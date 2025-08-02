const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

class MessageSocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.connectedUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
    this.conversationRooms = new Map(); // conversationId -> Set of socketIds

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('🔌 Service de messagerie Socket.IO initialisé');
  }

  // Middleware pour authentifier les connexions
  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Token d\'authentification manquant'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('_id firstName lastName avatar quartier ville');
        
        if (!user) {
          return next(new Error('Utilisateur non trouvé'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        console.error('Erreur d\'authentification Socket.IO:', error.message);
        next(new Error('Token invalide'));
      }
    });
  }

  // Configuration des gestionnaires d'événements
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 Utilisateur connecté: ${socket.user.firstName} ${socket.user.lastName} (${socket.userId})`);
      
      this.handleConnection(socket);
      this.handleDisconnection(socket);
      this.handleJoinConversation(socket);
      this.handleLeaveConversation(socket);
      this.handleTyping(socket);
      this.handleStopTyping(socket);
      this.handleMessageRead(socket);
      this.handleUserStatus(socket);
    });
  }

  // Gérer la connexion d'un utilisateur
  handleConnection(socket) {
    const userId = socket.userId;
    const socketId = socket.id;

    // Enregistrer l'utilisateur comme connecté
    this.connectedUsers.set(userId, socketId);
    this.userSockets.set(socketId, userId);

    // Rejoindre les conversations existantes de l'utilisateur
    this.joinUserConversations(socket);

    // Notifier les autres utilisateurs de la connexion
    this.broadcastUserStatus(userId, 'online');

    // Envoyer les statistiques de connexion
    this.sendConnectionStats(socket);
  }

  // Gérer la déconnexion d'un utilisateur
  handleDisconnection(socket) {
    const userId = socket.userId;
    const socketId = socket.id;

    console.log(`🔌 Utilisateur déconnecté: ${socket.user.firstName} ${socket.user.lastName} (${userId})`);

    // Nettoyer les données de connexion
    this.connectedUsers.delete(userId);
    this.userSockets.delete(socketId);

    // Quitter toutes les conversations
    this.leaveAllConversations(socket);

    // Notifier les autres utilisateurs de la déconnexion
    this.broadcastUserStatus(userId, 'offline');

    // Mettre à jour le statut de l'utilisateur en base
    this.updateUserLastSeen(userId);
  }

  // Rejoindre les conversations d'un utilisateur
  async joinUserConversations(socket) {
    try {
      const conversations = await Conversation.find({
        'participants.user': socket.userId,
        isDeleted: false
      });

      conversations.forEach(conversation => {
        const roomName = `conversation_${conversation.conversationId}`;
        socket.join(roomName);
        
        if (!this.conversationRooms.has(conversation.conversationId)) {
          this.conversationRooms.set(conversation.conversationId, new Set());
        }
        this.conversationRooms.get(conversation.conversationId).add(socket.id);
      });

      console.log(`📱 Utilisateur ${socket.user.firstName} a rejoint ${conversations.length} conversations`);
    } catch (error) {
      console.error('Erreur lors de la jointure des conversations:', error);
    }
  }

  // Gérer la jointure d'une conversation
  handleJoinConversation(socket) {
    socket.on('join_conversation', async (conversationId) => {
      try {
        // Vérifier que l'utilisateur participe à cette conversation
        const conversation = await Conversation.findOne({
          conversationId,
          'participants.user': socket.userId,
          isDeleted: false
        });

        if (!conversation) {
          socket.emit('error', { message: 'Accès non autorisé à cette conversation' });
          return;
        }

        const roomName = `conversation_${conversationId}`;
        socket.join(roomName);
        
        if (!this.conversationRooms.has(conversationId)) {
          this.conversationRooms.set(conversationId, new Set());
        }
        this.conversationRooms.get(conversationId).add(socket.id);

        // Notifier les autres participants
        socket.to(roomName).emit('user_joined_conversation', {
          conversationId,
          user: {
            id: socket.userId,
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
            avatar: socket.user.avatar
          }
        });

        console.log(`👥 ${socket.user.firstName} a rejoint la conversation ${conversationId}`);
      } catch (error) {
        console.error('Erreur lors de la jointure de conversation:', error);
        socket.emit('error', { message: 'Erreur lors de la jointure de la conversation' });
      }
    });
  }

  // Gérer la sortie d'une conversation
  handleLeaveConversation(socket) {
    socket.on('leave_conversation', (conversationId) => {
      const roomName = `conversation_${conversationId}`;
      socket.leave(roomName);
      
      if (this.conversationRooms.has(conversationId)) {
        this.conversationRooms.get(conversationId).delete(socket.id);
      }

      // Notifier les autres participants
      socket.to(roomName).emit('user_left_conversation', {
        conversationId,
        userId: socket.userId
      });

      console.log(`👋 ${socket.user.firstName} a quitté la conversation ${conversationId}`);
    });
  }

  // Gérer l'indicateur de frappe
  handleTyping(socket) {
    socket.on('typing', (data) => {
      const { conversationId } = data;
      const roomName = `conversation_${conversationId}`;
      
      socket.to(roomName).emit('user_typing', {
        conversationId,
        userId: socket.userId,
        user: {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName
        }
      });
    });
  }

  // Gérer l'arrêt de frappe
  handleStopTyping(socket) {
    socket.on('stop_typing', (data) => {
      const { conversationId } = data;
      const roomName = `conversation_${conversationId}`;
      
      socket.to(roomName).emit('user_stop_typing', {
        conversationId,
        userId: socket.userId
      });
    });
  }

  // Gérer la lecture de messages
  handleMessageRead(socket) {
    socket.on('message_read', async (data) => {
      const { messageId, conversationId } = data;
      
      try {
        const message = await Message.findById(messageId);
        if (message && message.sender.toString() !== socket.userId) {
          await message.markAsRead(socket.userId);
          
          // Notifier l'expéditeur que le message a été lu
          const senderSocketId = this.connectedUsers.get(message.sender.toString());
          if (senderSocketId) {
            this.io.to(senderSocketId).emit('message_read_by', {
              messageId,
              conversationId,
              readBy: {
                id: socket.userId,
                firstName: socket.user.firstName,
                lastName: socket.user.lastName
              }
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du marquage de lecture:', error);
      }
    });
  }

  // Gérer le statut utilisateur
  handleUserStatus(socket) {
    socket.on('get_user_status', (userId) => {
      const isOnline = this.connectedUsers.has(userId);
      socket.emit('user_status', {
        userId,
        status: isOnline ? 'online' : 'offline'
      });
    });
  }

  // Quitter toutes les conversations
  leaveAllConversations(socket) {
    this.conversationRooms.forEach((socketIds, conversationId) => {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        const roomName = `conversation_${conversationId}`;
        socket.leave(roomName);
      }
    });
  }

  // Diffuser le statut d'un utilisateur
  broadcastUserStatus(userId, status) {
    this.io.emit('user_status_changed', {
      userId,
      status
    });
  }

  // Envoyer les statistiques de connexion
  sendConnectionStats(socket) {
    const stats = {
      connectedUsers: this.connectedUsers.size,
      activeConversations: this.conversationRooms.size
    };
    socket.emit('connection_stats', stats);
  }

  // Mettre à jour le dernier accès de l'utilisateur
  async updateUserLastSeen(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lastSeen:', error);
    }
  }

  // Méthodes publiques pour l'utilisation externe

  // Envoyer un nouveau message à tous les participants
  async sendNewMessage(message) {
    try {
      const roomName = `conversation_${message.conversationId}`;
      
      // Envoyer le message à tous les participants de la conversation
      this.io.to(roomName).emit('new_message', {
        message: {
          id: message._id,
          content: message.content,
          sender: {
            id: message.sender._id || message.sender,
            firstName: message.sender.firstName,
            lastName: message.sender.lastName,
            avatar: message.sender.avatar
          },
          timestamp: message.createdAt,
          conversationId: message.conversationId,
          attachments: message.attachments || []
        }
      });

      // Envoyer une notification aux utilisateurs non connectés
      this.sendMessageNotification(message);

      console.log(`📤 Message envoyé dans la conversation ${message.conversationId}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  }

  // Envoyer une notification de message
  async sendMessageNotification(message) {
    try {
      const conversation = await Conversation.findOne({
        conversationId: message.conversationId
      }).populate('participants.user', 'firstName lastName avatar');

      if (!conversation) return;

      conversation.participants.forEach(participant => {
        const participantId = participant.user._id.toString();
        
        // Ne pas envoyer de notification à l'expéditeur
        if (participantId === message.sender.toString()) return;

        // Vérifier si l'utilisateur est connecté
        const isConnected = this.connectedUsers.has(participantId);
        
        if (!isConnected) {
          // Ici, vous pourriez envoyer une notification push
          // via Firebase Cloud Messaging ou un autre service
          console.log(`📱 Notification pour ${participant.user.firstName} (non connecté)`);
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }

  // Mettre à jour le statut d'un message
  updateMessageStatus(messageId, status, conversationId) {
    const roomName = `conversation_${conversationId}`;
    this.io.to(roomName).emit('message_status_updated', {
      messageId,
      status,
      conversationId
    });
  }

  // Diffuser les statistiques
  broadcastStats() {
    const stats = {
      connectedUsers: this.connectedUsers.size,
      activeConversations: this.conversationRooms.size,
      timestamp: new Date().toISOString()
    };
    
    this.io.emit('stats_update', stats);
  }

  // Obtenir les utilisateurs connectés
  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Vérifier si un utilisateur est connecté
  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }

  // Obtenir le socket d'un utilisateur
  getUserSocket(userId) {
    const socketId = this.connectedUsers.get(userId);
    return socketId ? this.io.sockets.sockets.get(socketId) : null;
  }
}

module.exports = MessageSocketService; 