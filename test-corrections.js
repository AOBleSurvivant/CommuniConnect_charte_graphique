const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

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
const logInfo = (message) => log(`ℹ️ ${message}`, 'blue');

async function testCorrections() {
  log('\n🔧 Test des corrections apportées', 'blue');
  log('=' .repeat(50), 'blue');

  // 1. Test OAuth (déjà fonctionnel)
  try {
    const oauthResponse = await axios.post(`${API_BASE_URL}/auth/oauth/callback`, {
      code: 'test-oauth-code',
      state: 'test-state',
      redirectUri: 'http://localhost:3000/auth/callback'
    });

    if (oauthResponse.data.success) {
      logSuccess('OAuth fonctionne toujours');
      const token = oauthResponse.data.token;
      
      // 2. Test Messages avec le token OAuth
      try {
        const messagesResponse = await axios.get(`${API_BASE_URL}/messages/conversations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (messagesResponse.data.success) {
          logSuccess('Messages corrigés - conversations accessibles');
          logInfo(`${messagesResponse.data.conversations?.length || 0} conversations trouvées`);
        } else {
          logError('Messages - conversations toujours en erreur');
        }
      } catch (error) {
        logError(`Messages: ${error.response?.data?.message || error.message}`);
      }

      // 3. Test Posts avec vidéo
      try {
        const postResponse = await axios.post(`${API_BASE_URL}/posts`, {
          content: 'Test post avec vidéo corrigé',
          mediaFiles: [
            {
              filename: 'test-video.mp4',
              type: 'video/mp4',
              size: 1024000
            }
          ],
          isPublic: true
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (postResponse.data.success) {
          logSuccess('Posts corrigés - création avec vidéo fonctionne');
          logInfo(`Post ID: ${postResponse.data.data?._id}`);
        } else {
          logError('Posts - création toujours en erreur');
        }
      } catch (error) {
        logError(`Posts: ${error.response?.data?.message || error.message}`);
      }

      // 4. Test Livestreams
      try {
        const livestreamResponse = await axios.post(`${API_BASE_URL}/livestreams`, {
          title: 'Test Livestream corrigé',
          description: 'Test de création de livestream',
          isPublic: true
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (livestreamResponse.data.success) {
          logSuccess('Livestreams corrigés - création fonctionne');
          logInfo(`Livestream ID: ${livestreamResponse.data.livestream?._id}`);
        } else {
          logError('Livestreams - création toujours en erreur');
        }
      } catch (error) {
        logError(`Livestreams: ${error.response?.data?.message || error.message}`);
      }

    } else {
      logError('OAuth ne fonctionne plus');
    }
  } catch (error) {
    logError(`OAuth: ${error.response?.data?.message || error.message}`);
  }

  log('\n' + '=' .repeat(50), 'blue');
  log('🏁 Test des corrections terminé', 'blue');
}

// Exécuter le test
testCorrections().catch(error => {
  logError(`Erreur générale: ${error.message}`);
}); 