const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEventCreationDebug() {
  try {
    console.log('🧪 Test de création d\'événement avec débogage...');
    
    // Données similaires à celles envoyées par le frontend
    const eventData = {
      title: 'Test Création Événement',
      description: 'Test pour diagnostiquer le problème de création',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle de test',
      address: '123 Rue Test, Conakry',
      latitude: 9.537,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' },
      // Données de localisation qui causent des problèmes
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Porel',
        address: '123 Rue Test, Conakry',
        venue: 'Salle de test',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      }
    };

    console.log('📤 Données à envoyer:', JSON.stringify(eventData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Événement créé avec succès:');
    console.log('- ID:', response.data.data._id);
    console.log('- Titre:', response.data.data.title);
    console.log('- Statut:', response.data.data.status);

  } catch (error) {
    console.error('❌ Erreur lors de la création:');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.response?.data?.message);
    console.error('- Données:', error.response?.data);
    
    if (error.response?.data?.errors) {
      console.error('- Erreurs de validation:');
      error.response.data.errors.forEach(err => {
        console.error(`  * ${err.param}: ${err.msg}`);
      });
    }
  }
}

testEventCreationDebug(); 