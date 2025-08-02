const winston = require('winston');
const path = require('path');

// Configuration des formats
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'communiconnect-api' },
  transports: [
    // Logs d'erreur
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Logs combinés
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Logs d'API
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/api.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Logs de sécurité
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/security.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Ajouter la console en mode développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Fonctions utilitaires pour différents types de logs
const apiLogger = {
  info: (message, meta = {}) => {
    logger.info(message, { ...meta, type: 'api' });
  },
  
  error: (message, error = null, meta = {}) => {
    logger.error(message, { 
      ...meta, 
      type: 'api',
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    });
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, { ...meta, type: 'api' });
  },
  
  debug: (message, meta = {}) => {
    logger.debug(message, { ...meta, type: 'api' });
  }
};

const securityLogger = {
  info: (message, meta = {}) => {
    logger.info(message, { ...meta, type: 'security' });
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, { ...meta, type: 'security' });
  },
  
  error: (message, error = null, meta = {}) => {
    logger.error(message, { 
      ...meta, 
      type: 'security',
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    });
  }
};

const performanceLogger = {
  info: (message, duration, meta = {}) => {
    logger.info(message, { 
      ...meta, 
      type: 'performance',
      duration: duration
    });
  },
  
  warn: (message, duration, meta = {}) => {
    logger.warn(message, { 
      ...meta, 
      type: 'performance',
      duration: duration
    });
  }
};

// Middleware pour logger les requêtes HTTP
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Logger la requête entrante
  apiLogger.info('Requête entrante', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });
  
  // Intercepter la réponse
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Logger la réponse
    apiLogger.info('Requête terminée', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    });
    
    // Logger les requêtes lentes
    if (duration > 1000) {
      performanceLogger.warn('Requête lente détectée', duration, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware pour logger les erreurs
const errorLogger = (error, req, res, next) => {
  apiLogger.error('Erreur serveur', error, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id || 'anonymous'
  });
  
  next(error);
};

// Fonction pour logger les événements de sécurité
const logSecurityEvent = (event, details = {}) => {
  securityLogger.warn(`Événement de sécurité: ${event}`, details);
};

// Fonction pour logger les tentatives d'authentification
const logAuthAttempt = (success, details = {}) => {
  if (success) {
    securityLogger.info('Authentification réussie', details);
  } else {
    securityLogger.warn('Tentative d\'authentification échouée', details);
  }
};

module.exports = {
  logger,
  apiLogger,
  securityLogger,
  performanceLogger,
  requestLogger,
  errorLogger,
  logSecurityEvent,
  logAuthAttempt
}; 