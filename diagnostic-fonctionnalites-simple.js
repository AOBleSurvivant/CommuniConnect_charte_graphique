const axios = require('axios');

class DiagnosticFonctionnalites {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = null;
    this.results = {
      auth: { success: false, details: [] },
      livestreams: { success: false, details: [] },
      events: { success: false, details: [] },
      messages: { success: false, details: [] },
      friends: { success: false, details: [] },
      profile: { success: false, details: [] },
      overall: { success: false, score: 0, total: 0 }
    };
  }

  async testAuth() {
    console.log('\n🔐 Test d\'authentification...');
    
    try {
      // Test de connexion
      const loginResponse = await axios.post(`${this.baseURL}/auth/login`, {
        identifier: 'test@communiconnect.gn',
        password: 'test123'
      });

      if (loginResponse.data.success) {
        this.token = loginResponse.data.token;
        this.results.auth.details.push('✅ Connexion réussie');
        this.results.auth.details.push(`✅ Token reçu: ${this.token ? 'Oui' : 'Non'}`);
        this.results.auth.success = true;
      } else {
        this.results.auth.details.push('❌ Échec de connexion');
      }
    } catch (error) {
      this.results.auth.details.push(`❌ Erreur d'authentification: ${error.message}`);
      console.error('Erreur auth:', error.response?.data || error.message);
    }
  }

  async testLivestreams() {
    console.log('\n📺 Test de création de Lives...');
    
    if (!this.token) {
      this.results.livestreams.details.push('❌ Pas de token d\'authentification');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      
      // Test de création de live
      const liveData = {
        title: 'Live Test CommuniConnect',
        description: 'Description du live de test',
        type: 'community',
        urgency: 'low',
        isPublic: true,
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre',
          coordinates: {
            latitude: 9.537,
            longitude: -13.6785
          }
        }
      };

      const response = await axios.post(`${this.baseURL}/livestreams`, liveData, { headers });
      
      if (response.data.success) {
        this.results.livestreams.details.push('✅ Live créé avec succès');
        this.results.livestreams.details.push(`✅ ID du live: ${response.data.livestream?._id || 'N/A'}`);
        this.results.livestreams.success = true;
      } else {
        this.results.livestreams.details.push('❌ Échec de création du live');
      }
    } catch (error) {
      this.results.livestreams.details.push(`❌ Erreur création live: ${error.message}`);
      console.error('Erreur live:', error.response?.data || error.message);
    }
  }

  async testEvents() {
    console.log('\n📅 Test de création d\'Événements...');
    
    if (!this.token) {
      this.results.events.details.push('❌ Pas de token d\'authentification');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      
      // Test de création d'événement
      const eventData = {
        title: 'Événement Test CommuniConnect',
        description: 'Description de l\'événement de test',
        type: 'celebration',
        category: 'community',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        startTime: '14:00',
        endTime: '18:00',
        address: 'Conakry, Guinée',
        venue: 'Centre-ville',
        latitude: 9.537,
        longitude: -13.6785,
        isFree: true,
        capacity: 50,
        tags: ['test', 'communauté']
      };

      const response = await axios.post(`${this.baseURL}/events`, eventData, { headers });
      
      if (response.data.success) {
        this.results.events.details.push('✅ Événement créé avec succès');
        this.results.events.details.push(`✅ ID de l'événement: ${response.data.data?._id || 'N/A'}`);
        this.results.events.success = true;
      } else {
        this.results.events.details.push('❌ Échec de création de l\'événement');
      }
    } catch (error) {
      this.results.events.details.push(`❌ Erreur création événement: ${error.message}`);
      console.error('Erreur événement:', error.response?.data || error.message);
    }
  }

  async testMessages() {
    console.log('\n💬 Test d\'envoi de Messages...');
    
    if (!this.token) {
      this.results.messages.details.push('❌ Pas de token d\'authentification');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      
      // Test de création de conversation
      const conversationData = {
        participants: ['test@communiconnect.gn'],
        name: 'Conversation Test'
      };

      const convResponse = await axios.post(`${this.baseURL}/messages/conversations`, conversationData, { headers });
      
      if (convResponse.data.success) {
        this.results.messages.details.push('✅ Conversation créée');
        const conversationId = convResponse.data.conversation?._id;
        
        // Test d'envoi de message
        const messageData = {
          content: 'Message de test CommuniConnect',
          conversationId: conversationId
        };

        const msgResponse = await axios.post(`${this.baseURL}/messages`, messageData, { headers });
        
        if (msgResponse.data.success) {
          this.results.messages.details.push('✅ Message envoyé avec succès');
          this.results.messages.success = true;
        } else {
          this.results.messages.details.push('❌ Échec d\'envoi du message');
        }
      } else {
        this.results.messages.details.push('❌ Échec de création de conversation');
      }
    } catch (error) {
      this.results.messages.details.push(`❌ Erreur messages: ${error.message}`);
      console.error('Erreur messages:', error.response?.data || error.message);
    }
  }

  async testFriends() {
    console.log('\n👥 Test d\'invitation d\'Amis...');
    
    if (!this.token) {
      this.results.friends.details.push('❌ Pas de token d\'authentification');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      
      // Test d'envoi de demande d'ami
      const friendData = {
        recipientId: 'test@communiconnect.gn'
      };

      const response = await axios.post(`${this.baseURL}/friends/request`, friendData, { headers });
      
      if (response.data.success) {
        this.results.friends.details.push('✅ Demande d\'ami envoyée avec succès');
        this.results.friends.success = true;
      } else {
        this.results.friends.details.push('❌ Échec d\'envoi de la demande d\'ami');
      }
    } catch (error) {
      this.results.friends.details.push(`❌ Erreur invitation ami: ${error.message}`);
      console.error('Erreur amis:', error.response?.data || error.message);
    }
  }

  async testProfile() {
    console.log('\n👤 Test de modification de Photo de Profil...');
    
    if (!this.token) {
      this.results.profile.details.push('❌ Pas de token d\'authentification');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${this.token}` };
      
      // Test de mise à jour du profil
      const profileData = {
        firstName: 'Test',
        lastName: 'Utilisateur',
        phone: '+224123456789',
        address: 'Conakry, Guinée'
      };

      const response = await axios.put(`${this.baseURL}/users/profile`, profileData, { headers });
      
      if (response.data.success) {
        this.results.profile.details.push('✅ Profil mis à jour avec succès');
        this.results.profile.success = true;
      } else {
        this.results.profile.details.push('❌ Échec de mise à jour du profil');
      }
    } catch (error) {
      this.results.profile.details.push(`❌ Erreur profil: ${error.message}`);
      console.error('Erreur profil:', error.response?.data || error.message);
    }
  }

  async runAllTests() {
    console.log('🚀 Diagnostic des fonctionnalités CommuniConnect...\n');
    
    try {
      // Tests séquentiels
      await this.testAuth();
      await this.testLivestreams();
      await this.testEvents();
      await this.testMessages();
      await this.testFriends();
      await this.testProfile();
      
      // Calculer le score
      const tests = [this.results.auth, this.results.livestreams, this.results.events, this.results.messages, this.results.friends, this.results.profile];
      const successfulTests = tests.filter(test => test.success).length;
      
      this.results.overall = {
        success: successfulTests >= 4, // Au moins 4/6 tests réussis
        score: successfulTests,
        total: tests.length
      };
      
      this.generateReport();
      
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
    }
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC FONCTIONNALITÉS');
    console.log('=' .repeat(60));
    
    const tests = [
      { name: 'Authentification', result: this.results.auth },
      { name: 'Lives', result: this.results.livestreams },
      { name: 'Événements', result: this.results.events },
      { name: 'Messages', result: this.results.messages },
      { name: 'Amis', result: this.results.friends },
      { name: 'Photo de Profil', result: this.results.profile }
    ];
    
    tests.forEach(test => {
      console.log(`\n${test.name}: ${test.result.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      test.result.details.forEach(detail => {
        console.log(`  ${detail}`);
      });
    });
    
    console.log(`\n🎯 SCORE GLOBAL: ${this.results.overall.score}/${this.results.overall.total}`);
    console.log(`📈 TAUX DE RÉUSSITE: ${Math.round((this.results.overall.score / this.results.overall.total) * 100)}%`);
    
    if (this.results.overall.success) {
      console.log('\n🎉 COMMUNICONNECT EST FONCTIONNEL !');
    } else {
      console.log('\n⚠️ DES PROBLÈMES ONT ÉTÉ IDENTIFIÉS');
      console.log('\n🔧 RECOMMANDATIONS:');
      console.log('1. Vérifier que le serveur backend est démarré');
      console.log('2. Vérifier la connexion à la base de données');
      console.log('3. Vérifier les routes API dans server/routes/');
      console.log('4. Vérifier les modèles dans server/models/');
    }
  }
}

async function main() {
  const diagnostic = new DiagnosticFonctionnalites();
  await diagnostic.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DiagnosticFonctionnalites; 