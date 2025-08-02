const axios = require('axios');

class CreateFakeData {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = null;
    this.results = {
      auth: { success: false },
      livestreams: { success: false, created: 0 },
      events: { success: false, created: 0 },
      messages: { success: false, created: 0 },
      friends: { success: false, created: 0 }
    };
  }

  async authenticate() {
    console.log('\n🔐 Authentification...');
    
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        identifier: 'test@communiconnect.gn',
        password: 'test123'
      });

      if (response.data.success) {
        this.token = response.data.token;
        this.results.auth.success = true;
        console.log('✅ Authentification réussie');
      }
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error.message);
    }
  }

  async createFakeLivestreams() {
    console.log('\n📺 Création de Lives fictifs...');
    
    const fakeLivestreams = [
      {
        title: 'Incendie dans le quartier Centre',
        description: 'Incendie signalé rue principale, pompiers en route. Évitez la zone.',
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
      },
      {
        title: 'Réunion communautaire - Nettoyage du quartier',
        description: 'Réunion pour organiser le nettoyage du quartier ce weekend.',
        type: 'community',
        urgency: 'low',
        isPublic: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Dixinn',
          quartier: 'Kipé',
          coordinates: { latitude: 9.530, longitude: -13.680 }
        }
      },
      {
        title: 'Accident de circulation - Route de Donka',
        description: 'Accident sur la route de Donka, circulation ralentie.',
        type: 'alert',
        urgency: 'high',
        isPublic: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Matam',
          quartier: 'Donka',
          coordinates: { latitude: 9.540, longitude: -13.670 }
        }
      },
      {
        title: 'Festival culturel - Place de l\'Indépendance',
        description: 'Festival culturel avec musique traditionnelle et danses.',
        type: 'community',
        urgency: 'low',
        isPublic: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre',
          coordinates: { latitude: 9.537, longitude: -13.6785 }
        }
      }
    ];

    const headers = { Authorization: `Bearer ${this.token}` };

    for (const livestream of fakeLivestreams) {
      try {
        const response = await axios.post(`${this.baseURL}/livestreams`, livestream, { headers });
        if (response.data.success) {
          this.results.livestreams.created++;
          console.log(`✅ Live créé: ${livestream.title}`);
        }
      } catch (error) {
        console.error(`❌ Erreur création live "${livestream.title}":`, error.message);
      }
    }

    this.results.livestreams.success = this.results.livestreams.created > 0;
  }

  async createFakeEvents() {
    console.log('\n📅 Création d\'Événements fictifs...');
    
    const fakeEvents = [
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
        tags: ['nettoyage', 'communauté', 'environnement']
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
        tags: ['formation', 'informatique', 'jeunes']
      },
      {
        title: 'Match de football inter-quartiers',
        description: 'Tournoi de football entre les quartiers de Conakry.',
        type: 'sport',
        category: 'sportif',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '16:00',
        endTime: '18:00',
        address: 'Stade municipal, Conakry',
        venue: 'Terrain principal',
        latitude: 9.530,
        longitude: -13.680,
        isFree: true,
        capacity: 500,
        tags: ['football', 'sport', 'tournoi']
      },
      {
        title: 'Concert de musique traditionnelle',
        description: 'Concert de musique traditionnelle guinéenne.',
        type: 'festival',
        category: 'culturel',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '19:00',
        endTime: '23:00',
        address: 'Place de l\'Indépendance, Conakry',
        venue: 'Place publique',
        latitude: 9.537,
        longitude: -13.6785,
        isFree: true,
        capacity: 1000,
        tags: ['musique', 'traditionnel', 'concert']
      },
      {
        title: 'Campagne de vaccination',
        description: 'Campagne de vaccination gratuite pour tous les âges.',
        type: 'sante',
        category: 'sante',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '09:00',
        endTime: '17:00',
        address: 'Centre de santé, Conakry',
        venue: 'Salle de consultation',
        latitude: 9.540,
        longitude: -13.670,
        isFree: true,
        capacity: 200,
        tags: ['santé', 'vaccination', 'gratuit']
      }
    ];

    const headers = { Authorization: `Bearer ${this.token}` };

    for (const event of fakeEvents) {
      try {
        const response = await axios.post(`${this.baseURL}/events`, event, { headers });
        if (response.data.success) {
          this.results.events.created++;
          console.log(`✅ Événement créé: ${event.title}`);
        }
      } catch (error) {
        console.error(`❌ Erreur création événement "${event.title}":`, error.message);
      }
    }

    this.results.events.success = this.results.events.created > 0;
  }

  async createFakeMessages() {
    console.log('\n💬 Création de Messages fictifs...');
    
    const fakeConversations = [
      {
        participants: ['test@communiconnect.gn'],
        name: 'Conversation Test 1'
      },
      {
        participants: ['test@communiconnect.gn'],
        name: 'Conversation Test 2'
      },
      {
        participants: ['test@communiconnect.gn'],
        name: 'Conversation Test 3'
      }
    ];

    const fakeMessages = [
      'Bonjour ! Comment allez-vous ?',
      'Avez-vous des nouvelles du quartier ?',
      'Il y a une réunion demain à 14h.',
      'Merci pour l\'information !',
      'À bientôt !'
    ];

    const headers = { Authorization: `Bearer ${this.token}` };

    for (const conversation of fakeConversations) {
      try {
        // Créer la conversation
        const convResponse = await axios.post(`${this.baseURL}/messages/conversations`, conversation, { headers });
        
        if (convResponse.data.success) {
          const conversationId = convResponse.data.conversation._id;
          
          // Envoyer des messages dans la conversation
          for (const message of fakeMessages) {
            try {
              const msgResponse = await axios.post(`${this.baseURL}/messages/send`, {
                conversationId: conversationId,
                content: message
              }, { headers });
              
              if (msgResponse.data.success) {
                this.results.messages.created++;
                console.log(`✅ Message envoyé: "${message.substring(0, 30)}..."`);
              }
            } catch (error) {
              console.error(`❌ Erreur envoi message:`, error.message);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Erreur création conversation:`, error.message);
      }
    }

    this.results.messages.success = this.results.messages.created > 0;
  }

  async createFakeFriends() {
    console.log('\n👥 Création d\'Invitations d\'Amis fictives...');
    
    const fakeEmails = [
      'mamadou.diallo@communiconnect.gn',
      'fatou.camara@communiconnect.gn',
      'ibrahima.sow@communiconnect.gn',
      'aissatou.barry@communiconnect.gn',
      'ousmane.toure@communiconnect.gn'
    ];

    const headers = { Authorization: `Bearer ${this.token}` };

    for (const email of fakeEmails) {
      try {
        const response = await axios.post(`${this.baseURL}/friends/request`, {
          recipientId: email
        }, { headers });
        
        if (response.data.success) {
          this.results.friends.created++;
          console.log(`✅ Invitation envoyée à: ${email}`);
        }
      } catch (error) {
        console.error(`❌ Erreur invitation "${email}":`, error.message);
      }
    }

    this.results.friends.success = this.results.friends.created > 0;
  }

  async runAll() {
    console.log('🚀 Création de données fictives CommuniConnect...\n');
    
    try {
      await this.authenticate();
      
      if (this.results.auth.success) {
        await this.createFakeLivestreams();
        await this.createFakeEvents();
        await this.createFakeMessages();
        await this.createFakeFriends();
        
        this.generateReport();
      } else {
        console.log('❌ Impossible de créer des données sans authentification');
      }
      
    } catch (error) {
      console.error('Erreur lors de la création des données:', error);
    }
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE CRÉATION DE DONNÉES FICTIVES');
    console.log('=' .repeat(60));
    
    console.log(`\n🔐 Authentification: ${this.results.auth.success ? '✅ Réussi' : '❌ Échoué'}`);
    console.log(`📺 Lives créés: ${this.results.livestreams.created}/5`);
    console.log(`📅 Événements créés: ${this.results.events.created}/5`);
    console.log(`💬 Messages envoyés: ${this.results.messages.created}/15`);
    console.log(`👥 Invitations d'amis: ${this.results.friends.created}/5`);
    
    const totalSuccess = [
      this.results.livestreams.success,
      this.results.events.success,
      this.results.messages.success,
      this.results.friends.success
    ].filter(Boolean).length;
    
    console.log(`\n📈 TAUX DE RÉUSSITE: ${totalSuccess}/4 fonctionnalités`);
    
    if (totalSuccess === 4) {
      console.log('\n🎉 TOUTES LES DONNÉES FICTIVES ONT ÉTÉ CRÉÉES AVEC SUCCÈS !');
      console.log('\n📋 RÉSUMÉ DES DONNÉES CRÉÉES:');
      console.log('- 5 Lives d\'alerte et communautaires');
      console.log('- 5 Événements (nettoyage, formation, sport, culture, santé)');
      console.log('- 3 Conversations avec 15 messages');
      console.log('- 5 Invitations d\'amis');
    } else {
      console.log('\n⚠️ CERTAINES DONNÉES N\'ONT PAS PU ÊTRE CRÉÉES');
    }
    
    console.log('\n🔗 URLs pour tester:');
    console.log('- Lives: http://localhost:3000/livestreams');
    console.log('- Événements: http://localhost:3000/events');
    console.log('- Messages: http://localhost:3000/messages');
    console.log('- Amis: http://localhost:3000/friends');
  }
}

async function main() {
  const creator = new CreateFakeData();
  await creator.runAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CreateFakeData; 