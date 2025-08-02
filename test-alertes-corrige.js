const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const authToken = 'test-token-development';

async function testAlertesCorrige() {
  console.log('🧪 TEST CORRECTION ALERTES - COMMUNICONNECT');
  console.log('==================================================\n');

  // Test 1: Création d'alerte avec données minimales
  try {
    console.log('🚨 Test 1: Création alerte avec données minimales...');
    const alertResponse = await axios.post(`${API_BASE_URL}/alerts`, {
      title: 'Test alerte',
      description: 'Test de création d\'alerte',
      type: 'accident',
      category: 'circulation',
      priority: 'urgent'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (alertResponse.data.success) {
      console.log('✅ Alerte créée avec succès');
      console.log('📋 Détails:', alertResponse.data);
    } else {
      console.log('❌ Échec création alerte');
      console.log('📋 Erreur:', alertResponse.data);
    }
  } catch (error) {
    console.log('❌ Erreur création alerte:', error.response?.data || error.message);
  }

  // Test 2: Création d'alerte avec données complètes
  try {
    console.log('\n🚨 Test 2: Création alerte avec données complètes...');
    const alertResponse2 = await axios.post(`${API_BASE_URL}/alerts`, {
      title: 'Accident de circulation',
      description: 'Accident grave sur la route principale de Conakry',
      type: 'accident',
      category: 'circulation',
      priority: 'urgent',
      latitude: 9.5370,
      longitude: -13.6785,
      quartier: 'Centre',
      address: 'Route principale, Conakry',
      impactRadius: 5
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (alertResponse2.data.success) {
      console.log('✅ Alerte complète créée avec succès');
      console.log('📋 Détails:', alertResponse2.data);
    } else {
      console.log('❌ Échec création alerte complète');
      console.log('📋 Erreur:', alertResponse2.data);
    }
  } catch (error) {
    console.log('❌ Erreur création alerte complète:', error.response?.data || error.message);
  }

  // Test 3: Récupération des alertes
  try {
    console.log('\n📋 Test 3: Récupération des alertes...');
    const alertsResponse = await axios.get(`${API_BASE_URL}/alerts`);
    
    if (alertsResponse.data.success) {
      console.log('✅ Alertes récupérées avec succès');
      console.log('📊 Nombre d\'alertes:', alertsResponse.data.data?.alerts?.length || 0);
    } else {
      console.log('❌ Échec récupération alertes');
      console.log('📋 Erreur:', alertsResponse.data);
    }
  } catch (error) {
    console.log('❌ Erreur récupération alertes:', error.response?.data || error.message);
  }

  // Test 4: Test de validation des données
  try {
    console.log('\n🔍 Test 4: Test validation données...');
    const invalidResponse = await axios.post(`${API_BASE_URL}/alerts`, {
      title: 'T', // Trop court
      description: 'D', // Trop court
      type: 'invalid_type',
      category: 'invalid_category',
      priority: 'invalid_priority'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('❌ Test de validation échoué (attendu)');
    console.log('📋 Erreurs de validation:', invalidResponse.data);
  } catch (error) {
    console.log('✅ Validation fonctionne correctement');
    console.log('📋 Erreurs détectées:', error.response?.data?.errors || 'Aucune erreur spécifique');
  }

  console.log('\n==================================================');
  console.log('📊 RÉSULTATS DES TESTS ALERTES');
  console.log('==================================================');
  console.log('✅ Tests de validation et création d\'alertes terminés');
  console.log('🚀 CommuniConnect - Plateforme communautaire guinéenne');
}

// Exécuter le test
testAlertesCorrige().catch(console.error); 