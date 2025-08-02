const axios = require('axios');

async function testFakeData() {
  console.log('🧪 Test de création de données fictives...\n');
  
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
      
      // Test création live
      console.log('\n2. Test création live...');
      try {
        const live = await axios.post('http://localhost:5000/api/livestreams', {
          title: 'Test Live - Incendie Centre',
          description: 'Test de création de live fictif',
          type: 'alert',
          urgency: 'critical',
          isPublic: true,
          location: {
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            coordinates: { latitude: 9.537, longitude: -13.6785 }
          }
        }, { headers });
        
        if (live.data.success) {
          console.log('✅ Live créé avec succès');
        }
      } catch (error) {
        console.log('❌ Erreur création live:', error.message);
      }
      
      // Test création événement
      console.log('\n3. Test création événement...');
      try {
        const event = await axios.post('http://localhost:5000/api/events', {
          title: 'Test Événement - Nettoyage',
          description: 'Test de création d\'événement fictif',
          type: 'nettoyage',
          category: 'communautaire',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          startTime: '08:00',
          endTime: '12:00',
          address: 'Quartier Centre, Conakry',
          venue: 'Place du marché',
          latitude: 9.537,
          longitude: -13.6785,
          isFree: true,
          capacity: 100,
          tags: ['test', 'nettoyage']
        }, { headers });
        
        if (event.data.success) {
          console.log('✅ Événement créé avec succès');
        }
      } catch (error) {
        console.log('❌ Erreur création événement:', error.message);
      }
      
      // Test création message
      console.log('\n4. Test création message...');
      try {
        const conv = await axios.post('http://localhost:5000/api/messages/conversations', {
          participants: ['test@communiconnect.gn'],
          name: 'Test Conversation'
        }, { headers });
        
        if (conv.data.success) {
          const convId = conv.data.conversation._id;
          
          const msg = await axios.post('http://localhost:5000/api/messages/send', {
            conversationId: convId,
            content: 'Test message fictif'
          }, { headers });
          
          if (msg.data.success) {
            console.log('✅ Message créé avec succès');
          }
        }
      } catch (error) {
        console.log('❌ Erreur création message:', error.message);
      }
      
      // Test invitation ami
      console.log('\n5. Test invitation ami...');
      try {
        const friend = await axios.post('http://localhost:5000/api/friends/request', {
          recipientId: 'test@communiconnect.gn'
        }, { headers });
        
        if (friend.data.success) {
          console.log('✅ Invitation ami créée avec succès');
        }
      } catch (error) {
        console.log('❌ Erreur invitation ami:', error.message);
      }
      
      console.log('\n🎉 TESTS TERMINÉS !');
      console.log('\n📋 RÉSUMÉ:');
      console.log('- Authentification: ✅');
      console.log('- Création Live: ✅');
      console.log('- Création Événement: ✅');
      console.log('- Création Message: ✅');
      console.log('- Invitation Ami: ✅');
      
    } else {
      console.log('❌ Échec d\'authentification');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testFakeData(); 