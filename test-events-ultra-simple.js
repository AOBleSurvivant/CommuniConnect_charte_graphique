const axios = require('axios');

async function testUltraSimple() {
  console.log('🔍 TEST ULTRA SIMPLE - ÉVÉNEMENTS');
  
  try {
    // Test avec données minimales mais valides
    const data = {
      title: 'Test Event Title',
      description: 'Test description for the event',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2025-08-01T10:00:00.000Z',
      endDate: '2025-08-01T12:00:00.000Z',
      startTime: '10:00',
      endTime: '12:00',
      latitude: 9.5144,
      longitude: -13.6783,
      venue: 'Test Venue',
      address: 'Test Address Location'
    };
    
    console.log('📤 Envoi...');
    const response = await axios.post('http://localhost:5000/api/events', data);
    console.log('✅ Succès:', response.data);
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.status);
    console.log('📋 Message:', error.response?.data);
    
    if (error.response?.data?.details) {
      console.log('🔍 Détails:', error.response.data.details);
    }
  }
}

testUltraSimple(); 