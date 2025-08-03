import React, { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsNone,
  CheckCircle,
  Warning,
  Error,
  Info,
  Delete,
  Done,
  DoneAll,
  Refresh,
  Settings,
  Report,
  Person,
  Assignment,
  Science,
  Schedule,
  PriorityHigh,
  PriorityLow
} from '@mui/icons-material';
import notificationService from '../../services/notificationService';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    notificationService.init('admin');
    
    const currentNotifications = notificationService.notifications || [];
    setNotifications(currentNotifications);
    setUnreadCount(notificationService.getUnreadCount());

    const unsubscribe = notificationService.addListener((newNotifications, newUnreadCount) => {
      setNotifications([...newNotifications]);
      setUnreadCount(newUnreadCount);
    });

    if (currentNotifications.length === 0) {
      setTimeout(() => {
        notificationService.simulateNotifications();
      }, 2000);
    }

    return unsubscribe;
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDeleteNotification = (notificationId) => {
    notificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
  };

  const handleTestNotification = () => {
    notificationService.sendTestNotification();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report': return <Error color="error" />;
      case 'contributor': return <Person color="primary" />;
      case 'action': return <CheckCircle color="success" />;
      case 'test': return <Science color="info" />;
      default: return <Info color="default" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    }
    return notificationTime.toLocaleDateString('fr-FR');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType;
  });

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 10);
  const open = Boolean(anchorEl);

  return (
    <Box>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 400, maxHeight: 600 } }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Notifications</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Tester notification">
                <IconButton size="small" onClick={handleTestNotification}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" startIcon={<DoneAll />} onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              Tout marquer comme lu
            </Button>
            <Button size="small" color="error" startIcon={<Delete />} onClick={handleClearAll} disabled={notifications.length === 0}>
              Tout supprimer
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['all', 'report', 'contributor', 'action', 'test'].map((type) => (
              <Chip
                key={type}
                label={
                  type === 'all' ? 'Toutes' :
                  type === 'report' ? 'Signalements' :
                  type === 'contributor' ? 'Candidatures' :
                  type === 'action' ? 'Actions' : 'Tests'
                }
                size="small"
                variant={filterType === type ? 'filled' : 'outlined'}
                onClick={() => setFilterType(type)}
                color={filterType === type ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {displayedNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Aucune notification
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {displayedNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem sx={{ backgroundColor: notification.read ? 'transparent' : 'action.hover' }}>
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.read && (
                        <Tooltip title="Marquer comme lu">
                          <IconButton size="small" onClick={() => handleMarkAsRead(notification.id)}>
                            <Done />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Supprimer">
                        <IconButton size="small" color="error" onClick={() => handleDeleteNotification(notification.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  
                  {index < displayedNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {filteredNotifications.length > 10 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button fullWidth onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Afficher moins' : `Afficher tout (${filteredNotifications.length})`}
            </Button>
          </Box>
        )}

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              {unreadCount} non lue(s) sur {notifications.length} notification(s)
            </Typography>
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default NotificationPanel; 