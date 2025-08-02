import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Map as MapIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  clearError,
  clearSuccess
} from '../../store/slices/alertsSlice';
import { formatError } from '../../utils/errorHandler';
import CreateAlertForm from '../../components/Alerts/CreateAlertForm';
import AlertDetails from '../../components/Alerts/AlertDetails';

const AlertsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  const dispatch = useDispatch();
  const { alerts, loading, error, success } = useSelector(state => state.alerts);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleCreateAlert = async (alertData) => {
    try {
      await dispatch(createAlert(alertData)).unwrap();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
    }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowDetailsDialog(true);
  };

  const handleViewOnMap = (alert) => {
    setSelectedAlert(alert);
    setShowMapDialog(true);
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await dispatch(deleteAlert(alertId)).unwrap();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'accident':
        return <ErrorIcon color="error" />;
      case 'incident':
        return <WarningIcon color="warning" />;
      case 'information':
        return <InfoIcon color="info" />;
      case 'resolved':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'accident':
        return 'error';
      case 'incident':
        return 'warning';
      case 'information':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'Faible';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Élevée';
      case 'critical':
        return 'Critique';
      default:
        return 'Normale';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType;
    const urgencyMatch = filterUrgency === 'all' || alert.urgency === filterUrgency;
    return typeMatch && urgencyMatch;
  });

  const getLocationText = (alert) => {
    if (!alert.location) return 'Localisation inconnue';
    const { quartier, commune, prefecture } = alert.location;
    return [quartier, commune, prefecture].filter(Boolean).join(', ');
  };

  return (
    <Box sx={{ p: 3 }}>
        {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🚨 Alertes Communautaires
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Restez informé des événements importants dans votre communauté
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<MapIcon />}
          onClick={() => setShowMapDialog(true)}
          sx={{ mr: 2 }}
        >
          Voir sur la carte
        </Button>
      </Box>

      {/* Messages d'état */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {formatError(error) || 'Une erreur est survenue'}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
          {success || 'Opération réussie'}
        </Alert>
      )}

        {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type d'alerte</InputLabel>
          <Select
            value={filterType}
            label="Type d'alerte"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Tous les types</MenuItem>
            <MenuItem value="accident">Accident</MenuItem>
            <MenuItem value="incident">Incident</MenuItem>
            <MenuItem value="information">Information</MenuItem>
            <MenuItem value="resolved">Résolu</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Urgence</InputLabel>
          <Select
            value={filterUrgency}
            label="Urgence"
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <MenuItem value="all">Tous les niveaux</MenuItem>
            <MenuItem value="low">Faible</MenuItem>
            <MenuItem value="medium">Moyenne</MenuItem>
            <MenuItem value="high">Élevée</MenuItem>
            <MenuItem value="critical">Critique</MenuItem>
          </Select>
        </FormControl>

        <Chip
          label={`${filteredAlerts.length} alerte${filteredAlerts.length > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
            </Box>

          {/* Liste des alertes */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
                </Box>
      ) : filteredAlerts.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <WarningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucune alerte trouvée
                    </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filterType !== 'all' || filterUrgency !== 'all'
              ? 'Aucune alerte ne correspond à vos filtres.'
              : 'Aucune alerte active pour le moment.'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
          >
            Créer une alerte
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredAlerts.map((alert) => (
            <Grid item xs={12} sm={6} md={4} key={alert._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getTypeIcon(alert.type)}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {alert.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {alert.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {getLocationText(alert)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                      icon={getTypeIcon(alert.type)}
                      label={alert.type}
                      color={getTypeColor(alert.type)}
                    size="small"
                      variant="outlined"
                  />
                  <Chip
                      label={getUrgencyLabel(alert.urgency)}
                      color={getUrgencyColor(alert.urgency)}
                    size="small"
                  />
                        </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => handleViewDetails(alert)}
                    >
                      Détails
                    </Button>
                    <Button
                            size="small"
                      startIcon={<MapIcon />}
                      onClick={() => handleViewOnMap(alert)}
                    >
                      Carte
                    </Button>
                      </Box>

                  {user?.role === 'admin' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
                </Grid>
      )}

      {/* Bouton flottant pour créer une alerte */}
      <Tooltip title="Créer une alerte">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setShowCreateDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Dialog de création d'alerte */}
      <CreateAlertForm 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateAlert}
      />

      {/* Dialog de détails d'alerte */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Détails de l'alerte
        </DialogTitle>
        <DialogContent>
          {selectedAlert && <AlertDetails alert={selectedAlert} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de la carte */}
      <Dialog
        open={showMapDialog}
        onClose={() => setShowMapDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Carte des alertes
          <IconButton
            aria-label="close"
            onClick={() => setShowMapDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 500, width: '100%' }}>
            {/* Ici on pourrait intégrer la carte interactive avec les alertes */}
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <MapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Carte Interactive
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAlert
                    ? `Alerte: ${selectedAlert.title} - ${getLocationText(selectedAlert)}`
                    : `${alerts.length} alerte${alerts.length > 1 ? 's' : ''} affichée${alerts.length > 1 ? 's' : ''} sur la carte`
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AlertsPage; 