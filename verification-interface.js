const axios = require('axios');

async function verifierInterface() {
  console.log('🔍 VÉRIFICATION DE L\'INTERFACE UTILISATEUR\n');

  // Test 1: Vérifier le serveur backend
  console.log('📡 Test du serveur backend...');
  try {
    const backendResponse = await axios.get('http://localhost:5000/api/livestreams', { timeout: 5000 });
    console.log('✅ Serveur backend: OPÉRATIONNEL');
    console.log(`   - Lives disponibles: ${backendResponse.data.data?.length || 0}`);
  } catch (error) {
    console.log('❌ Serveur backend: NON DÉMARRÉ');
    console.log('   Solution: cd server && npm start');
  }

  // Test 2: Vérifier le serveur frontend
  console.log('\n🌐 Test du serveur frontend...');
  try {
    const frontendResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✅ Serveur frontend: OPÉRATIONNEL');
    console.log('   - Interface accessible sur http://localhost:3000');
  } catch (error) {
    console.log('❌ Serveur frontend: NON DÉMARRÉ');
    console.log('   Solution: cd client && npm start');
  }

  // Test 3: Vérifier les données
  console.log('\n📊 Test des données...');
  try {
    const livesResponse = await axios.get('http://localhost:5000/api/livestreams');
    const eventsResponse = await axios.get('http://localhost:5000/api/events');
    const messagesResponse = await axios.get('http://localhost:5000/api/messages/conversations');
    const friendsResponse = await axios.get('http://localhost:5000/api/friends/list');

    console.log('✅ Données disponibles:');
    console.log(`   - Lives: ${livesResponse.data.data?.length || 0}`);
    console.log(`   - Événements: ${eventsResponse.data.data?.events?.length || 0}`);
    console.log(`   - Conversations: ${messagesResponse.data.conversations?.length || 0}`);
    console.log(`   - Amis: ${friendsResponse.data.friends?.length || 0}`);
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des données');
  }

  // Instructions pour l'utilisateur
  console.log('\n🎯 INSTRUCTIONS POUR VOIR LES DONNÉES:');
  console.log('='.repeat(50));
  console.log('1. Ouvrez votre navigateur');
  console.log('2. Allez sur: http://localhost:3000');
  console.log('3. Si vous ne voyez rien, attendez 30 secondes');
  console.log('4. Rafraîchissez la page (F5)');
  console.log('5. Vérifiez que les deux serveurs sont démarrés:');
  console.log('   - Terminal 1: cd server && npm start');
  console.log('   - Terminal 2: cd client && npm start');
  
  console.log('\n📱 ALTERNATIVE - Test direct des API:');
  console.log('   - Lives: http://localhost:5000/api/livestreams');
  console.log('   - Événements: http://localhost:5000/api/events');
  console.log('   - Messages: http://localhost:5000/api/messages/conversations');
  console.log('   - Amis: http://localhost:5000/api/friends/list');

  console.log('\n🔧 DIAGNOSTIC RAPIDE:');
  console.log('   - Backend: http://localhost:5000/api/health');
  console.log('   - Frontend: http://localhost:3000');
}

verifierInterface(); 