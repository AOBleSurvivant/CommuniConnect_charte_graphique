import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import DefaultAvatar from '../common/DefaultAvatar';
import { useSelector } from 'react-redux';

const TypingIndicator = ({ conversationId }) => {
  const typingIndicators = useSelector(state => state.messages.typingIndicators);
  const conversations = useSelector(state => state.messages.conversations);
  const currentUser = useSelector(state => state.auth.user);

  const isTyping = typingIndicators[conversationId] && typingIndicators[conversationId].size > 0;
  
  if (!isTyping) return null;

  // Obtenir les utilisateurs qui sont en train de taper
  const typingUsers = Array.from(typingIndicators[conversationId] || []);
  
  // Filtrer l'utilisateur actuel
  const otherTypingUsers = typingUsers.filter(userId => userId !== currentUser?.id);

  if (otherTypingUsers.length === 0) return null;

  // Obtenir les informations des utilisateurs qui tapent
  const conversation = conversations.find(conv => conv.id === conversationId);
  const typingUserNames = otherTypingUsers.map(userId => {
    const participant = conversation?.participants?.find(p => p.user._id === userId);
    return participant ? `${participant.user.firstName} ${participant.user.lastName}` : 'Quelqu\'un';
  });

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} est en train d'écrire...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} et ${typingUserNames[1]} sont en train d'écrire...`;
    } else {
      return `${typingUserNames[0]} et ${typingUserNames.length - 1} autres sont en train d'écrire...`;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        mx: 2,
        mb: 1,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        maxWidth: 'fit-content'
      }}
    >
      {/* Avatar de l'utilisateur qui tape */}
      {typingUserNames.length === 1 && (
        <Avatar
          src={conversation?.participants?.find(p => p.user._id === otherTypingUsers[0])?.user.avatar}
          sx={{ width: 24, height: 24 }}
        >
          {typingUserNames[0]?.charAt(0)}
        </Avatar>
      )}

      {/* Indicateur de frappe animé */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {getTypingText()}
        </Typography>
        
        {/* Points animés */}
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'text.secondary',
                animation: 'typing 1.4s infinite ease-in-out',
                animationDelay: `${index * 0.2}s`,
                '@keyframes typing': {
                  '0%, 60%, 100%': {
                    transform: 'translateY(0)',
                    opacity: 0.4
                  },
                  '30%': {
                    transform: 'translateY(-6px)',
                    opacity: 1
                  }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TypingIndicator; 