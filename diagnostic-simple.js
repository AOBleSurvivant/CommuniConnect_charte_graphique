const axios = require('axios');

console.log('🔍 DIAGNOSTIC SIMPLE - COMMUNICONNECT');
console.log('=====================================');

// Test 1: Vérifier si le serveur répond
async function testServer() {
  console.log('\n1️⃣ Test de connexion au serveur...');
  try {
    const response = await axios.get('http://localhost:5000/api/health', { timeout: 5000 });
    console.log('✅ Serveur accessible');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Serveur non démarré - Démarrez le serveur avec: cd server && npm start');
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Serveur inaccessible - Vérifiez l\'URL');
    } else {
      console.log('❌ Erreur serveur:', error.message);
    }
    return false;
  }
}

// Test 2: Test d'authentification
async function testAuth() {
  console.log('\n2️⃣ Test d\'authentification...');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    }, { timeout: 5000 });
    
    console.log('✅ Authentification réussie');
    return response.data.token;
  } catch (error) {
    console.log('❌ Erreur d\'authentification:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 3: Test d'invitation d'amis
async function testFriends(token) {
  console.log('\n3️⃣ Test d\'invitation d\'amis...');
  try {
    const response = await axios.post('http://localhost:5000/api/friends/request', {
      recipientId: 'ami@test.com'
    }, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Invitation d\'ami réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur invitation d\'ami:', error.response?.data?.message || error.message);
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
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Création de conversation réussie');
    return response.data.conversation;
  } catch (error) {
    console.log('❌ Erreur création conversation:', error.response?.data?.message || error.message);
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
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Envoi de message réussi');
    return true;
  } catch (error) {
    console.log('❌ Erreur envoi message:', error.response?.data?.message || error.message);
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
      },
      timeout: 5000
    });
    
    console.log('✅ Création d\'événement réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur création événement:', error.response?.data?.message || error.message);
    return false;
  }
}

// Fonction principale
async function runDiagnostic() {
  console.log('Démarrage du diagnostic...\n');
  
  const results = {
    server: false,
    auth: false,
    friends: false,
    conversation: false,
    message: false,
    event: false
  };
  
  // Test 1: Serveur
  results.server = await testServer();
  
  if (!results.server) {
    console.log('\n❌ DIAGNOSTIC ARRÊTÉ - Serveur inaccessible');
    console.log('💡 Solution: Démarrez le serveur avec "cd server && npm start"');
    return;
  }
  
  // Test 2: Authentification
  const token = await testAuth();
  results.auth = !!token;
  
  if (!token) {
    console.log('\n❌ DIAGNOSTIC ARRÊTÉ - Authentification échouée');
    return;
  }
  
  // Test 3: Amis
  results.friends = await testFriends(token);
  
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
  console.log('\n' + '=' .repeat(40));
  console.log('📊 RÉSULTATS DU DIAGNOSTIC');
  console.log('=' .repeat(40));
  
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
    console.log('\n🎉 TOUT FONCTIONNE PARFAITEMENT !');
    console.log('✅ CommuniConnect est prêt à être utilisé !');
  } else if (success >= 4) {
    console.log('\n✅ APPLICATION FONCTIONNELLE À 80% !');
    console.log('🎯 Les fonctionnalités principales marchent !');
  } else {
    console.log('\n⚠️ PROBLÈMES IDENTIFIÉS');
    console.log('🔧 Des corrections sont nécessaires');
  }
  
  console.log('\n💡 Pour démarrer l\'application:');
  console.log('   Terminal 1: cd server && npm start');
  console.log('   Terminal 2: cd client && npm start');
}

// Exécuter le diagnostic
runDiagnostic().catch(error => {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}); 