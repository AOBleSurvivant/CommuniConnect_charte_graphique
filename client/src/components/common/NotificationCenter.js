import React, { useState } from 'react';
import {
  Notifications,
  Close,
  CheckCircle,
  Warning,
  Info,
  Error,
  Schedule,
  Person,
  Event,
  Help,
} from '@mui/icons-material';
import './NotificationCenter.css';

const NotificationCenter = ({ onClose }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Demande d\'aide résolue',
      message: 'Votre demande de réparation de route a été traitée avec succès.',
      time: 'Il y a 5 minutes',
      icon: <CheckCircle />,
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Alerte météo',
      message: 'Orage prévu dans votre région ce soir. Prévoyez des précautions.',
      time: 'Il y a 1 heure',
      icon: <Warning />,
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouvel événement',
      message: 'Réunion du conseil de quartier demain à 18h00.',
      time: 'Il y a 2 heures',
      icon: <Event />,
      read: true
    },
    {
      id: 4,
      type: 'help',
      title: 'Demande d\'aide',
      message: 'Marie Dubois demande de l\'aide pour un déménagement.',
      time: 'Il y a 3 heures',
      icon: <Help />,
      read: false
    },
    {
      id: 5,
      type: 'success',
      title: 'Inscription réussie',
      message: 'Vous êtes maintenant inscrit à l\'événement "Festival culturel".',
      time: 'Il y a 1 jour',
      icon: <CheckCircle />,
      read: true
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      case 'info':
        return <Info />;
      case 'help':
        return <Help />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'info':
        return 'var(--color-info)';
      case 'help':
        return 'var(--color-accent)';
      default:
        return 'var(--color-secondary)';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-center-overlay" onClick={onClose}>
      <div className="notification-center" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <div className="notification-title">
            <Notifications />
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <button className="btn btn-icon" onClick={onClose}>
                  <Close />
          </button>
        </div>

        <div className="notification-content">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <Notifications />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  >
                        {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-body">
                    <div className="notification-header-item">
                      <h4 className="notification-title-item">{notification.title}</h4>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                  
                          {!notification.read && (
                    <div className="notification-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="notification-footer">
          <button className="btn btn-outline btn-sm">
            Marquer tout comme lu
          </button>
          <button className="btn btn-outline btn-sm">
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 