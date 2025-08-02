const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC BOUTON DÉTAILS ÉVÉNEMENTS');
console.log('==========================================');

// Vérifier les fichiers clés
const filesToCheck = [
  'client/src/pages/Events/EventsPage.js',
  'client/src/components/Events/EventDetails.js',
  'client/src/components/Events/EventCard.js'
];

console.log('\n📁 Vérification des fichiers:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Analyser EventsPage.js
const eventsPagePath = 'client/src/pages/Events/EventsPage.js';
if (fs.existsSync(eventsPagePath)) {
  const content = fs.readFileSync(eventsPagePath, 'utf8');
  
  console.log('\n🔍 Analyse de EventsPage.js:');
  
  // Vérifier la fonction handleViewDetails
  const hasHandleViewDetails = content.includes('handleViewDetails');
  console.log(`   ${hasHandleViewDetails ? '✅' : '❌'} Fonction handleViewDetails`);
  
  // Vérifier le bouton Détails
  const hasDetailsButton = content.includes('Détails') && content.includes('handleViewDetails');
  console.log(`   ${hasDetailsButton ? '✅' : '❌'} Bouton Détails avec handleViewDetails`);
  
  // Vérifier le dialog de détails
  const hasDetailsDialog = content.includes('showDetailsDialog') && content.includes('EventDetails');
  console.log(`   ${hasDetailsDialog ? '✅' : '❌'} Dialog de détails avec EventDetails`);
  
  // Vérifier les imports nécessaires
  const hasEventDetailsImport = content.includes('EventDetails');
  console.log(`   ${hasDetailsDialog ? '✅' : '❌'} Import EventDetails`);
  
  // Vérifier les états
  const hasSelectedEventState = content.includes('selectedEvent') && content.includes('useState');
  console.log(`   ${hasSelectedEventState ? '✅' : '❌'} État selectedEvent`);
  
  const hasShowDetailsDialogState = content.includes('showDetailsDialog') && content.includes('useState');
  console.log(`   ${hasShowDetailsDialogState ? '✅' : '❌'} État showDetailsDialog`);
}

// Analyser EventDetails.js
const eventDetailsPath = 'client/src/components/Events/EventDetails.js';
if (fs.existsSync(eventDetailsPath)) {
  const content = fs.readFileSync(eventDetailsPath, 'utf8');
  
  console.log('\n🔍 Analyse de EventDetails.js:');
  
  // Vérifier l'export du composant
  const hasExport = content.includes('export default EventDetails');
  console.log(`   ${hasExport ? '✅' : '❌'} Export EventDetails`);
  
  // Vérifier les props
  const hasEventProp = content.includes('event') && content.includes('props');
  console.log(`   ${hasEventProp ? '✅' : '❌'} Prop event`);
  
  // Vérifier le rendu conditionnel
  const hasConditionalRender = content.includes('if (!event) return null');
  console.log(`   ${hasConditionalRender ? '✅' : '❌'} Rendu conditionnel`);
  
  // Vérifier les imports Material-UI
  const hasMuiImports = content.includes('@mui/material') && content.includes('@mui/icons-material');
  console.log(`   ${hasMuiImports ? '✅' : '❌'} Imports Material-UI`);
}

// Créer un test simple pour vérifier le bouton
const createTestComponent = () => {
  const testComponent = `import React, { useState } from 'react';
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
`;

  fs.writeFileSync('client/src/components/Events/TestEventDetails.js', testComponent);
  console.log('\n✅ Composant de test TestEventDetails créé');
};

// Vérifier les erreurs potentielles
const checkForErrors = () => {
  console.log('\n🔍 Vérification des erreurs potentielles:');
  
  // Vérifier si EventDetails est bien importé dans EventsPage
  const eventsPagePath = 'client/src/pages/Events/EventsPage.js';
  if (fs.existsSync(eventsPagePath)) {
    const content = fs.readFileSync(eventsPagePath, 'utf8');
    
    // Vérifier l'import d'EventDetails
    const hasEventDetailsImport = content.includes('import EventDetails') || 
                                 content.includes('from \'../components/Events/EventDetails\'');
    console.log(`   ${hasEventDetailsImport ? '✅' : '❌'} Import EventDetails dans EventsPage`);
    
    // Vérifier l'utilisation d'EventDetails dans le JSX
    const hasEventDetailsUsage = content.includes('<EventDetails') && content.includes('event={selectedEvent}');
    console.log(`   ${hasEventDetailsUsage ? '✅' : '❌'} Utilisation EventDetails dans JSX`);
    
    // Vérifier la gestion des états
    const hasStateManagement = content.includes('useState') && 
                              content.includes('selectedEvent') && 
                              content.includes('showDetailsDialog');
    console.log(`   ${hasStateManagement ? '✅' : '❌'} Gestion des états pour le dialog`);
  }
  
  // Vérifier EventDetails.js
  const eventDetailsPath = 'client/src/components/Events/EventDetails.js';
  if (fs.existsSync(eventDetailsPath)) {
    const content = fs.readFileSync(eventDetailsPath, 'utf8');
    
    // Vérifier la structure du composant
    const hasComponentStructure = content.includes('const EventDetails') && 
                                 content.includes('return (') &&
                                 content.includes('export default');
    console.log(`   ${hasComponentStructure ? '✅' : '❌'} Structure du composant EventDetails`);
    
    // Vérifier les props
    const hasProps = content.includes('event') && content.includes('props');
    console.log(`   ${hasProps ? '✅' : '❌'} Props du composant EventDetails`);
  }
};

// Exécution du diagnostic
console.log('\n🔧 Application du diagnostic...');

checkForErrors();
createTestComponent();

console.log('\n🎯 DIAGNOSTIC TERMINÉ');
console.log('========================');
console.log('✅ Analyse des fichiers terminée');
console.log('✅ Composant de test créé');
console.log('\n💡 Prochaines étapes:');
console.log('1. Vérifiez la console du navigateur pour les erreurs JavaScript');
console.log('2. Testez le composant TestEventDetails');
console.log('3. Vérifiez que EventDetails est bien importé dans EventsPage');
console.log('4. Vérifiez que les états selectedEvent et showDetailsDialog sont bien définis'); 