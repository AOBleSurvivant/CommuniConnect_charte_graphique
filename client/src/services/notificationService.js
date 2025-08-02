import io from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.notifications = [];
    this.unreadCount = 0;
    this.userId = null;
    this.token = null;
  }

  // Initialiser la connexion
  connect(userId, token) {
    if (this.socket && this.isConnected) {
      return;
    }

    this.userId = userId;
    this.token = token;

    // Connexion au serveur WebSocket
    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('🔔 Connecté au service de notifications');
      this.isConnected = true;
      this.authenticate();
    });

    this.socket.on('disconnect', () => {
      console.log('🔔 Déconnecté du service de notifications');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔔 Erreur de connexion aux notifications:', error);
      this.isConnected = false;
    });

    // Écouter les notifications
    this.socket.on('notification', (notification) => {
      console.log('📨 Nouvelle notification reçue:', notification);
      this.handleNewNotification(notification);
    });

    // Écouter les notifications non lues
    this.socket.on('unread_notifications', (data) => {
      console.log('📨 Notifications non lues reçues:', data);
      this.handleUnreadNotifications(data.data);
    });

    // Écouter les statistiques du serveur
    this.socket.on('server_stats', (stats) => {
      console.log('📊 Statistiques serveur:', stats);
      this.emit('server_stats', stats);
    });
  }

  // Authentifier l'utilisateur
  authenticate() {
    if (this.socket && this.userId) {
      this.socket.emit('authenticate', {
        userId: this.userId,
        token: this.token
      });
    }
  }

  // Rejoindre des rooms spécifiques
  joinRooms(rooms) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-rooms', rooms);
    }
  }

  // Quitter des rooms
  leaveRooms(rooms) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-rooms', rooms);
    }
  }

  // Mettre à jour la localisation
  updateLocation(location) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update-location', location);
    }
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-read', notificationId);
      
      // Mettre à jour localement
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.emit('notification_updated', { notification, unreadCount: this.unreadCount });
      }
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-all-read');
      
      // Mettre à jour localement
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      this.unreadCount = 0;
      this.emit('all_notifications_read', { unreadCount: 0 });
    }
  }

  // Gérer une nouvelle notification
  handleNewNotification(notification) {
    // Ajouter à la liste des notifications
    this.notifications.unshift(notification);
    
    // Limiter le nombre de notifications en mémoire
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Incrémenter le compteur de notifications non lues
    if (!notification.read) {
      this.unreadCount++;
    }

    // Émettre l'événement
    this.emit('new_notification', { notification, unreadCount: this.unreadCount });

    // Afficher une notification toast si l'utilisateur est sur la page
    this.showToastNotification(notification);
  }

  // Gérer les notifications non lues
  handleUnreadNotifications(notifications) {
    this.notifications = notifications;
    this.unreadCount = notifications.filter(n => !n.read).length;
    this.emit('notifications_loaded', { notifications, unreadCount: this.unreadCount });
  }

  // Afficher une notification toast
  showToastNotification(notification) {
    // Vérifier si l'utilisateur est sur la page
    if (document.visibilityState === 'visible') {
      // Créer une notification native du navigateur seulement si autorisé
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id,
            requireInteraction: notification.priority === 'high'
          });
        } catch (error) {
          console.warn('Erreur lors de l\'affichage de la notification:', error);
        }
      }
    }
  }

  // Demander la permission pour les notifications
  async requestPermission() {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.warn('Erreur lors de la demande de permission:', error);
        return false;
      }
    }
    return false;
  }

  // Vérifier la permission sans demander
  checkPermission() {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  // Obtenir les notifications
  getNotifications() {
    return this.notifications;
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.unreadCount;
  }

  // Filtrer les notifications par type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  // Supprimer une notification
  removeNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notification = this.notifications[index];
      this.notifications.splice(index, 1);
      
      if (!notification.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      
      this.emit('notification_removed', { notificationId, unreadCount: this.unreadCount });
    }
  }

  // Système d'événements pour les composants React
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erreur dans le callback de notification:', error);
        }
      });
    }
  }

  // Déconnexion
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
      this.token = null;
      this.notifications = [];
      this.unreadCount = 0;
      this.listeners.clear();
    }
  }

  // Vérifier si connecté
  isConnected() {
    return this.isConnected;
  }

  // Obtenir les statistiques de connexion
  getConnectionStats() {
    if (this.socket) {
      return {
        connected: this.socket.connected,
        id: this.socket.id,
        transport: this.socket.io.engine.transport.name
      };
    }
    return { connected: false };
  }
}

// Instance singleton
const notificationService = new NotificationService();

export default notificationService; 