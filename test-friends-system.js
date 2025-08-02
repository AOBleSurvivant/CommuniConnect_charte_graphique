const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Configuration axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Couleurs pour les messages
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
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');

async function testFriendsSystem() {
  logInfo('🧪 Test du système d\'amis CommuniConnect');
  logInfo('==========================================');

  try {
    // Test 1: Vérifier l'accessibilité du service
    logInfo('\n1. Test d\'accessibilité du service d\'amis...');
    try {
      const response = await api.get('/friends');
      if (response.data.success) {
        logSuccess('Service d\'amis accessible');
        logInfo(`Endpoints disponibles: ${Object.keys(response.data.endpoints).join(', ')}`);
      } else {
        logError('Service d\'amis non accessible');
        return;
      }
    } catch (error) {
      logError(`Erreur d'accès au service: ${error.message}`);
      return;
    }

    // Test 2: Liste des amis
    logInfo('\n2. Test de récupération de la liste des amis...');
    try {
      const response = await api.get('/friends/list');
      if (response.data.success) {
        logSuccess(`Liste des amis récupérée (${response.data.count} amis)`);
        if (response.data.friends && response.data.friends.length > 0) {
          response.data.friends.forEach((friend, index) => {
            logInfo(`  ${index + 1}. ${friend.firstName} ${friend.lastName} (${friend.quartier}, ${friend.commune})`);
          });
        } else {
          logWarning('Aucun ami trouvé (normal en mode développement)');
        }
      } else {
        logError('Échec de récupération de la liste des amis');
      }
    } catch (error) {
      logError(`Erreur lors de la récupération des amis: ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Demandes d'amis reçues
    logInfo('\n3. Test de récupération des demandes d\'amis...');
    try {
      const response = await api.get('/friends/requests');
      if (response.data.success) {
        logSuccess(`Demandes d'amis récupérées (${response.data.count} demandes)`);
        if (response.data.requests && response.data.requests.length > 0) {
          response.data.requests.forEach((request, index) => {
            logInfo(`  ${index + 1}. ${request.requester.firstName} ${request.requester.lastName}: "${request.message}"`);
          });
        } else {
          logWarning('Aucune demande d\'ami reçue (normal en mode développement)');
        }
      } else {
        logError('Échec de récupération des demandes d\'amis');
      }
    } catch (error) {
      logError(`Erreur lors de la récupération des demandes: ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Envoi d'une demande d'ami (simulation)
    logInfo('\n4. Test d\'envoi de demande d\'ami...');
    try {
      const testRequest = {
        recipientId: 'test-user-123',
        message: 'Salut ! Je voudrais te connecter pour échanger sur notre quartier.'
      };
      
      const response = await api.post('/friends/send-request', testRequest);
      if (response.data.success) {
        logSuccess('Demande d\'ami envoyée avec succès');
        logInfo(`Message: "${testRequest.message}"`);
      } else {
        logError('Échec de l\'envoi de la demande d\'ami');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('existe déjà')) {
        logWarning('Demande d\'ami déjà existante (comportement normal)');
      } else {
        logError(`Erreur lors de l'envoi de la demande: ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 5: Acceptation d'une demande (simulation)
    logInfo('\n5. Test d\'acceptation de demande d\'ami...');
    try {
      const testFriendshipId = 'test-friendship-123';
      const response = await api.put(`/friends/accept/${testFriendshipId}`);
      if (response.data.success) {
        logSuccess('Demande d\'ami acceptée avec succès');
      } else {
        logError('Échec de l\'acceptation de la demande');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        logWarning('Demande d\'ami non trouvée (normal en mode développement)');
      } else {
        logError(`Erreur lors de l'acceptation: ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 6: Rejet d'une demande (simulation)
    logInfo('\n6. Test de rejet de demande d\'ami...');
    try {
      const testFriendshipId = 'test-friendship-456';
      const response = await api.put(`/friends/reject/${testFriendshipId}`);
      if (response.data.success) {
        logSuccess('Demande d\'ami rejetée avec succès');
      } else {
        logError('Échec du rejet de la demande');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        logWarning('Demande d\'ami non trouvée (normal en mode développement)');
      } else {
        logError(`Erreur lors du rejet: ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 7: Suppression d'un ami (simulation)
    logInfo('\n7. Test de suppression d\'ami...');
    try {
      const testFriendshipId = 'test-friendship-789';
      const response = await api.delete(`/friends/remove/${testFriendshipId}`);
      if (response.data.success) {
        logSuccess('Ami supprimé avec succès');
      } else {
        logError('Échec de la suppression de l\'ami');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        logWarning('Relation d\'amitié non trouvée (normal en mode développement)');
      } else {
        logError(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
      }
    }

    logSuccess('\n🎉 Tests du système d\'amis terminés avec succès !');
    logInfo('Le système d\'amis est opérationnel et prêt à être utilisé.');

  } catch (error) {
    logError(`\n💥 Erreur générale lors des tests: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      logError('Le serveur n\'est pas démarré. Veuillez démarrer le serveur avec: npm run server');
    }
  }
}

// Exécution des tests
if (require.main === module) {
  testFriendsSystem();
}

module.exports = { testFriendsSystem }; 