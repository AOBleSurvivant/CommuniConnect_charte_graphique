#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE TEST AUTOMATIQUE COMPLET - COMMUNICONNECT
 * 
 * Ce script exécute automatiquement tous les tests sans interaction
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let currentUser = null;

// Couleurs pour l'affichage
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logHeader(message) {
  log(`\n${message}`, 'magenta');
  log('='.repeat(message.length), 'magenta');
}

// Fonctions de test
async function testAuthentification() {
  logHeader('🔐 TEST D\'AUTHENTIFICATION');
  
  try {
    // Test d'inscription
    logInfo('1. Test d\'inscription...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@communiconnect.com`,
      password: 'password123',
      phone: '22412345678',
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      address: '123 Rue Test, Conakry',
      latitude: 9.5370,
      longitude: -13.6785
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    logSuccess(`Inscription réussie: ${registerData.username}`);
    
    // Test de connexion
    logInfo('2. Test de connexion...');
    const loginData = {
      identifier: registerData.email,
      password: registerData.password
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    authToken = loginResponse.data.token;
    currentUser = loginResponse.data.user;
    
    logSuccess(`Connexion réussie: ${currentUser.username}`);
    logInfo(`Token JWT reçu: ${authToken.substring(0, 20)}...`);
    
    return true;
  } catch (error) {
    logError(`Erreur d'authentification: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testProfilUtilisateur() {
  logHeader('👤 TEST PROFIL UTILISATEUR');
  
  if (!authToken) {
    logWarning('Token d\'authentification requis');
    return false;
  }
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    
    // Test récupération profil
    logInfo('1. Récupération du profil utilisateur...');
    const profileResponse = await axios.get(`${BASE_URL}/users/${currentUser._id}`, { headers });
    logSuccess(`Profil récupéré: ${profileResponse.data.user.username}`);
    
    // Test recherche utilisateurs
    logInfo('2. Test de recherche d\'utilisateurs...');
    const searchResponse = await axios.get(`${BASE_URL}/users/search?q=test`, { headers });
    logSuccess(`Recherche effectuée: ${searchResponse.data.users?.length || 0} résultats`);
    
    // Test statistiques utilisateur
    logInfo('3. Test des statistiques utilisateur...');
    const statsResponse = await axios.get(`${BASE_URL}/users/${currentUser._id}/stats`, { headers });
    logSuccess('Statistiques récupérées');
    
    return true;
  } catch (error) {
    logError(`Erreur profil utilisateur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGeolocalisation() {
  logHeader('🗺️  TEST GÉOLOCALISATION');
  
  try {
    // Test recherche à proximité (public)
    logInfo('1. Test de recherche à proximité...');
    const nearbyResponse = await axios.get(`${BASE_URL}/location/nearby?latitude=9.5370&longitude=-13.6785&radius=10`);
    logSuccess(`Recherche proximité: ${nearbyResponse.data.users?.length || 0} utilisateurs, ${nearbyResponse.data.events?.length || 0} événements`);
    
    // Test mise à jour position (authentifié)
    if (authToken) {
      logInfo('2. Test de mise à jour de position...');
      const updateData = {
        latitude: 9.5370,
        longitude: -13.6785,
        address: 'Conakry, Guinée'
      };
      
      const updateResponse = await axios.post(`${BASE_URL}/location/update`, updateData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess('Position mise à jour');
    }
    
    // Test géocodage
    logInfo('3. Test de géocodage...');
    const geocodeResponse = await axios.get(`${BASE_URL}/location/geocode?address=Conakry, Guinée`);
    logSuccess('Géocodage réussi');
    
    // Test régions
    logInfo('4. Test des régions de Guinée...');
    const regionsResponse = await axios.get(`${BASE_URL}/location/regions`);
    logSuccess(`Régions récupérées: ${regionsResponse.data.regions?.length || 0} régions`);
    
    return true;
  } catch (error) {
    logError(`Erreur géolocalisation: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testEvenements() {
  logHeader('🎉 TEST ÉVÉNEMENTS');
  
  try {
    // Test calendrier (public)
    logInfo('1. Test du calendrier d\'événements...');
    const calendarResponse = await axios.get(`${BASE_URL}/events/calendar`);
    logSuccess(`Calendrier récupéré: ${calendarResponse.data.events?.length || 0} événements`);
    
    // Test recommandations (public)
    logInfo('2. Test des recommandations d\'événements...');
    const recommendationsResponse = await axios.get(`${BASE_URL}/events/recommendations`);
    logSuccess(`Recommandations récupérées: ${recommendationsResponse.data.events?.length || 0} événements`);
    
          // Test création d'événement (authentifié)
      if (authToken) {
        logInfo('3. Test de création d\'événement...');
        const eventData = {
          title: 'Test Event ' + Date.now(),
          description: 'Événement de test pour CommuniConnect',
          type: 'reunion',
          category: 'communautaire',
          startDate: new Date(Date.now() + 86400000).toISOString(), // Demain
          endDate: new Date(Date.now() + 86400000 + 7200000).toISOString(), // Demain + 2h
          startTime: '14:00',
          endTime: '16:00',
          venue: 'Centre Culturel Conakry',
          address: '123 Rue Test, Conakry, Guinée',
          latitude: 9.5370,
          longitude: -13.6785,
          capacity: 50,
          isFree: true,
          tags: ['test', 'communautaire']
        };
      
              const createResponse = await axios.post(`${BASE_URL}/events`, eventData, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        logSuccess(`Événement créé: ${createResponse.data.data.title}`);
      
              // Test participation
        logInfo('4. Test de participation à l\'événement...');
        const participateResponse = await axios.post(`${BASE_URL}/events/${createResponse.data.data._id}/participate`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      logSuccess('Participation enregistrée');
    }
    
    return true;
  } catch (error) {
    logError(`Erreur événements: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testModeration() {
  logHeader('🛡️  TEST MODÉRATION');
  
  try {
          // Test signalement (authentifié)
      if (authToken) {
        logInfo('1. Test de signalement de contenu...');
        const reportData = {
          targetType: 'event',
          targetId: 'test-event-id',
          reason: 'inappropriate',
          description: 'Test de signalement de contenu inapproprié'
        };
      
      const reportResponse = await axios.post(`${BASE_URL}/moderation/report`, reportData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess('Signalement enregistré');
    }
    
    // Test statistiques modération (authentifié)
    if (authToken) {
      logInfo('2. Test des statistiques de modération...');
      const statsResponse = await axios.get(`${BASE_URL}/moderation/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess('Statistiques de modération récupérées');
    } else {
      logWarning('Token d\'authentification requis pour les statistiques de modération');
    }
    
    // Test filtres automatiques (authentifié)
    if (authToken) {
      logInfo('3. Test des filtres automatiques...');
      const filtersResponse = await axios.get(`${BASE_URL}/moderation/filters`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess('Filtres automatiques récupérés');
    } else {
      logWarning('Token d\'authentification requis pour les filtres automatiques');
    }
    
    return true;
  } catch (error) {
    logError(`Erreur modération: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testPerformance() {
  logHeader('⚡ TEST DE PERFORMANCE');
  
  const endpoints = [
    { name: 'Profil utilisateur', url: '/users/test', method: 'GET' },
    { name: 'Recherche utilisateurs', url: '/users/search?q=test', method: 'GET' },
    { name: 'Géolocalisation proximité', url: '/location/nearby?latitude=9.5370&longitude=-13.6785', method: 'GET' },
    { name: 'Régions', url: '/location/regions', method: 'GET' },
    { name: 'Calendrier événements', url: '/events/calendar', method: 'GET' },
    { name: 'Recommandations événements', url: '/events/recommendations', method: 'GET' }
  ];
  
  let successCount = 0;
  const startTime = Date.now();
  
  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      await axios.get(`${BASE_URL}${endpoint.url}`);
      const duration = Date.now() - start;
      
      logSuccess(`${endpoint.name}: ${duration}ms`);
      successCount++;
    } catch (error) {
      logError(`${endpoint.name}: Échec`);
    }
  }
  
  const totalTime = Date.now() - startTime;
  const avgTime = totalTime / endpoints.length;
  
  log('\n📊 RÉSULTATS DE PERFORMANCE:', 'magenta');
  log(`✅ Tests réussis: ${successCount}/${endpoints.length}`, 'green');
  log(`⏱️  Temps total: ${totalTime}ms`, 'blue');
  log(`⚡ Temps moyen: ${avgTime.toFixed(2)}ms`, 'blue');
  
  return successCount === endpoints.length;
}

// Vérification de la connectivité
async function checkServer() {
  try {
    logInfo('Vérification de la connectivité au serveur...');
    await axios.get(`${BASE_URL}/health`);
    logSuccess('Serveur accessible');
    return true;
  } catch (error) {
    logError('Serveur inaccessible. Assurez-vous que le serveur est démarré sur le port 5000.');
    return false;
  }
}

// Exécution de tous les tests
async function runAllTests() {
  logHeader('🧪 LANCEMENT DE TOUS LES TESTS AUTOMATIQUES');
  
  const tests = [
    { name: 'Authentification', fn: testAuthentification },
    { name: 'Profil Utilisateur', fn: testProfilUtilisateur },
    { name: 'Géolocalisation', fn: testGeolocalisation },
    { name: 'Événements', fn: testEvenements },
    { name: 'Modération', fn: testModeration },
    { name: 'Performance', fn: testPerformance }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    logInfo(`\n🔍 Test: ${test.name}`);
    try {
      const result = await test.fn();
      if (result) {
        logSuccess(`${test.name}: RÉUSSI`);
        successCount++;
      } else {
        logError(`${test.name}: ÉCHEC`);
      }
    } catch (error) {
      logError(`${test.name}: ERREUR - ${error.message}`);
    }
  }
  
  logHeader('📊 RÉSULTATS FINAUX');
  log(`✅ Tests réussis: ${successCount}/${tests.length}`, 'green');
  log(`📈 Taux de succès: ${((successCount / tests.length) * 100).toFixed(1)}%`, 'blue');
  
  if (successCount === tests.length) {
    log('🎉 TOUS LES TESTS SONT RÉUSSIS !', 'green');
  } else {
    log('⚠️  Certains tests ont échoué', 'yellow');
  }
  
  return successCount;
}

// Point d'entrée
async function main() {
  log('🧪 SCRIPT DE TEST AUTOMATIQUE COMPLET - COMMUNICONNECT', 'magenta');
  log('====================================================', 'magenta');
  log('Ce script exécute automatiquement tous les tests sans interaction', 'blue');
  
  const serverOk = await checkServer();
  if (!serverOk) {
    logError('Impossible de continuer sans serveur accessible');
    process.exit(1);
  }
  
  const successCount = await runAllTests();
  
  logHeader('🎯 RÉSUMÉ FINAL');
  log(`📊 Tests exécutés: ${successCount}/6`, 'blue');
  log(`🚀 Performance: ${successCount >= 4 ? 'EXCELLENTE' : successCount >= 2 ? 'BONNE' : 'À AMÉLIORER'}`, 'green');
  log(`🎉 CommuniConnect est ${successCount === 6 ? 'PRÊT POUR LA PRODUCTION' : 'EN DÉVELOPPEMENT'}`, 'magenta');
  
  process.exit(successCount === 6 ? 0 : 1);
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  logError(`Erreur non gérée: ${error.message}`);
  process.exit(1);
});

// Lancement
if (require.main === module) {
  main().catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testAuthentification,
  testProfilUtilisateur,
  testGeolocalisation,
  testEvenements,
  testModeration,
  testPerformance,
  runAllTests
}; 