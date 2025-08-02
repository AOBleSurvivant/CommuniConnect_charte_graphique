const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Fonction pour obtenir un token d'authentification
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour tester la création d'événement avec debug
async function testEventCreation(token) {
  console.log('\n🔍 Test de création d\'événement avec debug');
  
  const eventData = {
    title: 'Test Event CommuniConnect',
    description: 'Événement de test pour vérifier les corrections',
    type: 'reunion',
    category: 'communautaire',
    startDate: '2024-12-25',
    endDate: '2024-12-25',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Centre-ville de Conakry',
    address: 'Centre-ville de Conakry',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 50,
    isFree: true,
    price: { amount: 0, currency: 'GNF' },
    contactPhone: '22412345678',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      address: 'Centre-ville de Conakry',
      coordinates: {
        latitude: 9.5370,
        longitude: -13.6785
      }
    }
  };
  
  console.log('📤 Données envoyées:', JSON.stringify(eventData, null, 2));
  
  try {
    // Test 1: Vérifier si l'endpoint existe
    console.log('\n🔍 Test 1: Vérification de l\'endpoint /api/events');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Endpoint GET /api/events accessible');
    } catch (error) {
      console.log('❌ Endpoint GET /api/events non accessible:', error.response?.status);
    }
    
    // Test 2: Essayer POST /api/events
    console.log('\n🔍 Test 2: Tentative POST /api/events');
    const response = await axios.post(`${API_BASE_URL}/api/events`, eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Création d\'événement réussie:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création d\'événement:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    
    // Test 3: Essayer d'autres endpoints possibles
    console.log('\n🔍 Test 3: Test d\'autres endpoints possibles');
    
    const possibleEndpoints = [
      '/api/events/create',
      '/api/events/new',
      '/api/event',
      '/api/event/create'
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔍 Test de ${endpoint}`);
        const testResponse = await axios.post(`${API_BASE_URL}${endpoint}`, eventData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Endpoint ${endpoint} fonctionne!`);
        return true;
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} ne fonctionne pas:`, endpointError.response?.status);
      }
    }
    
    return false;
  }
}

// Fonction principale
async function runDebug() {
  console.log('🚀 Debug de la création d\'événements');
  console.log('=' .repeat(50));
  
  const token = await getAuthToken();
  if (!token) {
    console.error('❌ Impossible d\'obtenir le token d\'authentification');
    return;
  }
  
  console.log('✅ Authentification réussie');
  
  const result = await testEventCreation(token);
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSULTAT DU DEBUG');
  console.log('=' .repeat(50));
  console.log(`✅ Création d'événement: ${result ? 'SUCCÈS' : 'ÉCHEC'}`);
  
  if (result) {
    console.log('🎉 Le problème de création d\'événements est résolu !');
  } else {
    console.log('⚠️  Le problème de création d\'événements persiste');
  }
}

// Exécuter le debug
if (require.main === module) {
  runDebug().catch(console.error);
}

module.exports = { runDebug }; 