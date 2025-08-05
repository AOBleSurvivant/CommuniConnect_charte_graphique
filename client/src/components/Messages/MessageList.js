import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[100],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  wordWrap: 'break-word',
}));

const MessageList = ({ messages = [], currentUserId, loading = false, error = null }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) => {
    return message.sender?._id === currentUserId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      {messages.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">
            Aucun message pour le moment. Commencez la conversation !
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {messages.map((message, index) => {
            const isOwn = isOwnMessage(message);
            const showAvatar = !isOwn;
            
            return (
              <ListItem 
                key={message._id || index} 
                sx={{ 
                  p: 0, 
                  mb: 1,
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start'
                }}
              >
                <MessageContainer isOwn={isOwn}>
                  {showAvatar && (
                    <ListItemAvatar sx={{ minWidth: 40, mr: 1 }}>
                      <Avatar 
                        src={message.sender?.profilePicture}
                        sx={{ width: 32, height: 32 }}
                      >
                        {message.sender?.firstName?.charAt(0) || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                  )}
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <MessageBubble isOwn={isOwn}>
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                    </MessageBubble>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: isOwn ? 'flex-end' : 'flex-start',
                      mt: 0.5,
                      px: 1
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(message.createdAt)}
                      </Typography>
                      {isOwn && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {message.read ? '✓✓' : '✓'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </MessageContainer>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default MessageList; 