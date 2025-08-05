const { performance } = require('perf_hooks');
const os = require('os');
const { logPerformance, logError } = require('../config/logger');

// Métriques système
let metrics = {
  requests: {
    total: 0,
    success: 0,
    error: 0,
    byMethod: {},
    byPath: {}
  },
  performance: {
    avgResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Infinity,
    responseTimes: []
  },
  system: {
    memory: {},
    cpu: {},
    uptime: 0
  },
  errors: {
    count: 0,
    byType: {},
    recent: []
  }
};

// Configuration du monitoring
const config = {
  maxResponseTimes: 1000,
  errorHistorySize: 100,
  metricsInterval: 30000, // 30 secondes
  alertThresholds: {
    responseTime: 2000, // 2 secondes
    errorRate: 0.05, // 5%
    memoryUsage: 0.9, // 90%
    cpuUsage: 0.8 // 80%
  }
};

// Middleware de monitoring avancé
const advancedMonitoring = (req, res, next) => {
  const start = performance.now();
  const startTime = Date.now();

  // Intercepter la réponse
  res.on('finish', () => {
    const duration = performance.now() - start;
    const responseTime = Date.now() - startTime;

    // Mettre à jour les métriques
    updateMetrics(req, res, duration, responseTime);
  });

  next();
};

// Mettre à jour les métriques
const updateMetrics = (req, res, duration, responseTime) => {
  const method = req.method;
  const path = req.path;
  const statusCode = res.statusCode;

  // Métriques générales
  metrics.requests.total++;
  
  if (statusCode >= 200 && statusCode < 400) {
    metrics.requests.success++;
  } else {
    metrics.requests.error++;
  }

  // Métriques par méthode
  if (!metrics.requests.byMethod[method]) {
    metrics.requests.byMethod[method] = 0;
  }
  metrics.requests.byMethod[method]++;

  // Métriques par chemin
  if (!metrics.requests.byPath[path]) {
    metrics.requests.byPath[path] = {
      count: 0,
      avgTime: 0,
      errors: 0
    };
  }
  
  const pathMetrics = metrics.requests.byPath[path];
  pathMetrics.count++;
  pathMetrics.avgTime = (pathMetrics.avgTime * (pathMetrics.count - 1) + responseTime) / pathMetrics.count;
  
  if (statusCode >= 400) {
    pathMetrics.errors++;
  }

  // Métriques de performance
  metrics.performance.responseTimes.push(responseTime);
  
  if (metrics.performance.responseTimes.length > config.maxResponseTimes) {
    metrics.performance.responseTimes.shift();
  }

  metrics.performance.avgResponseTime = metrics.performance.responseTimes.reduce((a, b) => a + b, 0) / metrics.performance.responseTimes.length;
  metrics.performance.maxResponseTime = Math.max(metrics.performance.maxResponseTime, responseTime);
  metrics.performance.minResponseTime = Math.min(metrics.performance.minResponseTime, responseTime);

  // Logger la performance
  logPerformance('Request completed', {
    method,
    path,
    statusCode,
    responseTime,
    duration
  });

  // Vérifier les alertes
  checkAlerts(req, res, responseTime);
};

// Vérifier les alertes
const checkAlerts = (req, res, responseTime) => {
  const errorRate = metrics.requests.error / metrics.requests.total;
  const memoryUsage = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;

  // Alerte temps de réponse
  if (responseTime > config.alertThresholds.responseTime) {
    logPerformance('ALERT: Response time high', {
      path: req.path,
      responseTime,
      threshold: config.alertThresholds.responseTime
    });
  }

  // Alerte taux d'erreur
  if (errorRate > config.alertThresholds.errorRate) {
    logPerformance('ALERT: Error rate high', {
      errorRate: errorRate.toFixed(4),
      threshold: config.alertThresholds.errorRate
    });
  }

  // Alerte utilisation mémoire
  if (memoryUsage > config.alertThresholds.memoryUsage) {
    logPerformance('ALERT: Memory usage high', {
      memoryUsage: memoryUsage.toFixed(4),
      threshold: config.alertThresholds.memoryUsage
    });
  }
};

// Middleware de gestion d'erreurs avancée
const advancedErrorHandler = (error, req, res, next) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id || 'anonymous',
    timestamp: new Date().toISOString()
  };

  // Mettre à jour les métriques d'erreur
  metrics.errors.count++;
  
  const errorType = error.name || 'Unknown';
  if (!metrics.errors.byType[errorType]) {
    metrics.errors.byType[errorType] = 0;
  }
  metrics.errors.byType[errorType]++;

  // Ajouter à l'historique des erreurs
  metrics.errors.recent.push(errorInfo);
  if (metrics.errors.recent.length > config.errorHistorySize) {
    metrics.errors.recent.shift();
  }

  // Logger l'erreur
  logError(error, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?._id || 'anonymous'
  });

  next(error);
};

// Obtenir les métriques système
const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = os.loadavg();

  return {
    memory: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      usagePercent: (memUsage.heapUsed / memUsage.heapTotal * 100).toFixed(2)
    },
    cpu: {
      loadAverage: cpuUsage,
      cores: os.cpus().length,
      uptime: os.uptime()
    },
    process: {
      uptime: process.uptime(),
      pid: process.pid,
      version: process.version,
      platform: process.platform
    }
  };
};

// Mettre à jour les métriques système
const updateSystemMetrics = () => {
  metrics.system = getSystemMetrics();
  metrics.system.uptime = process.uptime();
};

// Obtenir toutes les métriques
const getAllMetrics = () => {
  updateSystemMetrics();
  return {
    ...metrics,
    timestamp: new Date().toISOString(),
    config
  };
};

// Endpoint pour les métriques
const metricsEndpoint = (req, res) => {
  const allMetrics = getAllMetrics();
  
  // Formater les métriques pour l'affichage
  const formattedMetrics = {
    summary: {
      totalRequests: allMetrics.requests.total,
      successRate: ((allMetrics.requests.success / allMetrics.requests.total) * 100).toFixed(2) + '%',
      avgResponseTime: allMetrics.performance.avgResponseTime.toFixed(2) + 'ms',
      errorRate: ((allMetrics.requests.error / allMetrics.requests.total) * 100).toFixed(2) + '%',
      uptime: (allMetrics.system.uptime / 3600).toFixed(2) + 'h'
    },
    performance: {
      avgResponseTime: allMetrics.performance.avgResponseTime,
      maxResponseTime: allMetrics.performance.maxResponseTime,
      minResponseTime: allMetrics.performance.minResponseTime,
      responseTimePercentiles: calculatePercentiles(allMetrics.performance.responseTimes)
    },
    requests: {
      byMethod: allMetrics.requests.byMethod,
      byPath: Object.entries(allMetrics.requests.byPath)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 10)
        .reduce((acc, [path, data]) => {
          acc[path] = data;
          return acc;
        }, {})
    },
    errors: {
      count: allMetrics.errors.count,
      byType: allMetrics.errors.byType,
      recent: allMetrics.errors.recent.slice(-10)
    },
    system: allMetrics.system
  };

  res.json({
    success: true,
    data: formattedMetrics,
    timestamp: allMetrics.timestamp
  });
};

// Calculer les percentiles
const calculatePercentiles = (values) => {
  if (values.length === 0) return {};
  
  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;
  
  return {
    p50: sorted[Math.floor(len * 0.5)],
    p90: sorted[Math.floor(len * 0.9)],
    p95: sorted[Math.floor(len * 0.95)],
    p99: sorted[Math.floor(len * 0.99)]
  };
};

// Mettre à jour les métriques périodiquement
setInterval(updateSystemMetrics, config.metricsInterval);

module.exports = {
  advancedMonitoring,
  advancedErrorHandler,
  getAllMetrics,
  metricsEndpoint,
  updateSystemMetrics
}; 