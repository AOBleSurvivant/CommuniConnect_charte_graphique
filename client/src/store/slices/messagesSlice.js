import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messagesService from '../../services/messagesService';

// Actions asynchrones
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messagesService.getConversations();
      return response.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des conversations');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'messages/fetchConversationMessages',
  async ({ conversationId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await messagesService.getConversationMessages(conversationId, page, limit);
      return {
        conversationId,
        messages: response.messages,
        conversation: response.conversation,
        pagination: response.pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue, getState }) => {
    try {
      const response = await messagesService.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }
);

export const createConversation = createAsyncThunk(
  'messages/createConversation',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await messagesService.createConversation(conversationData);
      return response.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la conversation');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      await messagesService.deleteMessage(messageId);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du message');
    }
  }
);

export const searchMessages = createAsyncThunk(
  'messages/searchMessages',
  async ({ query, conversationId }, { rejectWithValue }) => {
    try {
      const response = await messagesService.searchMessages(query, conversationId);
      return response.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la recherche');
    }
  }
);

// État initial
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  searchResults: [],
  loading: false,
  error: null,
  success: null,
  selectedConversationId: null,
  unreadCount: 0,
  isConnected: false,
  typingIndicators: {},
  stats: {
    totalConversations: 0,
    unreadMessages: 0,
    privateConversations: 0,
    groupConversations: 0,
    quartierConversations: 0
  }
};

// Slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Réinitialiser l'état
    resetMessages: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.messages = {};
      state.searchResults = [];
      state.error = null;
      state.selectedConversationId = null;
      state.unreadCount = 0;
    },

    // Sélectionner une conversation
    selectConversation: (state, action) => {
      state.selectedConversationId = action.payload;
      state.currentConversation = state.conversations.find(
        conv => conv.id === action.payload
      );
    },

    // Ajouter un message en temps réel (pour Socket.IO)
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      state.messages[conversationId].push(message);
      
      // Mettre à jour la conversation
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        conversation.lastMessage = {
          content: message.content,
          sender: message.sender,
          timestamp: message.timestamp
        };
        conversation.messageCount += 1;
      }
    },

    // Marquer un message comme lu
    markMessageAsRead: (state, action) => {
      const { conversationId, messageId } = action.payload;
      
      if (state.messages[conversationId]) {
        const message = state.messages[conversationId].find(msg => msg.id === messageId);
        if (message) {
          message.isRead = true;
        }
      }
    },

    // Mettre à jour le statut d'un message
    updateMessageStatus: (state, action) => {
      const { conversationId, messageId, status } = action.payload;
      
      if (state.messages[conversationId]) {
        const message = state.messages[conversationId].find(msg => msg.id === messageId);
        if (message) {
          message.status = status;
        }
      }
    },

    // Effacer les résultats de recherche
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    // Mettre à jour les statistiques
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

      // Réduire le nombre de messages non lus
  decrementUnreadCount: (state, action) => {
    const conversationId = action.payload;
    const conversation = state.conversations.find(conv => conv.id === conversationId);
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount -= 1;
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    }
  },

  // Gérer les indicateurs de frappe
  setTypingIndicator: (state, action) => {
    const { conversationId, userId, isTyping } = action.payload;
    if (!state.typingIndicators) {
      state.typingIndicators = {};
    }
    
    if (isTyping) {
      if (!state.typingIndicators[conversationId]) {
        state.typingIndicators[conversationId] = new Set();
      }
      state.typingIndicators[conversationId].add(userId);
    } else {
      if (state.typingIndicators[conversationId]) {
        state.typingIndicators[conversationId].delete(userId);
        if (state.typingIndicators[conversationId].size === 0) {
          delete state.typingIndicators[conversationId];
        }
      }
    }
  },

      // Mettre à jour le statut de connexion
    updateConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },

    // Effacer les erreurs
    clearError: (state) => {
      state.error = null;
    },

    // Effacer les messages de succès
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
        state.unreadCount = action.payload.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchConversationMessages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId, messages, conversation } = action.payload;
        state.messages[conversationId] = messages;
        state.currentConversation = conversation;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload;
        const conversationId = message.conversationId;
        
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        
        state.messages[conversationId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createConversation
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.unshift(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteMessage
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const messageId = action.payload;
        
        // Supprimer le message de toutes les conversations
        Object.keys(state.messages).forEach(conversationId => {
          state.messages[conversationId] = state.messages[conversationId].filter(
            msg => msg.id !== messageId
          );
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // searchMessages
      .addCase(searchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const {
  resetMessages,
  selectConversation,
  addMessage,
  markMessageAsRead,
  updateMessageStatus,
  clearSearchResults,
  updateStats,
  decrementUnreadCount,
  setTypingIndicator,
  updateConnectionStatus,
  clearError,
  clearSuccess
} = messagesSlice.actions;

// Sélecteurs
export const selectConversations = (state) => state.messages.conversations;
export const selectCurrentConversation = (state) => state.messages.currentConversation;
export const selectMessages = (state) => state.messages.messages;
export const selectSelectedConversationId = (state) => state.messages.selectedConversationId;
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectMessagesError = (state) => state.messages.error;
export const selectUnreadCount = (state) => state.messages.unreadCount;
export const selectMessageStats = (state) => state.messages.stats;
export const selectSearchResults = (state) => state.messages.searchResults;

// Sélecteur pour les messages d'une conversation spécifique
export const selectConversationMessages = (conversationId) => (state) => 
  state.messages.messages[conversationId] || [];

// Sélecteur pour une conversation spécifique
export const selectConversationById = (conversationId) => (state) =>
  state.messages.conversations.find(conv => conv.id === conversationId);

export default messagesSlice.reducer; 