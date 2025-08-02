const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test sans authentification d'abord
async function testDataVisibility() {
  console.log('🔍 Test de visibilité des données fictives...\n');

  try {
    // Test 1: Vérifier les lives (sans auth)
    console.log('📺 Test des lives (sans auth)...');
    const livesResponse = await axios.get(`${BASE_URL}/livestreams`);
    console.log(`✅ Lives récupérés: ${livesResponse.data.data?.length || 0}`);
    if (livesResponse.data.data?.length > 0) {
      console.log('   Premier live:', livesResponse.data.data[0].title);
    }

    // Test 2: Vérifier les événements (sans auth)
    console.log('\n📅 Test des événements (sans auth)...');
    const eventsResponse = await axios.get(`${BASE_URL}/events`);
    console.log(`✅ Événements récupérés: ${eventsResponse.data.data?.events?.length || 0}`);
    if (eventsResponse.data.data?.events?.length > 0) {
      console.log('   Premier événement:', eventsResponse.data.data.events[0].title);
    }

    // Test 3: Vérifier les alertes (sans auth)
    console.log('\n🚨 Test des alertes (sans auth)...');
    const alertsResponse = await axios.get(`${BASE_URL}/livestreams/alerts`);
    console.log(`✅ Alertes récupérées: ${alertsResponse.data.data?.length || 0}`);
    if (alertsResponse.data.data?.length > 0) {
      console.log('   Première alerte:', alertsResponse.data.data[0].title);
    }

    // Test 4: Vérifier les conversations (sans auth)
    console.log('\n💬 Test des conversations (sans auth)...');
    const conversationsResponse = await axios.get(`${BASE_URL}/messages/conversations`);
    console.log(`✅ Conversations récupérées: ${conversationsResponse.data.conversations?.length || 0}`);
    if (conversationsResponse.data.conversations?.length > 0) {
      console.log('   Première conversation:', conversationsResponse.data.conversations[0].title);
    }

    // Test 5: Vérifier les amis (sans auth)
    console.log('\n👥 Test des amis (sans auth)...');
    const friendsResponse = await axios.get(`${BASE_URL}/friends/list`);
    console.log(`✅ Amis récupérés: ${friendsResponse.data.friends?.length || 0}`);
    if (friendsResponse.data.friends?.length > 0) {
      console.log('   Premier ami:', friendsResponse.data.friends[0].firstName);
    }

    // Test 6: Vérifier les demandes d'amis (sans auth)
    console.log('\n📨 Test des demandes d\'amis (sans auth)...');
    const requestsResponse = await axios.get(`${BASE_URL}/friends/requests`);
    console.log(`✅ Demandes récupérées: ${requestsResponse.data.requests?.length || 0}`);
    if (requestsResponse.data.requests?.length > 0) {
      console.log('   Première demande:', requestsResponse.data.requests[0].requester.firstName);
    }

    console.log('\n📊 RÉSUMÉ COMPLET (sans auth):');
    console.log(`- Lives: ${livesResponse.data.data?.length || 0}`);
    console.log(`- Événements: ${eventsResponse.data.data?.events?.length || 0}`);
    console.log(`- Alertes: ${alertsResponse.data.data?.length || 0}`);
    console.log(`- Conversations: ${conversationsResponse.data.conversations?.length || 0}`);
    console.log(`- Amis: ${friendsResponse.data.friends?.length || 0}`);
    console.log(`- Demandes d'amis: ${requestsResponse.data.requests?.length || 0}`);

    // Vérifier si le client React est en cours d'exécution
    console.log('\n🌐 Test de l\'interface client...');
    try {
      const clientResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
      console.log('✅ Interface client accessible sur http://localhost:3000');
    } catch (error) {
      console.log('❌ Interface client non accessible sur http://localhost:3000');
      console.log('   Démarrer le client avec: cd client && npm start');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testDataVisibility(); 