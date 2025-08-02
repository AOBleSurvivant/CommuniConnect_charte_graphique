import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  IconButton,
  Slide,
  useTheme,
} from '@mui/material';
import {
  Close,
  Notifications,
  Comment,
  Favorite,
  Warning,
  Event,
  Help,
  Security,
  Info,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectNotifications } from '../../store/slices/notificationsSlice';

const NotificationToast = () => {
  const theme = useTheme();
  const notifications = useSelector(selectNotifications);
  
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [displayedNotifications, setDisplayedNotifications] = useState(new Set());

  useEffect(() => {
    // Trouver la notification la plus récente non affichée
    const unreadNotifications = notifications.filter(n => !n.read && !displayedNotifications.has(n.id));
    
    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[0];
      setCurrentNotification(latestNotification);
      setOpen(true);
      
      // Marquer comme affichée
      setDisplayedNotifications(prev => new Set([...prev, latestNotification.id]));
      
      // Fermer automatiquement après 5 secondes
      const timer = setTimeout(() => {
        setOpen(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, displayedNotifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_post':
        return <Comment />;
      case 'new_comment':
        return <Comment />;
      case 'new_like':
        return <Favorite />;
      case 'new_alert':
        return <Warning />;
      case 'new_event':
        return <Event />;
      case 'help_request':
        return <Help />;
      case 'moderation':
        return <Security />;
      case 'system':
        return <Info />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationSeverity = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'normal':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_alert':
        return theme.palette.error.main;
      case 'moderation':
        return theme.palette.error.main;
      case 'new_like':
        return theme.palette.error.main;
      case 'new_event':
        return theme.palette.success.main;
      case 'help_request':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  if (!currentNotification) {
    return null;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: 300,
          maxWidth: 400,
        }
      }}
    >
      <Alert
        onClose={handleClose}
        severity={getNotificationSeverity(currentNotification.priority)}
        icon={getNotificationIcon(currentNotification.type)}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${getNotificationColor(currentNotification.type)}`,
          '& .MuiAlert-icon': {
            color: getNotificationColor(currentNotification.type),
          },
          '& .MuiAlert-message': {
            width: '100%',
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {currentNotification.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentNotification.message}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {new Date(currentNotification.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast; 