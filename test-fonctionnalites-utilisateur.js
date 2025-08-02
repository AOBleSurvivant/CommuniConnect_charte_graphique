const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = null;

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fonction de log coloré
function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

// Authentification
async function authenticate() {
  try {
    logInfo('🔐 Authentification...');
    const response = await api.post('/auth/login', {
      email: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (response.data.success) {
      authToken = response.data.token;
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      logSuccess('Authentification réussie');
      return true;
    } else {
      logError('Échec de l\'authentification');
      return false;
    }
  } catch (error) {
    logError(`Erreur d'authentification: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test du système d'amis
async function testFriendsSystem() {
  logInfo('\n👥 TEST DU SYSTÈME D\'AMIS');
  logInfo('================================');

  // 1. Envoyer une demande d'ami
  try {
    logInfo('1. Test envoi de demande d\'ami...');
    const response = await api.post('/friends/request', {
      recipientId: 'ami@test.com'
    });
    
    if (response.data.success) {
      logSuccess('Demande d\'ami envoyée avec succès');
      logInfo(`Message: ${response.data.message}`);
    } else {
      logError('Échec de l\'envoi de la demande d\'ami');
    }
  } catch (error) {
    logError(`Erreur lors de l'envoi de la demande: ${error.response?.data?.message || error.message}`);
  }

  // 2. Récupérer la liste d'amis
  try {
    logInfo('\n2. Test récupération de la liste d\'amis...');
    const response = await api.get('/friends/list');
    
    if (response.data.success) {
      logSuccess(`Liste d'amis récupérée (${response.data.friends.length} amis)`);
      response.data.friends.forEach((friend, index) => {
        logInfo(`  ${index + 1}. ${friend.firstName} ${friend.lastName} (${friend.email})`);
      });
    } else {
      logError('Échec de la récupération de la liste d\'amis');
    }
  } catch (error) {
    logError(`Erreur lors de la récupération des amis: ${error.response?.data?.message || error.message}`);
  }

  // 3. Récupérer les demandes d'amis
  try {
    logInfo('\n3. Test récupération des demandes d\'amis...');
    const response = await api.get('/friends/requests');
    
    if (response.data.success) {
      logSuccess(`Demandes d'amis récupérées (${response.data.requests.length} demandes)`);
      response.data.requests.forEach((request, index) => {
        logInfo(`  ${index + 1}. ${request.requester.firstName} ${request.requester.lastName}: ${request.status}`);
      });
    } else {
      logError('Échec de la récupération des demandes d\'amis');
    }
  } catch (error) {
    logError(`Erreur lors de la récupération des demandes: ${error.response?.data?.message || error.message}`);
  }
}

// Test du système de messages
async function testMessagesSystem() {
  logInfo('\n💬 TEST DU SYSTÈME DE MESSAGES');
  logInfo('==================================');

  // 1. Créer une conversation
  try {
    logInfo('1. Test création de conversation...');
    const response = await api.post('/messages/conversations', {
      participants: ['user-123'],
      name: 'Test Conversation',
      type: 'private'
    });
    
    if (response.data.success) {
      logSuccess('Conversation créée avec succès');
      logInfo(`Conversation ID: ${response.data.conversation.id}`);
      return response.data.conversation.id;
    } else {
      logError('Échec de la création de conversation');
      return null;
    }
  } catch (error) {
    logError(`Erreur lors de la création de conversation: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test de l'envoi de message
async function testSendMessage(conversationId) {
  if (!conversationId) {
    logWarning('Impossible de tester l\'envoi de message sans conversation');
    return;
  }

  try {
    logInfo('\n2. Test envoi de message...');
    const response = await api.post('/messages/send', {
      conversationId: conversationId,
      content: 'Salut ! Comment ça va ?'
    });
    
    if (response.data.success) {
      logSuccess('Message envoyé avec succès');
      logInfo(`Message: ${response.data.message.content}`);
    } else {
      logError('Échec de l\'envoi du message');
    }
  } catch (error) {
    logError(`Erreur lors de l'envoi du message: ${error.response?.data?.message || error.message}`);
  }
}

// Test du système d'événements
async function testEventsSystem() {
  logInfo('\n📅 TEST DU SYSTÈME D\'ÉVÉNEMENTS');
  logInfo('==================================');

  // 1. Créer un événement
  try {
    logInfo('1. Test création d\'événement...');
    const eventData = {
      title: 'Fête de quartier Kaloum',
      description: 'Grande fête de quartier avec musique, danse et repas communautaire',
      type: 'festival',
      category: 'communautaire',
      startDate: '2025-08-15',
      endDate: '2025-08-15',
      startTime: '18:00',
      endTime: '23:00',
      venue: 'Place du Marché',
      address: 'Kaloum, Conakry',
      latitude: 9.5370,
      longitude: -13.6785,
      capacity: 200,
      isFree: true,
      price: { amount: 0, currency: 'GNF' }
    };

    const response = await api.post('/events', eventData);
    
    if (response.data.success) {
      logSuccess('Événement créé avec succès');
      logInfo(`Titre: ${response.data.data.title}`);
      logInfo(`Lieu: ${response.data.data.location.address}`);
      return response.data.data._id;
    } else {
      logError('Échec de la création de l\'événement');
      return null;
    }
  } catch (error) {
    logError(`Erreur lors de la création de l'événement: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test de participation à un événement
async function testEventParticipation(eventId) {
  if (!eventId) {
    logWarning('Impossible de tester la participation sans événement');
    return;
  }

  try {
    logInfo('\n2. Test participation à l\'événement...');
    const response = await api.post(`/events/${eventId}/participate`, {
      status: 'confirmed'
    });
    
    if (response.data.success) {
      logSuccess('Participation confirmée avec succès');
    } else {
      logError('Échec de la participation à l\'événement');
    }
  } catch (error) {
    logError(`Erreur lors de la participation: ${error.response?.data?.message || error.message}`);
  }
}

// Test principal
async function testUserFunctionalities() {
  console.log('🧪 TEST DES FONCTIONNALITÉS UTILISATEUR');
  console.log('==========================================');

  // Authentification
  const authSuccess = await authenticate();
  if (!authSuccess) {
    logError('Impossible de continuer sans authentification');
    return;
  }

  // Test du système d'amis
  await testFriendsSystem();

  // Test du système de messages
  const conversationId = await testMessagesSystem();
  await testSendMessage(conversationId);

  // Test du système d'événements
  const eventId = await testEventsSystem();
  await testEventParticipation(eventId);

  console.log('\n🎯 RÉSUMÉ DES TESTS');
  console.log('=====================');
  console.log('✅ Tests terminés - Vérifiez les résultats ci-dessus');
  console.log('💡 Si des erreurs apparaissent, les fonctionnalités nécessitent des corrections');
}

// Exécuter les tests
testUserFunctionalities().catch(console.error); 