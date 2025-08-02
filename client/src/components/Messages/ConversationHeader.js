import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Badge,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';

const ConversationHeader = ({ conversation, onSearch, onEdit, onDelete, onArchive }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    onSearch?.();
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit?.();
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.();
    handleMenuClose();
  };

  const handleArchive = () => {
    onArchive?.();
    handleMenuClose();
  };

  if (!conversation) {
    return (
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Sélectionnez une conversation</Typography>
      </Box>
    );
  }

  const getConversationIcon = (type) => {
    switch (type) {
      case 'private':
        return <PersonIcon />;
      case 'group':
        return <GroupIcon />;
      case 'quartier':
        return <LocationIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getConversationAvatar = () => {
    if (conversation.avatar) return conversation.avatar;
    
    if (conversation.type === 'private' && conversation.participants) {
      const otherParticipant = conversation.participants.find(p => p.user._id !== conversation.currentUserId);
      return otherParticipant?.user.avatar;
    }
    
    return null;
  };

  const getConversationName = () => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === 'private' && conversation.participants) {
      const otherParticipant = conversation.participants.find(p => p.user._id !== conversation.currentUserId);
      return otherParticipant ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}` : 'Utilisateur';
    }
    
    return 'Conversation de groupe';
  };

  const getParticipantCount = () => {
    if (!conversation.participants) return 0;
    return conversation.participants.length;
  };

  const getOnlineStatus = () => {
    // Logique pour déterminer si des participants sont en ligne
    // À implémenter avec Socket.IO
    return false;
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Avatar de la conversation */}
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getOnlineStatus() ? 'success.main' : 'grey.400',
                border: 2,
                borderColor: 'background.paper'
              }}
            />
          }
        >
          <Avatar
            src={getConversationAvatar()}
            sx={{ width: 48, height: 48 }}
          >
            {getConversationIcon(conversation.type)}
          </Avatar>
        </Badge>

        {/* Informations de la conversation */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" noWrap>
              {getConversationName()}
            </Typography>
            
            {/* Type de conversation */}
            <Chip
              label={conversation.type === 'private' ? 'Privé' : 
                     conversation.type === 'group' ? 'Groupe' : 'Quartier'}
              size="small"
              variant="outlined"
              icon={getConversationIcon(conversation.type)}
            />
          </Box>

          {/* Métadonnées */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {conversation.type !== 'private' && (
              <Typography variant="caption" color="text.secondary">
                {getParticipantCount()} participant{getParticipantCount() > 1 ? 's' : ''}
              </Typography>
            )}
            
            {conversation.quartier && (
              <Typography variant="caption" color="text.secondary">
                {conversation.quartier}
                {conversation.ville && `, ${conversation.ville}`}
              </Typography>
            )}
            
            {conversation.lastSeen && (
              <Typography variant="caption" color="text.secondary">
                Vu {new Date(conversation.lastSeen).toLocaleDateString('fr-FR')}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Recherche */}
          <Tooltip title="Rechercher dans la conversation">
            <IconButton size="small" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Paramètres de notification">
            <IconButton size="small">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* Menu */}
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Menu des actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleSearch}>
          <SearchIcon sx={{ mr: 1 }} fontSize="small" />
          Rechercher
        </MenuItem>
        
        {conversation.type !== 'private' && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Modifier la conversation
          </MenuItem>
        )}
        
        <MenuItem onClick={handleArchive}>
          <ArchiveIcon sx={{ mr: 1 }} fontSize="small" />
          Archiver
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConversationHeader; 