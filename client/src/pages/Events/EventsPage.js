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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LiveTv as LiveIcon,
  VideoCall as VideoCallIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Map as MapIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  participateInEvent,
  leaveEvent,
  clearError,
  clearSuccess
} from '../../store/slices/eventsSlice';
import { formatError } from '../../utils/errorHandler';
import CreateEventForm from '../../components/Events/CreateEventForm';
import EventDetails from '../../components/Events/EventDetails';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showLivestreamDialog, setShowLivestreamDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyEvents, setShowMyEvents] = useState(false);

  const dispatch = useDispatch();
  const { events, loading, error, success } = useSelector(state => state.events);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
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

  // Log de débogage pour surveiller les événements
  useEffect(() => {
    console.log('📊 État des événements:', {
      count: events.length,
      events: events.map(e => ({ id: e._id, title: e.title, status: e.status }))
    });
  }, [events]);

  const handleCreateEvent = async (eventData) => {
    try {
      console.log('📤 Création d\'événement avec les données:', eventData);
      await dispatch(createEvent(eventData)).unwrap();
      setShowCreateDialog(false);
      
      // Rafraîchir la liste des événements après création
      console.log('🔄 Rafraîchissement de la liste des événements...');
      await dispatch(fetchEvents());
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await dispatch(participateInEvent({ id: eventId })).unwrap();
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await dispatch(leaveEvent(eventId)).unwrap();
    } catch (error) {
      console.error('Erreur lors du désistement:', error);
    }
  };

  const handleStartLivestream = (event) => {
    setSelectedEvent(event);
    setShowLivestreamDialog(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <GroupIcon />;
      case 'conference':
        return <EventIcon />;
      case 'workshop':
        return <EventIcon />;
      case 'celebration':
        return <EventIcon />;
      case 'sport':
        return <EventIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'primary';
      case 'conference':
        return 'secondary';
      case 'workshop':
        return 'info';
      case 'celebration':
        return 'success';
      case 'sport':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const isUserParticipating = (event) => {
    return event.participants?.some(p => p._id === user?._id || p.id === user?.id);
  };

  const isUserOrganizer = (event) => {
    return event.organizer?._id === user?._id || event.organizer?.id === user?.id;
  };

  const canStartLivestream = (event) => {
    return isUserOrganizer(event) && event.status === 'ongoing' && !event.livestream;
  };

  const filteredEvents = events.filter(event => {
    const typeMatch = filterType === 'all' || event.type === filterType;
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    const searchMatch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const myEventsMatch = !showMyEvents || isUserParticipating(event) || isUserOrganizer(event);

    return typeMatch && statusMatch && searchMatch && myEventsMatch;
  });

  const upcomingEvents = filteredEvents.filter(event => 
    event.status === 'upcoming' || event.status === 'published'
  );
  const ongoingEvents = filteredEvents.filter(event => event.status === 'ongoing');
  const pastEvents = filteredEvents.filter(event => event.status === 'completed');

  // Log de débogage pour le filtrage
  console.log('🔍 Filtrage des événements:', {
    total: events.length,
    filtered: filteredEvents.length,
    upcoming: upcomingEvents.length,
    statuses: events.map(e => ({ id: e._id, title: e.title, status: e.status }))
  });

  const getLocationText = (event) => {
    if (!event.location) return 'Lieu non spécifié';
    const { quartier, commune, prefecture } = event.location;
    return [quartier, commune, prefecture].filter(Boolean).join(', ');
  };

  const formatDate = (date) => {
    if (!date) return 'Date non spécifiée';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, date);
      return 'Date invalide';
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Heure non spécifiée';
    try {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur de formatage d\'heure:', error, date);
      return 'Heure invalide';
    }
  };

  const formatEventTime = (event) => {
    if (!event.startTime || !event.endTime) return 'Heure non spécifiée';
    return `${event.startTime} - ${event.endTime}`;
  };

  return (
    <Box sx={{ p: 3 }}>
        {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            📅 Événements Communautaires
          </Typography>
        <Typography variant="body1" color="text.secondary">
          Découvrez et participez aux événements de votre communauté
        </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showMyEvents}
                onChange={(e) => setShowMyEvents(e.target.checked)}
              />
            }
            label="Mes événements"
          />
          <Button
            variant="contained"
            startIcon={<MapIcon />}
            onClick={() => {/* TODO: Ouvrir la carte */}}
          >
            Voir sur la carte
          </Button>
        </Box>
      </Box>

      {/* Messages d'état */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {typeof error === 'string' ? error : 'Une erreur est survenue'}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
          {typeof success === 'string' ? success : 'Opération réussie'}
        </Alert>
      )}

          {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Rechercher des événements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type d'événement</InputLabel>
          <Select
            value={filterType}
            label="Type d'événement"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Tous les types</MenuItem>
            <MenuItem value="meeting">Réunion</MenuItem>
            <MenuItem value="conference">Conférence</MenuItem>
            <MenuItem value="workshop">Atelier</MenuItem>
            <MenuItem value="celebration">Célébration</MenuItem>
            <MenuItem value="sport">Sport</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filterStatus}
            label="Statut"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="upcoming">À venir</MenuItem>
            <MenuItem value="ongoing">En cours</MenuItem>
            <MenuItem value="completed">Terminé</MenuItem>
            <MenuItem value="cancelled">Annulé</MenuItem>
          </Select>
        </FormControl>

        <Chip
          label={`${filteredEvents.length} événement${filteredEvents.length > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                À venir
                <Badge badgeContent={upcomingEvents.length} color="primary" />
                    </Box>
                  }
                />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                En cours
                <Badge badgeContent={ongoingEvents.length} color="success" />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Passés
                <Badge badgeContent={pastEvents.length} color="default" />
                </Box>
            }
          />
        </Tabs>
          </Box>

      {/* Contenu des onglets */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Onglet À venir */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {upcomingEvents.length === 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun événement à venir
              </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                        ? 'Aucun événement ne correspond à vos filtres.'
                        : 'Aucun événement programmé pour le moment.'
                }
              </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowCreateDialog(true)}
                    >
                      Créer un événement
                    </Button>
                  </Card>
        </Grid>
              ) : (
                upcomingEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getTypeIcon(event.type)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {event.title}
                  </Typography>
                  <Chip
                            label={event.type}
                            color={getTypeColor(event.type)}
                    size="small"
                            variant="outlined"
                  />
                </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(event.startDate)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatEventTime(event)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {getLocationText(event)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.participants?.length || 0} participant{(event.participants?.length || 0) > 1 ? 's' : ''}
                          </Typography>
                          {event.maxParticipants && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              / {event.maxParticipants}
                  </Typography>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                            label={getStatusLabel(event.status)}
                            color={getStatusColor(event.status)}
                    size="small"
                          />
                          {event.isPublic ? (
                            <Chip label="Public" size="small" icon={<PublicIcon />} />
                          ) : (
                            <Chip label="Privé" size="small" icon={<LockIcon />} />
                          )}
                          {event.livestream && (
                            <Chip label="Live" size="small" color="error" icon={<LiveIcon />} />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EventIcon />}
                            onClick={() => handleViewDetails(event)}
                          >
                            Détails
                          </Button>
                          {isUserOrganizer(event) && (
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<VideoCallIcon />}
                              onClick={() => handleStartLivestream(event)}
                              disabled={!canStartLivestream(event)}
                            >
                              Live
                            </Button>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {isUserParticipating(event) ? (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleLeaveEvent(event._id)}
                            >
                              Se désister
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              color="primary"
                              variant="contained"
                              onClick={() => handleJoinEvent(event._id)}
                              disabled={event.maxParticipants && (event.participants?.length || 0) >= event.maxParticipants}
                            >
                              Participer
                            </Button>
                          )}
                </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Onglet En cours */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              {ongoingEvents.length === 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun événement en cours
                    </Typography>
                  <Typography variant="body2" color="text.secondary">
                      Aucun événement ne se déroule actuellement.
                    </Typography>
                  </Card>
                </Grid>
              ) : (
                ongoingEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '2px solid #4caf50' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getTypeIcon(event.type)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {event.title}
                  </Typography>
                  <Chip
                            label="EN COURS"
                            color="success"
                    size="small"
                  />
                </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description}
              </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {getLocationText(event)}
                      </Typography>
                    </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.participants?.length || 0} participant{(event.participants?.length || 0) > 1 ? 's' : ''} en ligne
                          </Typography>
                  </Box>

                        {event.livestream && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LiveIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                            <Typography variant="caption" color="error.main" fontWeight="bold">
                              🔴 EN DIRECT
                            </Typography>
              </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          startIcon={<EventIcon />}
                          onClick={() => handleViewDetails(event)}
                        >
                          Détails
                        </Button>

                        {event.livestream ? (
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            startIcon={<LiveIcon />}
                            onClick={() => {/* TODO: Rejoindre le livestream */}}
                          >
                            Rejoindre le live
                          </Button>
                        ) : isUserOrganizer(event) && (
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            onClick={() => handleStartLivestream(event)}
                          >
                            Démarrer le live
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Onglet Passés */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              {pastEvents.length === 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun événement passé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aucun événement terminé pour le moment.
              </Typography>
                  </Card>
                </Grid>
              ) : (
                pastEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: 0.7 }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getTypeIcon(event.type)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {event.title}
                      </Typography>
                          <Chip
                            label="TERMINÉ"
                            color="default"
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(event.startDate)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                            {getLocationText(event)}
                      </Typography>
                    </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.participants?.length || 0} participant{(event.participants?.length || 0) > 1 ? 's' : ''} ont participé
                          </Typography>
              </Box>

                        {event.livestream && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LiveIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              Livestream disponible
                            </Typography>
      </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          startIcon={<EventIcon />}
                          onClick={() => handleViewDetails(event)}
                        >
                          Détails
                        </Button>

                        {event.livestream && (
                          <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            startIcon={<VideoCallIcon />}
                            onClick={() => {/* TODO: Voir le replay */}}
                          >
                            Voir le replay
                          </Button>
                        )}
                      </CardActions>
                    </Card>
        </Grid>
                ))
              )}
      </Grid>
          )}
        </>
      )}

      {/* Bouton flottant pour créer un événement */}
      <Tooltip title="Créer un événement">
      <Fab
        color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setShowCreateDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Dialog de création d'événement */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Créer un nouvel événement
        </DialogTitle>
        <DialogContent>
          <CreateEventForm 
            onClose={() => setShowCreateDialog(false)} 
            onSubmit={handleCreateEvent} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de détails d'événement */}
      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          open={showDetailsDialog} 
          onClose={() => setShowDetailsDialog(false)} 
        />
      )}

      {/* Dialog de démarrage de livestream */}
      <Dialog 
        open={showLivestreamDialog} 
        onClose={() => setShowLivestreamDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Démarrer un livestream pour {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vous êtes sur le point de démarrer un livestream pour cet événement.
            Tous les participants seront notifiés.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Le livestream sera automatiquement lié à l'événement et accessible
            depuis la page de l'événement.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLivestreamDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LiveIcon />}
            onClick={() => {
              // TODO: Démarrer le livestream
              setShowLivestreamDialog(false);
            }}
          >
            Démarrer le live
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsPage; 