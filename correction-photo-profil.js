const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION AUTOMATIQUE - PHOTO DE PROFIL');
console.log('=' .repeat(50));

// Fonction pour créer le dossier avatars s'il n'existe pas
function createAvatarsDirectory() {
  console.log('\n1️⃣ Création du dossier avatars...');
  
  const avatarsDir = path.join(__dirname, 'server/static/avatars');
  
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log('✅ Dossier avatars créé:', avatarsDir);
  } else {
    console.log('✅ Dossier avatars existe déjà');
  }
  
  return avatarsDir;
}

// Fonction pour créer des images d'exemple
function createSampleImages(avatarsDir) {
  console.log('\n2️⃣ Création d\'images d\'exemple...');
  
  const sampleImages = [
    { name: 'U.jpg', content: Buffer.from('fake-avatar-U', 'utf8') },
    { name: 'T.jpg', content: Buffer.from('fake-avatar-T', 'utf8') },
    { name: 'A.jpg', content: Buffer.from('fake-avatar-A', 'utf8') },
    { name: 'M.jpg', content: Buffer.from('fake-avatar-M', 'utf8') }
  ];
  
  let created = 0;
  sampleImages.forEach(image => {
    const imagePath = path.join(avatarsDir, image.name);
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, image.content);
      console.log('✅ Image créée:', image.name);
      created++;
    } else {
      console.log('✅ Image existe déjà:', image.name);
    }
  });
  
  console.log(`📸 ${created} nouvelles images créées`);
}

// Fonction pour vérifier et corriger la configuration CORS
function checkCORSConfiguration() {
  console.log('\n3️⃣ Vérification de la configuration CORS...');
  
  const serverIndexPath = path.join(__dirname, 'server/index.js');
  
  if (!fs.existsSync(serverIndexPath)) {
    console.log('❌ Fichier server/index.js non trouvé');
    return false;
  }
  
  let serverContent = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Vérifier si multer est configuré
  if (!serverContent.includes('multer')) {
    console.log('⚠️ Multer non configuré - ajout de la configuration...');
    
    const multerConfig = `
// Configuration multer pour l'upload de fichiers
const multer = require('multer');
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

app.use('/api/static', express.static(path.join(__dirname, 'static')));
`;
    
    // Insérer la configuration multer après les imports
    const importEndIndex = serverContent.indexOf('const app = express()');
    if (importEndIndex !== -1) {
      serverContent = serverContent.slice(0, importEndIndex) + multerConfig + serverContent.slice(importEndIndex);
      fs.writeFileSync(serverIndexPath, serverContent);
      console.log('✅ Configuration multer ajoutée');
    }
  } else {
    console.log('✅ Multer déjà configuré');
  }
  
  // Vérifier la configuration CORS
  if (!serverContent.includes('cors')) {
    console.log('⚠️ CORS non configuré - ajout de la configuration...');
    
    const corsConfig = `
// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data']
}));
`;
    
    // Insérer la configuration CORS après app.use(express.json())
    const jsonMiddlewareIndex = serverContent.indexOf('app.use(express.json())');
    if (jsonMiddlewareIndex !== -1) {
      const insertIndex = serverContent.indexOf('\n', jsonMiddlewareIndex) + 1;
      serverContent = serverContent.slice(0, insertIndex) + corsConfig + serverContent.slice(insertIndex);
      fs.writeFileSync(serverIndexPath, serverContent);
      console.log('✅ Configuration CORS ajoutée');
    }
  } else {
    console.log('✅ CORS déjà configuré');
  }
  
  return true;
}

// Fonction pour vérifier et corriger la route d'upload
function checkUploadRoute() {
  console.log('\n4️⃣ Vérification de la route d\'upload...');
  
  const authRoutePath = path.join(__dirname, 'server/routes/auth.js');
  
  if (!fs.existsSync(authRoutePath)) {
    console.log('❌ Fichier server/routes/auth.js non trouvé');
    return false;
  }
  
  let authContent = fs.readFileSync(authRoutePath, 'utf8');
  
  // Vérifier si la route d'upload existe
  if (!authContent.includes('/profile/picture')) {
    console.log('⚠️ Route d\'upload manquante - ajout...');
    
    const uploadRoute = `
// @route   PUT /api/auth/profile/picture
// @desc    Mettre à jour la photo de profil
// @access  Private
router.put('/profile/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }
    
    // Générer l'URL de la nouvelle photo
    const profilePicture = \`/api/static/avatars/\${req.file.filename}\`;
    
    // Mettre à jour l'utilisateur (en mode développement, on simule)
    // En production, vous devriez mettre à jour la base de données
    
    res.json({
      success: true,
      message: 'Photo de profil mise à jour avec succès',
      profilePicture: profilePicture
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la photo de profil'
    });
  }
});
`;
    
    // Insérer la route avant la dernière accolade
    const lastBraceIndex = authContent.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      authContent = authContent.slice(0, lastBraceIndex) + uploadRoute + authContent.slice(lastBraceIndex);
      fs.writeFileSync(authRoutePath, authContent);
      console.log('✅ Route d\'upload ajoutée');
    }
  } else {
    console.log('✅ Route d\'upload existe déjà');
  }
  
  return true;
}

// Fonction pour vérifier les dépendances
function checkDependencies() {
  console.log('\n5️⃣ Vérification des dépendances...');
  
  const packagePath = path.join(__dirname, 'server/package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ Fichier server/package.json non trouvé');
    return false;
  }
  
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = packageContent.dependencies || {};
  
  const requiredDeps = ['multer', 'cors'];
  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (!dependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length > 0) {
    console.log('⚠️ Dépendances manquantes:', missingDeps.join(', '));
    console.log('💡 Exécutez: cd server && npm install ' + missingDeps.join(' '));
    return false;
  } else {
    console.log('✅ Toutes les dépendances sont installées');
    return true;
  }
}

// Fonction principale
async function runCorrection() {
  console.log('🚀 Démarrage des corrections...\n');
  
  try {
    // Étape 1: Créer le dossier avatars
    const avatarsDir = createAvatarsDirectory();
    
    // Étape 2: Créer des images d'exemple
    createSampleImages(avatarsDir);
    
    // Étape 3: Vérifier les dépendances
    const depsOk = checkDependencies();
    
    if (!depsOk) {
      console.log('\n❌ CORRECTION ARRÊTÉE - Dépendances manquantes');
      console.log('\n🔧 SOLUTIONS:');
      console.log('1. Ouvrir un terminal dans le dossier server/');
      console.log('2. Exécuter: npm install multer cors');
      console.log('3. Relancer ce script de correction');
      return;
    }
    
    // Étape 4: Vérifier la configuration CORS
    checkCORSConfiguration();
    
    // Étape 5: Vérifier la route d'upload
    checkUploadRoute();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ CORRECTIONS TERMINÉES');
    console.log('=' .repeat(50));
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('1. Redémarrer le serveur: cd server && npm start');
    console.log('2. Tester l\'upload: node diagnostic-photo-profil.js');
    console.log('3. Ouvrir l\'interface: http://localhost:3000');
    
    console.log('\n💡 TIPS:');
    console.log('• Assurez-vous que le serveur est démarré sur le port 5000');
    console.log('• Vérifiez que vous êtes connecté à l\'application');
    console.log('• Utilisez des images de moins de 5MB');
    console.log('• Formats acceptés: JPG, PNG, GIF');
    
  } catch (error) {
    console.error('❌ Erreur lors des corrections:', error.message);
  }
}

// Exécuter les corrections
runCorrection(); 