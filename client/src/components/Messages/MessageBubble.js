import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageBubble = ({ message, isOwn, onReply, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReply = () => {
    onReply?.(message);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(message.id);
    handleMenuClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    handleMenuClose();
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm', { locale: fr });
    } catch (error) {
      return '--:--';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: 1,
        maxWidth: '70%',
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
      }}
    >
      {!isOwn && (
        <Avatar
          src={message.sender?.profilePicture}
          sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
        >
          {message.sender?.firstName?.charAt(0)}
        </Avatar>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
        {!isOwn && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, ml: 1 }}
          >
            {message.sender?.firstName} {message.sender?.lastName}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              backgroundColor: isOwn ? 'primary.main' : 'background.paper',
              color: isOwn ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopRightRadius: isOwn ? 0 : 2,
              borderTopLeftRadius: isOwn ? 2 : 0,
              position: 'relative',
              '&:hover': {
                '& .message-actions': {
                  opacity: 1,
                },
              },
            }}
          >
            {/* Message de réponse */}
            {message.replyTo && (
              <Box
                sx={{
                  mb: 1,
                  p: 1,
                  backgroundColor: isOwn ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Réponse à: {message.replyTo.content}
                </Typography>
              </Box>
            )}

            {/* Contenu du message */}
            <Typography
              variant="body2"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.content}
            </Typography>

            {/* Pièces jointes */}
            {message.attachments && message.attachments.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {message.attachments.map((attachment, index) => {
                  // Vérifier si c'est une vidéo
                  const isVideo = attachment.type?.startsWith('video/') || 
                                 attachment.filename?.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i);
                  
                  if (isVideo) {
                    return (
                      <Box key={index} sx={{ mb: 1 }}>
                        <video
                          controls
                          width="100%"
                          maxWidth="300px"
                          style={{ borderRadius: 8 }}
                        >
                          <source src={attachment.url} type={attachment.type || 'video/mp4'} />
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                        <Typography variant="caption" color="text.secondary">
                          {attachment.filename}
                        </Typography>
                      </Box>
                    );
                  }
                  
                  // Vérifier si c'est une image
                  const isImage = attachment.type?.startsWith('image/') || 
                                 attachment.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  
                  if (isImage) {
                    return (
                      <Box key={index} sx={{ mb: 1 }}>
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: 8,
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(attachment.url, '_blank')}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {attachment.filename}
                        </Typography>
                      </Box>
                    );
                  }
                  
                  // Autres types de fichiers
                  return (
                  <Chip
                    key={index}
                    label={attachment.filename}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                    onClick={() => window.open(attachment.url, '_blank')}
                  />
                  );
                })}
              </Box>
            )}

            {/* Actions du message */}
            <Box
              className="message-actions"
              sx={{
                position: 'absolute',
                top: -8,
                right: isOwn ? -8 : 'auto',
                left: isOwn ? 'auto' : -8,
                opacity: 0,
                transition: 'opacity 0.2s',
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 2,
              }}
            >
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>

          {/* Menu des actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: isOwn ? 'left' : 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: isOwn ? 'right' : 'left',
            }}
          >
            <MenuItem onClick={handleReply}>
              <ReplyIcon sx={{ mr: 1 }} fontSize="small" />
              Répondre
            </MenuItem>
            <MenuItem onClick={handleCopy}>
              <CopyIcon sx={{ mr: 1 }} fontSize="small" />
              Copier
            </MenuItem>
            {isOwn && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                Supprimer
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Informations du message */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            ml: isOwn ? 'auto' : 1,
            mr: isOwn ? 1 : 'auto',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatTime(message.timestamp)}
          </Typography>
          
          {isOwn && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              {getStatusIcon(message.status)}
            </Typography>
          )}
        </Box>
      </Box>

      {isOwn && (
        <Avatar
          src={message.sender?.profilePicture}
          sx={{ width: 32, height: 32, ml: 1, mt: 0.5 }}
        >
          {message.sender?.firstName?.charAt(0)}
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble; 