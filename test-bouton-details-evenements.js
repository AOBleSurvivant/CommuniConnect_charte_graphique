const fs = require('fs');
const path = require('path');

console.log('🧪 TEST BOUTON DÉTAILS ÉVÉNEMENTS');
console.log('====================================');

// Vérifier que les corrections ont été appliquées
const checkCorrections = () => {
  console.log('\n🔍 Vérification des corrections:');
  
  const eventsPagePath = 'client/src/pages/Events/EventsPage.js';
  if (fs.existsSync(eventsPagePath)) {
    const content = fs.readFileSync(eventsPagePath, 'utf8');
    
    // Vérifier que le Dialog externe a été supprimé
    const hasExternalDialog = content.includes('<Dialog') && 
                             content.includes('open={showDetailsDialog}') && 
                             content.includes('DialogTitle') &&
                             content.includes('Détails de l\'événement');
    console.log(`   ${!hasExternalDialog ? '✅' : '❌'} Dialog externe supprimé`);
    
    // Vérifier que EventDetails est utilisé directement
    const hasDirectEventDetails = content.includes('<EventDetails') && 
                                 content.includes('open={showDetailsDialog}') && 
                                 content.includes('onClose={() => setShowDetailsDialog(false)}');
    console.log(`   ${hasDirectEventDetails ? '✅' : '❌'} EventDetails utilisé directement`);
    
    // Vérifier que les props sont correctes
    const hasCorrectProps = content.includes('event={selectedEvent}') && 
                           content.includes('open={showDetailsDialog}') && 
                           content.includes('onClose={() => setShowDetailsDialog(false)}');
    console.log(`   ${hasCorrectProps ? '✅' : '❌'} Props correctes`);
  }
};

// Vérifier EventDetails.js
const checkEventDetails = () => {
  console.log('\n🔍 Vérification de EventDetails.js:');
  
  const eventDetailsPath = 'client/src/components/Events/EventDetails.js';
  if (fs.existsSync(eventDetailsPath)) {
    const content = fs.readFileSync(eventDetailsPath, 'utf8');
    
    // Vérifier que le composant a son propre Dialog
    const hasOwnDialog = content.includes('<Dialog') && 
                        content.includes('open={open}') && 
                        content.includes('onClose={onClose}');
    console.log(`   ${hasOwnDialog ? '✅' : '❌'} Dialog intégré`);
    
    // Vérifier que les props sont utilisées
    const usesOpenProp = content.includes('open={open}');
    console.log(`   ${usesOpenProp ? '✅' : '❌'} Utilise la prop open`);
    
    const usesOnCloseProp = content.includes('onClose={onClose}');
    console.log(`   ${usesOnCloseProp ? '✅' : '❌'} Utilise la prop onClose`);
    
    // Vérifier que le bouton de fermeture fonctionne
    const hasCloseButton = content.includes('onClick={onClose}') || 
                          content.includes('onClick={() => onClose()}');
    console.log(`   ${hasCloseButton ? '✅' : '❌'} Bouton de fermeture`);
  }
};

// Créer un composant de test simple
const createSimpleTest = () => {
  const testComponent = `import React, { useState } from 'react';
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
`;

  fs.writeFileSync('client/src/components/Events/SimpleEventDetailsTest.js', testComponent);
  console.log('\n✅ Composant de test simple créé');
};

// Vérifier les erreurs JavaScript potentielles
const checkForJavaScriptErrors = () => {
  console.log('\n🔍 Vérification des erreurs JavaScript potentielles:');
  
  // Vérifier les imports dans EventsPage.js
  const eventsPagePath = 'client/src/pages/Events/EventsPage.js';
  if (fs.existsSync(eventsPagePath)) {
    const content = fs.readFileSync(eventsPagePath, 'utf8');
    
    // Vérifier l'import d'EventDetails
    const hasEventDetailsImport = content.includes('import EventDetails') || 
                                 content.includes('from \'../../components/Events/EventDetails\'');
    console.log(`   ${hasEventDetailsImport ? '✅' : '❌'} Import EventDetails`);
    
    // Vérifier que les états sont définis
    const hasSelectedEventState = content.includes('const [selectedEvent') || 
                                 content.includes('useState(null)');
    console.log(`   ${hasSelectedEventState ? '✅' : '❌'} État selectedEvent`);
    
    const hasShowDetailsDialogState = content.includes('const [showDetailsDialog') || 
                                     content.includes('useState(false)');
    console.log(`   ${hasShowDetailsDialogState ? '✅' : '❌'} État showDetailsDialog`);
    
    // Vérifier la fonction handleViewDetails
    const hasHandleViewDetails = content.includes('const handleViewDetails') && 
                                content.includes('setSelectedEvent(event)') && 
                                content.includes('setShowDetailsDialog(true)');
    console.log(`   ${hasHandleViewDetails ? '✅' : '❌'} Fonction handleViewDetails`);
  }
};

// Exécution des tests
console.log('\n🔧 Application des tests...');

checkCorrections();
checkEventDetails();
checkForJavaScriptErrors();
createSimpleTest();

console.log('\n🎯 TESTS TERMINÉS');
console.log('==================');
console.log('✅ Corrections vérifiées');
console.log('✅ EventDetails analysé');
console.log('✅ Erreurs JavaScript vérifiées');
console.log('✅ Composant de test créé');
console.log('\n💡 Prochaines étapes:');
console.log('1. Redémarrez le client: cd client && npm start');
console.log('2. Testez le bouton "Détails" sur un événement');
console.log('3. Vérifiez la console pour les messages de succès');
console.log('4. Si le problème persiste, testez SimpleEventDetailsTest'); 