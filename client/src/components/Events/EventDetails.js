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
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { participateInEvent, leaveEvent, reportEvent, deleteEvent } from '../../store/slices/eventsSlice';

const EventDetails = ({ event, open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  if (!event) return null;

  const isParticipating = event.participants?.some(p => 
    p.user?._id === user?.id && p.status === 'confirmed'
  );

  const isOrganizer = event.organizer?._id === user?.id;
  const canModerate = user?.role === 'moderator' || user?.role === 'admin';

  const getEventTypeIcon = (type) => {
    const icons = {
      reunion: '👥',
      formation: '📚',
      nettoyage: '🧹',
      festival: '🎉',
      sport: '⚽',
      culture: '🎭',
      sante: '🏥',
      education: '🎓',
      autre: '📅'
    };
    return icons[type] || '📅';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      reunion: 'primary',
      formation: 'secondary',
      nettoyage: 'success',
      festival: 'warning',
      sport: 'info',
      culture: 'error',
      sante: 'success',
      education: 'primary',
      autre: 'default'
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'success',
      draft: 'default',
      cancelled: 'error',
      completed: 'info',
      postponed: 'warning'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isPast = new Date(event.endDate) < new Date();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleParticipate = async () => {
    setLoading(true);
    try {
      if (isParticipating) {
        await dispatch(leaveEvent(event._id)).unwrap();
      } else {
        await dispatch(participateInEvent({ id: event._id, status: 'confirmed' })).unwrap();
      }
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    handleMenuClose();
  };

  const handleReport = () => {
    // TODO: Implémenter le signalement
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setLoading(true);
      try {
        await dispatch(deleteEvent(event._id)).unwrap();
        onClose();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
      setLoading(false);
    }
    handleMenuClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Détails de l'événement
          </Typography>
          <Box>
            <IconButton onClick={handleShare} size="small">
              <ShareIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* En-tête de l'événement */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                label={getEventTypeIcon(event.type)}
                color={getEventTypeColor(event.type)}
                variant="outlined"
                size="large"
              />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    label={event.status}
                    color={getStatusColor(event.status)}
                    size="small"
                  />
                  <Chip
                    label={event.type}
                    color={getEventTypeColor(event.type)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={event.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Statut temporel */}
          <Grid item xs={12}>
            {isUpcoming && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Cet événement aura lieu le {formatDate(event.startDate)}
              </Alert>
            )}
            {isOngoing && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Cet événement est en cours
              </Alert>
            )}
            {isPast && (
              <Alert severity="default" sx={{ mb: 2 }}>
                Cet événement s'est terminé le {formatDate(event.endDate)}
              </Alert>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Grid>

          {/* Informations principales */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📅 Date et heure
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Début :</strong> {formatDate(event.startDate)} à {formatTime(event.startTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fin :</strong> {formatDate(event.endDate)} à {formatTime(event.endTime)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📍 Localisation
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Lieu :</strong> {event.location?.venue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Adresse :</strong> {event.location?.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Quartier :</strong> {event.location?.quartier}, {event.location?.commune}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Organisateur */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  👤 Organisateur
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {event.organizer?.firstName?.[0]}{event.organizer?.lastName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {event.organizer?.firstName} {event.organizer?.lastName}
                    </Typography>
                    {event.contact && (
                      <Box display="flex" gap={1} mt={1}>
                        {event.contact.phone && (
                          <IconButton size="small" color="primary">
                            <PhoneIcon />
                          </IconButton>
                        )}
                        {event.contact.email && (
                          <IconButton size="small" color="primary">
                            <EmailIcon />
                          </IconButton>
                        )}
                        {event.contact.whatsapp && (
                          <IconButton size="small" color="success">
                            <WhatsAppIcon />
                          </IconButton>
                        )}
                        {event.contact.website && (
                          <IconButton size="small" color="info">
                            <WebsiteIcon />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Participants */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    👥 Participants ({event.participantsCount || 0})
                    {event.capacity && ` / ${event.capacity}`}
                  </Typography>
                  {event.isFull && (
                    <Chip label="Complet" color="error" size="small" />
                  )}
                </Box>
                
                {event.participants && event.participants.length > 0 ? (
                  <List>
                    {event.participants.slice(0, 10).map((participant, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar>
                            {participant.user?.firstName?.[0]}{participant.user?.lastName?.[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${participant.user?.firstName} ${participant.user?.lastName}`}
                          secondary={`Inscrit le ${new Date(participant.registeredAt).toLocaleDateString('fr-FR')}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={participant.status}
                            color={participant.status === 'confirmed' ? 'success' : 'default'}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {event.participants.length > 10 && (
                      <ListItem>
                        <ListItemText
                          secondary={`... et ${event.participants.length - 10} autres participants`}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun participant inscrit pour le moment.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Informations pratiques */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💰 Prix
                </Typography>
                <Typography variant="h5" color="primary">
                  {event.isFree ? 'Gratuit' : `${event.price?.amount} ${event.price?.currency}`}
                </Typography>
                {event.price?.description && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {event.price.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Capacité
                </Typography>
                <Typography variant="h5" color="primary">
                  {event.capacity ? `${event.participantsCount || 0} / ${event.capacity}` : 'Illimitée'}
                </Typography>
                {event.capacity && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {event.availableSpots} places disponibles
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏷️ Tags
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {event.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Statistiques */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Statistiques
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {event.statistics?.views || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vues
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {event.statistics?.shares || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Partages
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {event.statistics?.notificationsSent || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Notifications
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {event.statistics?.participantsCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Participants
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Fermer
        </Button>
        
        {!isPast && !isOrganizer && (
          <Button
            variant={isParticipating ? "outlined" : "contained"}
            color={isParticipating ? "secondary" : "primary"}
            onClick={handleParticipate}
            disabled={loading || event.isFull}
            startIcon={loading ? <CircularProgress size={20} /> : <GroupIcon />}
          >
            {isParticipating ? 'Se désinscrire' : 'Participer'}
          </Button>
        )}
      </DialogActions>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleShare}>
          <ShareIcon sx={{ mr: 1 }} />
          Partager
        </MenuItem>
        {isOrganizer && (
          <MenuItem onClick={handleMenuClose}>
            <EditIcon sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
        )}
        {(isOrganizer || canModerate) && (
          <MenuItem onClick={handleDelete}>
            <DeleteIcon sx={{ mr: 1 }} />
            Supprimer
          </MenuItem>
        )}
        {!isOrganizer && (
          <MenuItem onClick={handleReport}>
            <ReportIcon sx={{ mr: 1 }} />
            Signaler
          </MenuItem>
        )}
      </Menu>
    </Dialog>
  );
};

export default EventDetails; 