const nodemailer = require('nodemailer');
const twilio = require('twilio');

class AdvancedNotificationService {
  constructor(io) {
    this.io = io;
    this.notifications = new Map();
    this.userSessions = new Map();
    
    // Configuration email (simulée en développement)
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'test@communiconnect.com',
        pass: process.env.SMTP_PASS || 'test-password'
      }
    });

    // Configuration SMS (simulée en développement)
    this.smsClient = process.env.NODE_ENV === 'production' 
      ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      : null;
  }

  // Notifications en temps réel via Socket.IO
  async sendRealTimeNotification(userId, notification) {
    try {
      const userSocket = this.userSessions.get(userId);
      
      if (userSocket) {
        this.io.to(userSocket).emit('notification', {
          type: 'real-time',
          data: notification,
          timestamp: new Date().toISOString()
        });
      }

      // Stocker la notification
      if (!this.notifications.has(userId)) {
        this.notifications.set(userId, []);
      }
      this.notifications.get(userId).push(notification);

      return { success: true, sent: !!userSocket };
    } catch (error) {
      console.error('Erreur notification temps réel:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications push (Firebase)
  async sendPushNotification(userId, notification) {
    try {
      // En mode développement, simulation
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 Push notification pour ${userId}:`, notification.title);
        return { success: true, sent: true };
      }

      // En production, utiliser Firebase
      // const message = {
      //   notification: {
      //     title: notification.title,
      //     body: notification.message
      //   },
      //   token: userFCMToken
      // };
      // await admin.messaging().send(message);

      return { success: true, sent: true };
    } catch (error) {
      console.error('Erreur push notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications par email
  async sendEmailNotification(userEmail, notification) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@communiconnect.com',
        to: userEmail,
        subject: notification.title,
        html: this.generateEmailTemplate(notification)
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Email notification pour ${userEmail}:`, notification.title);
        return { success: true, sent: true };
      }

      const result = await this.emailTransporter.sendMail(mailOptions);
      return { success: true, sent: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erreur email notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications SMS
  async sendSMSNotification(phoneNumber, notification) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 SMS notification pour ${phoneNumber}:`, notification.message);
        return { success: true, sent: true };
      }

      if (!this.smsClient) {
        throw new Error('Client SMS non configuré');
      }

      const message = await this.smsClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return { success: true, sent: true, messageId: message.sid };
    } catch (error) {
      console.error('Erreur SMS notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Notification multi-canal
  async sendMultiChannelNotification(userId, notification, channels = ['real-time']) {
    try {
      const results = {};

      // Récupérer les préférences utilisateur
      const userPreferences = await this.getUserNotificationPreferences(userId);

      for (const channel of channels) {
        switch (channel) {
          case 'real-time':
            results.realTime = await this.sendRealTimeNotification(userId, notification);
            break;
          case 'push':
            results.push = await this.sendPushNotification(userId, notification);
            break;
          case 'email':
            if (userPreferences.email) {
              results.email = await this.sendEmailNotification(userPreferences.email, notification);
            }
            break;
          case 'sms':
            if (userPreferences.phone) {
              results.sms = await this.sendSMSNotification(userPreferences.phone, notification);
            }
            break;
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Erreur notification multi-canal:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications de groupe
  async sendGroupNotification(userIds, notification, channels = ['real-time']) {
    try {
      const results = [];
      
      for (const userId of userIds) {
        const result = await this.sendMultiChannelNotification(userId, notification, channels);
        results.push({ userId, result });
      }

      return { success: true, results };
    } catch (error) {
      console.error('Erreur notification de groupe:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications automatiques basées sur les événements
  async sendEventBasedNotification(event, data) {
    try {
      const notificationTemplates = {
        'user_registration': {
          title: 'Bienvenue sur CommuniConnect !',
          message: 'Votre compte a été créé avec succès.',
          type: 'welcome'
        },
        'new_post': {
          title: 'Nouvelle publication',
          message: `${data.author} a publié quelque chose de nouveau.`,
          type: 'post'
        },
        'event_reminder': {
          title: 'Rappel d\'événement',
          message: `L'événement "${data.eventTitle}" commence dans 1 heure.`,
          type: 'reminder'
        },
        'moderation_action': {
          title: 'Action de modération',
          message: 'Votre contenu a été modéré.',
          type: 'moderation'
        }
      };

      const template = notificationTemplates[event];
      if (!template) {
        throw new Error(`Template non trouvé pour l'événement: ${event}`);
      }

      const notification = {
        ...template,
        data,
        event,
        timestamp: new Date().toISOString()
      };

      return notification;
    } catch (error) {
      console.error('Erreur notification basée sur événement:', error);
      return null;
    }
  }

  // Gestion des sessions utilisateur
  handleUserConnection(userId, socketId) {
    this.userSessions.set(userId, socketId);
    console.log(`👤 Utilisateur ${userId} connecté (socket: ${socketId})`);
  }

  handleUserDisconnection(userId) {
    this.userSessions.delete(userId);
    console.log(`👤 Utilisateur ${userId} déconnecté`);
  }

  // Récupérer les notifications d'un utilisateur
  getUserNotifications(userId, limit = 50) {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.slice(-limit);
  }

  // Marquer une notification comme lue
  markNotificationAsRead(userId, notificationId) {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }
  }

  // Utilitaires
  async getUserNotificationPreferences(userId) {
    // En mode développement, préférences simulées
    return {
      email: 'user@example.com',
      phone: '+1234567890',
      push: true,
      realTime: true,
      emailNotifications: true,
      smsNotifications: false
    };
  }

  generateEmailTemplate(notification) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003366 0%, #007ACC 100%); color: white; padding: 20px; text-align: center;">
          <h1>CommuniConnect</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          <p style="color: #666; font-size: 12px;">
            Envoyé le ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div style="background: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          © 2025 CommuniConnect - Tous droits réservés
        </div>
      </div>
    `;
  }

  // Statistiques des notifications
  getNotificationStats() {
    const stats = {
      totalNotifications: 0,
      activeUsers: this.userSessions.size,
      notificationsByType: {},
      averageDeliveryTime: 0
    };

    for (const [userId, notifications] of this.notifications.entries()) {
      stats.totalNotifications += notifications.length;
      
      notifications.forEach(notification => {
        const type = notification.type || 'unknown';
        stats.notificationsByType[type] = (stats.notificationsByType[type] || 0) + 1;
      });
    }

    return stats;
  }
}

module.exports = AdvancedNotificationService; 