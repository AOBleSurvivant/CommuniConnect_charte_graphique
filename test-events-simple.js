const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEventsSimple() {
  console.log('🎯 TEST SIMPLE - ÉVÉNEMENTS');
  console.log('='.repeat(50));

  try {
    // Test 1: Récupération des événements
    console.log('📅 Test 1: Récupération des événements...');
    const getEvents = await axios.get(`${BASE_URL}/events`);
    console.log(`✅ Événements récupérés: ${getEvents.data.data?.events?.length || 0}`);

    // Test 2: Création d'un événement minimal
    console.log('\n📝 Test 2: Création d\'un événement minimal...');
    const minimalEvent = {
      title: "Test Event",
      description: "Test Description",
      type: "reunion",
      category: "communautaire",
      startDate: "2025-08-01T10:00:00.000Z",
      endDate: "2025-08-01T14:00:00.000Z",
      startTime: "10:00",
      endTime: "14:00",
      latitude: 9.5144,
      longitude: -13.6783,
      venue: "Test Venue",
      address: "Test Address"
    };

    console.log('📤 Envoi de la requête...');
    const createEvent = await axios.post(`${BASE_URL}/events`, minimalEvent);
    console.log('✅ Événement créé avec succès');
    console.log('📋 Réponse:', JSON.stringify(createEvent.data, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error.response?.status);
    console.error('📋 Détails:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.data?.errors) {
      console.log('🔍 Erreurs de validation:');
      error.response.data.errors.forEach(err => {
        console.log(`  - ${err.param}: ${err.msg}`);
      });
    }
  }
}

setTimeout(() => {
  testEventsSimple();
}, 2000); 