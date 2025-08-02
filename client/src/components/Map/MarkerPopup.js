import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Warning,
  Event,
  Help,
  Chat,
  LocationOn,
  AccessTime,
  Person,
  Visibility,
  Share
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
// import { mapService } from '../../services/mapService';

const MarkerPopup = ({ marker }) => {
  const { type, data } = marker;

  const getTypeInfo = (type) => {
    const types = {
      alert: { label: 'Alerte', icon: <Warning />, color: 'error' },
      event: { label: 'Événement', icon: <Event />, color: 'success' },
      help: { label: 'Demande d\'aide', icon: <Help />, color: 'warning' },
      post: { label: 'Post', icon: <Chat />, color: 'primary' }
    };
    return types[type] || { label: 'Marqueur', icon: <LocationOn />, color: 'default' };
  };

  const getSeverityInfo = (severity) => {
    const severities = {
      low: { label: 'Faible', color: 'success' },
      normal: { label: 'Normale', color: 'warning' },
      high: { label: 'Élevée', color: 'error' },
      critical: { label: 'Critique', color: 'error' }
    };
    return severities[severity] || { label: 'Normale', color: 'warning' };
  };

  const typeInfo = getTypeInfo(type);

  const renderAlertContent = () => (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Chip
          label={typeInfo.label}
          color={typeInfo.color}
          size="small"
          icon={typeInfo.icon}
        />
        <Chip
          label={getSeverityInfo(data.severity).label}
          color={getSeverityInfo(data.severity).color}
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {data.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {data.description}
      </Typography>
      
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Person fontSize="small" />
        <Typography variant="caption">
          {data.author.firstName} {data.author.lastName}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTime fontSize="small" />
        <Typography variant="caption">
          {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: fr })}
        </Typography>
      </Box>
      
      <Box display="flex" gap={1}>
        <Button size="small" variant="outlined" startIcon={<Visibility />}>
          Voir détails
        </Button>
        <Button size="small" variant="contained" color="error">
          Confirmer
        </Button>
      </Box>
    </Box>
  );

  const renderEventContent = () => (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Chip
          label={typeInfo.label}
          color={typeInfo.color}
          size="small"
          icon={typeInfo.icon}
        />
        <Chip
          label={data.type}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {data.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {data.description}
      </Typography>
      
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Person fontSize="small" />
        <Typography variant="caption">
          {data.organizer.firstName} {data.organizer.lastName}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTime fontSize="small" />
        <Typography variant="caption">
          {formatDistanceToNow(new Date(data.startDate), { addSuffix: true, locale: fr })}
        </Typography>
      </Box>
      
      <Box display="flex" gap={1}>
        <Button size="small" variant="outlined" startIcon={<Visibility />}>
          Voir détails
        </Button>
        <Button size="small" variant="contained" color="success">
          Participer
        </Button>
      </Box>
    </Box>
  );

  const renderHelpContent = () => (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Chip
          label={typeInfo.label}
          color={typeInfo.color}
          size="small"
          icon={typeInfo.icon}
        />
        <Chip
          label={data.type}
          color="warning"
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {data.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {data.description}
      </Typography>
      
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Person fontSize="small" />
        <Typography variant="caption">
          {data.author.firstName} {data.author.lastName}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTime fontSize="small" />
        <Typography variant="caption">
          {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: fr })}
        </Typography>
      </Box>
      
      <Box display="flex" gap={1}>
        <Button size="small" variant="outlined" startIcon={<Visibility />}>
          Voir détails
        </Button>
        <Button size="small" variant="contained" color="warning">
          Aider
        </Button>
      </Box>
    </Box>
  );

  const renderPostContent = () => (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Chip
          label={typeInfo.label}
          color={typeInfo.color}
          size="small"
          icon={typeInfo.icon}
        />
        <Chip
          label={data.type}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="body1" paragraph>
        {data.content.length > 100 
          ? `${data.content.substring(0, 100)}...` 
          : data.content
        }
      </Typography>
      
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
          {data.author.firstName?.[0]}{data.author.lastName?.[0]}
        </Avatar>
        <Typography variant="caption">
          {data.author.firstName} {data.author.lastName}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTime fontSize="small" />
        <Typography variant="caption">
          {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: fr })}
        </Typography>
      </Box>
      
      <Box display="flex" gap={1}>
        <Button size="small" variant="outlined" startIcon={<Visibility />}>
          Lire plus
        </Button>
        <IconButton size="small">
          <Share />
        </IconButton>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (type) {
      case 'alert':
        return renderAlertContent();
      case 'event':
        return renderEventContent();
      case 'help':
        return renderHelpContent();
      case 'post':
        return renderPostContent();
      default:
        return (
          <Typography variant="body2">
            Informations non disponibles
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ minWidth: 250, maxWidth: 300 }}>
      {renderContent()}
    </Box>
  );
};

export default MarkerPopup; 