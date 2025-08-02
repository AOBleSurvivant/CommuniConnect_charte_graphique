const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { logSecurityEvent } = require('../utils/logger');

// Configuration de sécurité avancée
const securityConfig = {
  // Rate limiting par type de route
  authLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives par IP
    message: {
      success: false,
      message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
      logSecurityEvent('Rate limit exceeded - Auth', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      res.status(429).json({
        success: false,
        message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
      });
    }
  }),

  apiLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par IP
    message: {
      success: false,
      message: 'Trop de requêtes depuis cette IP. Réessayez plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Ignorer les routes de santé et de documentation
      return req.path === '/api/health' || req.path.startsWith('/api-docs');
    },
    handler: (req, res) => {
      logSecurityEvent('Rate limit exceeded - API', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      res.status(429).json({
        success: false,
        message: 'Trop de requêtes depuis cette IP. Réessayez plus tard.'
      });
    }
  }),

  // Configuration Helmet avancée
  helmetConfig: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws://localhost:5000", "http://localhost:5000"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    xFrameOptions: { action: 'deny' },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Configuration CORS sécurisée
  corsConfig: {
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origine (applications mobiles, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://communiconnect.gn',
        'https://www.communiconnect.gn'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logSecurityEvent('CORS violation', {
          origin: origin,
          userAgent: 'Unknown'
        });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400 // 24 heures
  }
};

// Middleware pour détecter les attaques
const detectAttacks = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip;
  
  // Détecter les bots malveillants
  const maliciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /dirbuster/i
  ];
  
  const isMalicious = maliciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isMalicious) {
    logSecurityEvent('Malicious bot detected', {
      ip: ip,
      userAgent: userAgent,
      path: req.path
    });
    
    return res.status(403).json({
      success: false,
      message: 'Accès refusé'
    });
  }
  
  // Détecter les tentatives d'injection SQL
  const sqlInjectionPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
    /(\b(and|or)\s+\d+\s*=\s*\d+)/i,
    /(\b(and|or)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--|\/\*|\*\/)/i
  ];
  
  const hasSqlInjection = sqlInjectionPatterns.some(pattern => {
    return pattern.test(req.url) || pattern.test(JSON.stringify(req.body));
  });
  
  if (hasSqlInjection) {
    logSecurityEvent('SQL injection attempt detected', {
      ip: ip,
      userAgent: userAgent,
      path: req.path,
      body: JSON.stringify(req.body)
    });
    
    return res.status(403).json({
      success: false,
      message: 'Accès refusé'
    });
  }
  
  // Détecter les tentatives XSS
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  ];
  
  const hasXSS = xssPatterns.some(pattern => {
    return pattern.test(req.url) || pattern.test(JSON.stringify(req.body));
  });
  
  if (hasXSS) {
    logSecurityEvent('XSS attempt detected', {
      ip: ip,
      userAgent: userAgent,
      path: req.path,
      body: JSON.stringify(req.body)
    });
    
    return res.status(403).json({
      success: false,
      message: 'Accès refusé'
    });
  }
  
  next();
};

// Middleware pour valider les tokens JWT
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification manquant'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Format de token invalide'
    });
  }
  
  // Validation basique du format JWT
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  
  if (!jwtPattern.test(token)) {
    logSecurityEvent('Invalid JWT format', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
  
  next();
};

// Middleware pour logger les événements de sécurité
const securityLogger = (req, res, next) => {
  // Logger les tentatives d'accès aux routes sensibles
  const sensitiveRoutes = ['/api/auth', '/api/users', '/api/admin'];
  const isSensitiveRoute = sensitiveRoutes.some(route => req.path.startsWith(route));
  
  if (isSensitiveRoute) {
    logSecurityEvent('Sensitive route access', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      userId: req.user?.id || 'anonymous'
    });
  }
  
  next();
};

// Middleware pour nettoyer les données d'entrée
const sanitizeInput = (req, res, next) => {
  // Nettoyer les chaînes de caractères
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/[<>]/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer javascript:
      .replace(/on\w+\s*=/gi, '') // Supprimer les événements JS
      .trim();
  };
  
  // Nettoyer req.body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }
  
  // Nettoyer req.query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }
  
  next();
};

module.exports = {
  securityConfig,
  detectAttacks,
  validateToken,
  securityLogger,
  sanitizeInput
}; 