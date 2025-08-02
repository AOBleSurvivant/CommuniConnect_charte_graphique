import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  useTheme,
  Alert,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add,
  Event,
  Warning,
  LocationOn,
  Share,
  Directions,
  Info,
  Close,
} from '@mui/icons-material';
import InteractiveMap from '../../components/Map/InteractiveMap';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MapPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Données fictives pour la démonstration
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkerClick = (item, type) => {
    setSelectedItem({ item, type });
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedItem.item.title,
        text: selectedItem.item.description || selectedItem.item.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: 'Lien copié dans le presse-papiers !',
        severity: 'success'
      });
    }
  };

  const handleDirections = () => {
    const { latitude, longitude } = selectedItem.item;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const getItemIcon = (type) => {
    if (selectedItem?.type === 'event') {
      return <Event />;
    } else {
      return <Warning />;
    }
  };

  const getItemColor = (type) => {
    if (selectedItem?.type === 'event') {
      return 'primary';
    } else {
      return 'error';
    }
  };

  const getItemTypeLabel = (type) => {
    if (selectedItem?.type === 'event') {
      return 'Événement';
    } else {
      return 'Alerte';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de la carte..." />;
  }

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* En-tête de la carte */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          p: 2,
        }}
      >
        <Typography variant="h5" color="white" fontWeight="bold" gutterBottom>
          Carte Interactive
        </Typography>
        <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
          Découvrez les événements et alertes autour de vous
        </Typography>
        
        {/* Légende */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Event />}
            label="Événements"
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
          />
          <Chip
            icon={<Warning />}
            label="Alertes"
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
          />
        </Box>
      </Box>

      {/* Carte interactive */}
      <InteractiveMap
        events={events}
        alerts={alerts}
        onMarkerClick={handleMarkerClick}
      />

      {/* Bouton d'action flottant */}
      <SpeedDial
        ariaLabel="Actions rapides"
        sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<Event />}
          tooltipTitle="Créer un événement"
          onClick={() => {
            navigate('/events');
            setSnackbar({
              open: true,
              message: 'Redirection vers la création d\'événement...',
              severity: 'info'
            });
          }}
        />
        <SpeedDialAction
          icon={<Warning />}
          tooltipTitle="Créer une alerte"
          onClick={() => {
            navigate('/alerts');
            setSnackbar({
              open: true,
              message: 'Redirection vers la création d\'alerte...',
              severity: 'info'
            });
          }}
        />
        <SpeedDialAction
          icon={<LocationOn />}
          tooltipTitle="Ma position"
          onClick={() => {
            setSnackbar({
              open: true,
              message: 'Centrage sur votre position...',
              severity: 'info'
            });
          }}
        />
      </SpeedDial>

      {/* Dialogue de détails */}
      <Dialog
        open={showDetails}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getItemIcon()}
                  <Typography variant="h6" fontWeight="bold">
                    {selectedItem.item.title}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseDetails}>
                  <Close />
                </IconButton>
              </Box>
              <Chip
                label={getItemTypeLabel()}
                color={getItemColor()}
                size="small"
                sx={{ mt: 1 }}
              />
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedItem.item.description || 'Aucune description disponible.'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedItem.item.location}
                </Typography>
              </Box>

              {selectedItem.type === 'event' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date: {selectedItem.item.startDate?.toLocaleDateString('fr-FR')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Participants: {selectedItem.item.participants}/{selectedItem.item.maxParticipants}
                  </Typography>
                </Box>
              )}

              {selectedItem.type === 'alert' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Gravité: {selectedItem.item.severity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Statut: {selectedItem.item.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Signalé le: {selectedItem.item.createdAt?.toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                startIcon={<Directions />}
                onClick={handleDirections}
                variant="outlined"
              >
                Itinéraire
              </Button>
              <Button
                startIcon={<Share />}
                onClick={handleShare}
                variant="outlined"
              >
                Partager
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseDetails}
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MapPage; 