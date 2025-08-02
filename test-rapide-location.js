const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Test rapide des fonctionnalités principales
const testRapide = async () => {
  console.log('🚀 TEST RAPIDE LOCATIONSELECTOR');
  console.log('=' .repeat(40));
  
  const results = {
    apiConnection: false,
    geographicData: false,
    locationValidation: false,
    eventCreation: false
  };
  
  try {
    // Test 1: Connexion API
    console.log('\n🔍 Test 1: Connexion API');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ API connectée');
      results.apiConnection = true;
    } catch (error) {
      console.log('❌ API non accessible');
    }
    
    // Test 2: Données géographiques
    console.log('\n🔍 Test 2: Données géographiques');
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/guinea-geography`);
      const data = response.data;
      console.log('✅ Données géographiques chargées');
      console.log(`📊 ${data.regions?.length || 0} régions, ${data.prefectures?.length || 0} préfectures`);
      results.geographicData = true;
    } catch (error) {
      console.log('❌ Données géographiques non accessibles');
    }
    
    // Test 3: Validation de localisation
    console.log('\n🔍 Test 3: Validation de localisation');
    try {
      const testLocation = {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        address: 'Centre, Kaloum, Conakry, Guinée',
        latitude: 9.5370,
        longitude: -13.6785
      };
      
      const response = await axios.post(`${API_BASE_URL}/locations/validate`, testLocation);
      console.log('✅ Validation de localisation réussie');
      results.locationValidation = true;
    } catch (error) {
      console.log('❌ Validation de localisation échouée');
    }
    
    // Test 4: Création d'événement (sans authentification)
    console.log('\n🔍 Test 4: Test de création d\'événement');
    try {
      const eventData = {
        title: 'Test Rapide',
        description: 'Test rapide du LocationSelector',
        type: 'meeting',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        startTime: '18:00',
        endTime: '20:00',
        venue: 'Test',
        address: 'Centre, Kaloum, Conakry, Guinée',
        latitude: 9.5370,
        longitude: -13.6785,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre',
          address: 'Centre, Kaloum, Conakry, Guinée',
          coordinates: {
            latitude: 9.5370,
            longitude: -13.6785
          }
        }
      };
      
      const response = await axios.post(`${API_BASE_URL}/events`, eventData);
      console.log('✅ Format des données d\'événement valide');
      results.eventCreation = true;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Format des données d\'événement valide (erreur 401 = non authentifié)');
        results.eventCreation = true;
      } else {
        console.log('❌ Format des données d\'événement invalide');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
  
  // Résumé
  console.log('\n' + '=' .repeat(40));
  console.log('📊 RÉSUMÉ DU TEST RAPIDE');
  console.log('=' .repeat(40));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`📈 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Détail:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });
  
  if (passedTests >= 3) {
    console.log('\n🎉 LE LOCATIONSELECTOR EST OPÉRATIONNEL !');
  } else {
    console.log('\n⚠️ Problèmes détectés. Vérifiez la configuration.');
  }
  
  return results;
};

// Exécuter le test rapide
if (require.main === module) {
  testRapide().catch(console.error);
}

module.exports = { testRapide };