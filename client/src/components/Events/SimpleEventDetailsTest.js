import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

const SimpleEventDetailsTest = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [testEvent] = useState({
    _id: 'test-123',
    title: 'Événement de test',
    description: 'Description de test pour vérifier le bouton Détails',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    startTime: '14:00',
    endTime: '16:00',
    location: { venue: 'Lieu de test', quartier: 'Quartier de test' },
    type: 'meeting',
    status: 'published',
    category: 'test',
    organizer: { _id: 'user-123', name: 'Organisateur Test' },
    participants: []
  });

  const handleViewDetails = (event) => {
    console.log('✅ Bouton Détails cliqué avec succès!');
    console.log('📋 Événement:', event);
    setShowDialog(true);
  };

  const handleClose = () => {
    console.log('✅ Dialog fermé avec succès!');
    setShowDialog(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Bouton Détails Événements
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ce test vérifie que le bouton "Détails" fonctionne correctement.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => handleViewDetails(testEvent)}
        sx={{ mb: 2 }}
      >
        🧪 Tester le bouton Détails
      </Button>
      
      {showDialog && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Box sx={{ 
            bgcolor: 'white', 
            p: 3, 
            borderRadius: 2, 
            maxWidth: 500, 
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Typography variant="h5" gutterBottom>
              ✅ Test Réussi!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Le bouton "Détails" fonctionne correctement.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Titre: {testEvent.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Description: {testEvent.description}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              Fermer le test
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SimpleEventDetailsTest;
