// Service de monitoring des performances

class PerformanceService {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      userInteractions: [],
      errors: [],
      memoryUsage: [],
      cacheStats: []
    };

    this.observers = [];
    this.isInitialized = false;
    this.performanceObserver = null;
    
    // Seuils d'alerte
    this.thresholds = {
      pageLoadTime: 3000, // 3 secondes
      apiResponseTime: 2000, // 2 secondes
      memoryUsage: 50 * 1024 * 1024, // 50MB
      errorRate: 0.05 // 5%
    };

    // Configuration
    this.config = {
      sampleRate: 0.1, // 10% des événements
      maxMetricsAge: 24 * 60 * 60 * 1000, // 24 heures
      flushInterval: 30000, // 30 secondes
      enableRealTime: true
    };
  }

  // Initialiser le service
  init() {
    if (this.isInitialized) return;

    try {
      // Observer les métriques de performance
      this.setupPerformanceObserver();
      
      // Observer les erreurs
      this.setupErrorObserver();
      
      // Observer les interactions utilisateur
      this.setupInteractionObserver();
      
      // Nettoyer périodiquement
      setInterval(() => this.cleanup(), this.config.flushInterval);
      
      // Envoyer les métriques périodiquement
      setInterval(() => this.flushMetrics(), this.config.flushInterval);
      
      this.isInitialized = true;
      console.log('📊 Service de monitoring des performances initialisé');
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du monitoring:', error);
    }
  }

  // Configurer l'observer de performance
  setupPerformanceObserver() {
    if (!window.PerformanceObserver) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordPageLoad(entry);
        });
      });

      this.performanceObserver.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('⚠️ PerformanceObserver non supporté:', error);
    }
  }

  // Configurer l'observer d'erreurs
  setupErrorObserver() {
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        message: event.reason?.message || 'Promise rejected',
        timestamp: Date.now()
      });
    });
  }

  // Configurer l'observer d'interactions
  setupInteractionObserver() {
    let lastInteraction = Date.now();
    
    const events = ['click', 'input', 'scroll', 'keydown'];
    events.forEach(eventType => {
      document.addEventListener(eventType, () => {
        lastInteraction = Date.now();
      }, { passive: true });
    });

    // Mesurer l'inactivité
    setInterval(() => {
      const inactiveTime = Date.now() - lastInteraction;
      if (inactiveTime > 300000) { // 5 minutes
        this.recordUserInteraction('inactive', { duration: inactiveTime });
      }
    }, 60000);
  }

  // Enregistrer un chargement de page
  recordPageLoad(entry) {
    if (Math.random() > this.config.sampleRate) return;

    const metric = {
      url: window.location.href,
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      timestamp: Date.now()
    };

    this.metrics.pageLoads.push(metric);
    this.checkThreshold('pageLoadTime', metric.loadTime);
  }

  // Enregistrer un appel API
  recordApiCall(url, method, duration, status, error = null) {
    if (Math.random() > this.config.sampleRate) return;

    const metric = {
      url,
      method,
      duration,
      status,
      error: error?.message,
      timestamp: Date.now()
    };

    this.metrics.apiCalls.push(metric);
    this.checkThreshold('apiResponseTime', duration);
  }

  // Enregistrer une interaction utilisateur
  recordUserInteraction(type, data = {}) {
    if (Math.random() > this.config.sampleRate) return;

    const metric = {
      type,
      data,
      timestamp: Date.now()
    };

    this.metrics.userInteractions.push(metric);
  }

  // Enregistrer une erreur
  recordError(error) {
    const metric = {
      ...error,
      timestamp: Date.now()
    };

    this.metrics.errors.push(metric);
    this.checkErrorRate();
  }

  // Enregistrer l'utilisation mémoire
  recordMemoryUsage() {
    if (!performance.memory) return;

    const metric = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      timestamp: Date.now()
    };

    this.metrics.memoryUsage.push(metric);
    this.checkThreshold('memoryUsage', metric.used);
  }

  // Enregistrer les stats de cache
  recordCacheStats(stats) {
    const metric = {
      ...stats,
      timestamp: Date.now()
    };

    this.metrics.cacheStats.push(metric);
  }

  // Obtenir le First Paint
  getFirstPaint() {
    const entries = performance.getEntriesByType('paint');
    const firstPaint = entries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  // Obtenir le First Contentful Paint
  getFirstContentfulPaint() {
    const entries = performance.getEntriesByType('paint');
    const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  // Vérifier les seuils
  checkThreshold(type, value) {
    const threshold = this.thresholds[type];
    if (threshold && value > threshold) {
      this.triggerAlert(type, value, threshold);
    }
  }

  // Vérifier le taux d'erreur
  checkErrorRate() {
    const recentErrors = this.metrics.errors.filter(
      error => Date.now() - error.timestamp < 300000 // 5 minutes
    );
    
    const recentApiCalls = this.metrics.apiCalls.filter(
      call => Date.now() - call.timestamp < 300000
    );

    if (recentApiCalls.length > 0) {
      const errorRate = recentErrors.length / recentApiCalls.length;
      if (errorRate > this.thresholds.errorRate) {
        this.triggerAlert('errorRate', errorRate, this.thresholds.errorRate);
      }
    }
  }

  // Déclencher une alerte
  triggerAlert(type, value, threshold) {
    const alert = {
      type,
      value,
      threshold,
      timestamp: Date.now(),
      url: window.location.href
    };

    console.warn(`🚨 Alerte de performance: ${type} = ${value} (seuil: ${threshold})`);
    this.notifyObservers('alert', alert);
  }

  // Obtenir les métriques
  getMetrics(timeRange = 3600000) { // 1 heure par défaut
    const now = Date.now();
    const cutoff = now - timeRange;

    return {
      pageLoads: this.metrics.pageLoads.filter(m => m.timestamp > cutoff),
      apiCalls: this.metrics.apiCalls.filter(m => m.timestamp > cutoff),
      userInteractions: this.metrics.userInteractions.filter(m => m.timestamp > cutoff),
      errors: this.metrics.errors.filter(m => m.timestamp > cutoff),
      memoryUsage: this.metrics.memoryUsage.filter(m => m.timestamp > cutoff),
      cacheStats: this.metrics.cacheStats.filter(m => m.timestamp > cutoff)
    };
  }

  // Obtenir les statistiques
  getStats() {
    const metrics = this.getMetrics();
    
    const avgPageLoadTime = this.calculateAverage(metrics.pageLoads, 'loadTime');
    const avgApiResponseTime = this.calculateAverage(metrics.apiCalls, 'duration');
    const errorRate = this.calculateErrorRate(metrics.apiCalls, metrics.errors);
    const avgMemoryUsage = this.calculateAverage(metrics.memoryUsage, 'used');

    return {
      avgPageLoadTime: avgPageLoadTime ? `${avgPageLoadTime.toFixed(2)}ms` : 'N/A',
      avgApiResponseTime: avgApiResponseTime ? `${avgApiResponseTime.toFixed(2)}ms` : 'N/A',
      errorRate: `${(errorRate * 100).toFixed(2)}%`,
      avgMemoryUsage: avgMemoryUsage ? `${(avgMemoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
      totalPageLoads: metrics.pageLoads.length,
      totalApiCalls: metrics.apiCalls.length,
      totalErrors: metrics.errors.length,
      totalInteractions: metrics.userInteractions.length
    };
  }

  // Calculer la moyenne
  calculateAverage(array, key) {
    if (array.length === 0) return null;
    const sum = array.reduce((acc, item) => acc + (item[key] || 0), 0);
    return sum / array.length;
  }

  // Calculer le taux d'erreur
  calculateErrorRate(apiCalls, errors) {
    if (apiCalls.length === 0) return 0;
    return errors.length / apiCalls.length;
  }

  // Nettoyer les anciennes métriques
  cleanup() {
    const cutoff = Date.now() - this.config.maxMetricsAge;
    
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = this.metrics[key].filter(
        metric => metric.timestamp > cutoff
      );
    });
  }

  // Envoyer les métriques au serveur
  async flushMetrics() {
    try {
      const metrics = this.getMetrics();
      if (Object.values(metrics).some(array => array.length > 0)) {
        // Simuler l'envoi au serveur
        console.log('📊 Envoi des métriques de performance:', metrics);
        
        // Ici, on enverrait réellement les données au serveur
        // await fetch('/api/performance', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(metrics)
        // });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des métriques:', error);
    }
  }

  // Ajouter un observateur
  addObserver(callback) {
    this.observers.push(callback);
  }

  // Notifier les observateurs
  notifyObservers(event, data) {
    this.observers.forEach(observer => {
      try {
        observer(event, data);
      } catch (error) {
        console.error('❌ Erreur dans l\'observateur:', error);
      }
    });
  }

  // Mesurer une fonction
  async measureFunction(name, fn) {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordApiCall(name, 'function', duration, 200);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordApiCall(name, 'function', duration, 500, error);
      throw error;
    }
  }

  // Mesurer le rendu d'un composant
  measureComponentRender(componentName, renderFn) {
    const start = performance.now();
    const result = renderFn();
    const duration = performance.now() - start;
    
    this.recordUserInteraction('componentRender', {
      component: componentName,
      duration
    });
    
    return result;
  }

  // Obtenir un rapport de performance
  getPerformanceReport() {
    const stats = this.getStats();
    const metrics = this.getMetrics();
    
    return {
      summary: stats,
      details: {
        slowestPageLoads: this.getSlowestPageLoads(metrics.pageLoads),
        slowestApiCalls: this.getSlowestApiCalls(metrics.apiCalls),
        recentErrors: metrics.errors.slice(-10),
        memoryTrend: this.getMemoryTrend(metrics.memoryUsage)
      },
      recommendations: this.getRecommendations(stats)
    };
  }

  // Obtenir les pages les plus lentes
  getSlowestPageLoads(pageLoads) {
    return pageLoads
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 5);
  }

  // Obtenir les appels API les plus lents
  getSlowestApiCalls(apiCalls) {
    return apiCalls
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
  }

  // Obtenir la tendance mémoire
  getMemoryTrend(memoryUsage) {
    if (memoryUsage.length < 2) return 'stable';
    
    const recent = memoryUsage.slice(-5);
    const avg = this.calculateAverage(recent, 'used');
    const first = recent[0]?.used || 0;
    
    if (avg > first * 1.1) return 'increasing';
    if (avg < first * 0.9) return 'decreasing';
    return 'stable';
  }

  // Obtenir des recommandations
  getRecommendations(stats) {
    const recommendations = [];
    
    if (parseFloat(stats.avgPageLoadTime) > 2000) {
      recommendations.push('Optimiser le temps de chargement des pages');
    }
    
    if (parseFloat(stats.avgApiResponseTime) > 1000) {
      recommendations.push('Optimiser les temps de réponse API');
    }
    
    if (parseFloat(stats.errorRate) > 0.05) {
      recommendations.push('Réduire le taux d\'erreur');
    }
    
    if (parseFloat(stats.avgMemoryUsage) > 50) {
      recommendations.push('Optimiser l\'utilisation mémoire');
    }
    
    return recommendations;
  }
}

// Instance singleton
const performanceService = new PerformanceService();

export default performanceService; 