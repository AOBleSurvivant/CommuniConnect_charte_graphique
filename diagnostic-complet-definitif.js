const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:3000';

// Couleurs pour la console
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

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Fonction pour tester une route API
const testRoute = async (method, endpoint, data = null) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 'TIMEOUT',
      message: error.response?.data?.message || error.message
    };
  }
};

// Fonction pour tester les événements spécifiquement
const testEvents = async () => {
  log('\n🔍 TEST SPÉCIAL - ÉVÉNEMENTS', 'cyan');
  
  // Test 1: Récupération des événements
  log('📅 Test 1: Récupération des événements...', 'yellow');
  const getEvents = await testRoute('GET', '/events');
  log(`   Résultat: ${getEvents.success ? '✅' : '❌'} ${getEvents.status}`, getEvents.success ? 'green' : 'red');
  
  if (!getEvents.success) {
    log(`   Erreur: ${getEvents.message}`, 'red');
  }

  // Test 2: Création d'un événement
  log('📝 Test 2: Création d\'un événement...', 'yellow');
  const eventData = {
    title: 'Test Event',
    description: 'Événement de test',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    location: 'Test Location',
    category: 'test'
  };
  
  const createEvent = await testRoute('POST', '/events', eventData);
  log(`   Résultat: ${createEvent.success ? '✅' : '❌'} ${createEvent.status}`, createEvent.success ? 'green' : 'red');
  
  if (!createEvent.success) {
    log(`   Erreur: ${createEvent.message}`, 'red');
  }

  // Test 3: Validation des données d'événement
  log('✅ Test 3: Validation des données...', 'yellow');
  const invalidEventData = {
    title: '', // Titre vide
    description: 'Test',
    date: 'invalid-date'
  };
  
  const validateEvent = await testRoute('POST', '/events', invalidEventData);
  log(`   Résultat: ${validateEvent.success ? '❌' : '✅'} ${validateEvent.status}`, validateEvent.success ? 'red' : 'green');
  
  if (validateEvent.success) {
    log(`   ⚠️  Validation échouée: L'événement invalide a été accepté`, 'yellow');
  } else {
    log(`   ✅ Validation fonctionne: L'événement invalide a été rejeté`, 'green');
  }
};

// Diagnostic complet
const runDiagnostic = async () => {
  log('🚀 DIAGNOSTIC COMPLET COMMUNICONNECT', 'bright');
  log('=====================================', 'bright');
  
  // Test de base - Santé de l'API
  log('\n🔍 Test 1: Santé de l\'API', 'cyan');
  const health = await testRoute('GET', '/health');
  log(`   API Health: ${health.success ? '✅' : '❌'} ${health.status}`, health.success ? 'green' : 'red');
  
  if (!health.success) {
    log('   ⚠️  Le serveur ne répond pas. Vérifiez qu\'il est démarré.', 'yellow');
    return;
  }

  // Test des routes principales
  log('\n🔍 Test 2: Routes principales', 'cyan');
  const routes = [
    { name: 'Authentification', endpoint: '/auth/login', method: 'POST' },
    { name: 'Posts', endpoint: '/posts', method: 'GET' },
    { name: 'Messages', endpoint: '/messages', method: 'GET' },
    { name: 'Alertes', endpoint: '/alerts', method: 'GET' },
    { name: 'Amis', endpoint: '/friends', method: 'GET' },
    { name: 'Notifications', endpoint: '/notifications', method: 'GET' },
    { name: 'Utilisateurs', endpoint: '/users', method: 'GET' },
    { name: 'Recherche', endpoint: '/search', method: 'GET' },
    { name: 'Statistiques', endpoint: '/stats', method: 'GET' }
  ];

  for (const route of routes) {
    const result = await testRoute(route.method, route.endpoint);
    const status = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`   ${route.name}: ${status} ${result.status}`, color);
    
    if (!result.success && result.status === 404) {
      log(`      ⚠️  Route non trouvée: ${route.endpoint}`, 'yellow');
    }
  }

  // Test spécial des événements
  await testEvents();

  // Test des livestreams
  log('\n🔍 Test 3: Livestreams', 'cyan');
  const livestreams = await testRoute('GET', '/livestreams');
  log(`   Livestreams: ${livestreams.success ? '✅' : '❌'} ${livestreams.status}`, livestreams.success ? 'green' : 'red');

  // Test de l'authentification
  log('\n🔍 Test 4: Authentification', 'cyan');
  const authData = {
    email: 'test@example.com',
    password: 'testpassword'
  };
  
  const auth = await testRoute('POST', '/auth/login', authData);
  log(`   Login: ${auth.success ? '✅' : '❌'} ${auth.status}`, auth.success ? 'green' : 'red');
  
  if (!auth.success) {
    log(`   Erreur: ${auth.message}`, 'red');
  }

  // Test des fichiers statiques
  log('\n🔍 Test 5: Fichiers statiques', 'cyan');
  try {
    const staticResponse = await axios.get(`${BASE_URL}/static/avatars`, { timeout: 3000 });
    log(`   Fichiers statiques: ✅ ${staticResponse.status}`, 'green');
  } catch (error) {
    log(`   Fichiers statiques: ❌ ${error.response?.status || 'TIMEOUT'}`, 'red');
  }

  // Test Socket.IO
  log('\n🔍 Test 6: Socket.IO', 'cyan');
  try {
    const socketResponse = await axios.get(`${BASE_URL.replace('/api', '')}`, { timeout: 3000 });
    log(`   Socket.IO: ✅ ${socketResponse.status}`, 'green');
  } catch (error) {
    log(`   Socket.IO: ❌ ${error.response?.status || 'TIMEOUT'}`, 'red');
  }

  // Vérification des fichiers de configuration
  log('\n🔍 Test 7: Configuration', 'cyan');
  const configFiles = [
    'server/package.json',
    'client/package.json',
    'server/index.js',
    'client/src/App.js'
  ];

  for (const file of configFiles) {
    const exists = fs.existsSync(file);
    log(`   ${file}: ${exists ? '✅' : '❌'}`, exists ? 'green' : 'red');
  }

  // Test des variables d'environnement
  log('\n🔍 Test 8: Variables d\'environnement', 'cyan');
  const envFiles = [
    'server/.env',
    'client/.env'
  ];

  for (const file of envFiles) {
    const exists = fs.existsSync(file);
    log(`   ${file}: ${exists ? '✅' : '❌'}`, exists ? 'green' : 'red');
  }

  log('\n🎯 DIAGNOSTIC TERMINÉ', 'bright');
  log('========================', 'bright');
};

// Exécution du diagnostic
runDiagnostic().catch(console.error); 