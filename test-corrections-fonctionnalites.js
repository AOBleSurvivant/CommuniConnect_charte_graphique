const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  identifier: 'test@communiconnect.gn',
  password: 'test123'
};

// Fonction pour obtenir un token d'authentification
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, TEST_USER);
    return response.data.token;
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour tester l'invitation d'amis
async function testFriendInvitation(token) {
  console.log('\n🔍 Test 1: Invitation d\'amis avec email');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/friends/request`, {
      recipientId: 'ami@test.com'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Invitation d\'ami réussie:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'invitation d\'ami:', error.response?.data || error.message);
    return false;
  }
}

// Fonction pour tester la création de conversation
async function testConversationCreation(token) {
  console.log('\n🔍 Test 2: Création de conversation');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/messages/conversations`, {
      participants: ['user-123'],
      name: 'Test Conversation',
      type: 'private'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Création de conversation réussie:', response.data.message);
    return response.data.conversation;
  } catch (error) {
    console.error('❌ Erreur lors de la création de conversation:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour tester l'envoi de message
async function testMessageSending(token, conversationId) {
  console.log('\n🔍 Test 3: Envoi de message');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/messages/send`, {
      conversationId: conversationId,
      content: 'Test message from CommuniConnect!'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Envoi de message réussi:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de message:', error.response?.data || error.message);
    return false;
  }
}

// Fonction pour tester la création d'événement
async function testEventCreation(token) {
  console.log('\n🔍 Test 4: Création d\'événement');
  
  const eventData = {
    title: 'Test Event CommuniConnect',
    description: 'Événement de test pour vérifier les corrections',
    type: 'reunion',
    category: 'communautaire', // Cette catégorie est valide
    startDate: '2024-12-25',
    endDate: '2024-12-26', // Date de fin différente
    startTime: '14:00', // Format HH:MM correct
    endTime: '16:00', // Format HH:MM correct
    venue: 'Centre-ville de Conakry',
    address: 'Centre-ville de Conakry',
    latitude: 9.5370, // Dans les limites de la Guinée
    longitude: -13.6785, // Dans les limites de la Guinée
    capacity: 50,
    isFree: true,
    price: { amount: 0, currency: 'GNF' },
    contactPhone: '22412345678'
  };
  
  try {
    console.log('📤 Données envoyées:', JSON.stringify(eventData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/api/events`, eventData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Création d\'événement réussie:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création d\'événement:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    
    // Essayer avec des données simplifiées
    console.log('\n🔍 Tentative avec des données simplifiées...');
    const simpleEventData = {
      title: 'Test Event Simple',
      description: 'Description simple',
      type: 'reunion',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      venue: 'Test Venue',
      address: 'Test Address'
    };
    
    try {
      const simpleResponse = await axios.post(`${API_BASE_URL}/api/events`, simpleEventData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Création d\'événement simple réussie:', simpleResponse.data.message);
      return true;
    } catch (simpleError) {
      console.error('❌ Erreur même avec données simplifiées:', simpleError.response?.data);
      return false;
    }
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de corrections des fonctionnalités utilisateur');
  console.log('=' .repeat(60));
  
  // Obtenir le token d'authentification
  const token = await getAuthToken();
  if (!token) {
    console.error('❌ Impossible d\'obtenir le token d\'authentification');
    return;
  }
  
  console.log('✅ Authentification réussie');
  
  // Résultats des tests
  const results = {
    friendInvitation: false,
    conversationCreation: false,
    messageSending: false,
    eventCreation: false
  };
  
  // Test 1: Invitation d'amis
  results.friendInvitation = await testFriendInvitation(token);
  
  // Test 2: Création de conversation
  const conversation = await testConversationCreation(token);
  results.conversationCreation = !!conversation;
  
  // Test 3: Envoi de message (si conversation créée)
  if (conversation) {
    results.messageSending = await testMessageSending(token, conversation._id);
  }
  
  // Test 4: Création d'événement
  results.eventCreation = await testEventCreation(token);
  
  // Résumé des résultats
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('=' .repeat(60));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`✅ Invitation d'amis: ${results.friendInvitation ? 'SUCCÈS' : 'ÉCHEC'}`);
  console.log(`✅ Création de conversation: ${results.conversationCreation ? 'SUCCÈS' : 'ÉCHEC'}`);
  console.log(`✅ Envoi de message: ${results.messageSending ? 'SUCCÈS' : 'ÉCHEC'}`);
  console.log(`✅ Création d'événement: ${results.eventCreation ? 'SUCCÈS' : 'ÉCHEC'}`);
  
  console.log(`\n📈 Score: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 TOUTES LES CORRECTIONS FONCTIONNENT PARFAITEMENT !');
  } else {
    console.log('⚠️  Certaines corrections nécessitent encore des ajustements');
  }
  
  return results;
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 