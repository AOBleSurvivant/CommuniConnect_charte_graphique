const axios = require('axios');

console.log('🔍 VÉRIFICATION RAPIDE DES FONCTIONNALITÉS');
console.log('=' .repeat(50));

// Test 1: Vérifier si le serveur répond
async function testServerConnection() {
  console.log('\n1️⃣ Test de connexion au serveur...');
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Serveur accessible');
    return true;
  } catch (error) {
    console.log('❌ Serveur inaccessible:', error.message);
    return false;
  }
}

// Test 2: Test d'authentification
async function testAuthentication() {
  console.log('\n2️⃣ Test d\'authentification...');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    console.log('✅ Authentification réussie');
    return response.data.token;
  } catch (error) {
    console.log('❌ Erreur d\'authentification:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Test d'invitation d'amis
async function testFriendRequest(token) {
  console.log('\n3️⃣ Test d\'invitation d\'amis...');
  try {
    const response = await axios.post('http://localhost:5000/api/friends/request', {
      recipientId: 'ami@test.com'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Invitation d\'ami réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur invitation d\'ami:', error.response?.data || error.message);
    return false;
  }
}

// Test 4: Test de création de conversation
async function testConversation(token) {
  console.log('\n4️⃣ Test de création de conversation...');
  try {
    const response = await axios.post('http://localhost:5000/api/messages/conversations', {
      participants: ['user-123'],
      name: 'Test Conversation',
      type: 'private'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Création de conversation réussie');
    return response.data.conversation;
  } catch (error) {
    console.log('❌ Erreur création conversation:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Test d'envoi de message
async function testMessage(token, conversationId) {
  console.log('\n5️⃣ Test d\'envoi de message...');
  try {
    const response = await axios.post('http://localhost:5000/api/messages/send', {
      conversationId: conversationId,
      content: 'Test message'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Envoi de message réussi');
    return true;
  } catch (error) {
    console.log('❌ Erreur envoi message:', error.response?.data || error.message);
    return false;
  }
}

// Test 6: Test de création d'événement
async function testEvent(token) {
  console.log('\n6️⃣ Test de création d\'événement...');
  const eventData = {
    title: 'Test Event',
    description: 'Test Description',
    type: 'reunion',
    category: 'communautaire',
    startDate: '2024-12-25',
    endDate: '2024-12-26',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Test Venue',
    address: 'Test Address',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 50,
    isFree: true,
    price: { amount: 0, currency: 'GNF' }
  };
  
  try {
    const response = await axios.post('http://localhost:5000/api/events', eventData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Création d\'événement réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur création événement:', error.response?.data || error.message);
    return false;
  }
}

// Fonction principale
async function runQuickTest() {
  const results = {
    server: false,
    auth: false,
    friends: false,
    conversation: false,
    message: false,
    event: false
  };
  
  // Test 1: Serveur
  results.server = await testServerConnection();
  
  if (!results.server) {
    console.log('\n❌ SERVEUR INACCESSIBLE - Vérifiez que le serveur est démarré');
    return;
  }
  
  // Test 2: Authentification
  const token = await testAuthentication();
  results.auth = !!token;
  
  if (!token) {
    console.log('\n❌ AUTHENTIFICATION ÉCHOUÉE');
    return;
  }
  
  // Test 3: Amis
  results.friends = await testFriendRequest(token);
  
  // Test 4: Conversation
  const conversation = await testConversation(token);
  results.conversation = !!conversation;
  
  // Test 5: Message
  if (conversation) {
    results.message = await testMessage(token, conversation._id);
  }
  
  // Test 6: Événement
  results.event = await testEvent(token);
  
  // Résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSULTATS DE LA VÉRIFICATION');
  console.log('=' .repeat(50));
  
  const total = Object.keys(results).length;
  const success = Object.values(results).filter(Boolean).length;
  
  console.log(`🌐 Serveur: ${results.server ? '✅' : '❌'}`);
  console.log(`🔐 Auth: ${results.auth ? '✅' : '❌'}`);
  console.log(`👥 Amis: ${results.friends ? '✅' : '❌'}`);
  console.log(`💬 Conversation: ${results.conversation ? '✅' : '❌'}`);
  console.log(`📤 Message: ${results.message ? '✅' : '❌'}`);
  console.log(`📅 Événement: ${results.event ? '✅' : '❌'}`);
  
  console.log(`\n📈 Score: ${success}/${total} tests réussis`);
  
  if (success === total) {
    console.log('🎉 TOUT FONCTIONNE PARFAITEMENT !');
  } else if (success >= 4) {
    console.log('✅ APPLICATION FONCTIONNELLE À 80% !');
  } else {
    console.log('⚠️ PROBLÈMES IDENTIFIÉS - Corrections nécessaires');
  }
}

// Exécuter le test
runQuickTest().catch(console.error); 