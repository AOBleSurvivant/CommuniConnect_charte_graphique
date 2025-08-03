const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const NotificationService = require('./services/notificationService');
const MessageSocketService = require('./services/messageSocketService');
const PushNotificationService = require('./services/pushNotificationService');
const multer = require('multer');
require('dotenv').config();

// Configuration par défaut pour le mode développement
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'communiconnect-dev-secret-key-2024';
  console.log('🔧 JWT_SECRET configuré par défaut pour le développement');
}

if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '7d';
}

if (!process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN = 'http://localhost:3000';
}

const path = require('path'); // Added for serving static files

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

const app = express();
const server = http.createServer(app);

// Configuration Socket.IO avec CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Initialiser les services avec l'instance io
const notificationService = new NotificationService(io);
const messageSocketService = new MessageSocketService(io);
const pushNotificationService = new PushNotificationService();

const PORT = process.env.PORT || 5000;

// Middleware de sécurité et de performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "ws://localhost:5000", "http://localhost:5000"]
    }
  },
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(compression());
app.use(morgan('combined'));

// Rate limiting - Désactivé en mode développement
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Ignorer le rate limiting pour les routes de santé et de test
      return req.path === '/api/health' || req.path.startsWith('/api/test');
    }
  });
  app.use('/api/', limiter);
} else {
  console.log('🔓 Rate limiting désactivé en mode développement');
}

// CORS pour Express
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use('/api/static', express.static(path.join(__dirname, 'static')));

// Créer le dossier avatars s'il n'existe pas
const avatarsDir = path.join(__dirname, 'static/avatars');
if (!require('fs').existsSync(avatarsDir)) {
  require('fs').mkdirSync(avatarsDir, { recursive: true });
}

// Connexion à MongoDB (optionnelle en mode développement)
const connectToMongoDB = async () => {
  try {
    const mongoose = require('mongoose'); // Import here to make it optional
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/communiconnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB établie');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB non disponible:', error.message);
    console.log('📝 Mode développement: L\'application fonctionne sans base de données');
    return false;
  }
};

// Documentation API Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CommuniConnect API Documentation'
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/livestreams', require('./routes/livestreams'));
app.use('/api/events', require('./routes/events'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/moderation', require('./routes/moderation'));
app.use('/api/advanced-moderation', require('./routes/advancedModeration'));
app.use('/api/advanced-notifications', require('./routes/advancedNotifications'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/communiconseil', require('./routes/communiconseil'));

// Route pour servir les images statiques
app.use('/api/static/avatars', express.static(path.join(__dirname, 'static/avatars')));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Vérifier l'état de l'API
 *     description: Endpoint pour vérifier que l'API CommuniConnect fonctionne correctement
 *     tags: [Système]
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "CommuniConnect API fonctionne correctement"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-29T22:00:00.000Z"
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CommuniConnect API fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Rendre les services disponibles globalement
global.notificationService = notificationService;
global.messageSocketService = messageSocketService;
global.pushNotificationService = pushNotificationService;

// Broadcast des statistiques toutes les 30 secondes
setInterval(() => {
  notificationService.broadcastStats();
}, 30000);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Erreur interne du serveur' 
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// Démarrage du serveur
const startServer = async () => {
  global.mongoConnected = await connectToMongoDB(); // Store MongoDB connection status
  server.listen(PORT, () => {
    console.log(`🚀 Serveur CommuniConnect démarré sur le port ${PORT}`);
    console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 API disponible sur: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO actif sur: http://localhost:${PORT}`);
  });
};

startServer(); // Call to start the server 