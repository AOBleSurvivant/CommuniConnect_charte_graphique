import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import pushNotificationService from '../services/pushNotificationService';

const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser le service de notifications push
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const success = await pushNotificationService.initialize();
        if (success) {
          setIsInitialized(true);
          console.log('✅ Service de notifications push initialisé');
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  // Écouter les notifications push
  useEffect(() => {
    const handlePushNotification = (event) => {
      const { notification, data } = event.detail;
      
      // Ajouter la notification à la liste
      const newNotification = {
        id: Date.now().toString(),
        title: notification.title,
        body: notification.body,
        type: data?.type || 'general',
        data: data,
        timestamp: new Date(),
        isRead: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Déclencher des actions spécifiques selon le type
      handleNotificationAction(data);
    };

    window.addEventListener('pushNotification', handlePushNotification);
    return () => window.removeEventListener('pushNotification', handlePushNotification);
  }, []);

  // Gérer les actions spécifiques aux notifications
  const handleNotificationAction = useCallback((data) => {
    const { type, id } = data;

    switch (type) {
      case 'message':
        // Mettre à jour les messages non lus
        dispatch({ type: 'messages/incrementUnreadCount' });
        break;
      
      case 'alert':
        // Mettre à jour les alertes
        dispatch({ type: 'alerts/addNewAlert', payload: { id } });
        break;
      
      case 'livestream':
        // Mettre à jour les livestreams
        dispatch({ type: 'livestreams/addNewLivestream', payload: { id } });
        break;
      
      case 'event':
        // Mettre à jour les événements
        dispatch({ type: 'events/addNewEvent', payload: { id } });
        break;
      
      case 'friend_request':
        // Mettre à jour les demandes d'amis
        dispatch({ type: 'friends/incrementRequestCount' });
        break;
      
      default:
        break;
    }
  }, [dispatch]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // Envoyer une notification
  const sendNotification = useCallback(async (type, data) => {
    try {
      switch (type) {
        case 'message':
          await pushNotificationService.notifyNewMessage(
            data.conversationId,
            data.senderName,
            data.message
          );
          break;
        
        case 'alert':
          await pushNotificationService.notifyAlert(
            data.alertId,
            data.title,
            data.urgency
          );
          break;
        
        case 'livestream':
          await pushNotificationService.notifyLivestreamStart(
            data.livestreamId,
            data.title,
            data.authorName
          );
          break;
        
        case 'event':
          await pushNotificationService.notifyEvent(
            data.eventId,
            data.title,
            data.date
          );
          break;
        
        case 'friend_request':
          await pushNotificationService.notifyFriendRequest(
            data.requesterName
          );
          break;
        
        default:
          await pushNotificationService.sendNotification('all', data);
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }, []);

  // Notifications automatiques pour les événements
  const scheduleEventReminder = useCallback((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeUntilEvent = eventDate.getTime() - now.getTime();
    
    // Rappel 1 heure avant
    if (timeUntilEvent > 3600000) { // Plus d'1 heure
      setTimeout(() => {
        sendNotification('event_reminder', {
          title: '📅 Rappel événement',
          body: `${event.title} commence dans 1 heure`,
          data: {
            type: 'event_reminder',
            eventId: event._id,
            url: `/events?event=${event._id}`
          }
        });
      }, timeUntilEvent - 3600000);
    }
    
    // Rappel 15 minutes avant
    if (timeUntilEvent > 900000) { // Plus de 15 minutes
      setTimeout(() => {
        sendNotification('event_reminder', {
          title: '⏰ Événement bientôt',
          body: `${event.title} commence dans 15 minutes`,
          data: {
            type: 'event_reminder',
            eventId: event._id,
            url: `/events?event=${event._id}`
          }
        });
      }, timeUntilEvent - 900000);
    }
  }, [sendNotification]);

  // Notifications pour les livestreams
  const notifyLivestreamStart = useCallback((livestream) => {
    sendNotification('livestream', {
      livestreamId: livestream._id,
      title: livestream.title,
      authorName: `${livestream.author.firstName} ${livestream.author.lastName}`
    });
  }, [sendNotification]);

  // Notifications pour les alertes
  const notifyNewAlert = useCallback((alert) => {
    sendNotification('alert', {
      alertId: alert._id,
      title: alert.title,
      urgency: alert.urgency
    });
  }, [sendNotification]);

  // Notifications pour les messages
  const notifyNewMessage = useCallback((message, conversation) => {
    sendNotification('message', {
      conversationId: conversation._id,
      senderName: `${message.sender.firstName} ${message.sender.lastName}`,
      message: message.content
    });
  }, [sendNotification]);

  // Notifications pour les demandes d'amis
  const notifyFriendRequest = useCallback((request) => {
    sendNotification('friend_request', {
      requesterName: `${request.requester.firstName} ${request.requester.lastName}`
    });
  }, [sendNotification]);

  // Notifications pour les événements
  const notifyNewEvent = useCallback((event) => {
    sendNotification('event', {
      eventId: event._id,
      title: event.title,
      date: event.date
    });
    
    // Programmer les rappels
    scheduleEventReminder(event);
  }, [sendNotification, scheduleEventReminder]);

  // Nettoyer les anciennes notifications
  useEffect(() => {
    const cleanupOldNotifications = () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      setNotifications(prev => 
        prev.filter(notif => new Date(notif.timestamp) > oneWeekAgo)
      );
    };

    // Nettoyer toutes les heures
    const interval = setInterval(cleanupOldNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    // État
    notifications,
    unreadCount,
    isInitialized,
    
    // Actions
    markAsRead,
    markAllAsRead,
    removeNotification,
    sendNotification,
    
    // Notifications spécifiques
    notifyLivestreamStart,
    notifyNewAlert,
    notifyNewMessage,
    notifyFriendRequest,
    notifyNewEvent,
    scheduleEventReminder,
    
    // Utilitaires
    hasUnread: unreadCount > 0,
    totalCount: notifications.length
  };
};

export default useNotifications; 