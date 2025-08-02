import { createSlice, createSelector } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    connectionStats: null,
    permission: 'default', // 'default', 'granted', 'denied'
    settings: {
      sound: true,
      desktop: true,
      email: true,
      push: true,
    }
  },
  
  reducers: {
    // Initialiser le service de notifications
    initializeNotifications: (state, action) => {
      const { userId, token } = action.payload;
      notificationService.connect(userId, token);
      
      // Écouter les événements du service
      notificationService.on('new_notification', (data) => {
        // Cette fonction sera appelée par le service
        // L'état sera mis à jour via d'autres actions
      });
      
      notificationService.on('notifications_loaded', (data) => {
        // Cette fonction sera appelée par le service
        // L'état sera mis à jour via d'autres actions
      });
      
      notificationService.on('notification_updated', (data) => {
        // Cette fonction sera appelée par le service
        // L'état sera mis à jour via d'autres actions
      });
      
      notificationService.on('all_notifications_read', (data) => {
        // Cette fonction sera appelée par le service
        // L'état sera mis à jour via d'autres actions
      });
      
      notificationService.on('server_stats', (stats) => {
        // Cette fonction sera appelée par le service
        // L'état sera mis à jour via d'autres actions
      });
    },
    
    // Mettre à jour l'état de connexion
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    // Mettre à jour les statistiques de connexion
    setConnectionStats: (state, action) => {
      state.connectionStats = action.payload;
    },
    
    // Ajouter une nouvelle notification
    addNotification: (state, action) => {
      const notification = action.payload;
      state.notifications.unshift(notification);
      
      // Limiter le nombre de notifications en mémoire
      if (state.notifications.length > 100) {
        state.notifications = state.notifications.slice(0, 100);
      }
      
      if (!notification.read) {
        state.unreadCount++;
      }
    },
    
    // Charger les notifications
    loadNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    
    // Marquer une notification comme lue
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Marquer toutes les notifications comme lues
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    // Supprimer une notification
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const index = state.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const notification = state.notifications[index];
        state.notifications.splice(index, 1);
        
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    // Mettre à jour les paramètres de notifications
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // Mettre à jour la permission
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    
    // Rejoindre des rooms
    joinRooms: (state, action) => {
      notificationService.joinRooms(action.payload);
    },
    
    // Quitter des rooms
    leaveRooms: (state, action) => {
      notificationService.leaveRooms(action.payload);
    },
    
    // Mettre à jour la localisation
    updateLocation: (state, action) => {
      notificationService.updateLocation(action.payload);
    },
    
    // Marquer une notification comme lue côté serveur
    markAsReadServer: (state, action) => {
      const notificationId = action.payload;
      notificationService.markAsRead(notificationId);
      
      // Mettre à jour localement
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Marquer toutes les notifications comme lues côté serveur
    markAllAsReadServer: (state) => {
      notificationService.markAllAsRead();
      
      // Mettre à jour localement
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    // Déconnecter le service
    disconnectNotifications: (state) => {
      notificationService.disconnect();
      state.isConnected = false;
      state.connectionStats = null;
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    // Filtrer les notifications par type
    filterByType: (state, action) => {
      // Cette action ne modifie pas l'état, elle est utilisée pour le sélecteur
    },
    
    // Rechercher dans les notifications
    searchNotifications: (state, action) => {
      // Cette action ne modifie pas l'état, elle est utilisée pour le sélecteur
    }
  }
});

export const {
  initializeNotifications,
  setConnectionStatus,
  setConnectionStats,
  addNotification,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  updateSettings,
  setPermission,
  joinRooms,
  leaveRooms,
  updateLocation,
  markAsReadServer,
  markAllAsReadServer,
  disconnectNotifications,
  filterByType,
  searchNotifications,
} = notificationsSlice.actions;

// Sélecteurs
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectIsConnected = (state) => state.notifications.isConnected;
export const selectConnectionStats = (state) => state.notifications.connectionStats;
export const selectPermission = (state) => state.notifications.permission;
export const selectSettings = (state) => state.notifications.settings;

// Sélecteurs dérivés
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectNotificationsByType = createSelector(
  [selectNotifications, (state, type) => type],
  (notifications, type) => notifications.filter(n => n.type === type)
);

export const selectHighPriorityNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => n.priority === 'high')
);

export const selectRecentNotifications = createSelector(
  [selectNotifications, (state, limit = 10) => limit],
  (notifications, limit) => notifications.slice(0, limit)
);

export const selectNotificationStats = createSelector(
  [selectNotifications],
  (notifications) => {
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {},
      byPriority: {
        low: 0,
        normal: 0,
        high: 0
      }
    };
    
    notifications.forEach(notification => {
      // Par type
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      
      // Par priorité
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
    });
    
    return stats;
  }
);

export default notificationsSlice.reducer; 