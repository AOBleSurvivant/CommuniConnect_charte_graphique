// Service d'analytics pour le tableau de bord admin CommuniConseil

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.currentUser = null;
    this.isEnabled = true;
  }

  // Initialiser l'analytics
  init(userId = null) {
    this.currentUser = userId;
    this.sessionStart = Date.now();
    this.trackEvent('session_start', { userId });
  }

  // Tracker un événement
  trackEvent(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      id: Date.now() + Math.random(),
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.currentUser,
      sessionDuration: Date.now() - this.sessionStart
    };

    this.events.push(event);
    this.saveToLocalStorage();
    
    // En production, envoyer à l'API
    this.sendToServer(event);
  }

  // Tracker les actions d'administration
  trackAdminAction(action, targetType, targetId, details = {}) {
    this.trackEvent('admin_action', {
      action,
      targetType,
      targetId,
      ...details
    });
  }

  // Tracker la navigation
  trackNavigation(fromTab, toTab) {
    this.trackEvent('navigation', {
      from: fromTab,
      to: toTab
    });
  }

  // Tracker les recherches
  trackSearch(query, filters = {}) {
    this.trackEvent('search', {
      query,
      filters
    });
  }

  // Tracker les performances
  trackPerformance(operation, duration, success = true) {
    this.trackEvent('performance', {
      operation,
      duration,
      success
    });
  }

  // Tracker les erreurs
  trackError(error, context = {}) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  // Tracker les tests utilisateur
  trackUserTest(scenarioId, duration, performance, feedback) {
    this.trackEvent('user_test', {
      scenarioId,
      duration,
      performance,
      feedback
    });
  }

  // Sauvegarder dans le localStorage
  saveToLocalStorage() {
    try {
      const analyticsData = {
        events: this.events.slice(-100), // Garder seulement les 100 derniers événements
        sessionStart: this.sessionStart,
        currentUser: this.currentUser
      };
      localStorage.setItem('admin_analytics', JSON.stringify(analyticsData));
    } catch (error) {
      console.warn('Impossible de sauvegarder l\'analytics:', error);
    }
  }

  // Charger depuis le localStorage
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('admin_analytics');
      if (data) {
        const analyticsData = JSON.parse(data);
        this.events = analyticsData.events || [];
        this.sessionStart = analyticsData.sessionStart || Date.now();
        this.currentUser = analyticsData.currentUser;
      }
    } catch (error) {
      console.warn('Impossible de charger l\'analytics:', error);
    }
  }

  // Envoyer à l'API (simulation)
  sendToServer(event) {
    // En production, envoyer à l'API
    console.log('Analytics Event:', event);
  }

  // Obtenir les statistiques
  getStats() {
    const now = Date.now();
    const sessionDuration = now - this.sessionStart;
    
    const stats = {
      totalEvents: this.events.length,
      sessionDuration,
      eventsByType: {},
      recentActivity: this.events.slice(-10),
      performance: this.getPerformanceStats(),
      userActions: this.getUserActionStats()
    };

    // Compter les événements par type
    this.events.forEach(event => {
      stats.eventsByType[event.eventName] = (stats.eventsByType[event.eventName] || 0) + 1;
    });

    return stats;
  }

  // Obtenir les statistiques de performance
  getPerformanceStats() {
    const performanceEvents = this.events.filter(e => e.eventName === 'performance');
    
    return {
      totalOperations: performanceEvents.length,
      averageDuration: performanceEvents.length > 0 
        ? performanceEvents.reduce((sum, e) => sum + e.properties.duration, 0) / performanceEvents.length 
        : 0,
      successRate: performanceEvents.length > 0
        ? (performanceEvents.filter(e => e.properties.success).length / performanceEvents.length) * 100
        : 0
    };
  }

  // Obtenir les statistiques des actions utilisateur
  getUserActionStats() {
    const actionEvents = this.events.filter(e => e.eventName === 'admin_action');
    
    const actionsByType = {};
    actionEvents.forEach(event => {
      const action = event.properties.action;
      actionsByType[action] = (actionsByType[action] || 0) + 1;
    });

    return {
      totalActions: actionEvents.length,
      actionsByType,
      mostCommonAction: Object.keys(actionsByType).reduce((a, b) => 
        actionsByType[a] > actionsByType[b] ? a : b, null
      )
    };
  }

  // Obtenir les métriques pour le tableau de bord
  getDashboardMetrics() {
    const stats = this.getStats();
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > last24h);

    return {
      totalSessions: 1, // Simplifié pour la démo
      averageSessionDuration: stats.sessionDuration,
      eventsLast24h: recentEvents.length,
      mostActiveHour: this.getMostActiveHour(),
      topActions: this.getTopActions(),
      errorRate: this.getErrorRate(),
      userSatisfaction: this.getUserSatisfaction()
    };
  }

  // Obtenir l'heure la plus active
  getMostActiveHour() {
    const hourCounts = {};
    this.events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b, 0
    );
  }

  // Obtenir les actions les plus fréquentes
  getTopActions() {
    const actionStats = this.getUserActionStats();
    return Object.entries(actionStats.actionsByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));
  }

  // Obtenir le taux d'erreur
  getErrorRate() {
    const errorEvents = this.events.filter(e => e.eventName === 'error');
    const totalEvents = this.events.length;
    
    return totalEvents > 0 ? (errorEvents.length / totalEvents) * 100 : 0;
  }

  // Obtenir la satisfaction utilisateur (basée sur les tests)
  getUserSatisfaction() {
    const testEvents = this.events.filter(e => e.eventName === 'user_test');
    if (testEvents.length === 0) return 0;

    const totalSatisfaction = testEvents.reduce((sum, event) => {
      const satisfaction = event.properties.feedback?.satisfaction || 0;
      return sum + satisfaction;
    }, 0);

    return totalSatisfaction / testEvents.length;
  }

  // Exporter les données
  exportData() {
    return {
      events: this.events,
      stats: this.getStats(),
      dashboardMetrics: this.getDashboardMetrics(),
      exportDate: new Date().toISOString()
    };
  }

  // Réinitialiser les données
  reset() {
    this.events = [];
    this.sessionStart = Date.now();
    localStorage.removeItem('admin_analytics');
  }

  // Activer/Désactiver l'analytics
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}

// Instance singleton
const analyticsService = new AnalyticsService();

// Charger les données au démarrage
analyticsService.loadFromLocalStorage();

export default analyticsService; 