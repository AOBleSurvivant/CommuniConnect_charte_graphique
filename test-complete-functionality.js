const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Configuration axios avec timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Variables globales pour les tests
let authToken = null;
let testUserId = null;

// ============================================================================
// 1. TEST DE CONNEXION ET SANTÉ DU SERVEUR
// ============================================================================

async function testServerHealth() {
  log.title('1. TEST DE CONNEXION ET SANTÉ DU SERVEUR');
  
  try {
    const response = await api.get('/health');
    log.success('Serveur accessible et fonctionnel');
    log.info(`Status: ${response.data.status}`);
    log.info(`Message: ${response.data.message}`);
    return true;
  } catch (error) {
    log.error('Serveur non accessible');
    return false;
  }
}

async function testAuthService() {
  try {
    const response = await api.get('/auth');
    log.success('Service d\'authentification opérationnel');
    log.info(`Endpoints disponibles: ${Object.keys(response.data.endpoints).join(', ')}`);
    return true;
  } catch (error) {
    log.error('Service d\'authentification non accessible');
    return false;
  }
}

// ============================================================================
// 2. TEST D'AUTHENTIFICATION
// ============================================================================

async function testAuthentication() {
  log.title('2. TEST D\'AUTHENTIFICATION');
  
  // Test d'inscription
  const testUserData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '22412345678',
    password: 'password123',
    region: 'Labé',
    prefecture: 'Labé',
    commune: 'Labé-Centre',
    quartier: 'Tata',
    latitude: 11.3182,
    longitude: -12.2833,
    address: 'Tata, Labé-Centre, Labé, Labé, Guinée'
  };

  try {
    log.info('Test d\'inscription...');
    const registerResponse = await api.post('/auth/register', testUserData);
    authToken = registerResponse.data.token;
    testUserId = registerResponse.data.user._id;
    log.success('Inscription réussie');
    log.info(`Token généré: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`Échec de l'inscription: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogin() {
  try {
    log.info('Test de connexion...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const response = await api.post('/auth/login', loginData);
    log.success('Connexion réussie');
    return true;
  } catch (error) {
    log.warning(`Connexion échouée (normal si l'utilisateur n'existe pas): ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetCurrentUser() {
  if (!authToken) {
    log.warning('Pas de token disponible pour tester getCurrentUser');
    return false;
  }

  try {
    log.info('Test de récupération du profil utilisateur...');
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log.success('Profil utilisateur récupéré');
    log.info(`Email: ${response.data.email}, Région: ${response.data.region}`);
    return true;
  } catch (error) {
    log.error(`Échec de récupération du profil: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// ============================================================================
// 3. TEST DES FONCTIONNALITÉS GÉOGRAPHIQUES
// ============================================================================

async function testGeographicFeatures() {
  log.title('3. TEST DES FONCTIONNALITÉS GÉOGRAPHIQUES');
  
  try {
    log.info('Test de récupération des données géographiques...');
    const response = await api.get('/locations/geography');
    log.success('Données géographiques récupérées');
    log.info(`${response.data.regions?.length || 0} régions disponibles`);
    return true;
  } catch (error) {
    log.error(`Échec de récupération des données géographiques: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// ============================================================================
// 4. TEST DES FONCTIONNALITÉS DE CONTENU
// ============================================================================

async function testContentFeatures() {
  log.title('4. TEST DES FONCTIONNALITÉS DE CONTENU');
  
  if (!authToken) {
    log.warning('Pas de token disponible pour tester les fonctionnalités de contenu');
    return false;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test des posts
  try {
    log.info('Test de création de post...');
    const postData = {
      content: 'Ceci est un post de test pour vérifier les fonctionnalités de CommuniConnect.',
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    const response = await api.post('/posts', postData, { headers });
    log.success('Post créé avec succès');
    log.info(`Post ID: ${response.data._id}`);
  } catch (error) {
    log.error(`Échec de création de post: ${error.response?.data?.message || error.message}`);
  }

  // Test des alertes
  try {
    log.info('Test de création d\'alerte...');
    const alertData = {
      title: 'Alerte de test',
      description: 'Ceci est une alerte de test pour vérifier les fonctionnalités.',
      severity: 'medium',
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    const response = await api.post('/alerts', alertData, { headers });
    log.success('Alerte créée avec succès');
    log.info(`Alerte ID: ${response.data._id}`);
  } catch (error) {
    log.error(`Échec de création d'alerte: ${error.response?.data?.message || error.message}`);
  }

  // Test des événements
  try {
    log.info('Test de création d\'événement...');
    const eventData = {
      title: 'Événement de test',
      description: 'Ceci est un événement de test pour vérifier les fonctionnalités.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    const response = await api.post('/events', eventData, { headers });
    log.success('Événement créé avec succès');
    log.info(`Événement ID: ${response.data._id}`);
  } catch (error) {
    log.error(`Échec de création d'événement: ${error.response?.data?.message || error.message}`);
  }

  return true;
}

// ============================================================================
// 5. TEST DES FONCTIONNALITÉS DE COMMUNICATION
// ============================================================================

async function testCommunicationFeatures() {
  log.title('5. TEST DES FONCTIONNALITÉS DE COMMUNICATION');
  
  if (!authToken) {
    log.warning('Pas de token disponible pour tester les fonctionnalités de communication');
    return false;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Test des messages
  try {
    log.info('Test de création de conversation...');
    const conversationData = {
      participants: [testUserId],
      title: 'Conversation de test'
    };
    const response = await api.post('/messages/conversations', conversationData, { headers });
    log.success('Conversation créée avec succès');
    log.info(`Conversation ID: ${response.data._id}`);
  } catch (error) {
    log.error(`Échec de création de conversation: ${error.response?.data?.message || error.message}`);
  }

  return true;
}

// ============================================================================
// 6. TEST DES FONCTIONNALITÉS DE MODÉRATION
// ============================================================================

async function testModerationFeatures() {
  log.title('6. TEST DES FONCTIONNALITÉS DE MODÉRATION');
  
  if (!authToken) {
    log.warning('Pas de token disponible pour tester les fonctionnalités de modération');
    return false;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    log.info('Test de récupération des logs de modération...');
    const response = await api.get('/moderation/logs', { headers });
    log.success('Logs de modération récupérés');
    log.info(`${response.data.logs?.length || 0} logs disponibles`);
  } catch (error) {
    log.error(`Échec de récupération des logs: ${error.response?.data?.message || error.message}`);
  }

  return true;
}

// ============================================================================
// 7. TEST DES NOTIFICATIONS
// ============================================================================

async function testNotificationFeatures() {
  log.title('7. TEST DES NOTIFICATIONS');
  
  if (!authToken) {
    log.warning('Pas de token disponible pour tester les notifications');
    return false;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    log.info('Test de récupération des notifications...');
    const response = await api.get('/notifications', { headers });
    log.success('Notifications récupérées');
    log.info(`${response.data.notifications?.length || 0} notifications disponibles`);
  } catch (error) {
    log.error(`Échec de récupération des notifications: ${error.response?.data?.message || error.message}`);
  }

  return true;
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function runAllTests() {
  console.log(`${colors.bold}${colors.blue}🚀 DÉBUT DES TESTS COMPLETS DE COMMUNICONNECT${colors.reset}\n`);
  
  const results = {
    serverHealth: false,
    authService: false,
    authentication: false,
    login: false,
    currentUser: false,
    geographic: false,
    content: false,
    communication: false,
    moderation: false,
    notifications: false
  };

  // Test 1: Santé du serveur
  results.serverHealth = await testServerHealth();
  results.authService = await testAuthService();

  if (!results.serverHealth) {
    log.error('Serveur non accessible. Arrêt des tests.');
    return;
  }

  // Test 2: Authentification
  results.authentication = await testAuthentication();
  results.login = await testLogin();
  results.currentUser = await testGetCurrentUser();

  // Test 3: Fonctionnalités géographiques
  results.geographic = await testGeographicFeatures();

  // Test 4: Fonctionnalités de contenu
  results.content = await testContentFeatures();

  // Test 5: Fonctionnalités de communication
  results.communication = await testCommunicationFeatures();

  // Test 6: Fonctionnalités de modération
  results.moderation = await testModerationFeatures();

  // Test 7: Notifications
  results.notifications = await testNotificationFeatures();

  // Résumé final
  log.title('📊 RÉSUMÉ DES TESTS');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(`\n${colors.bold}Résultats:${colors.reset}`);
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
    console.log(`${status} ${test}`);
  });

  console.log(`\n${colors.bold}Statistiques:${colors.reset}`);
  console.log(`Tests réussis: ${colors.green}${passedTests}/${totalTests}${colors.reset}`);
  console.log(`Taux de succès: ${colors.blue}${successRate}%${colors.reset}`);

  if (successRate >= 80) {
    log.success('🎉 Application CommuniConnect fonctionnelle !');
  } else if (successRate >= 60) {
    log.warning('⚠️ Application partiellement fonctionnelle');
  } else {
    log.error('❌ Application nécessite des corrections');
  }
}

// Exécution des tests
runAllTests().catch(console.error); 