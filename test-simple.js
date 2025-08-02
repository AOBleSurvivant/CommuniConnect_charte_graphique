const axios = require('axios');

async function testServer() {
  console.log('🧪 Test simple du serveur CommuniConnect');
  console.log('==========================================');
  
  try {
    // Test de santé
    console.log('\n1. Test de santé...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Serveur accessible:', health.data.message);
    
    // Test des routes principales
    console.log('\n2. Test des routes principales...');
    const routes = ['/events', '/alerts', '/posts', '/livestreams'];
    
    for (const route of routes) {
      try {
        const response = await axios.get(`http://localhost:5000/api${route}`);
        console.log(`✅ ${route} - OK (${response.data.data?.length || 0} éléments)`);
      } catch (error) {
        console.log(`❌ ${route} - Erreur: ${error.response?.status || error.message}`);
      }
    }
    
    // Test des routes avec paramètres
    console.log('\n3. Test des routes avec paramètres...');
    const paramRoutes = [
      '/events/nearby?latitude=9.5370&longitude=-13.6785&radius=10',
      '/alerts/nearby?latitude=9.5370&longitude=-13.6785&radius=10',
      '/alerts/urgent'
    ];
    
    for (const route of paramRoutes) {
      try {
        const response = await axios.get(`http://localhost:5000/api${route}`);
        console.log(`✅ ${route} - OK`);
      } catch (error) {
        console.log(`❌ ${route} - Erreur: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n✅ Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testServer(); 