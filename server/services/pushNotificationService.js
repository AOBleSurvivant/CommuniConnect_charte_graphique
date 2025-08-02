const admin = require('firebase-admin');
const User = require('../models/User');

class PushNotificationService {
  constructor() {
    this.initializeFirebase();
  }

  // Initialiser Firebase Admin SDK
  initializeFirebase() {
    try {
      // Vérifier si Firebase est déjà initialisé
      if (admin.apps.length === 0) {
        // Initialiser avec les credentials
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        } else {
          // Mode développement sans Firebase
          console.log('⚠️ Firebase non configuré - Mode développement');
          this.isEnabled = false;
          return;
        }
      }

      this.messaging = admin.messaging();
      this.isEnabled = true;
      console.log('✅ Service de notifications push Firebase initialisé');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation Firebase:', error);
      this.isEnabled = false;
    }
  }

  // Envoyer une notification à un utilisateur spécifique
  async sendToUser(userId, notification) {
    if (!this.isEnabled) {
      console.log('⚠️ Notifications push désactivées');
      return false;
    }

    try {
      const user = await User.findById(userId).select('fcmToken notificationSettings');
      
      if (!user || !user.fcmToken) {
        console.log(`⚠️ Utilisateur ${userId} n'a pas de token FCM`);
        return false;
      }

      // Vérifier les paramètres de notification de l'utilisateur
      if (!this.shouldSendNotification(user, notification.type)) {
        console.log(`⚠️ Notification bloquée par les paramètres utilisateur: ${notification.type}`);
        return false;
      }

      const message = {
        token: user.fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl
        },
        data: {
          type: notification.type,
          conversationId: notification.conversationId || '',
          messageId: notification.messageId || '',
          senderId: notification.senderId || '',
          clickAction: notification.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
        },
        android: {
          notification: {
            channelId: this.getChannelId(notification.type),
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
            icon: 'ic_notification',
            color: '#2196F3'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              category: notification.type
            }
          }
        },
        webpush: {
          notification: {
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            actions: [
              {
                action: 'reply',
                title: 'Répondre',
                icon: '/reply-icon.png'
              },
              {
                action: 'mark_read',
                title: 'Marquer comme lu',
                icon: '/read-icon.png'
              }
            ]
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log(`✅ Notification envoyée à ${userId}:`, response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de notification à ${userId}:`, error);
      
      // Si le token est invalide, le supprimer
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        await this.removeInvalidToken(userId);
      }
      
      return false;
    }
  }

  // Envoyer une notification à plusieurs utilisateurs
  async sendToUsers(userIds, notification) {
    if (!this.isEnabled) {
      console.log('⚠️ Notifications push désactivées');
      return { success: 0, failed: 0 };
    }

    try {
      const users = await User.find({
        _id: { $in: userIds },
        fcmToken: { $exists: true, $ne: null }
      }).select('fcmToken notificationSettings');

      const validUsers = users.filter(user => 
        this.shouldSendNotification(user, notification.type)
      );

      if (validUsers.length === 0) {
        console.log('⚠️ Aucun utilisateur valide pour la notification');
        return { success: 0, failed: 0 };
      }

      const tokens = validUsers.map(user => user.fcmToken);
      
      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl
        },
        data: {
          type: notification.type,
          conversationId: notification.conversationId || '',
          messageId: notification.messageId || '',
          senderId: notification.senderId || '',
          clickAction: notification.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
        },
        android: {
          notification: {
            channelId: this.getChannelId(notification.type),
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
            icon: 'ic_notification',
            color: '#2196F3'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              category: notification.type
            }
          }
        }
      };

      const response = await this.messaging.sendMulticast({
        tokens,
        ...message
      });

      console.log(`✅ Notifications envoyées: ${response.successCount}/${tokens.length}`);
      
      // Gérer les tokens invalides
      if (response.failureCount > 0) {
        const invalidTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            invalidTokens.push({
              userId: validUsers[idx]._id,
              token: tokens[idx]
            });
          }
        });
        
        await this.removeInvalidTokens(invalidTokens);
      }

      return {
        success: response.successCount,
        failed: response.failureCount
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de notifications multiples:', error);
      return { success: 0, failed: userIds.length };
    }
  }

  // Envoyer une notification à tous les utilisateurs d'une région/quartier
  async sendToLocation(region, quartier, notification) {
    if (!this.isEnabled) {
      console.log('⚠️ Notifications push désactivées');
      return { success: 0, failed: 0 };
    }

    try {
      const query = {};
      if (region) query.region = region;
      if (quartier) query.quartier = quartier;

      const users = await User.find({
        ...query,
        fcmToken: { $exists: true, $ne: null }
      }).select('_id fcmToken notificationSettings');

      const userIds = users.map(user => user._id.toString());
      
      return await this.sendToUsers(userIds, notification);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de notifications par localisation:', error);
      return { success: 0, failed: 0 };
    }
  }

  // Envoyer une notification d'alerte
  async sendAlertNotification(alert) {
    const notification = {
      title: `🚨 Alerte: ${alert.type}`,
      body: alert.description || `Nouvelle alerte dans votre quartier`,
      type: 'alert',
      imageUrl: alert.imageUrl,
      clickAction: 'OPEN_ALERT',
      data: {
        alertId: alert._id.toString(),
        alertType: alert.type,
        location: `${alert.quartier}, ${alert.ville}`
      }
    };

    // Envoyer aux utilisateurs de la zone
    return await this.sendToLocation(alert.region, alert.quartier, notification);
  }

  // Envoyer une notification de nouveau message
  async sendMessageNotification(message, conversation) {
    const sender = await User.findById(message.sender).select('firstName lastName');
    
    const notification = {
      title: conversation.type === 'private' 
        ? `💬 ${sender.firstName} ${sender.lastName}`
        : `💬 ${conversation.name || 'Groupe'}`,
      body: message.content.length > 50 
        ? `${message.content.substring(0, 50)}...`
        : message.content,
      type: 'message',
      conversationId: conversation.conversationId,
      messageId: message._id.toString(),
      senderId: message.sender.toString(),
      clickAction: 'OPEN_CONVERSATION'
    };

    // Envoyer aux participants de la conversation
    const participantIds = conversation.participants
      .map(p => p.user.toString())
      .filter(id => id !== message.sender.toString());

    return await this.sendToUsers(participantIds, notification);
  }

  // Envoyer une notification d'événement
  async sendEventNotification(event) {
    const notification = {
      title: `📅 Événement: ${event.title}`,
      body: `Nouvel événement le ${new Date(event.date).toLocaleDateString('fr-FR')}`,
      type: 'event',
      imageUrl: event.imageUrl,
      clickAction: 'OPEN_EVENT',
      data: {
        eventId: event._id.toString(),
        eventDate: event.date,
        location: event.location
      }
    };

    // Envoyer aux utilisateurs de la zone
    return await this.sendToLocation(event.region, event.quartier, notification);
  }

  // Envoyer une notification de demande d'aide
  async sendHelpRequestNotification(helpRequest) {
    const requester = await User.findById(helpRequest.user).select('firstName lastName');
    
    const notification = {
      title: `🆘 Demande d'aide de ${requester.firstName}`,
      body: helpRequest.description || 'Nouvelle demande d\'aide dans votre quartier',
      type: 'help_request',
      clickAction: 'OPEN_HELP_REQUEST',
      data: {
        helpRequestId: helpRequest._id.toString(),
        category: helpRequest.category,
        urgency: helpRequest.urgency
      }
    };

    // Envoyer aux utilisateurs de la zone
    return await this.sendToLocation(helpRequest.region, helpRequest.quartier, notification);
  }

  // Vérifier si une notification doit être envoyée selon les paramètres utilisateur
  shouldSendNotification(user, notificationType) {
    if (!user.notificationSettings) return true;

    const settings = user.notificationSettings;
    
    switch (notificationType) {
      case 'message':
        return settings.messages !== false;
      case 'alert':
        return settings.alerts !== false;
      case 'event':
        return settings.events !== false;
      case 'help_request':
        return settings.helpRequests !== false;
      default:
        return true;
    }
  }

  // Obtenir l'ID du canal Android selon le type de notification
  getChannelId(notificationType) {
    switch (notificationType) {
      case 'alert':
        return 'alerts';
      case 'message':
        return 'messages';
      case 'event':
        return 'events';
      case 'help_request':
        return 'help_requests';
      default:
        return 'general';
    }
  }

  // Supprimer un token FCM invalide
  async removeInvalidToken(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        $unset: { fcmToken: 1 }
      });
      console.log(`🗑️ Token FCM supprimé pour l'utilisateur ${userId}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du token pour ${userId}:`, error);
    }
  }

  // Supprimer plusieurs tokens FCM invalides
  async removeInvalidTokens(invalidTokens) {
    try {
      for (const { userId } of invalidTokens) {
        await this.removeInvalidToken(userId);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des tokens invalides:', error);
    }
  }

  // Enregistrer un token FCM pour un utilisateur
  async registerToken(userId, fcmToken) {
    try {
      await User.findByIdAndUpdate(userId, {
        fcmToken,
        lastTokenUpdate: new Date()
      });
      console.log(`✅ Token FCM enregistré pour l'utilisateur ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'enregistrement du token pour ${userId}:`, error);
      return false;
    }
  }

  // Obtenir les statistiques des notifications
  async getNotificationStats() {
    try {
      const totalUsers = await User.countDocuments();
      const usersWithToken = await User.countDocuments({
        fcmToken: { $exists: true, $ne: null }
      });

      return {
        totalUsers,
        usersWithToken,
        coverage: totalUsers > 0 ? (usersWithToken / totalUsers * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return { totalUsers: 0, usersWithToken: 0, coverage: 0 };
    }
  }
}

module.exports = PushNotificationService; 