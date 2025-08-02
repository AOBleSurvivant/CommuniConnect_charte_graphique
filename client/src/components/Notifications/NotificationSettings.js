import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Message,
  Warning,
  Event,
  Help,
  Settings,
  TestTube,
  Info,
  Refresh
} from '@mui/icons-material';
import pushNotificationService from '../../services/pushNotificationService';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    messages: true,
    alerts: true,
    events: true,
    helpRequests: true
  });
  
  const [status, setStatus] = useState({
    supported: false,
    permission: 'default',
    enabled: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testDialog, setTestDialog] = useState(false);
  const [testNotification, setTestNotification] = useState({
    type: 'message',
    title: '',
    body: ''
  });
  
  const [message, setMessage] = useState(null);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
  }, []);

  // Charger les paramètres depuis le serveur
  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Obtenir le statut des notifications
      const notificationStatus = pushNotificationService.getStatus();
      setStatus(notificationStatus);
      
      // Obtenir les paramètres depuis le serveur
      const serverSettings = await pushNotificationService.getNotificationSettings();
      if (serverSettings) {
        setSettings(serverSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des paramètres'
      });
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un paramètre
  const handleSettingChange = async (setting, value) => {
    try {
      setSaving(true);
      
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      
      const success = await pushNotificationService.updateNotificationSettings(newSettings);
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'Paramètres mis à jour avec succès'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Erreur lors de la mise à jour des paramètres'
        });
        // Restaurer l'ancienne valeur
        setSettings(settings);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la mise à jour'
      });
      // Restaurer l'ancienne valeur
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  // Demander la permission pour les notifications
  const requestPermission = async () => {
    try {
      const newPermission = await pushNotificationService.requestPermission();
      const newStatus = pushNotificationService.getStatus();
      setStatus(newStatus);
      
      if (newPermission === 'granted') {
        setMessage({
          type: 'success',
          text: 'Permission accordée ! Les notifications sont maintenant activées.'
        });
      } else {
        setMessage({
          type: 'warning',
          text: 'Permission refusée. Les notifications ne fonctionneront pas.'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la demande de permission'
      });
    }
  };

  // Réinitialiser les notifications
  const resetNotifications = async () => {
    try {
      setSaving(true);
      const success = await pushNotificationService.reset();
      
      if (success) {
        const newStatus = pushNotificationService.getStatus();
        setStatus(newStatus);
        setMessage({
          type: 'success',
          text: 'Notifications réinitialisées avec succès'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Erreur lors de la réinitialisation'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la réinitialisation'
      });
    } finally {
      setSaving(false);
    }
  };

  // Envoyer une notification de test
  const sendTestNotification = async () => {
    try {
      setSaving(true);
      
      const success = await pushNotificationService.sendTestNotification(
        testNotification.type,
        testNotification.title,
        testNotification.body
      );
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'Notification de test envoyée !'
        });
        setTestDialog(false);
        setTestNotification({ type: 'message', title: '', body: '' });
      } else {
        setMessage({
          type: 'error',
          text: 'Erreur lors de l\'envoi de la notification de test'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du test:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'envoi du test'
      });
    } finally {
      setSaving(false);
    }
  };

  // Obtenir l'icône pour un type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'messages':
        return <Message />;
      case 'alerts':
        return <Warning />;
      case 'events':
        return <Event />;
      case 'helpRequests':
        return <Help />;
      default:
        return <Notifications />;
    }
  };

  // Obtenir le statut de permission
  const getPermissionStatus = () => {
    if (!status.supported) {
      return { color: 'error', text: 'Non supporté', icon: <NotificationsOff /> };
    }
    
    switch (status.permission) {
      case 'granted':
        return { color: 'success', text: 'Activé', icon: <Notifications /> };
      case 'denied':
        return { color: 'error', text: 'Refusé', icon: <NotificationsOff /> };
      default:
        return { color: 'warning', text: 'En attente', icon: <Info /> };
    }
  };

  const permissionStatus = getPermissionStatus();

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Chargement des paramètres...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings />
        Paramètres de Notifications
      </Typography>

      {/* Message d'alerte */}
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Statut des notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Statut des Notifications</Typography>
            <Chip
              icon={permissionStatus.icon}
              label={permissionStatus.text}
              color={permissionStatus.color}
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {status.supported 
              ? 'Votre navigateur supporte les notifications push. Vous pouvez configurer vos préférences ci-dessous.'
              : 'Votre navigateur ne supporte pas les notifications push.'
            }
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {status.supported && status.permission !== 'granted' && (
              <Button
                variant="contained"
                color="primary"
                onClick={requestPermission}
                disabled={saving}
                startIcon={<Notifications />}
              >
                Activer les Notifications
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={resetNotifications}
              disabled={saving}
              startIcon={<Refresh />}
            >
              Réinitialiser
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setTestDialog(true)}
              disabled={!status.enabled}
              startIcon={<TestTube />}
            >
              Test
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Paramètres de notification */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Types de Notifications
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choisissez quels types de notifications vous souhaitez recevoir
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(settings).map(([key, value]) => (
              <Box key={key}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => handleSettingChange(key, e.target.checked)}
                      disabled={saving || !status.enabled}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getNotificationIcon(key)}
                      <Typography>
                        {key === 'messages' && 'Messages privés'}
                        {key === 'alerts' && 'Alertes de sécurité'}
                        {key === 'events' && 'Événements locaux'}
                        {key === 'helpRequests' && 'Demandes d\'aide'}
                      </Typography>
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  {key === 'messages' && 'Recevoir des notifications pour les nouveaux messages privés'}
                  {key === 'alerts' && 'Être informé des alertes de sécurité dans votre quartier'}
                  {key === 'events' && 'Recevoir des notifications pour les événements locaux'}
                  {key === 'helpRequests' && 'Être notifié des demandes d\'aide à proximité'}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog de test */}
      <Dialog open={testDialog} onClose={() => setTestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TestTube />
            Notification de Test
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type de notification</InputLabel>
              <Select
                value={testNotification.type}
                onChange={(e) => setTestNotification({ ...testNotification, type: e.target.value })}
                label="Type de notification"
              >
                <MenuItem value="message">Message</MenuItem>
                <MenuItem value="alert">Alerte</MenuItem>
                <MenuItem value="event">Événement</MenuItem>
                <MenuItem value="help_request">Demande d'aide</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Titre"
              value={testNotification.title}
              onChange={(e) => setTestNotification({ ...testNotification, title: e.target.value })}
              fullWidth
              placeholder="Titre de la notification"
            />
            
            <TextField
              label="Contenu"
              value={testNotification.body}
              onChange={(e) => setTestNotification({ ...testNotification, body: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Contenu de la notification"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={sendTestNotification}
            variant="contained"
            disabled={saving || !testNotification.title || !testNotification.body}
          >
            Envoyer le Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationSettings; 