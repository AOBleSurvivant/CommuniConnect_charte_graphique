const io = require('socket.io');

class NotificationService {
  constructor(server) {
    this.io = io(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.connectedUsers = new Map(); // userId -> socketId
    this.userRooms = new Map(); // userId -> [room1, room2, ...]
    
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🔔 Nouvelle connexion notification:', socket.id);

      // Authentification de l'utilisateur
      socket.on('authenticate', (data) => {
        const { userId, token } = data;
        if (userId) {
          this.authenticateUser(socket, userId);
        }
      });

      // Rejoindre des rooms spécifiques
      socket.on('join-rooms', (rooms) => {
        if (Array.isArray(rooms)) {
          rooms.forEach(room => {
            socket.join(room);
            console.log(`👥 Utilisateur ${socket.userId} a rejoint la room: ${room}`);
          });
        }
      });

      // Quitter des rooms
      socket.on('leave-rooms', (rooms) => {
        if (Array.isArray(rooms)) {
          rooms.forEach(room => {
            socket.leave(room);
            console.log(`👋 Utilisateur ${socket.userId} a quitté la room: ${room}`);
          });
        }
      });

      // Mettre à jour la localisation pour les notifications géolocalisées
      socket.on('update-location', (location) => {
        if (socket.userId && location) {
          this.updateUserLocation(socket.userId, location);
        }
      });

      // Marquer une notification comme lue
      socket.on('mark-read', (notificationId) => {
        if (socket.userId) {
          this.markNotificationAsRead(socket.userId, notificationId);
        }
      });

      // Marquer toutes les notifications comme lues
      socket.on('mark-all-read', () => {
        if (socket.userId) {
          this.markAllNotificationsAsRead(socket.userId);
        }
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log('🔔 Déconnexion notification:', socket.id);
        if (socket.userId) {
          this.disconnectUser(socket.userId);
        }
      });
    });
  }

  authenticateUser(socket, userId) {
    socket.userId = userId;
    this.connectedUsers.set(userId, socket.id);
    
    // Rejoindre les rooms par défaut
    socket.join(`user:${userId}`);
    socket.join('global');
    
    console.log(`✅ Utilisateur ${userId} authentifié pour les notifications`);
    
    // Envoyer les notifications non lues
    this.sendUnreadNotifications(userId);
  }

  disconnectUser(userId) {
    this.connectedUsers.delete(userId);
    console.log(`🔌 Utilisateur ${userId} déconnecté des notifications`);
  }

  updateUserLocation(userId, location) {
    // Mettre à jour la localisation pour les notifications géolocalisées
    console.log(`📍 Localisation mise à jour pour l'utilisateur ${userId}:`, location);
  }

  // Envoyer une notification à un utilisateur spécifique
  sendToUser(userId, notification) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
      console.log(`📨 Notification envoyée à l'utilisateur ${userId}:`, notification.type);
    }
  }

  // Envoyer une notification à plusieurs utilisateurs
  sendToUsers(userIds, notification) {
    userIds.forEach(userId => {
      this.sendToUser(userId, notification);
    });
  }

  // Envoyer une notification à une room
  sendToRoom(room, notification) {
    this.io.to(room).emit('notification', notification);
    console.log(`📢 Notification envoyée à la room ${room}:`, notification.type);
  }

  // Envoyer une notification globale
  sendGlobal(notification) {
    this.io.to('global').emit('notification', notification);
    console.log(`🌍 Notification globale envoyée:`, notification.type);
  }

  // Envoyer une notification géolocalisée
  sendGeolocated(notification, radius = 10) {
    // TODO: Implémenter la logique de géolocalisation
    // Pour l'instant, on envoie à tous les utilisateurs connectés
    this.io.to('global').emit('notification', notification);
    console.log(`🗺️ Notification géolocalisée envoyée:`, notification.type);
  }

  // Notifications spécifiques par type
  sendNewPostNotification(post, author) {
    const notification = {
      id: Date.now().toString(),
      type: 'new_post',
      title: 'Nouvelle publication',
      message: `${author.firstName} ${author.lastName} a publié quelque chose`,
      data: {
        postId: post._id,
        authorId: author._id,
        authorName: `${author.firstName} ${author.lastName}`,
        postType: post.type,
        location: post.location
      },
      timestamp: new Date(),
      read: false,
      priority: 'normal'
    };

    // Envoyer aux utilisateurs de la même région/quartier
    this.sendToRoom(`region:${post.location.region}`, notification);
  }

  sendNewAlertNotification(alert, author) {
    const notification = {
      id: Date.now().toString(),
      type: 'new_alert',
      title: 'Nouvelle alerte',
      message: `Alerte ${alert.type} dans votre zone`,
      data: {
        alertId: alert._id,
        authorId: author._id,
        alertType: alert.type,
        priority: alert.priority,
        location: alert.location
      },
      timestamp: new Date(),
      read: false,
      priority: alert.priority === 'urgent' ? 'high' : 'normal'
    };

    // Envoyer aux utilisateurs de la même zone
    this.sendGeolocated(notification, alert.impactRadius || 5);
  }

  sendNewEventNotification(event, organizer) {
    const notification = {
      id: Date.now().toString(),
      type: 'new_event',
      title: 'Nouvel événement',
      message: `${organizer.firstName} ${organizer.lastName} organise un événement`,
      data: {
        eventId: event._id,
        organizerId: organizer._id,
        organizerName: `${organizer.firstName} ${organizer.lastName}`,
        eventTitle: event.title,
        eventDate: event.startDate,
        location: event.location
      },
      timestamp: new Date(),
      read: false,
      priority: 'normal'
    };

    // Envoyer aux utilisateurs de la même région
    this.sendToRoom(`region:${event.location.region}`, notification);
  }

  sendHelpRequestNotification(request, author) {
    const notification = {
      id: Date.now().toString(),
      type: 'help_request',
      title: 'Demande d\'aide',
      message: `${author.firstName} ${author.lastName} a besoin d'aide`,
      data: {
        requestId: request._id,
        authorId: author._id,
        authorName: `${author.firstName} ${author.lastName}`,
        category: request.category,
        priority: request.priority,
        location: request.location
      },
      timestamp: new Date(),
      read: false,
      priority: request.priority === 'urgent' ? 'high' : 'normal'
    };

    // Envoyer aux utilisateurs de la même zone
    this.sendGeolocated(notification, 5);
  }

  sendCommentNotification(comment, post, commenter) {
    const notification = {
      id: Date.now().toString(),
      type: 'new_comment',
      title: 'Nouveau commentaire',
      message: `${commenter.firstName} ${commenter.lastName} a commenté votre publication`,
      data: {
        commentId: comment._id,
        postId: post._id,
        commenterId: commenter._id,
        commenterName: `${commenter.firstName} ${commenter.lastName}`,
        commentContent: comment.content.substring(0, 100)
      },
      timestamp: new Date(),
      read: false,
      priority: 'normal'
    };

    // Envoyer à l'auteur du post
    this.sendToUser(post.author, notification);
  }

  sendLikeNotification(like, post, liker) {
    const notification = {
      id: Date.now().toString(),
      type: 'new_like',
      title: 'Nouveau j\'aime',
      message: `${liker.firstName} ${liker.lastName} a aimé votre publication`,
      data: {
        likeId: like._id,
        postId: post._id,
        likerId: liker._id,
        likerName: `${liker.firstName} ${liker.lastName}`
      },
      timestamp: new Date(),
      read: false,
      priority: 'low'
    };

    // Envoyer à l'auteur du post
    this.sendToUser(post.author, notification);
  }

  sendEventReminderNotification(event, participants) {
    const notification = {
      id: Date.now().toString(),
      type: 'event_reminder',
      title: 'Rappel d\'événement',
      message: `L'événement "${event.title}" commence dans 1 heure`,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        location: event.location
      },
      timestamp: new Date(),
      read: false,
      priority: 'normal'
    };

    // Envoyer aux participants
    participants.forEach(participant => {
      this.sendToUser(participant.user, notification);
    });
  }

  sendModerationNotification(userId, action, reason) {
    const notification = {
      id: Date.now().toString(),
      type: 'moderation',
      title: 'Action de modération',
      message: `Votre compte a été ${action}`,
      data: {
        action,
        reason,
        timestamp: new Date()
      },
      timestamp: new Date(),
      read: false,
      priority: 'high'
    };

    this.sendToUser(userId, notification);
  }

  sendSystemNotification(userId, title, message, data = {}) {
    const notification = {
      id: Date.now().toString(),
      type: 'system',
      title,
      message,
      data,
      timestamp: new Date(),
      read: false,
      priority: 'normal'
    };

    this.sendToUser(userId, notification);
  }

  // Marquer une notification comme lue
  async markNotificationAsRead(userId, notificationId) {
    // TODO: Implémenter la logique de base de données
    console.log(`✅ Notification ${notificationId} marquée comme lue pour l'utilisateur ${userId}`);
  }

  // Marquer toutes les notifications comme lues
  async markAllNotificationsAsRead(userId) {
    // TODO: Implémenter la logique de base de données
    console.log(`✅ Toutes les notifications marquées comme lues pour l'utilisateur ${userId}`);
  }

  // Envoyer les notifications non lues
  async sendUnreadNotifications(userId) {
    // TODO: Récupérer les notifications non lues depuis la base de données
    const unreadNotifications = [];
    
    if (unreadNotifications.length > 0) {
      this.sendToUser(userId, {
        type: 'unread_notifications',
        data: unreadNotifications
      });
    }
  }

  // Obtenir les statistiques des connexions
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      totalRooms: this.io.sockets.adapter.rooms.size,
      activeConnections: this.io.engine.clientsCount
    };
  }

  // Broadcast des statistiques
  broadcastStats() {
    const stats = this.getStats();
    this.io.emit('server_stats', stats);
  }
}

module.exports = NotificationService; 