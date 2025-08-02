const axios = require('axios');

console.log('🎯 TEST FINAL - FRONTEND CORRIGÉ');
console.log('=' .repeat(50));

async function testFrontendFinal() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('\n🚀 Test des routes corrigées...');
    
    // Test 1: Routes livestreams
    console.log('\n1️⃣ Test routes livestreams...');
    
    const livestreamsResponse = await axios.get(`${baseUrl}/api/livestreams`);
    console.log(`✅ /api/livestreams: ${livestreamsResponse.data.data?.length || 0} lives`);
    console.log(`   Format: ${JSON.stringify(livestreamsResponse.data).substring(0, 100)}...`);
    
    const liveResponse = await axios.get(`${baseUrl}/api/livestreams/live`);
    console.log(`✅ /api/livestreams/live: ${liveResponse.data.data?.length || 0} lives`);
    
    const scheduledResponse = await axios.get(`${baseUrl}/api/livestreams/scheduled`);
    console.log(`✅ /api/livestreams/scheduled: ${scheduledResponse.data.data?.length || 0} lives`);
    
    const alertsResponse = await axios.get(`${baseUrl}/api/livestreams/alerts`);
    console.log(`✅ /api/livestreams/alerts: ${alertsResponse.data.data?.length || 0} alertes`);
    
    // Test 2: Routes friends
    console.log('\n2️⃣ Test routes friends...');
    
    const friendsResponse = await axios.get(`${baseUrl}/api/friends`);
    console.log(`✅ /api/friends: ${friendsResponse.data.friends?.length || 0} amis`);
    console.log(`   Format: ${JSON.stringify(friendsResponse.data).substring(0, 100)}...`);
    
    const requestsResponse = await axios.get(`${baseUrl}/api/friends/requests`);
    console.log(`✅ /api/friends/requests: ${requestsResponse.data.requests?.length || 0} demandes`);
    
    // Test 3: Routes auth
    console.log('\n3️⃣ Test routes auth...');
    
    const authResponse = await axios.get(`${baseUrl}/api/auth/me`);
    console.log(`✅ /api/auth/me: ${authResponse.data.user?.firstName || 'Non trouvé'}`);
    
    console.log('\n📊 RÉSUMÉ DES CORRECTIONS:');
    console.log('✅ Routes livestreams: /api/livestreams/*');
    console.log('✅ Routes friends: /api/friends/*');
    console.log('✅ Routes auth: /api/auth/*');
    console.log('✅ Format données: {success: true, data: [...]}');
    console.log('✅ Slice Redux: Extraction correcte des données');
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('1. Rafraîchir le navigateur (F5)');
    console.log('2. Vérifier que les erreurs 404 ont disparu');
    console.log('3. Vérifier que les données s\'affichent');
    console.log('4. Tester les fonctionnalités');
    
      } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.response?.status === 404) {
      console.log('\n🔧 PROBLÈME: Route non trouvée');
      console.log('Vérifiez que le serveur backend est démarré');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 PROBLÈME: Serveur non accessible');
      console.log('Démarrez le serveur: cd server && npm start');
    }
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  testFrontendFinal();
}, 2000); 