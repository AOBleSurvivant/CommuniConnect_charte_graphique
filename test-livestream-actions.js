const axios = require('axios');

console.log('🎬 TEST ACTIONS LIVESTREAM');
console.log('=' .repeat(50));

async function testLivestreamActions() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('\n🚀 Test des actions livestream...');
    
    // Test 1: Démarrer un livestream
    console.log('\n1️⃣ Test démarrage d\'un livestream...');
    const startResponse = await axios.post(`${baseUrl}/api/livestreams/1/start`);
    console.log(`✅ Démarrage: ${startResponse.data.message || 'Live démarré'}`);
    
    // Test 2: Rejoindre un livestream
    console.log('\n2️⃣ Test rejoindre un livestream...');
    const joinResponse = await axios.post(`${baseUrl}/api/livestreams/1/join`);
    console.log(`✅ Rejoindre: ${joinResponse.data.message || 'Spectateur ajouté'}`);
    
    // Test 3: Envoyer un message
    console.log('\n3️⃣ Test envoi de message...');
    const messageResponse = await axios.post(`${baseUrl}/api/livestreams/1/message`, {
      message: 'Test message from frontend'
    });
    console.log(`✅ Message: ${messageResponse.data.message || 'Message envoyé'}`);
    
    // Test 4: Ajouter une réaction
    console.log('\n4️⃣ Test ajout de réaction...');
    const reactionResponse = await axios.post(`${baseUrl}/api/livestreams/1/reaction`, {
      type: 'like'
    });
    console.log(`✅ Réaction: ${reactionResponse.data.message || 'Réaction ajoutée'}`);
    
    // Test 5: Vérifier l'état après les actions
    console.log('\n5️⃣ Vérification de l\'état...');
    const livestreamResponse = await axios.get(`${baseUrl}/api/livestreams/1`);
    console.log(`✅ État du live: ${livestreamResponse.data.data?.status || 'Non trouvé'}`);
    
    console.log('\n📊 RÉSUMÉ DES ACTIONS:');
    console.log('✅ Démarrage: Fonctionnel');
    console.log('✅ Rejoindre: Fonctionnel');
    console.log('✅ Messages: Fonctionnel');
    console.log('✅ Réactions: Fonctionnel');
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('1. Tester les boutons dans l\'interface');
    console.log('2. Vérifier que les actions fonctionnent');
    console.log('3. Tester le lecteur de live');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.response?.status === 404) {
      console.log('\n🔧 PROBLÈME: Route non trouvée');
      console.log('Vérifiez que le serveur backend est démarré');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 PROBLÈME: Serveur non accessible');
      console.log('Démarrez le serveur: cd server && npm start');
    } else if (error.response?.data) {
      console.log('\n🔧 PROBLÈME: Erreur API');
      console.log('Message:', error.response.data.message);
    }
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  testLivestreamActions();
}, 2000); 