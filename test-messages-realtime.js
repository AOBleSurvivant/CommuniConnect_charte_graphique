const io = require('socket.io-client');

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
let user1Socket = null;
let user2Socket = null;
let conversationId = null;

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const http = require('http');
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

// Test 1: Connexion des utilisateurs et obtention des tokens
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

// Test 2: Créer une conversation
async function createConversation() {
  console.log('\n💬 Test 2: Création d\'une conversation');
  
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
      console.log('✅ Conversation créée:', conversationId);
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

// Test 3: Connexion Socket.IO des utilisateurs
async function connectSockets() {
  console.log('\n🔌 Test 3: Connexion Socket.IO');
  
  return new Promise((resolve) => {
    let connectedUsers = 0;
    
    // Connexion utilisateur 1
    user1Socket = io(BASE_URL, {
      auth: {
        token: user1Token
      }
    });

    user1Socket.on('connect', () => {
      console.log('✅ Utilisateur 1 connecté via Socket.IO');
      connectedUsers++;
      
      if (connectedUsers === 2) {
        resolve(true);
      }
    });

    user1Socket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion Socket.IO utilisateur 1:', error.message);
      resolve(false);
    });

    // Connexion utilisateur 2
    user2Socket = io(BASE_URL, {
      auth: {
        token: user2Token
      }
    });

    user2Socket.on('connect', () => {
      console.log('✅ Utilisateur 2 connecté via Socket.IO');
      connectedUsers++;
      
      if (connectedUsers === 2) {
        resolve(true);
      }
    });

    user2Socket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion Socket.IO utilisateur 2:', error.message);
      resolve(false);
    });
  });
}

// Test 4: Rejoindre la conversation
async function joinConversation() {
  console.log('\n👥 Test 4: Jointure de la conversation');
  
  return new Promise((resolve) => {
    let joinedUsers = 0;
    
    // Utilisateur 1 rejoint la conversation
    user1Socket.emit('join_conversation', { conversationId });
    
    user1Socket.on('user_joined_conversation', (data) => {
      console.log('✅ Utilisateur 1 a rejoint la conversation');
      joinedUsers++;
      
      if (joinedUsers === 2) {
        resolve(true);
      }
    });

    // Utilisateur 2 rejoint la conversation
    user2Socket.emit('join_conversation', { conversationId });
    
    user2Socket.on('user_joined_conversation', (data) => {
      console.log('✅ Utilisateur 2 a rejoint la conversation');
      joinedUsers++;
      
      if (joinedUsers === 2) {
        resolve(true);
      }
    });

    // Timeout pour éviter l'attente infinie
    setTimeout(() => {
      if (joinedUsers < 2) {
        console.log('⚠️ Timeout lors de la jointure de conversation');
        resolve(false);
      }
    }, 5000);
  });
}

// Test 5: Envoi de message en temps réel
async function testRealTimeMessage() {
  console.log('\n📤 Test 5: Message en temps réel');
  
  return new Promise((resolve) => {
    let messageReceived = false;
    
    // Écouter les nouveaux messages côté utilisateur 2
    user2Socket.on('new_message', (data) => {
      console.log('✅ Message reçu en temps réel:', data.message.content);
      messageReceived = true;
      resolve(true);
    });

    // Envoyer un message via l'API (qui déclenchera Socket.IO)
    makeRequest({
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
      content: 'Test de message en temps réel ! 🚀'
    }).then(response => {
      if (response.status === 200 && response.data.success) {
        console.log('✅ Message envoyé via API');
      } else {
        console.log('❌ Échec envoi message:', response.data.message);
        resolve(false);
      }
    }).catch(error => {
      console.error('❌ Erreur lors de l\'envoi:', error.message);
      resolve(false);
    });

    // Timeout pour éviter l'attente infinie
    setTimeout(() => {
      if (!messageReceived) {
        console.log('⚠️ Timeout - Message non reçu en temps réel');
        resolve(false);
      }
    }, 10000);
  });
}

// Test 6: Indicateur de frappe
async function testTypingIndicator() {
  console.log('\n⌨️ Test 6: Indicateur de frappe');
  
  return new Promise((resolve) => {
    let typingReceived = false;
    let stopTypingReceived = false;
    
    // Écouter les indicateurs de frappe côté utilisateur 2
    user2Socket.on('user_typing', (data) => {
      console.log('✅ Indicateur de frappe reçu:', data);
      typingReceived = true;
    });

    user2Socket.on('user_stop_typing', (data) => {
      console.log('✅ Arrêt de frappe reçu:', data);
      stopTypingReceived = true;
      
      if (typingReceived && stopTypingReceived) {
        resolve(true);
      }
    });

    // Envoyer un indicateur de frappe
    user1Socket.emit('typing', { conversationId });
    
    // Arrêter l'indicateur après 2 secondes
    setTimeout(() => {
      user1Socket.emit('stop_typing', { conversationId });
    }, 2000);

    // Timeout pour éviter l'attente infinie
    setTimeout(() => {
      if (!typingReceived || !stopTypingReceived) {
        console.log('⚠️ Timeout - Indicateurs de frappe non reçus');
        resolve(false);
      }
    }, 10000);
  });
}

// Test 7: Statut de lecture
async function testMessageRead() {
  console.log('\n👁️ Test 7: Statut de lecture');
  
  return new Promise((resolve) => {
    let readStatusReceived = false;
    
    // Écouter les statuts de lecture côté utilisateur 1
    user1Socket.on('message_read_by', (data) => {
      console.log('✅ Statut de lecture reçu:', data);
      readStatusReceived = true;
      resolve(true);
    });

    // Marquer un message comme lu (simulation)
    user2Socket.emit('message_read', { 
      messageId: 'test-message-id', 
      conversationId 
    });

    // Timeout pour éviter l'attente infinie
    setTimeout(() => {
      if (!readStatusReceived) {
        console.log('⚠️ Timeout - Statut de lecture non reçu');
        resolve(false);
      }
    }, 5000);
  });
}

// Nettoyer les connexions
function cleanup() {
  console.log('\n🧹 Nettoyage des connexions');
  
  if (user1Socket) {
    user1Socket.disconnect();
  }
  
  if (user2Socket) {
    user2Socket.disconnect();
  }
  
  console.log('✅ Connexions fermées');
}

// Fonction principale de test
async function runRealTimeTests() {
  console.log('🧪 Test du système de messagerie en temps réel CommuniConnect\n');
  
  const tests = [
    { name: 'Connexion utilisateurs', fn: loginUsers },
    { name: 'Création conversation', fn: createConversation },
    { name: 'Connexion Socket.IO', fn: connectSockets },
    { name: 'Jointure conversation', fn: joinConversation },
    { name: 'Message temps réel', fn: testRealTimeMessage },
    { name: 'Indicateur de frappe', fn: testTypingIndicator },
    { name: 'Statut de lecture', fn: testMessageRead }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  try {
    for (const test of tests) {
      console.log(`\n--- ${test.name} ---`);
      const result = await test.fn();
      if (result) {
        passedTests++;
        console.log(`✅ ${test.name} réussi`);
      } else {
        console.log(`❌ ${test.name} échoué`);
      }
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  } finally {
    cleanup();
  }

  console.log('\n📊 Résultats des tests temps réel:');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests temps réel sont passés ! Le système de messagerie en temps réel fonctionne parfaitement.');
  } else {
    console.log('\n⚠️ Certains tests temps réel ont échoué. Vérifiez la configuration Socket.IO.');
  }
}

// Exécuter les tests
runRealTimeTests().catch(console.error); 