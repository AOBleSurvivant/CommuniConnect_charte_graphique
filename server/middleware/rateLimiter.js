const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const { logSecurity } = require('../config/logger');

// Configuration Redis pour le rate limiting
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // En développement, utiliser le store en mémoire si Redis n'est pas disponible
      console.warn('Redis non disponible, utilisation du store en mémoire');
      return null;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Store pour le rate limiting
let store;
try {
  store = new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  });
} catch (error) {
  console.warn('Store Redis non disponible, utilisation du store par défaut');
  store = undefined;
}

// Configuration des limites
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes par défaut
    max = 100, // 100 requêtes par défaut
    message = 'Trop de requêtes, réessayez plus tard',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip,
    handler = (req, res) => {
      logSecurity('Rate limit dépassé', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  } = options;

  return rateLimit({
    windowMs,
    max,
    message,
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator,
    handler,
    store,
    standardHeaders: true,
    legacyHeaders: false,
    // Ajouter des headers personnalisés
    onLimitReached: (req, res) => {
      logSecurity('Limite de taux atteinte', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent'),
        userId: req.user?._id || 'anonymous'
      });
    }
  });
};

// Limiteurs spécifiques
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
  keyGenerator: (req) => `auth:${req.ip}`,
  handler: (req, res) => {
    logSecurity('Tentatives de connexion excessives', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
      retryAfter: 900
    });
  }
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes API, réessayez plus tard'
});

const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requêtes par minute
  message: 'Trop de requêtes, ralentissez'
});

const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 uploads par heure
  message: 'Limite d\'upload atteinte, réessayez plus tard'
});

// Middleware pour détecter les attaques
const detectAttack = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /document\.cookie/i, // Cookie theft
  ];

  const userInput = JSON.stringify(req.body) + req.path + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logSecurity('Attaque détectée', {
        ip: req.ip,
        pattern: pattern.source,
        path: req.path,
        userAgent: req.get('User-Agent'),
        body: req.body,
        query: req.query
      });
      
      return res.status(403).json({
        success: false,
        message: 'Requête malveillante détectée'
      });
    }
  }
  
  next();
};

// Middleware pour bloquer les bots malveillants
const blockBadBots = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const badBots = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i
  ];

  // Autoriser les bons bots (Google, Bing, etc.)
  const goodBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i
  ];

  // Vérifier si c'est un bon bot
  const isGoodBot = goodBots.some(bot => bot.test(userAgent));
  if (isGoodBot) {
    return next();
  }

  // Vérifier si c'est un mauvais bot
  const isBadBot = badBots.some(bot => bot.test(userAgent));
  if (isBadBot) {
    logSecurity('Bot malveillant détecté', {
      ip: req.ip,
      userAgent,
      path: req.path
    });
    
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé'
    });
  }

  next();
};

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  strictLimiter,
  uploadLimiter,
  detectAttack,
  blockBadBots
}; 