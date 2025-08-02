const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration pour les tests
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️ ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️ ${message}`, 'blue');

async function testOAuthEndpoints() {
  log('\n🔐 Test des endpoints OAuth', 'blue');
  
  try {
    // Test du callback OAuth (simulation)
    const oauthResponse = await axios.post(`${API_BASE_URL}/auth/oauth/callback`, {
      code: 'test-oauth-code',
      state: 'test-state',
      redirectUri: 'http://localhost:3000/auth/callback'
    }, testConfig);

    if (oauthResponse.data.success) {
      logSuccess('OAuth callback fonctionne');
      logInfo(`Token reçu: ${oauthResponse.data.token.substring(0, 20)}...`);
    } else {
      logError('OAuth callback échoué');
    }
  } catch (error) {
    logError(`OAuth callback: ${error.response?.data?.message || error.message}`);
  }
}

async function testMessagesEndpoints() {
  log('\n💬 Test des endpoints Messages', 'blue');
  
  try {
    // Test de récupération des conversations
    const conversationsResponse = await axios.get(`${API_BASE_URL}/messages/conversations`, {
      ...testConfig,
      headers: {
        ...testConfig.headers,
        'Authorization': 'Bearer test-token'
      }
    });

    if (conversationsResponse.data.success) {
      logSuccess('Récupération des conversations fonctionne');
      logInfo(`${conversationsResponse.data.conversations?.length || 0} conversations trouvées`);
    } else {
      logError('Récupération des conversations échouée');
    }
  } catch (error) {
    logError(`Conversations: ${error.response?.data?.message || error.message}`);
  }

  try {
    // Test d'envoi de message
    const messageResponse = await axios.post(`${API_BASE_URL}/messages/send`, {
      conversationId: 'test-conversation-id',
      content: 'Test message avec vidéo',
      attachments: [
        {
          filename: 'test-video.mp4',
          type: 'video/mp4',
          size: 1024000
        }
      ]
    }, {
      ...testConfig,
      headers: {
        ...testConfig.headers,
        'Authorization': 'Bearer test-token'
      }
    });

    if (messageResponse.data.success) {
      logSuccess('Envoi de message avec vidéo fonctionne');
      logInfo(`Message ID: ${messageResponse.data.message?.id}`);
    } else {
      logError('Envoi de message échoué');
    }
  } catch (error) {
    logError(`Envoi message: ${error.response?.data?.message || error.message}`);
  }
}

async function testVideoSupport() {
  log('\n🎥 Test du support vidéo', 'blue');
  
  try {
    // Test d'upload de vidéo dans les posts
    const postResponse = await axios.post(`${API_BASE_URL}/posts`, {
      content: 'Post avec vidéo de test',
      mediaFiles: [
        {
          filename: 'test-video.mp4',
          type: 'video/mp4',
          size: 2048000
        }
      ],
      isPublic: true
    }, {
      ...testConfig,
      headers: {
        ...testConfig.headers,
        'Authorization': 'Bearer test-token'
      }
    });

    if (postResponse.data.success) {
      logSuccess('Upload vidéo dans les posts fonctionne');
      logInfo(`Post ID: ${postResponse.data.post?.id}`);
    } else {
      logError('Upload vidéo dans les posts échoué');
    }
  } catch (error) {
    logError(`Upload vidéo posts: ${error.response?.data?.message || error.message}`);
  }
}

async function runAllTests() {
  log('\n🚀 Démarrage des tests OAuth et Messages', 'blue');
  log('=' .repeat(50), 'blue');

  // Vérifier que le serveur est accessible
  try {
    await axios.get(`${API_BASE_URL}/auth/status`, testConfig);
    logSuccess('Serveur accessible');
  } catch (error) {
    logError('Serveur non accessible. Assurez-vous qu\'il est démarré sur le port 5000');
    return;
  }

  // Exécuter les tests
  await testOAuthEndpoints();
  await testMessagesEndpoints();
  await testVideoSupport();

  log('\n' + '=' .repeat(50), 'blue');
  log('🏁 Tests terminés', 'blue');
}

// Exécuter les tests
runAllTests().catch(error => {
  logError(`Erreur générale: ${error.message}`);
  process.exit(1);
}); 