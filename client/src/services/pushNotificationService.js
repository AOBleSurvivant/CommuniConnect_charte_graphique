import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuration Firebase (à remplacer par vos vraies clés)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "communiConnect-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "communiConnect-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "communiConnect-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

class PushNotificationService {
  constructor() {
    this.messaging = null;
    this.isSupported = this.checkSupport();
    this.notificationPermission = 'default';
    this.isInitialized = false;
  }

  checkSupport() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async initialize() {
    if (!this.isSupported || this.isInitialized) {
      return false;
    }

    try {
      // Initialiser Firebase
      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);

      // Demander la permission
      this.notificationPermission = await this.requestPermission();
      
      if (this.notificationPermission === 'granted') {
        // Obtenir le token FCM
        const token = await this.getFCMToken();
        if (token) {
          await this.sendTokenToServer(token);
        }

        // Écouter les messages en arrière-plan
        this.setupBackgroundMessageHandler();
        
        // Écouter les messages au premier plan
        this.setupForegroundMessageHandler();
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications push:', error);
      return false;
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return 'denied';
    }
  }

  async getFCMToken() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || 'demo-vapid-key'
      });
      return token;
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token FCM:', error);
      return null;
    }
  }

  async sendTokenToServer(token) {
    try {
      const response = await fetch('/api/notifications/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token, platform: 'web' })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du token');
      }

      console.log('Token FCM enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du token au serveur:', error);
    }
  }

  setupBackgroundMessageHandler() {
    // Gestionnaire pour les messages en arrière-plan
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
          this.handleNotification(event.data.payload);
        }
      });
    }
  }

  setupForegroundMessageHandler() {
    // Gestionnaire pour les messages au premier plan
    onMessage(this.messaging, (payload) => {
      console.log('Message reçu au premier plan:', payload);
      this.handleNotification(payload);
    });
  }

  handleNotification(payload) {
    const { notification, data } = payload;
    
    // Créer une notification native
    if (Notification.permission === 'granted') {
      const notificationOptions = {
        body: notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: data?.type || 'default',
        data: data,
        actions: this.getNotificationActions(data?.type),
        requireInteraction: data?.type === 'alert' || data?.type === 'critical'
      };

      const nativeNotification = new Notification(notification.title, notificationOptions);

      // Gérer les clics sur la notification
      nativeNotification.onclick = (event) => {
        this.handleNotificationClick(event, data);
        nativeNotification.close();
      };

      // Auto-fermeture pour les notifications non critiques
      if (data?.type !== 'alert' && data?.type !== 'critical') {
        setTimeout(() => {
          nativeNotification.close();
        }, 10000); // 10 secondes
      }
    }

    // Émettre un événement personnalisé pour l'interface
    window.dispatchEvent(new CustomEvent('pushNotification', {
      detail: { notification, data }
    }));
  }

  getNotificationActions(type) {
    switch (type) {
      case 'message':
        return [
          { action: 'reply', title: 'Répondre', icon: '/icons/reply.png' },
          { action: 'view', title: 'Voir', icon: '/icons/view.png' }
        ];
      case 'alert':
        return [
          { action: 'view', title: 'Voir détails', icon: '/icons/view.png' },
          { action: 'share', title: 'Partager', icon: '/icons/share.png' }
        ];
      case 'livestream':
        return [
          { action: 'join', title: 'Rejoindre', icon: '/icons/join.png' },
          { action: 'view', title: 'Voir', icon: '/icons/view.png' }
        ];
      case 'event':
        return [
          { action: 'rsvp', title: 'Participer', icon: '/icons/rsvp.png' },
          { action: 'view', title: 'Voir détails', icon: '/icons/view.png' }
        ];
      default:
        return [
          { action: 'view', title: 'Voir', icon: '/icons/view.png' }
        ];
    }
  }

  handleNotificationClick(event, data) {
    const { type, id, url } = data;

    switch (type) {
      case 'message':
        // Rediriger vers la conversation
        window.location.href = `/messages?conversation=${id}`;
        break;
      case 'alert':
        // Rediriger vers les détails de l'alerte
        window.location.href = `/alerts?alert=${id}`;
        break;
      case 'livestream':
        // Rediriger vers le livestream
        window.location.href = `/livestreams?stream=${id}`;
        break;
      case 'event':
        // Rediriger vers l'événement
        window.location.href = `/events?event=${id}`;
        break;
      case 'friend_request':
        // Rediriger vers les demandes d'amis
        window.location.href = `/friends?tab=requests`;
        break;
      default:
        // Redirection par défaut
        if (url) {
          window.location.href = url;
        }
    }
  }

  // Méthodes pour envoyer des notifications depuis l'interface
  async sendNotification(userId, notification) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          type: notification.type
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
      return false;
    }
  }

  // Notifications pour les livestreams
  async notifyLivestreamStart(livestreamId, title, authorName) {
    return this.sendNotification('all', {
      title: '🎥 Live en cours',
      body: `${title} par ${authorName}`,
      data: {
        type: 'livestream',
        id: livestreamId,
        url: `/livestreams?stream=${livestreamId}`
      },
      type: 'livestream'
    });
  }

  // Notifications pour les alertes
  async notifyAlert(alertId, title, urgency) {
    const urgencyEmoji = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
      critical: '🚨'
    };

    return this.sendNotification('all', {
      title: `${urgencyEmoji[urgency]} Nouvelle alerte`,
      body: title,
      data: {
        type: 'alert',
        id: alertId,
        url: `/alerts?alert=${alertId}`
      },
      type: 'alert'
    });
  }

  // Notifications pour les messages
  async notifyNewMessage(conversationId, senderName, message) {
    return this.sendNotification('conversation', {
      title: `💬 ${senderName}`,
      body: message,
      data: {
        type: 'message',
        id: conversationId,
        url: `/messages?conversation=${conversationId}`
      },
      type: 'message'
    });
  }

  // Notifications pour les événements
  async notifyEvent(eventId, title, date) {
    return this.sendNotification('all', {
      title: '📅 Événement à venir',
      body: `${title} - ${new Date(date).toLocaleDateString()}`,
      data: {
        type: 'event',
        id: eventId,
        url: `/events?event=${eventId}`
      },
      type: 'event'
    });
  }

  // Notifications pour les demandes d'amis
  async notifyFriendRequest(requesterName) {
    return this.sendNotification('user', {
      title: '👥 Nouvelle demande d'ami',
      body: `${requesterName} souhaite vous ajouter comme ami`,
      data: {
        type: 'friend_request',
        url: '/friends?tab=requests'
      },
      type: 'friend_request'
    });
  }

  // Méthodes utilitaires
  isSupported() {
    return this.isSupported;
  }

  isInitialized() {
    return this.isInitialized;
  }

  getPermissionStatus() {
    return this.notificationPermission;
  }

  async updateSettings(settings) {
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      return false;
    }
  }
}

// Instance singleton
const pushNotificationService = new PushNotificationService();

export default pushNotificationService; 