import api from './api';
import localPersistenceService from './localPersistenceService';

class MessagesService {
  constructor() {
    this.testDataAdded = false;
  }

  // Ajouter des données de test pour les messages
  addTestData() {
    if (this.testDataAdded) {
      console.log('📝 Données de test déjà ajoutées');
      return;
    }

    const testConversations = [
      {
        id: 'conv1',
        name: 'Dr. Marie Dubois',
        type: 'private',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        lastMessage: {
          content: 'Merci pour vos conseils sur la nutrition !',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sender: {
            _id: 'user2',
            firstName: 'Marie',
            lastName: 'Dubois'
          }
        },
        unreadCount: 2,
        participants: [
          {
            user: {
              _id: 'user1',
              firstName: 'Jean',
              lastName: 'Martin',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            }
          },
          {
            user: {
              _id: 'user2',
              firstName: 'Marie',
              lastName: 'Dubois',
              avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
            }
          }
        ],
        memberCount: 2,
        messageCount: 15,
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'conv2',
        name: 'Quartier Saint-Michel',
        type: 'quartier',
        avatar: null,
        lastMessage: {
          content: 'Quelqu\'un a des nouvelles du projet de jardin communautaire ?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          sender: {
            _id: 'user3',
            firstName: 'Pierre',
            lastName: 'Durand'
          }
        },
        unreadCount: 0,
        participants: [
          {
            user: {
              _id: 'user1',
              firstName: 'Jean',
              lastName: 'Martin',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            }
          },
          {
            user: {
              _id: 'user3',
              firstName: 'Pierre',
              lastName: 'Durand',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
            }
          },
          {
            user: {
              _id: 'user4',
              firstName: 'Sophie',
              lastName: 'Leroy',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
            }
          }
        ],
        memberCount: 3,
        messageCount: 45,
        quartier: 'Saint-Michel',
        ville: 'Paris',
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'conv3',
        name: 'Groupe Fitness Local',
        type: 'group',
        avatar: null,
        lastMessage: {
          content: 'Séance de yoga demain matin à 7h au parc !',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          sender: {
            _id: 'user5',
            firstName: 'Emma',
            lastName: 'Bernard'
          }
        },
        unreadCount: 1,
        participants: [
          {
            user: {
              _id: 'user1',
              firstName: 'Jean',
              lastName: 'Martin',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            }
          },
          {
            user: {
              _id: 'user5',
              firstName: 'Emma',
              lastName: 'Bernard',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
            }
          },
          {
            user: {
              _id: 'user6',
              firstName: 'Lucas',
              lastName: 'Moreau',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
            }
          }
        ],
        memberCount: 3,
        messageCount: 23,
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ];

    const testMessages = {
      conv1: [
        {
          _id: 'msg1',
          content: 'Bonjour Dr. Dubois, j\'ai une question sur la nutrition.',
          sender: {
            _id: 'user1',
            firstName: 'Jean',
            lastName: 'Martin',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user2'],
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user2', readAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
          ],
          status: 'delivered'
        },
        {
          _id: 'msg2',
          content: 'Bonjour Jean ! Je serais ravie de vous aider. De quoi s\'agit-il ?',
          sender: {
            _id: 'user2',
            firstName: 'Marie',
            lastName: 'Dubois',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1'],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user1', readAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
          ],
          status: 'read'
        },
        {
          _id: 'msg3',
          content: 'Merci pour vos conseils sur la nutrition !',
          sender: {
            _id: 'user2',
            firstName: 'Marie',
            lastName: 'Dubois',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1'],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          readBy: [],
          status: 'sent'
        }
      ],
      conv2: [
        {
          _id: 'msg4',
          content: 'Bonjour à tous ! Comment va le quartier ?',
          sender: {
            _id: 'user3',
            firstName: 'Pierre',
            lastName: 'Durand',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1', 'user4'],
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user1', readAt: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
            { user: 'user4', readAt: new Date(Date.now() - 35 * 60 * 1000).toISOString() }
          ],
          status: 'read'
        },
        {
          _id: 'msg5',
          content: 'Quelqu\'un a des nouvelles du projet de jardin communautaire ?',
          sender: {
            _id: 'user3',
            firstName: 'Pierre',
            lastName: 'Durand',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1', 'user4'],
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user1', readAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() }
          ],
          status: 'delivered'
        }
      ],
      conv3: [
        {
          _id: 'msg6',
          content: 'Bonjour tout le monde ! Qui est partant pour une séance de yoga ?',
          sender: {
            _id: 'user5',
            firstName: 'Emma',
            lastName: 'Bernard',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1', 'user6'],
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user1', readAt: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
            { user: 'user6', readAt: new Date(Date.now() - 16 * 60 * 1000).toISOString() }
          ],
          status: 'read'
        },
        {
          _id: 'msg7',
          content: 'Séance de yoga demain matin à 7h au parc !',
          sender: {
            _id: 'user5',
            firstName: 'Emma',
            lastName: 'Bernard',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          recipients: ['user1', 'user6'],
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          readBy: [
            { user: 'user6', readAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() }
          ],
          status: 'delivered'
        }
      ]
    };

    // Sauvegarder les données de test
    localPersistenceService.save('conversations', testConversations);
    Object.keys(testMessages).forEach(conversationId => {
      localPersistenceService.save(`messages_${conversationId}`, testMessages[conversationId]);
    });

    this.testDataAdded = true;
    console.log('📝 Données de test pour les messages ajoutées');
  }

  // Récupérer toutes les conversations de l'utilisateur
  async getConversations() {
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      console.log('📂 Tentative de récupération depuis le stockage local');
      // Fallback vers les données locales
      const localConversations = localPersistenceService.load('conversations');
      if (localConversations) {
        return { conversations: localConversations };
      }
      return { conversations: [] };
    }
  }

  // Récupérer les messages d'une conversation
  async getConversationMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.log('📂 Récupération des messages depuis le stockage local');
      // Fallback vers les données locales
      const localMessages = localPersistenceService.load(`messages_${conversationId}`);
      if (localMessages) {
        return { messages: localMessages };
      }
      return { messages: [] };
    }
  }

  // Envoyer un message
  async sendMessage(messageData) {
    try {
      const response = await api.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  // Créer une nouvelle conversation
  async createConversation(conversationData) {
    try {
      const response = await api.post('/conversations', conversationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      throw error;
    }
  }

  // Mettre à jour une conversation
  async updateConversation(conversationId, updateData) {
    try {
      const response = await api.put(`/messages/conversation/${conversationId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la conversation:', error);
      throw error;
    }
  }

  // Supprimer un message
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  }

  // Rechercher des messages
  async searchMessages(query, conversationId = null) {
    try {
      const params = { query };
      if (conversationId) {
        params.conversationId = conversationId;
      }
      
      const response = await api.get('/messages/search', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  }

  // Créer une conversation privée avec un utilisateur
  async createPrivateConversation(userId) {
    try {
      const response = await api.post('/conversations', {
        type: 'private',
        participants: [userId]
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation privée:', error);
      throw error;
    }
  }

  // Créer une conversation de groupe
  async createGroupConversation(name, participants, description = null) {
    try {
      const response = await api.post('/messages/conversation/create', {
        type: 'group',
        name,
        participants,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation de groupe:', error);
      throw error;
    }
  }

  // Créer une conversation de quartier
  async createQuartierConversation(quartier, ville, participants) {
    try {
      const response = await api.post('/messages/conversation/create', {
        type: 'quartier',
        name: `Quartier ${quartier}`,
        participants,
        quartier,
        ville,
        description: `Conversation du quartier ${quartier} à ${ville}`
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation de quartier:', error);
      throw error;
    }
  }

  // Marquer une conversation comme vue
  async markConversationAsSeen(conversationId) {
    try {
      // Cette fonction sera utilisée pour mettre à jour le statut côté client
      // L'API gère automatiquement le lastSeen lors de la récupération des messages
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du marquage comme vu:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de messagerie
  async getMessageStats() {
    try {
      const conversations = await this.getConversations();
      
      const stats = {
        totalConversations: conversations.conversations?.length || 0,
        unreadMessages: 0,
        privateConversations: 0,
        groupConversations: 0,
        quartierConversations: 0
      };

      if (conversations.conversations) {
        conversations.conversations.forEach(conv => {
          if (conv.unreadCount) {
            stats.unreadMessages += conv.unreadCount;
          }
          
          switch (conv.type) {
            case 'private':
              stats.privateConversations++;
              break;
            case 'group':
              stats.groupConversations++;
              break;
            case 'quartier':
              stats.quartierConversations++;
              break;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Formater un message pour l'affichage
  formatMessage(message, currentUserId) {
    return {
      id: message._id,
      content: message.content,
      sender: message.sender,
      recipients: message.recipients,
      timestamp: message.createdAt,
      isOwn: message.sender._id === currentUserId,
      isRead: message.readBy?.some(read => read.user === currentUserId) || false,
      attachments: message.attachments || [],
      replyTo: message.replyTo,
      status: message.status
    };
  }

  // Formater une conversation pour l'affichage
  formatConversation(conversation, currentUserId) {
    const otherParticipants = conversation.participants?.filter(
      p => p.user._id !== currentUserId
    ) || [];

    return {
      id: conversation.id || conversation.conversationId,
      name: conversation.name || (conversation.type === 'private' && otherParticipants.length === 1 
        ? `${otherParticipants[0].user.firstName} ${otherParticipants[0].user.lastName}`
        : 'Conversation de groupe'),
      type: conversation.type,
      avatar: conversation.avatar || (conversation.type === 'private' && otherParticipants.length === 1 
        ? otherParticipants[0].user.avatar 
        : null),
      lastMessage: conversation.lastMessage,
      unreadCount: conversation.unreadCount || 0,
      participants: conversation.participants || [],
      memberCount: conversation.memberCount || 0,
      messageCount: conversation.messageCount || 0,
      lastSeen: conversation.lastSeen,
      quartier: conversation.quartier,
      ville: conversation.ville,
      updatedAt: conversation.updatedAt
    };
  }
}

export default new MessagesService(); 