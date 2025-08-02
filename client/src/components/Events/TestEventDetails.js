import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

const TestEventDetails = () => {
  const [open, setOpen] = useState(false);
  const [testEvent] = useState({
    _id: 'test-123',
    title: 'Événement de test',
    description: 'Description de test',
    startDate: new Date().toISOString(),
    location: { venue: 'Lieu de test', quartier: 'Quartier de test' },
    type: 'meeting',
    status: 'published',
    organizer: { _id: 'user-123', name: 'Organisateur Test' },
    participants: []
  });

  const handleViewDetails = (event) => {
    console.log('Bouton Détails cliqué:', event);
    setOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Bouton Détails Événements</h2>
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleViewDetails(testEvent)}
        style={{ marginBottom: '20px' }}
      >
        Test Détails
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de l'événement de test</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{testEvent.title}</Typography>
          <Typography variant="body1">{testEvent.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            Lieu: {testEvent.location.venue}, {testEvent.location.quartier}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TestEventDetails;
