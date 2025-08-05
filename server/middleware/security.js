const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const { logSecurity } = require('../config/logger');

// Configuration CORS sécurisée
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (applications mobiles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://communiconnect.com',
      'https://www.communiconnect.com'
    ];
    
    // En développement, autoriser localhost
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logSecurity('Tentative d\'accès CORS non autorisée', {
        origin,
        allowedOrigins
      });
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 heures
};

// Configuration Helmet renforcée
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.communiconnect.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

// Middleware pour bloquer les attaques par injection
const blockInjection = (req, res, next) => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi
  ];

  const checkInput = (input) => {
    if (typeof input === 'string') {
      for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
          return true;
        }
      }
    }
    return false;
  };

  // Vérifier le body
  if (req.body && checkInput(JSON.stringify(req.body))) {
    logSecurity('Injection détectée dans le body', {
      ip: req.ip,
      path: req.path,
      body: req.body
    });
    return res.status(403).json({
      success: false,
      message: 'Contenu malveillant détecté'
    });
  }

  // Vérifier les query parameters
  if (req.query && checkInput(JSON.stringify(req.query))) {
    logSecurity('Injection détectée dans les query params', {
      ip: req.ip,
      path: req.path,
      query: req.query
    });
    return res.status(403).json({
      success: false,
      message: 'Paramètres malveillants détectés'
    });
  }

  next();
};

// Middleware pour valider les types de contenu
const validateContentType = (req, res, next) => {
  const allowedContentTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data'
  ];

  const contentType = req.get('Content-Type');
  
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!contentType || !allowedContentTypes.some(type => contentType.includes(type))) {
      logSecurity('Content-Type non autorisé', {
        ip: req.ip,
        path: req.path,
        contentType
      });
      return res.status(415).json({
        success: false,
        message: 'Type de contenu non supporté'
      });
    }
  }

  next();
};

// Middleware pour limiter la taille des requêtes
const limitRequestSize = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    logSecurity('Requête trop volumineuse', {
      ip: req.ip,
      path: req.path,
      size: req.headers['content-length']
    });
    return res.status(413).json({
      success: false,
      message: 'Requête trop volumineuse'
    });
  }

  next();
};

// Middleware pour bloquer les méthodes HTTP dangereuses
const blockDangerousMethods = (req, res, next) => {
  const dangerousMethods = ['TRACE', 'TRACK', 'OPTIONS'];
  
  if (dangerousMethods.includes(req.method)) {
    logSecurity('Méthode HTTP dangereuse', {
      ip: req.ip,
      method: req.method,
      path: req.path
    });
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  next();
};

// Middleware pour ajouter des headers de sécurité supplémentaires
const addSecurityHeaders = (req, res, next) => {
  // Headers de sécurité supplémentaires
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // Header personnalisé pour identifier l'API
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Powered-By', 'CommuniConnect API');
  
  next();
};

// Middleware pour logger les tentatives d'attaque
const logAttackAttempts = (req, res, next) => {
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-forwarded-proto',
    'x-forwarded-host'
  ];

  const suspiciousHeadersFound = suspiciousHeaders.filter(header => 
    req.headers[header]
  );

  if (suspiciousHeadersFound.length > 0) {
    logSecurity('Headers suspects détectés', {
      ip: req.ip,
      path: req.path,
      suspiciousHeaders: suspiciousHeadersFound,
      allHeaders: req.headers
    });
  }

  next();
};

module.exports = {
  corsOptions,
  helmetConfig,
  blockInjection,
  validateContentType,
  limitRequestSize,
  blockDangerousMethods,
  addSecurityHeaders,
  logAttackAttempts
}; 