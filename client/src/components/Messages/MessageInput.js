import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper,
  InputAdornment,
  Typography
} from '@mui/material';
import { 
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components pour la cohérence
const StyledMessageInput = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

const MessageInput = ({ onSendMessage, disabled = false, placeholder = "Tapez votre message..." }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage({
        content: message.trim(),
        type: 'text'
      });
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Ici on pourrait ajouter la logique pour uploader le fichier
      console.log('Fichier sélectionné:', file.name);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Ici on pourrait ajouter la logique pour uploader l'image
      console.log('Image sélectionnée:', file.name);
    }
  };

  return (
    <StyledMessageInput elevation={2}>
      <Box component="form" onSubmit={handleSubmit}>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {/* Bouton emoji */}
                  <IconButton 
                    size="small" 
                    disabled={disabled}
                    onClick={() => console.log('Emoji picker')}
                  >
                    <EmojiIcon fontSize="small" />
                  </IconButton>
                  
                  {/* Bouton image */}
                  <IconButton 
                    size="small" 
                    disabled={disabled}
                    component="label"
                  >
                    <ImageIcon fontSize="small" />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                  
                  {/* Bouton fichier */}
                  <IconButton 
                    size="small" 
                    disabled={disabled}
                    component="label"
                  >
                    <AttachFileIcon fontSize="small" />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </IconButton>
                  
                  {/* Bouton envoi */}
                  <IconButton 
                    type="submit"
                    size="small" 
                    disabled={disabled || !message.trim()}
                    color="primary"
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Indicateur de frappe */}
      {isTyping && (
        <TypingIndicator>
          <Typography variant="caption" color="text.secondary">
            En train d'écrire...
          </Typography>
        </TypingIndicator>
      )}
    </StyledMessageInput>
  );
};

export default MessageInput; 