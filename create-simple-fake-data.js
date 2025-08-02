const axios = require('axios');

async function createFakeData() {
  console.log('🚀 Création de données fictives CommuniConnect...\n');
  
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // 1. Authentification
    console.log('🔐 Authentification...');
    const authResponse = await axios.post(`${baseURL}/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (!authResponse.data.success) {
      console.log('❌ Échec d\'authentification');
      return;
    }
    
    const token = authResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Authentification réussie');
    
    // 2. Créer des lives
    console.log('\n📺 Création de Lives...');
    const livestreams = [
      {
        title: 'Incendie dans le quartier Centre',
        description: 'Incendie signalé rue principale, pompiers en route.',
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
      },
      {
        title: 'Coupure d\'électricité - Quartier Almamya',
        description: 'Coupure d\'électricité prévue de 14h à 18h pour maintenance.',
        type: 'alert',
        urgency: 'medium',
        isPublic: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Ratoma',
          quartier: 'Almamya',
          coordinates: { latitude: 9.545, longitude: -13.675 }
        }
      }
    ];
    
    for (const live of livestreams) {
      try {
        await axios.post(`${baseURL}/livestreams`, live, { headers });
        console.log(`✅ Live créé: ${live.title}`);
      } catch (error) {
        console.log(`❌ Erreur live "${live.title}": ${error.message}`);
      }
    }
    
    // 3. Créer des événements
    console.log('\n📅 Création d\'Événements...');
    const events = [
      {
        title: 'Nettoyage communautaire du quartier',
        description: 'Grande opération de nettoyage du quartier avec tous les habitants.',
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
        tags: ['nettoyage', 'communauté']
      },
      {
        title: 'Formation informatique gratuite',
        description: 'Formation en informatique pour les jeunes du quartier.',
        type: 'formation',
        category: 'educatif',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '14:00',
        endTime: '17:00',
        address: 'Centre culturel, Conakry',
        venue: 'Salle de formation',
        latitude: 9.545,
        longitude: -13.675,
        isFree: true,
        capacity: 30,
        tags: ['formation', 'informatique']
      }
    ];
    
    for (const event of events) {
      try {
        await axios.post(`${baseURL}/events`, event, { headers });
        console.log(`✅ Événement créé: ${event.title}`);
      } catch (error) {
        console.log(`❌ Erreur événement "${event.title}": ${error.message}`);
      }
    }
    
    // 4. Créer des messages
    console.log('\n💬 Création de Messages...');
    try {
      const conversation = await axios.post(`${baseURL}/messages/conversations`, {
        participants: ['test@communiconnect.gn'],
        name: 'Conversation Test'
      }, { headers });
      
      if (conversation.data.success) {
        const conversationId = conversation.data.conversation._id;
        
        const messages = [
          'Bonjour ! Comment allez-vous ?',
          'Avez-vous des nouvelles du quartier ?',
          'Il y a une réunion demain à 14h.',
          'Merci pour l\'information !'
        ];
        
        for (const message of messages) {
          try {
            await axios.post(`${baseURL}/messages/send`, {
              conversationId: conversationId,
              content: message
            }, { headers });
            console.log(`✅ Message envoyé: "${message.substring(0, 30)}..."`);
          } catch (error) {
            console.log(`❌ Erreur message: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Erreur conversation: ${error.message}`);
    }
    
    // 5. Créer des invitations d'amis
    console.log('\n👥 Création d\'Invitations d\'Amis...');
    const emails = [
      'mamadou.diallo@communiconnect.gn',
      'fatou.camara@communiconnect.gn',
      'ibrahima.sow@communiconnect.gn'
    ];
    
    for (const email of emails) {
      try {
        await axios.post(`${baseURL}/friends/request`, {
          recipientId: email
        }, { headers });
        console.log(`✅ Invitation envoyée à: ${email}`);
      } catch (error) {
        console.log(`❌ Erreur invitation "${email}": ${error.message}`);
      }
    }
    
    console.log('\n🎉 CRÉATION DE DONNÉES FICTIVES TERMINÉE !');
    console.log('\n📋 RÉSUMÉ:');
    console.log('- 2 Lives d\'alerte créés');
    console.log('- 2 Événements créés');
    console.log('- 1 Conversation avec 4 messages');
    console.log('- 3 Invitations d\'amis envoyées');
    
    console.log('\n🔗 URLs pour tester:');
    console.log('- Lives: http://localhost:3000/livestreams');
    console.log('- Événements: http://localhost:3000/events');
    console.log('- Messages: http://localhost:3000/messages');
    console.log('- Amis: http://localhost:3000/friends');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

createFakeData(); 