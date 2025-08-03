// Service de notifications en temps réel pour le tableau de bord admin

import io from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.notifications = [];
    this.listeners = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialiser la connexion Socket.IO
  init(userId = null) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        userId: userId
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('🔔 Notifications connectées');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('🔔 Notifications déconnectées');
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔔 Erreur de connexion notifications:', error);
      this.handleReconnect();
    });

    // Écouter les notifications
    this.socket.on('notification', (notification) => {
      this.addNotification(notification);
    });

    // Écouter les notifications admin spécifiques
    this.socket.on('admin_notification', (notification) => {
      this.addNotification({
        ...notification,
        type: 'admin',
        priority: 'high'
      });
    });

    // Écouter les nouveaux signalements
    this.socket.on('new_report', (report) => {
      this.addNotification({
        id: Date.now(),
        type: 'report',
        title: 'Nouveau signalement',
        message: `Signalement reçu pour "${report.publicationTitle}"`,
        data: report,
        priority: 'urgent',
        timestamp: new Date().toISOString(),
        read: false
      });
    });

    // Écouter les nouvelles candidatures
    this.socket.on('new_contributor_application', (application) => {
      this.addNotification({
        id: Date.now(),
        type: 'contributor',
        title: 'Nouvelle candidature',
        message: `Candidature de ${application.name} (${application.expertise})`,
        data: application,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        read: false
      });
    });

    // Écouter les actions admin
    this.socket.on('admin_action_completed', (action) => {
      this.addNotification({
        id: Date.now(),
        type: 'action',
        title: 'Action admin terminée',
        message: `${action.action} sur ${action.targetType} #${action.targetId}`,
        data: action,
        priority: 'low',
        timestamp: new Date().toISOString(),
        read: false
      });
    });

    // Écouter les tests utilisateur terminés
    this.socket.on('user_test_completed', (test) => {
      this.addNotification({
        id: Date.now(),
        type: 'test',
        title: 'Test utilisateur terminé',
        message: `Test "${test.scenarioTitle}" - Performance: ${test.performance}%`,
        data: test,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        read: false
      });
    });
  }

  // Gérer la reconnexion
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔔 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.init();
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error('🔔 Échec de reconnexion après plusieurs tentatives');
    }
  }

  // Ajouter une notification
  addNotification(notification) {
    // Limiter le nombre de notifications en mémoire
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(-50);
    }

    this.notifications.unshift(notification);
    this.saveToLocalStorage();
    this.notifyListeners();

    // Notification push pour les priorités urgentes
    if (notification.priority === 'urgent') {
      this.showPushNotification(notification);
    }
  }

  // Afficher une notification push
  showPushNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id
      });
    }
  }

  // Demander la permission pour les notifications push
  requestPushPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Permission notifications:', permission);
      });
    }
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToLocalStorage();
      this.notifyListeners();
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  // Supprimer une notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  // Supprimer toutes les notifications
  clearAllNotifications() {
    this.notifications = [];
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Obtenir les notifications par type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  // Obtenir les notifications par priorité
  getNotificationsByPriority(priority) {
    return this.notifications.filter(n => n.priority === priority);
  }

  // Obtenir les statistiques des notifications
  getNotificationStats() {
    const total = this.notifications.length;
    const unread = this.getUnreadCount();
    const byType = {};
    const byPriority = {};

    this.notifications.forEach(notification => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
    });

    return {
      total,
      unread,
      byType,
      byPriority,
      readRate: total > 0 ? ((total - unread) / total) * 100 : 0
    };
  }

  // Sauvegarder dans le localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('admin_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.warn('Impossible de sauvegarder les notifications:', error);
    }
  }

  // Charger depuis le localStorage
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('admin_notifications');
      if (data) {
        this.notifications = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Impossible de charger les notifications:', error);
    }
  }

  // Système d'écouteurs
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notifier les écouteurs
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.notifications, this.getUnreadCount());
      } catch (error) {
        console.error('Erreur dans le listener de notifications:', error);
      }
    });
  }

  // Envoyer une notification de test
  sendTestNotification() {
    const testNotification = {
      id: Date.now(),
      type: 'test',
      title: 'Test de notification',
      message: 'Ceci est une notification de test pour vérifier le système',
      priority: 'low',
      timestamp: new Date().toISOString(),
      read: false
    };

    this.addNotification(testNotification);
  }

  // Simuler des notifications pour la démo
  simulateNotifications() {
    const notifications = [
      {
        id: Date.now() + 1,
        type: 'report',
        title: 'Nouveau signalement urgent',
        message: 'Signalement reçu pour "Informations médicales incorrectes"',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false
      },
      {
        id: Date.now() + 2,
        type: 'contributor',
        title: 'Nouvelle candidature',
        message: 'Candidature de Dr. Fatoumata Camara (Médecine)',
        priority: 'medium',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: false
      },
      {
        id: Date.now() + 3,
        type: 'action',
        title: 'Action admin terminée',
        message: 'Publication "Guide santé" approuvée',
        priority: 'low',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        read: true
      },
      {
        id: Date.now() + 4,
        type: 'test',
        title: 'Test utilisateur terminé',
        message: 'Test "Gestion contributeurs" - Performance: 85%',
        priority: 'medium',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        read: true
      }
    ];

    notifications.forEach(notification => {
      this.addNotification(notification);
    });
  }

  // Déconnecter
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }

  // Obtenir l'état de connexion
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
}

// Instance singleton
const notificationService = new NotificationService();

// Charger les notifications au démarrage
notificationService.loadFromLocalStorage();

export default notificationService; 