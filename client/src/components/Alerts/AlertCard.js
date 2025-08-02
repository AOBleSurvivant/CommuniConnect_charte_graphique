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
} from '@mui/material';
import {
  Warning,
  LocalFireDepartment,
  ElectricBolt,
  Construction,
  PersonSearch,
  VolumeUp,
  LocalHospital,
  Lock,
  MoreVert,
  Flag,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Phone,
  CheckCircle,
  Cancel,
  Share,
  Visibility,
  VisibilityOff,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AlertCard = ({ alert, onStatusChange, onEdit, onDelete, onReport, onShare }) => {
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

  const handleStatusChange = (newStatus) => {
    handleMenuClose();
    onStatusChange?.(alert.id, newStatus);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(alert);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(alert.id);
  };

  const handleReport = () => {
    handleMenuClose();
    onReport?.(alert.id);
  };

  const handleShare = () => {
    handleMenuClose();
    onShare?.(alert);
  };

  const getAlertIcon = (type) => {
    const icons = {
      incendie: <LocalFireDepartment />,
      coupure_electricite: <ElectricBolt />,
      route_bloquee: <Construction />,
      personne_disparue: <PersonSearch />,
      tapage_nocturne: <VolumeUp />,
      accident: <LocalHospital />,
      cambriolage: <Lock />,
    };
    return icons[type] || <Warning />;
  };

  const getAlertColor = (type) => {
    const colors = {
      incendie: 'error',
      coupure_electricite: 'warning',
      route_bloquee: 'info',
      personne_disparue: 'error',
      tapage_nocturne: 'warning',
      accident: 'error',
      cambriolage: 'error',
    };
    return colors[type] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      faible: 'success',
      moderate: 'warning',
      critique: 'error',
    };
    return colors[severity] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'error',
      resolved: 'success',
      false_alarm: 'warning',
      investigating: 'info',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <Warning />,
      resolved: <CheckCircle />,
      false_alarm: <Cancel />,
      investigating: <Visibility />,
    };
    return icons[status] || <Warning />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      resolved: 'Résolue',
      false_alarm: 'Fausse alerte',
      investigating: 'En cours',
    };
    return labels[status] || 'Inconnu';
  };

  const canManage = user?.id === alert.author?.id || user?.role === 'moderator' || user?.role === 'admin';

  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: `2px solid ${theme.palette[getAlertColor(alert.type)].main}20` }}>
      {/* En-tête de l'alerte */}
      <CardHeader
        avatar={
          <Avatar
            sx={{ 
              bgcolor: theme.palette[getAlertColor(alert.type)].main,
              color: 'white',
            }}
          >
            {getAlertIcon(alert.type)}
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
                  {alert.status === 'active' && (
                    <MenuItem onClick={() => handleStatusChange('resolved')}>
                      <ListItemIcon>
                        <CheckCircle fontSize="small" />
                      </ListItemIcon>
                      Marquer comme résolue
                    </MenuItem>
                  )}
                  {alert.status === 'active' && (
                    <MenuItem onClick={() => handleStatusChange('false_alarm')}>
                      <ListItemIcon>
                        <Cancel fontSize="small" />
                      </ListItemIcon>
                      Fausse alerte
                    </MenuItem>
                  )}
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
            <Typography variant="h6" fontWeight="bold" color={theme.palette[getAlertColor(alert.type)].main}>
              {alert.title}
            </Typography>
            <Chip
              label={getStatusLabel(alert.status)}
              size="small"
              color={getStatusColor(alert.status)}
              icon={getStatusIcon(alert.status)}
            />
            <Chip
              label={alert.severity}
              size="small"
              color={getSeverityColor(alert.severity)}
              variant="outlined"
            />
          </Box>
        }
        subheader={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                {formatDistanceToNow(new Date(alert.createdAt), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
            {alert.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                  {alert.location}
                </span>
              </div>
            )}
            {alert.contactPhone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                  {alert.contactPhone}
                </span>
              </div>
            )}
          </div>
        }
      />

      {/* Contenu de l'alerte */}
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          {alert.description}
        </Typography>
        
        {/* Image de l'alerte */}
        {alert.image && (
          <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
            <img
              src={alert.image}
              alt="Alerte"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Informations sur l'auteur */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Signalé par <strong>{alert.author?.name || 'Utilisateur'}</strong>
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
          {alert.latitude && alert.longitude && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Coordonnées GPS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latitude: {alert.latitude.toFixed(6)}, Longitude: {alert.longitude.toFixed(6)}
              </Typography>
            </Box>
          )}

          {/* Mises à jour de statut */}
          {alert.updates && alert.updates.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Mises à jour
              </Typography>
              <List dense>
                {alert.updates.map((update, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.secondary.main }}>
                        <Typography variant="caption">U</Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={update.message}
                      secondary={formatDistanceToNow(new Date(update.timestamp), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default AlertCard; 