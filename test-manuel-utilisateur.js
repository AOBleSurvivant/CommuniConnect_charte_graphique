#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE TEST MANUEL UTILISATEUR - COMMUNICONNECT
 * 
 * Ce script permet de tester manuellement toutes les fonctionnalités
 * utilisateur de CommuniConnect de manière interactive.
 */

const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let currentUser = null;

// Interface de ligne de commande
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Fonctions de test
async function testAuthentification() {
  log('\n🔐 TEST D\'AUTHENTIFICATION', 'cyan');
  log('============================', 'cyan');
  
  try {
    // Test d'inscription
    logInfo('1. Test d\'inscription...');
    const registerData = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@communiconnect.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    logSuccess(`Inscription réussie: ${registerData.username}`);
    
    // Test de connexion
    logInfo('2. Test de connexion...');
    const loginData = {
      email: registerData.email,
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
  log('\n👤 TEST PROFIL UTILISATEUR', 'cyan');
  log('============================', 'cyan');
  
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
  log('\n🗺️  TEST GÉOLOCALISATION', 'cyan');
  log('============================', 'cyan');
  
  try {
    // Test recherche à proximité (public)
    logInfo('1. Test de recherche à proximité...');
    const nearbyResponse = await axios.get(`${BASE_URL}/location/nearby?lat=9.5370&lng=-13.6785&radius=10`);
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
  log('\n🎉 TEST ÉVÉNEMENTS', 'cyan');
  log('============================', 'cyan');
  
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
        description: 'Événement de test',
        date: new Date(Date.now() + 86400000).toISOString(), // Demain
        location: 'Conakry, Guinée',
        latitude: 9.5370,
        longitude: -13.6785
      };
      
      const createResponse = await axios.post(`${BASE_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess(`Événement créé: ${createResponse.data.event.title}`);
      
      // Test participation
      logInfo('4. Test de participation à l\'événement...');
      const participateResponse = await axios.post(`${BASE_URL}/events/${createResponse.data.event._id}/participate`, {}, {
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
  log('\n🛡️  TEST MODÉRATION', 'cyan');
  log('============================', 'cyan');
  
  try {
    // Test signalement (authentifié)
    if (authToken) {
      logInfo('1. Test de signalement de contenu...');
      const reportData = {
        type: 'event',
        contentId: 'test-event-id',
        reason: 'Contenu inapproprié',
        description: 'Test de signalement'
      };
      
      const reportResponse = await axios.post(`${BASE_URL}/moderation/report`, reportData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logSuccess('Signalement enregistré');
    }
    
    // Test statistiques modération (public)
    logInfo('2. Test des statistiques de modération...');
    const statsResponse = await axios.get(`${BASE_URL}/moderation/stats`);
    logSuccess('Statistiques de modération récupérées');
    
    // Test filtres automatiques (public)
    logInfo('3. Test des filtres automatiques...');
    const filtersResponse = await axios.get(`${BASE_URL}/moderation/filters`);
    logSuccess('Filtres automatiques récupérés');
    
    return true;
  } catch (error) {
    logError(`Erreur modération: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testPerformance() {
  log('\n⚡ TEST DE PERFORMANCE', 'cyan');
  log('============================', 'cyan');
  
  const endpoints = [
    { name: 'Profil utilisateur', url: '/users/test', method: 'GET' },
    { name: 'Recherche utilisateurs', url: '/users/search?q=test', method: 'GET' },
    { name: 'Géolocalisation proximité', url: '/location/nearby?lat=9.5370&lng=-13.6785', method: 'GET' },
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

// Menu principal
async function showMenu() {
  log('\n🎯 MENU DE TEST MANUEL - COMMUNICONNECT', 'magenta');
  log('==========================================', 'magenta');
  log('1. 🔐 Test d\'authentification', 'yellow');
  log('2. 👤 Test profil utilisateur', 'yellow');
  log('3. 🗺️  Test géolocalisation', 'yellow');
  log('4. 🎉 Test événements', 'yellow');
  log('5. 🛡️  Test modération', 'yellow');
  log('6. ⚡ Test de performance', 'yellow');
  log('7. 🧪 Test complet (tous les tests)', 'yellow');
  log('8. 📊 Afficher les résultats', 'yellow');
  log('9. 🚪 Quitter', 'yellow');
  
  const choice = await question('\nChoisissez une option (1-9): ');
  
  switch (choice) {
    case '1':
      await testAuthentification();
      break;
    case '2':
      await testProfilUtilisateur();
      break;
    case '3':
      await testGeolocalisation();
      break;
    case '4':
      await testEvenements();
      break;
    case '5':
      await testModeration();
      break;
    case '6':
      await testPerformance();
      break;
    case '7':
      await runAllTests();
      break;
    case '8':
      showResults();
      break;
    case '9':
      log('👋 Au revoir !', 'green');
      rl.close();
      return;
    default:
      logError('Option invalide');
  }
  
  await question('\nAppuyez sur Entrée pour continuer...');
  await showMenu();
}

async function runAllTests() {
  log('\n🧪 LANCEMENT DE TOUS LES TESTS', 'magenta');
  log('================================', 'magenta');
  
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
  
  log('\n📊 RÉSULTATS FINAUX:', 'magenta');
  log(`✅ Tests réussis: ${successCount}/${tests.length}`, 'green');
  log(`📈 Taux de succès: ${((successCount / tests.length) * 100).toFixed(1)}%`, 'blue');
  
  if (successCount === tests.length) {
    log('🎉 TOUS LES TESTS SONT RÉUSSIS !', 'green');
  } else {
    log('⚠️  Certains tests ont échoué', 'yellow');
  }
}

function showResults() {
  log('\n📊 ÉTAT ACTUEL', 'magenta');
  log('==============', 'magenta');
  log(`🔑 Token d'authentification: ${authToken ? '✅ Présent' : '❌ Absent'}`, authToken ? 'green' : 'red');
  log(`👤 Utilisateur connecté: ${currentUser ? currentUser.username : 'Aucun'}`, currentUser ? 'green' : 'red');
  log(`🌐 URL de base: ${BASE_URL}`, 'blue');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
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

// Point d'entrée
async function main() {
  log('🧪 SCRIPT DE TEST MANUEL - COMMUNICONNECT', 'magenta');
  log('==========================================', 'magenta');
  log('Ce script permet de tester manuellement toutes les fonctionnalités', 'blue');
  log('de CommuniConnect de manière interactive.', 'blue');
  
  const serverOk = await checkServer();
  if (!serverOk) {
    logError('Impossible de continuer sans serveur accessible');
    process.exit(1);
  }
  
  await showMenu();
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  logError(`Erreur non gérée: ${error.message}`);
});

process.on('SIGINT', () => {
  log('\n👋 Arrêt du script...', 'yellow');
  rl.close();
  process.exit(0);
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
  testPerformance
}; 