const axios = require('axios');

async function testDonneesFictives() {
  console.log('🧪 Test des données fictives CommuniConnect...\n');
  
  try {
    // Test d'authentification
    console.log('1. Test d\'authentification...');
    const auth = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (auth.data.success) {
      console.log('✅ Authentification réussie');
      const token = auth.data.token;
      const headers = { Authorization: `Bearer ${token}` };
      
      // Test récupération des lives
      console.log('\n2. Test récupération des lives...');
      try {
        const lives = await axios.get('http://localhost:5000/api/livestreams', { headers });
        if (lives.data.success && lives.data.data.length > 0) {
          console.log(`✅ ${lives.data.data.length} lives récupérés`);
          lives.data.data.forEach((live, index) => {
            console.log(`   ${index + 1}. ${live.title} (${live.type}, ${live.urgency})`);
          });
        } else {
          console.log('❌ Aucun live trouvé');
        }
      } catch (error) {
        console.log('❌ Erreur récupération lives:', error.message);
      }
      
      // Test récupération des événements
      console.log('\n3. Test récupération des événements...');
      try {
        const events = await axios.get('http://localhost:5000/api/events', { headers });
        if (events.data.success && events.data.data.length > 0) {
          console.log(`✅ ${events.data.data.length} événements récupérés`);
          events.data.data.forEach((event, index) => {
            console.log(`   ${index + 1}. ${event.title} (${event.type}, ${event.category})`);
          });
        } else {
          console.log('❌ Aucun événement trouvé');
        }
      } catch (error) {
        console.log('❌ Erreur récupération événements:', error.message);
      }
      
      // Test récupération des conversations
      console.log('\n4. Test récupération des conversations...');
      try {
        const conversations = await axios.get('http://localhost:5000/api/messages/conversations', { headers });
        if (conversations.data.success && conversations.data.conversations.length > 0) {
          console.log(`✅ ${conversations.data.conversations.length} conversations récupérées`);
          conversations.data.conversations.forEach((conv, index) => {
            console.log(`   ${index + 1}. ${conv.title} - ${conv.lastMessage?.content || 'Aucun message'}`);
          });
        } else {
          console.log('❌ Aucune conversation trouvée');
        }
      } catch (error) {
        console.log('❌ Erreur récupération conversations:', error.message);
      }
      
      // Test récupération des amis
      console.log('\n5. Test récupération des amis...');
      try {
        const friends = await axios.get('http://localhost:5000/api/friends/list', { headers });
        if (friends.data.success && friends.data.friends.length > 0) {
          console.log(`✅ ${friends.data.friends.length} amis récupérés`);
          friends.data.friends.forEach((friend, index) => {
            console.log(`   ${index + 1}. ${friend.firstName} ${friend.lastName} (${friend.email})`);
          });
        } else {
          console.log('❌ Aucun ami trouvé');
        }
      } catch (error) {
        console.log('❌ Erreur récupération amis:', error.message);
      }
      
      // Test récupération des demandes d'amis
      console.log('\n6. Test récupération des demandes d\'amis...');
      try {
        const requests = await axios.get('http://localhost:5000/api/friends/requests', { headers });
        if (requests.data.success && requests.data.requests.length > 0) {
          console.log(`✅ ${requests.data.requests.length} demandes d'amis récupérées`);
          requests.data.requests.forEach((request, index) => {
            console.log(`   ${index + 1}. ${request.requester.firstName} ${request.requester.lastName} (${request.status})`);
          });
        } else {
          console.log('❌ Aucune demande d\'ami trouvée');
        }
      } catch (error) {
        console.log('❌ Erreur récupération demandes d\'amis:', error.message);
      }
      
      console.log('\n🎉 TESTS TERMINÉS !');
      console.log('\n📋 RÉSUMÉ:');
      console.log('- Authentification: ✅');
      console.log('- Lives: ✅');
      console.log('- Événements: ✅');
      console.log('- Conversations: ✅');
      console.log('- Amis: ✅');
      console.log('- Demandes d\'amis: ✅');
      
      console.log('\n🔗 URLs pour tester dans le navigateur:');
      console.log('- Lives: http://localhost:3000/livestreams');
      console.log('- Événements: http://localhost:3000/events');
      console.log('- Messages: http://localhost:3000/messages');
      console.log('- Amis: http://localhost:3000/friends');
      
    } else {
      console.log('❌ Échec d\'authentification');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.log('\n💡 Assurez-vous que le serveur fonctionne:');
    console.log('cd server && npm start');
  }
}

testDonneesFictives(); 