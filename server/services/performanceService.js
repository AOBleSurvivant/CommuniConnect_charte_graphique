const compression = require('compression');
const { performance } = require('perf_hooks');

class PerformanceService {
  constructor() {
    this.metrics = {
      responseTimes: [],
      memoryUsage: [],
      cpuUsage: [],
      activeConnections: 0
    };
    
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Middleware de monitoring des performances
  monitorPerformance(req, res, next) {
    const startTime = performance.now();
    
    // Intercepter la fin de la réponse
    res.on('finish', () => {
      const duration = performance.now() - startTime;
      this.recordResponseTime(req.path, duration, res.statusCode);
    });

    next();
  }

  // Enregistrer les temps de réponse
  recordResponseTime(path, duration, statusCode) {
    this.metrics.responseTimes.push({
      path,
      duration,
      statusCode,
      timestamp: Date.now()
    });

    // Garder seulement les 1000 dernières mesures
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes = this.metrics.responseTimes.slice(-1000);
    }
  }

  // Cache intelligent
  async getCachedData(key, fetchFunction, ttl = this.cacheTimeout) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  }

  // Nettoyer le cache expiré
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  // Optimisation des requêtes de base de données
  optimizeQuery(query, options = {}) {
    const optimizedQuery = { ...query };
    
    // Limiter les champs retournés si spécifié
    if (options.select) {
      optimizedQuery.select = options.select;
    }
    
    // Ajouter des index si nécessaire
    if (options.index) {
      optimizedQuery.hint = options.index;
    }
    
    // Limiter le nombre de résultats
    if (options.limit) {
      optimizedQuery.limit = options.limit;
    }
    
    return optimizedQuery;
  }

  // Compression des réponses
  compressResponse(req, res, next) {
    // Vérifier si la compression est déjà appliquée
    if (res.getHeader('content-encoding')) {
      return next();
    }

    // Appliquer la compression pour les réponses JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      compression()(req, res, next);
    } else {
      next();
    }
  }

  // Optimisation des images
  optimizeImageResponse(req, res, next) {
    const acceptHeader = req.headers.accept || '';
    
    // Vérifier si le client supporte WebP
    if (acceptHeader.includes('image/webp')) {
      // Rediriger vers une version WebP si disponible
      const originalPath = req.path;
      const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // En mode développement, simuler la conversion
      console.log(`Optimisation image: ${originalPath} -> ${webpPath}`);
    }
    
    next();
  }

  // Statistiques de performance
  getPerformanceStats() {
    const responseTimes = this.metrics.responseTimes;
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, rt) => sum + rt.duration, 0) / responseTimes.length 
      : 0;

    const memoryUsage = process.memoryUsage();
    
    return {
      averageResponseTime: avgResponseTime.toFixed(2),
      totalRequests: responseTimes.length,
      cacheSize: this.cache.size,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) // MB
      },
      activeConnections: this.metrics.activeConnections
    };
  }

  // Surveillance des ressources
  monitorResources() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal
    });
    
    this.metrics.cpuUsage.push({
      timestamp: Date.now(),
      user: cpuUsage.user,
      system: cpuUsage.system
    });

    // Nettoyer les anciennes métriques
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-100);
    }
    
    if (this.metrics.cpuUsage.length > 100) {
      this.metrics.cpuUsage = this.metrics.cpuUsage.slice(-100);
    }
  }

  // Optimisation automatique
  autoOptimize() {
    // Nettoyer le cache toutes les 5 minutes
    setInterval(() => {
      this.cleanExpiredCache();
    }, 5 * 60 * 1000);

    // Surveiller les ressources toutes les 30 secondes
    setInterval(() => {
      this.monitorResources();
    }, 30 * 1000);

    console.log('🚀 Service d\'optimisation des performances initialisé');
  }
}

module.exports = new PerformanceService(); 