const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER_1 = {
  email: 'test1@guinee.gn',
  password: 'password123'
};
const TEST_USER_2 = {
  email: 'test2@guinee.gn',
  password: 'password123'
};

let user1Token = null;
let user2Token = null;
let conversationId = null;

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test 1: Connexion des utilisateurs
async function loginUsers() {
  console.log('\n🔐 Test 1: Connexion des utilisateurs');
  
  try {
    // Connexion utilisateur 1
    const login1Response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, TEST_USER_1);

    if (login1Response.status === 200 && login1Response.data.success) {
      user1Token = login1Response.data.token;
      console.log('✅ Utilisateur 1 connecté');
    } else {
      console.log('❌ Échec connexion utilisateur 1:', login1Response.data.message);
      return false;
    }

    // Connexion utilisateur 2
    const login2Response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, TEST_USER_2);

    if (login2Response.status === 200 && login2Response.data.success) {
      user2Token = login2Response.data.token;
      console.log('✅ Utilisateur 2 connecté');
    } else {
      console.log('❌ Échec connexion utilisateur 2:', login2Response.data.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error.message);
    return false;
  }
}

// Test 2: Créer une conversation privée
async function createPrivateConversation() {
  console.log('\n💬 Test 2: Création d\'une conversation privée');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages/conversation/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user1Token}`
      }
    }, {
      type: 'private',
      participants: [TEST_USER_2.id || 'test-user-2-id']
    });

    if (response.status === 200 && response.data.success) {
      conversationId = response.data.conversation.conversationId;
      console.log('✅ Conversation privée créée:', conversationId);
      return true;
    } else {
      console.log('❌ Échec création conversation:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de conversation:', error.message);
    return false;
  }
}

// Test 3: Envoyer un message
async function sendMessage() {
  console.log('\n📤 Test 3: Envoi d\'un message');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user1Token}`
      }
    }, {
      conversationId: conversationId,
      content: 'Bonjour ! Comment allez-vous ?'
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Message envoyé avec succès');
      return true;
    } else {
      console.log('❌ Échec envoi message:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error.message);
    return false;
  }
}

// Test 4: Récupérer les conversations
async function getConversations() {
  console.log('\n📋 Test 4: Récupération des conversations');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages/conversations',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user1Token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Conversations récupérées:', response.data.conversations.length);
      return true;
    } else {
      console.log('❌ Échec récupération conversations:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des conversations:', error.message);
    return false;
  }
}

// Test 5: Récupérer les messages d'une conversation
async function getConversationMessages() {
  console.log('\n💭 Test 5: Récupération des messages');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/messages/conversation/${conversationId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user1Token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Messages récupérés:', response.data.messages.length);
      return true;
    } else {
      console.log('❌ Échec récupération messages:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des messages:', error.message);
    return false;
  }
}

// Test 6: Rechercher des messages
async function searchMessages() {
  console.log('\n🔍 Test 6: Recherche de messages');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages/search?query=bonjour',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user1Token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Recherche effectuée:', response.data.messages.length, 'résultats');
      return true;
    } else {
      console.log('❌ Échec recherche:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error.message);
    return false;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🧪 Test de l\'API de messagerie CommuniConnect\n');
  
  const tests = [
    { name: 'Connexion utilisateurs', fn: loginUsers },
    { name: 'Création conversation', fn: createPrivateConversation },
    { name: 'Envoi message', fn: sendMessage },
    { name: 'Récupération conversations', fn: getConversations },
    { name: 'Récupération messages', fn: getConversationMessages },
    { name: 'Recherche messages', fn: searchMessages }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.error(`❌ Erreur dans le test "${test.name}":`, error.message);
    }
  }

  console.log('\n📊 Résultats des tests:');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests sont passés ! L\'API de messagerie fonctionne correctement.');
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez la configuration et les données de test.');
  }
}

// Exécuter les tests
runTests().catch(console.error); 