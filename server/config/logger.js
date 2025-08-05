const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuration des formats
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Configuration des transports
const transports = [
  // Fichier d'erreurs
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: logFormat
  }),
  
  // Fichier combiné
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: logFormat
  }),
  
  // Fichier d'audit pour les actions sensibles
  new winston.transports.File({
    filename: path.join(logsDir, 'audit.log'),
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    format: logFormat
  })
];

// En développement, ajouter la console
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Créer le logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Logger spécialisé pour l'audit
const auditLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      maxsize: 5242880,
      maxFiles: 10
    })
  ]
});

// Fonctions utilitaires
const logSecurity = (message, data = {}) => {
  logger.warn(`SECURITY: ${message}`, {
    ...data,
    timestamp: new Date().toISOString(),
    type: 'security'
  });
};

const logAuth = (action, userId, data = {}) => {
  auditLogger.info(`AUTH: ${action}`, {
    userId,
    action,
    timestamp: new Date().toISOString(),
    ip: data.ip,
    userAgent: data.userAgent,
    type: 'authentication'
  });
};

const logApi = (method, path, statusCode, responseTime, userId = null) => {
  logger.info(`API: ${method} ${path}`, {
    method,
    path,
    statusCode,
    responseTime,
    userId,
    timestamp: new Date().toISOString(),
    type: 'api'
  });
};

const logError = (error, context = {}) => {
  logger.error(`ERROR: ${error.message}`, {
    error: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
    type: 'error'
  });
};

const logPerformance = (operation, duration, data = {}) => {
  logger.info(`PERFORMANCE: ${operation}`, {
    operation,
    duration,
    ...data,
    timestamp: new Date().toISOString(),
    type: 'performance'
  });
};

// Middleware pour logger les requêtes
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Logger la requête entrante
  logger.info(`REQUEST: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id || req.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
    type: 'request'
  });
  
  // Intercepter la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    logApi(req.method, req.path, res.statusCode, duration, req.user?._id);
  });
  
  next();
};

// Middleware pour logger les erreurs
const errorLogger = (error, req, res, next) => {
  logError(error, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?._id || 'anonymous'
  });
  next(error);
};

module.exports = {
  logger,
  auditLogger,
  logSecurity,
  logAuth,
  logApi,
  logError,
  logPerformance,
  requestLogger,
  errorLogger
}; 