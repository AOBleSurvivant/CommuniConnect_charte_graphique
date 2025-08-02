import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Chip,
  Box,
  Divider,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Event,
  Celebration,
  School,
  SportsEsports,
  MusicNote,
  Restaurant,
  Business,
  VolunteerActivism,
  Group,
  MoreVert,
  Flag,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Phone,
  Email,
  People,
  Euro,
  Public,
  Lock,
  Share,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Cancel,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EventCard = ({ event, onJoin, onLeave, onEdit, onDelete, onReport, onShare }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleJoin = () => {
    handleMenuClose();
    onJoin?.(event.id);
  };

  const handleLeave = () => {
    handleMenuClose();
    onLeave?.(event.id);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(event);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(event.id);
  };

  const handleReport = () => {
    handleMenuClose();
    onReport?.(event.id);
  };

  const handleShare = () => {
    handleMenuClose();
    onShare?.(event);
  };

  const getEventIcon = (type) => {
    const icons = {
      celebration: <Celebration />,
      education: <School />,
      sport: <SportsEsports />,
      music: <MusicNote />,
      food: <Restaurant />,
      business: <Business />,
      charity: <VolunteerActivism />,
      meeting: <Group />,
    };
    return icons[type] || <Event />;
  };

  const getEventColor = (type) => {
    const colors = {
      celebration: 'primary',
      education: 'info',
      sport: 'success',
      music: 'secondary',
      food: 'warning',
      business: 'primary',
      charity: 'error',
      meeting: 'info',
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'primary',
      ongoing: 'success',
      completed: 'default',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      upcoming: <CalendarToday />,
      ongoing: <AccessTime />,
      completed: <CheckCircle />,
      cancelled: <Cancel />,
    };
    return icons[status] || <Event />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'À venir',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || 'Inconnu';
  };

  const isParticipant = event.participants?.some(p => p.user?._id === user?.id);
  const isInterested = event.interested?.some(p => p.user?._id === user?.id);
  const canManage = user?.id === event.organizer?._id || user?.role === 'moderator' || user?.role === 'admin';
  const isFull = event.participants?.length >= event.maxParticipants;
  const isPast = new Date(event.startDate) < new Date();

  const participationRate = event.maxParticipants ? (event.participants?.length / event.maxParticipants) * 100 : 0;

  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: `2px solid ${theme.palette[getEventColor(event.type)].main}20` }}>
      {/* En-tête de l'événement */}
      <CardHeader
        avatar={
          <Avatar
            sx={{ 
              bgcolor: theme.palette[getEventColor(event.type)].main,
              color: 'white',
            }}
          >
            {getEventIcon(event.type)}
          </Avatar>
        }
        action={
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { minWidth: 150 },
              }}
            >
              {!isPast && !isParticipant && !isFull && (
                <MenuItem onClick={handleJoin}>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  Participer
                </MenuItem>
              )}
              {!isPast && isParticipant && (
                <MenuItem onClick={handleLeave}>
                  <ListItemIcon>
                    <Cancel fontSize="small" />
                  </ListItemIcon>
                  Se désinscrire
                </MenuItem>
              )}
              {canManage && (
                <>
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    Modifier
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <Delete fontSize="small" />
                    </ListItemIcon>
                    Supprimer
                  </MenuItem>
                </>
              )}
              {!canManage && (
                <MenuItem onClick={handleReport}>
                  <ListItemIcon>
                    <Flag fontSize="small" />
                  </ListItemIcon>
                  Signaler
                </MenuItem>
              )}
              <MenuItem onClick={handleShare}>
                <ListItemIcon>
                  <Share fontSize="small" />
                </ListItemIcon>
                Partager
              </MenuItem>
            </Menu>
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight="bold" color={theme.palette[getEventColor(event.type)].main}>
              {event.title}
            </Typography>
            <Chip
              label={getStatusLabel(event.status)}
              size="small"
              color={getStatusColor(event.status)}
              icon={getStatusIcon(event.status)}
            />
            {event.isPublic ? (
              <Chip label="Public" size="small" icon={<Public />} variant="outlined" />
            ) : (
              <Chip label="Privé" size="small" icon={<Lock />} variant="outlined" />
            )}
            {event.isFree ? (
              <Chip label="Gratuit" size="small" color="success" variant="outlined" />
            ) : (
              <Chip 
                label={`${event.price?.amount} ${event.price?.currency}`} 
                size="small" 
                icon={<Euro />} 
                color="warning" 
                variant="outlined" 
              />
            )}
          </Box>
        }
        subheader={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                {format(new Date(event.startDate), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </span>
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                  {event.location?.venue}, {event.location?.quartier}
                </span>
              </div>
            )}
          </div>
        }
      />

      {/* Contenu de l'événement */}
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        
        {/* Image de l'événement */}
        {event.image && (
          <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
            <img
              src={event.image}
              alt="Événement"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {event.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        )}

        {/* Participation */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.participants?.length || 0} / {event.maxParticipants} participants
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {Math.round(participationRate)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={participationRate}
            color={participationRate >= 90 ? 'error' : 'primary'}
            sx={{ height: 6, borderRadius: 3 }}
          />
          {isFull && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Événement complet !
            </Alert>
          )}
        </Box>

        {/* Informations sur l'organisateur */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Organisé par <strong>{event.organizer?.firstName} {event.organizer?.lastName}</strong>
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ px: 2, py: 1 }}>
        <Button
          startIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setShowDetails(!showDetails)}
          sx={{ textTransform: 'none' }}
        >
          {showDetails ? 'Masquer les détails' : 'Voir les détails'}
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {!isPast && !isParticipant && !isFull && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            startIcon={<CheckCircle />}
          >
            Participer
          </Button>
        )}
        
        {!isPast && isParticipant && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            startIcon={<Cancel />}
          >
            Se désinscrire
          </Button>
        )}
        
        <Button
          startIcon={<Share />}
          onClick={handleShare}
          variant="outlined"
          size="small"
        >
          Partager
        </Button>
      </CardActions>

      {/* Détails supplémentaires */}
      <Collapse in={showDetails}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Coordonnées GPS */}
          {event.latitude && event.longitude && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Coordonnées GPS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latitude: {event.latitude.toFixed(6)}, Longitude: {event.longitude.toFixed(6)}
              </Typography>
            </Box>
          )}

          {/* Contact */}
          {(event.contactPhone || event.contactEmail) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Contact
              </Typography>
              {event.contactPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.contactPhone}
                  </Typography>
                </Box>
              )}
              {event.contactEmail && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.contactEmail}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Exigences */}
          {event.requirements && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Exigences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.requirements}
              </Typography>
            </Box>
          )}

          {/* Durée */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Durée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              De {format(new Date(event.startDate), 'dd/MM/yyyy à HH:mm', { locale: fr })} 
              à {format(new Date(event.endDate), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </Typography>
          </Box>

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Participants ({event.participants.length})
              </Typography>
              <List dense>
                {event.participants.slice(0, 5).map((participant, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.secondary.main }}>
                        <Typography variant="caption">P</Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={participant.user?.firstName}
                      secondary={formatDistanceToNow(new Date(participant.joinedAt), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    />
                  </ListItem>
                ))}
                {event.participants.length > 5 && (
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      +{event.participants.length - 5} autres participants
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default EventCard; 