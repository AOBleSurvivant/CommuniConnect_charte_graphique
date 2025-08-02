const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEventCreation() {
  console.log('🔍 TEST DÉBOGAGE ÉVÉNEMENTS - VERSION SIMPLE');
  
  try {
    // Test 1: Vérifier que le serveur répond
    console.log('\n📡 Test 1: Vérification du serveur...');
    const response1 = await axios.get(`${BASE_URL}/events`);
    console.log('✅ Serveur accessible, événements récupérés:', response1.data.data.events.length);
    
    // Test 2: Créer un événement avec données minimales
    console.log('\n📝 Test 2: Création événement minimal...');
    const eventData = {
      title: 'Test Simple',
      description: 'Description de test simple',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2025-08-01T10:00:00.000Z',
      endDate: '2025-08-01T12:00:00.000Z',
      startTime: '10:00',
      endTime: '12:00',
      latitude: 9.5144,
      longitude: -13.6783,
      venue: 'Test Venue',
      address: 'Test Address'
    };
    
    console.log('📤 Envoi des données:', JSON.stringify(eventData, null, 2));
    
    const response2 = await axios.post(`${BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Événement créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response2.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERREUR DÉTECTÉE:');
    console.log('📊 Status:', error.response?.status);
    console.log('📋 Message:', error.response?.data);
    console.log('🔍 Headers:', error.response?.headers);
    console.log('📝 Stack:', error.stack);
    
    if (error.response?.data?.error) {
      console.log('🐛 Erreur détaillée:', error.response.data.error);
    }
  }
}

testEventCreation(); 