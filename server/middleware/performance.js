const performance = require('perf_hooks').performance;

// Middleware de monitoring de performance
const performanceMonitor = (req, res, next) => {
    const start = performance.now();
    
    // Intercepter la fin de la réponse
    res.on('finish', () => {
        const duration = performance.now() - start;
        const { method, url } = req;
        const { statusCode } = res;
        
        // Log des métriques de performance
        console.log(`📊 Performance: ${method} ${url} - ${statusCode} - ${duration.toFixed(2)}ms`);
        
        // Alertes pour les temps de réponse lents
        if (duration > 1000) {
            console.warn(`⚠️  Temps de réponse lent: ${method} ${url} - ${duration.toFixed(2)}ms`);
        }
        
        if (duration > 5000) {
            console.error(`🚨 Temps de réponse très lent: ${method} ${url} - ${duration.toFixed(2)}ms`);
        }
    });
    
    next();
};

// Middleware de monitoring des erreurs
const errorMonitor = (err, req, res, next) => {
    const { method, url } = req;
    const { statusCode } = res;
    
    console.error(`❌ Erreur API: ${method} ${url} - ${statusCode} - ${err.message}`);
    
    // Log des détails de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack trace:', err.stack);
    }
    
    next(err);
};

// Middleware de monitoring de la mémoire
const memoryMonitor = (req, res, next) => {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    // Alertes pour l'utilisation de mémoire
    if (memUsageMB.heapUsed > 100) {
        console.warn(`⚠️  Utilisation mémoire élevée: ${memUsageMB.heapUsed}MB`);
    }
    
    if (memUsageMB.heapUsed > 200) {
        console.error(`🚨 Utilisation mémoire critique: ${memUsageMB.heapUsed}MB`);
    }
    
    // Ajouter les métriques à la réponse pour le monitoring
    res.setHeader('X-Memory-Usage', JSON.stringify(memUsageMB));
    
    next();
};

// Middleware de monitoring des requêtes
const requestMonitor = (req, res, next) => {
    const { method, url, ip } = req;
    const userAgent = req.get('User-Agent');
    
    console.log(`📝 Requête: ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);
    
    // Compter les requêtes par endpoint
    if (!global.requestCounts) {
        global.requestCounts = {};
    }
    
    const endpoint = `${method} ${url}`;
    global.requestCounts[endpoint] = (global.requestCounts[endpoint] || 0) + 1;
    
    next();
};

// Fonction pour obtenir les statistiques de performance
const getPerformanceStats = () => {
    return {
        requestCounts: global.requestCounts || {},
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    performanceMonitor,
    errorMonitor,
    memoryMonitor,
    requestMonitor,
    getPerformanceStats
}; 