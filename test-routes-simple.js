const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRoutes() {
  console.log('🧪 Test des routes CommuniConnect');
  console.log('================================');
  
  try {
    // Test de santé
    console.log('\n1. Test de santé du serveur...');
    const health = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Serveur accessible');
    
    // Test des routes principales
    const routes = [
      '/events',
      '/alerts', 
      '/posts',
      '/livestreams',
      '/livestreams/live',
      '/livestreams/scheduled',
      '/livestreams/alerts',
      '/notifications',
      '/stats'
    ];
    
    console.log('\n2. Test des routes publiques...');
    for (const route of routes) {
      try {
        const response = await axios.get(`${API_BASE_URL}${route}`);
        console.log(`✅ ${route} - OK`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`⚠️ ${route} - Nécessite authentification`);
        } else {
          console.log(`❌ ${route} - Erreur: ${error.response?.status || error.message}`);
        }
      }
    }
    
    // Test des routes avec paramètres
    console.log('\n3. Test des routes avec paramètres...');
    const routesWithParams = [
      '/events/nearby?latitude=9.5370&longitude=-13.6785&radius=10',
      '/alerts/nearby?latitude=9.5370&longitude=-13.6785&radius=10',
      '/alerts/urgent'
    ];
    
    for (const route of routesWithParams) {
      try {
        const response = await axios.get(`${API_BASE_URL}${route}`);
        console.log(`✅ ${route} - OK`);
      } catch (error) {
        console.log(`❌ ${route} - Erreur: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n✅ Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testRoutes();