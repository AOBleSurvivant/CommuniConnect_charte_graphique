const axios = require('axios');

console.log('🧪 TEST SIMPLE - ROUTES FRIENDS');
console.log('=' .repeat(40));

async function testFriendsRoutes() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Test 1: Liste des amis
    console.log('\n1️⃣ Test liste des amis...');
    const friendsResponse = await axios.get(`${baseUrl}/api/friends`);
    console.log(`✅ Liste des amis: ${friendsResponse.data.friends?.length || 0} amis`);
    
    // Test 2: Demandes reçues
    console.log('\n2️⃣ Test demandes reçues...');
    const requestsResponse = await axios.get(`${baseUrl}/api/friends/requests`);
    console.log(`✅ Demandes reçues: ${requestsResponse.data.requests?.length || 0} demandes`);
    
    // Test 3: Envoyer une demande
    console.log('\n3️⃣ Test envoi demande...');
    const sendResponse = await axios.post(`${baseUrl}/api/friends/request`, {
      recipientId: 'test@example.com'
    });
    console.log(`✅ Demande envoyée: ${sendResponse.data.message}`);
    
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    
  } catch (error) {
    console.error('❌ Erreur de test:', error.response?.data || error.message);
  }
}

testFriendsRoutes(); 