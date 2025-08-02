import api from './api';

class MessagesService {
  // Récupérer toutes les conversations de l'utilisateur
  async getConversations() {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error;
    }
  }

  // Récupérer les messages d'une conversation
  async getConversationMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
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
      const response = await api.post('/messages/conversations', conversationData);
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
      const response = await api.post('/messages/conversations', {
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