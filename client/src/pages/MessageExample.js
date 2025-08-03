import React from 'react';
import { Container, Typography, Box, Alert, Paper } from '@mui/material';
import MessageExample from '../components/Chat/MessageExample';

const MessageExamplePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          💬 Exemple de Message CommuniConnect
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Découvrez comment les messages de conversation apparaissent dans l'application
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note :</strong> Cet exemple montre comment les messages de conversation 
          s'affichent dans CommuniConnect avec toutes les fonctionnalités interactives.
        </Typography>
      </Alert>

      <MessageExample />

      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          🔧 Fonctionnalités démontrées
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Avatar avec badge de vérification</strong> - Indique les contributeurs vérifiés
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Tags et catégories</strong> - Organisation du contenu par thèmes
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Système de réactions</strong> - J'aime, favoris, partages
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Réponses et discussions</strong> - Conversations en fil de discussion
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Statistiques</strong> - Engagement et métriques de performance
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Horodatage</strong> - Dates et heures formatées en français
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MessageExamplePage; 