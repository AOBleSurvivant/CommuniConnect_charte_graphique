import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, markMessageAsRead, updateMessageStatus, decrementUnreadCount, setTypingIndicator, updateConnectionStatus } from '../store/slices/messagesSlice';

const useMessageSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const typingTimeoutsRef = useRef(new Map());
  
  // Sélecteurs Redux
  const { user, token } = useSelector(state => state.auth);
  const selectedConversationId = useSelector(state => state.messages.selectedConversationId);
  const conversations = useSelector(state => state.messages.conversations);

  // Initialiser la connexion Socket.IO
  const initializeSocket = useCallback(() => {
    if (!token || socketRef.current) return;

    try {
      socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5
      });

      console.log('🔌 Connexion Socket.IO établie');

      // Événements de connexion
      socketRef.current.on('connect', () => {
        console.log('✅ Connecté au serveur de messagerie');
        dispatch(updateConnectionStatus(true));
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Déconnecté du serveur:', reason);
        dispatch(updateConnectionStatus(false));
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion Socket.IO:', error);
      });

      // Événements de messagerie
      socketRef.current.on('new_message', (data) => {
        console.log('📨 Nouveau message reçu:', data);
        dispatch(addMessage({
          conversationId: data.message.conversationId,
          message: data.message
        }));

        // Réduire le compteur de messages non lus si ce n'est pas la conversation active
        if (selectedConversationId !== data.message.conversationId) {
          dispatch(decrementUnreadCount(data.message.conversationId));
        }
      });

      socketRef.current.on('message_read_by', (data) => {
        console.log('👁️ Message lu par:', data);
        dispatch(updateMessageStatus({
          conversationId: data.conversationId,
          messageId: data.messageId,
          status: 'read'
        }));
      });

      socketRef.current.on('message_status_updated', (data) => {
        console.log('📊 Statut du message mis à jour:', data);
        dispatch(updateMessageStatus({
          conversationId: data.conversationId,
          messageId: data.messageId,
          status: data.status
        }));
      });

      // Événements de frappe
      socketRef.current.on('user_typing', (data) => {
        console.log('⌨️ Utilisateur en train de taper:', data);
        dispatch(setTypingIndicator({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: true
        }));
      });

      socketRef.current.on('user_stop_typing', (data) => {
        console.log('⏹️ Utilisateur a arrêté de taper:', data);
        dispatch(setTypingIndicator({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: false
        }));
      });

      // Événements de statut utilisateur
      socketRef.current.on('user_status_changed', (data) => {
        console.log('👤 Statut utilisateur changé:', data);
        // Ici vous pourriez dispatcher une action pour mettre à jour le statut
      });

      // Événements de conversation
      socketRef.current.on('user_joined_conversation', (data) => {
        console.log('👥 Utilisateur a rejoint la conversation:', data);
      });

      socketRef.current.on('user_left_conversation', (data) => {
        console.log('👋 Utilisateur a quitté la conversation:', data);
      });

      // Événements de statistiques
      socketRef.current.on('connection_stats', (stats) => {
        console.log('📊 Statistiques de connexion:', stats);
      });

      socketRef.current.on('stats_update', (stats) => {
        console.log('📈 Mise à jour des statistiques:', stats);
      });

      // Événements d'erreur
      socketRef.current.on('error', (error) => {
        console.error('❌ Erreur Socket.IO:', error);
      });

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation Socket.IO:', error);
    }
  }, [token, dispatch, selectedConversationId]);

  // Nettoyer la connexion
  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log('🔌 Connexion Socket.IO fermée');
    }
  }, []);

  // Rejoindre une conversation
  const joinConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('join_conversation', { conversationId });
      console.log('👥 Rejoint la conversation:', conversationId);
    }
  }, []);

  // Quitter une conversation
  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('leave_conversation', { conversationId });
      console.log('👋 Quitté la conversation:', conversationId);
    }
  }, []);

  // Envoyer un indicateur de frappe
  const sendTypingIndicator = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing', { conversationId });
      
      // Nettoyer le timeout précédent
      if (typingTimeoutsRef.current.has(conversationId)) {
        clearTimeout(typingTimeoutsRef.current.get(conversationId));
      }
      
      // Arrêter l'indicateur après 3 secondes
      const timeout = setTimeout(() => {
        sendStopTypingIndicator(conversationId);
      }, 3000);
      
      typingTimeoutsRef.current.set(conversationId, timeout);
    }
  }, []);

  // Arrêter l'indicateur de frappe
  const sendStopTypingIndicator = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('stop_typing', { conversationId });
      
      // Nettoyer le timeout
      if (typingTimeoutsRef.current.has(conversationId)) {
        clearTimeout(typingTimeoutsRef.current.get(conversationId));
        typingTimeoutsRef.current.delete(conversationId);
      }
    }
  }, []);

  // Marquer un message comme lu
  const markMessageAsReadSocket = useCallback((messageId, conversationId) => {
    if (socketRef.current && messageId && conversationId) {
      socketRef.current.emit('message_read', { messageId, conversationId });
      dispatch(markMessageAsRead({ messageId, conversationId }));
    }
  }, [dispatch]);

  // Obtenir le statut d'un utilisateur
  const getUserStatus = useCallback((userId) => {
    if (socketRef.current && userId) {
      socketRef.current.emit('get_user_status', userId);
    }
  }, []);

  // Vérifier si la connexion est active
  const isConnected = useCallback(() => {
    return socketRef.current?.connected || false;
  }, []);

  // Reconnecter manuellement
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  // Initialiser la connexion au montage
  useEffect(() => {
    if (token && user) {
      initializeSocket();
    }

    return () => {
      cleanupSocket();
    };
  }, [token, user, initializeSocket, cleanupSocket]);

  // Gérer les changements de conversation sélectionnée
  useEffect(() => {
    if (socketRef.current && selectedConversationId) {
      joinConversation(selectedConversationId);
    }

    return () => {
      if (selectedConversationId) {
        leaveConversation(selectedConversationId);
      }
    };
  }, [selectedConversationId, joinConversation, leaveConversation]);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
    };
  }, []);

  return {
    // État de la connexion
    isConnected,
    
    // Actions de conversation
    joinConversation,
    leaveConversation,
    
    // Actions de messagerie
    sendTypingIndicator,
    sendStopTypingIndicator,
    markMessageAsRead: markMessageAsReadSocket,
    getUserStatus,
    
    // Gestion de la connexion
    reconnect,
    cleanupSocket,
    
    // Référence du socket (pour usage avancé)
    socket: socketRef.current
  };
};

export default useMessageSocket; 