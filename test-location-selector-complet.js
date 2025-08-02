const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Données de test
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+22412345678',
  password: 'password123',
  region: 'Conakry',
  prefecture: 'Conakry',
  commune: 'Kaloum',
  quartier: 'Centre',
  address: 'Centre, Kaloum, Conakry, Guinée',
  latitude: 9.5370,
  longitude: -13.6785
};

let authToken = null;

// Fonction pour faire des requêtes authentifiées
const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      ...(data && { data })
    };
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test 1: Inscription avec LocationSelector
const testRegistrationWithLocation = async () => {
  console.log('\n🔍 Test 1: Inscription avec LocationSelector');
  
  try {
    const response = await makeAuthenticatedRequest('POST', '/auth/register', testUser);
    console.log('✅ Inscription réussie avec localisation');
    console.log('📍 Données de localisation:', {
      region: response.user.region,
      prefecture: response.user.prefecture,
      commune: response.user.commune,
      quartier: response.user.quartier,
      address: response.user.address
    });
    return response.user;
  } catch (error) {
    console.log('❌ Échec de l\'inscription');
    return null;
  }
};

// Test 2: Connexion et récupération des données utilisateur
const testLoginAndUserData = async () => {
  console.log('\n🔍 Test 2: Connexion et données utilisateur');
  
  try {
    const loginResponse = await makeAuthenticatedRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = loginResponse.token;
    console.log('✅ Connexion réussie');
    
    const userResponse = await makeAuthenticatedRequest('GET', '/auth/me');
    console.log('✅ Données utilisateur récupérées');
    console.log('📍 Localisation actuelle:', {
      region: userResponse.user.region,
      prefecture: userResponse.user.prefecture,
      commune: userResponse.user.commune,
      quartier: userResponse.user.quartier,
      address: userResponse.user.address
    });
    
    return userResponse.user;
  } catch (error) {
    console.log('❌ Échec de la connexion');
    return null;
  }
};

// Test 3: Création d'événement avec LocationSelector
const testCreateEventWithLocation = async () => {
  console.log('\n🔍 Test 3: Création d\'événement avec LocationSelector');
  
  try {
    const eventData = {
      title: 'Test Event avec LocationSelector',
      description: 'Événement de test avec localisation complète',
      type: 'meeting',
      category: 'communautaire',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      startTime: '18:00',
      endTime: '20:00',
      venue: 'Salle communale',
      address: 'Centre, Kaloum, Conakry, Guinée',
      latitude: 9.5370,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' },
      tags: ['test', 'location'],
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
    
    const response = await makeAuthenticatedRequest('POST', '/events', eventData);
    console.log('✅ Événement créé avec succès');
    console.log('📍 Localisation de l\'événement:', response.event.location);
    
    return response.event;
  } catch (error) {
    console.log('❌ Échec de la création d\'événement');
    return null;
  }
};

// Test 4: Création d'alerte avec LocationSelector
const testCreateAlertWithLocation = async () => {
  console.log('\n🔍 Test 4: Création d\'alerte avec LocationSelector');
  
  try {
    const alertData = {
      title: 'Test Alerte avec LocationSelector',
      description: 'Alerte de test avec localisation complète',
      type: 'security',
      severity: 'medium',
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      address: 'Centre, Kaloum, Conakry, Guinée',
      latitude: 9.5370,
      longitude: -13.6785
    };
    
    const response = await makeAuthenticatedRequest('POST', '/alerts', alertData);
    console.log('✅ Alerte créée avec succès');
    console.log('📍 Localisation de l\'alerte:', {
      region: response.alert.region,
      prefecture: response.alert.prefecture,
      commune: response.alert.commune,
      quartier: response.alert.quartier,
      address: response.alert.address
    });
    
    return response.alert;
  } catch (error) {
    console.log('❌ Échec de la création d\'alerte');
    return null;
  }
};

// Test 5: Création de post avec LocationSelector
const testCreatePostWithLocation = async () => {
  console.log('\n🔍 Test 5: Création de post avec LocationSelector');
  
  try {
    const postData = {
      content: 'Post de test avec LocationSelector',
      type: 'community',
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
      },
      isPublic: true
    };
    
    const response = await makeAuthenticatedRequest('POST', '/posts', postData);
    console.log('✅ Post créé avec succès');
    console.log('📍 Localisation du post:', response.post.location);
    
    return response.post;
  } catch (error) {
    console.log('❌ Échec de la création de post');
    return null;
  }
};

// Test 6: Création de livestream avec LocationSelector
const testCreateLivestreamWithLocation = async () => {
  console.log('\n🔍 Test 6: Création de livestream avec LocationSelector');
  
  try {
    const livestreamData = {
      title: 'Test Livestream avec LocationSelector',
      description: 'Livestream de test avec localisation complète',
      type: 'community',
      urgency: 'medium',
      visibility: 'quartier',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      address: 'Centre, Kaloum, Conakry, Guinée',
      latitude: 9.5370,
      longitude: -13.6785
    };
    
    const response = await makeAuthenticatedRequest('POST', '/livestreams', livestreamData);
    console.log('✅ Livestream créé avec succès');
    console.log('📍 Localisation du livestream:', response.livestream.location);
    
    return response.livestream;
  } catch (error) {
    console.log('❌ Échec de la création de livestream');
    return null;
  }
};

// Test 7: Validation des données géographiques
const testGeographicDataValidation = async () => {
  console.log('\n🔍 Test 7: Validation des données géographiques');
  
  try {
    const response = await makeAuthenticatedRequest('GET', '/locations/guinea-geography');
    console.log('✅ Données géographiques récupérées');
    console.log('📊 Statistiques:', {
      regions: response.data?.regions?.length || 0,
      prefectures: response.data?.prefectures?.length || 0,
      communes: response.data?.communes?.length || 0,
      quartiers: response.data?.quartiers?.length || 0
    });
    
    return response.data;
  } catch (error) {
    console.log('❌ Échec de la récupération des données géographiques');
    return null;
  }
};

// Test 8: Test de validation de localisation
const testLocationValidation = async () => {
  console.log('\n🔍 Test 8: Test de validation de localisation');
  
  try {
    const validLocation = {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      address: 'Centre, Kaloum, Conakry, Guinée',
      latitude: 9.5370,
      longitude: -13.6785
    };
    
    const response = await makeAuthenticatedRequest('POST', '/locations/validate', validLocation);
    console.log('✅ Validation de localisation réussie');
    console.log('📍 Localisation validée:', response.location);
    
    return response;
  } catch (error) {
    console.log('❌ Échec de la validation de localisation');
    return null;
  }
};

// Test principal
const runAllTests = async () => {
  console.log('🚀 DÉBUT DES TESTS LOCATIONSELECTOR COMPLET');
  console.log('=' .repeat(50));
  
  const results = {
    registration: false,
    login: false,
    event: false,
    alert: false,
    post: false,
    livestream: false,
    geographicData: false,
    locationValidation: false
  };
  
  try {
    // Test 1: Inscription
    const user = await testRegistrationWithLocation();
    results.registration = !!user;
    
    // Test 2: Connexion
    const loggedUser = await testLoginAndUserData();
    results.login = !!loggedUser;
    
    // Test 3: Événement
    const event = await testCreateEventWithLocation();
    results.event = !!event;
    
    // Test 4: Alerte
    const alert = await testCreateAlertWithLocation();
    results.alert = !!alert;
    
    // Test 5: Post
    const post = await testCreatePostWithLocation();
    results.post = !!post;
    
    // Test 6: Livestream
    const livestream = await testCreateLivestreamWithLocation();
    results.livestream = !!livestream;
    
    // Test 7: Données géographiques
    const geoData = await testGeographicDataValidation();
    results.geographicData = !!geoData;
    
    // Test 8: Validation de localisation
    const validation = await testLocationValidation();
    results.locationValidation = !!validation;
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
  
  // Résumé des résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('=' .repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`📈 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Détail des tests:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'RÉUSSI' : 'ÉCHOUÉ'}`);
  });
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS !');
    console.log('🚀 Le LocationSelector est complètement opérationnel !');
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  return results;
};

// Exécuter les tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };