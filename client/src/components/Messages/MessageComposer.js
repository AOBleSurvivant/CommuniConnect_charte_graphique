import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  IconButton,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, AttachFile, EmojiEmotions } from '@mui/icons-material';
import messagesService from '../../services/messagesService';

const MessageComposer = ({ conversationId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await messagesService.sendMessage(conversationId, message);
      
      if (response.data.success) {
        setSuccess('Message envoyé avec succès');
        setMessage('');
        if (onMessageSent) {
          onMessageSent(response.data.message);
        }
      } else {
        setError('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    // TODO: Implémenter l'upload de fichiers
    console.log('Upload de fichier à implémenter');
  };

  const handleEmoji = () => {
    // TODO: Implémenter le sélecteur d'emojis
    console.log('Sélecteur d\'emojis à implémenter');
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <IconButton
          onClick={handleAttachFile}
          color="primary"
          size="small"
          title="Joindre un fichier"
        >
          <AttachFile />
        </IconButton>
        
        <IconButton
          onClick={handleEmoji}
          color="primary"
          size="small"
          title="Ajouter un emoji"
        >
          <EmojiEmotions />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message..."
          variant="outlined"
          size="small"
          disabled={isLoading}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          {isLoading ? '' : 'Envoyer'}
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
      </Typography>
    </Paper>
  );
};

export default MessageComposer; 