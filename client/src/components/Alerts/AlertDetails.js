import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as ConfirmIcon,
  Cancel as DenyIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  Phone as PhoneIcon,
  LocalFireDepartment as FireIcon,
  LocalHospital as HospitalIcon,
  LocalPolice as PoliceIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { confirmAlert, denyAlert, reportAlert } from '../../store/slices/alertsSlice';

const AlertDetails = ({ alert, open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  if (!alert) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'important': return 'warning';
      case 'information': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <ErrorIcon />;
      case 'important': return <WarningIcon />;
      case 'information': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'accident': return <WarningIcon />;
      case 'securite': return <PoliceIcon />;
      case 'sante': return <HospitalIcon />;
      case 'infrastructure': return <FireIcon />;
      default: return <InfoIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await dispatch(confirmAlert(alert._id)).unwrap();
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
    }
    setLoading(false);
  };

  const handleDeny = async () => {
    setLoading(true);
    try {
      await dispatch(denyAlert(alert._id)).unwrap();
    } catch (error) {
      console.error('Erreur lors du déni:', error);
    }
    setLoading(false);
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      await dispatch(reportAlert({ id: alert._id, reason: 'fausse_alerte' })).unwrap();
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: alert.description,
        url: window.location.href
      });
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(`${alert.title}\n\n${alert.description}`);
    }
  };

  const isAuthor = user && alert.author?._id === user._id;
  const hasConfirmed = alert.userInteractions?.confirmed?.some(c => c.user === user?._id);
  const hasDenied = alert.userInteractions?.denied?.some(d => d.user === user?._id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getPriorityIcon(alert.priority)}
            <Typography variant="h5" sx={{ ml: 1 }}>
              {alert.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informations principales */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={alert.priority} 
                    color={getPriorityColor(alert.priority)}
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={alert.type} 
                    variant="outlined"
                    icon={getTypeIcon(alert.type)}
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={alert.category} 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {alert.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Localisation */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {alert.location?.quartier}, {alert.location?.commune}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  {alert.location?.address}
                </Typography>

                {/* Auteur et date */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Par {alert.author?.firstName} {alert.author?.lastName}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(alert.createdAt)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistiques */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Badge badgeContent={alert.interactions?.views || 0} color="primary">
                        <PersonIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Vues" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Badge badgeContent={alert.interactions?.confirmations || 0} color="success">
                        <ConfirmIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Confirmations" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Badge badgeContent={alert.interactions?.denials || 0} color="error">
                        <DenyIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Dénis" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Contacts d'urgence */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contacts d'urgence
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PoliceIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Police" 
                      secondary={alert.emergencyContacts?.police || '117'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FireIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Pompiers" 
                      secondary={alert.emergencyContacts?.pompiers || '18'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HospitalIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="SAMU" 
                      secondary={alert.emergencyContacts?.samu || '442'} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Mises à jour */}
          {alert.updates && alert.updates.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mises à jour
                  </Typography>
                  {alert.updates.map((update, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" paragraph>
                        {update.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(update.createdAt)} - {update.isOfficial ? 'Officiel' : 'Utilisateur'}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isAuthor && (
            <>
              <Button
                variant="outlined"
                color="success"
                startIcon={<ConfirmIcon />}
                onClick={handleConfirm}
                disabled={loading || hasConfirmed}
              >
                {hasConfirmed ? 'Confirmé' : 'Confirmer'}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DenyIcon />}
                onClick={handleDeny}
                disabled={loading || hasDenied}
              >
                {hasDenied ? 'Dénié' : 'Dénier'}
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            disabled={loading}
          >
            Partager
          </Button>

          {!isAuthor && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ReportIcon />}
              onClick={handleReport}
              disabled={loading}
            >
              Signaler
            </Button>
          )}

          <Button onClick={onClose} variant="contained">
            Fermer
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDetails; 