const axios = require('axios');

class TestProblemesSpecifiques {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.results = {
      serveur: { success: false, details: [] },
      auth: { success: false, details: [] },
      routes: { success: false, details: [] },
      database: { success: false, details: [] }
    };
  }

  async testServeur() {
    console.log('\n🔍 Test de connexion au serveur...');
    
    try {
      const response = await axios.get(`${this.baseURL}/health`, { timeout: 5000 });
      this.results.serveur.details.push('✅ Serveur accessible');
      this.results.serveur.success = true;
    } catch (error) {
      this.results.serveur.details.push(`❌ Serveur inaccessible: ${error.message}`);
      console.error('Erreur serveur:', error.message);
    }
  }

  async testAuth() {
    console.log('\n🔐 Test d\'authentification...');
    
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        identifier: 'test@communiconnect.gn',
        password: 'test123'
      }, { timeout: 5000 });

      if (response.data.success) {
        this.results.auth.details.push('✅ Authentification réussie');
        this.results.auth.success = true;
        return response.data.token;
      } else {
        this.results.auth.details.push('❌ Authentification échouée');
      }
    } catch (error) {
      this.results.auth.details.push(`❌ Erreur auth: ${error.message}`);
      console.error('Erreur auth:', error.response?.data || error.message);
    }
    return null;
  }

  async testRoutes(token) {
    console.log('\n🛣️ Test des routes API...');
    
    const routes = [
      { name: 'Lives', path: '/livestreams', method: 'GET' },
      { name: 'Événements', path: '/events', method: 'GET' },
      { name: 'Messages', path: '/messages', method: 'GET' },
      { name: 'Amis', path: '/friends', method: 'GET' },
      { name: 'Utilisateurs', path: '/users', method: 'GET' }
    ];

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    for (const route of routes) {
      try {
        const response = await axios({
          method: route.method,
          url: `${this.baseURL}${route.path}`,
          headers,
          timeout: 5000
        });
        
        this.results.routes.details.push(`✅ Route ${route.name}: Accessible`);
      } catch (error) {
        this.results.routes.details.push(`❌ Route ${route.name}: ${error.response?.status || 'Erreur'}`);
      }
    }

    this.results.routes.success = this.results.routes.details.filter(d => d.includes('✅')).length >= 3;
  }

  async testDatabase() {
    console.log('\n🗄️ Test de la base de données...');
    
    try {
      // Test de connexion à MongoDB
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/communiconnect', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      this.results.database.details.push('✅ Connexion MongoDB réussie');
      this.results.database.success = true;
      
      await mongoose.disconnect();
    } catch (error) {
      this.results.database.details.push(`❌ Erreur MongoDB: ${error.message}`);
      console.error('Erreur DB:', error.message);
    }
  }

  async runDiagnostic() {
    console.log('🚀 Diagnostic des problèmes CommuniConnect...\n');
    
    try {
      await this.testServeur();
      
      if (this.results.serveur.success) {
        const token = await this.testAuth();
        await this.testRoutes(token);
        await this.testDatabase();
      }
      
      this.generateReport();
      
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
    }
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC');
    console.log('=' .repeat(50));
    
    const tests = [
      { name: 'Serveur', result: this.results.serveur },
      { name: 'Authentification', result: this.results.auth },
      { name: 'Routes API', result: this.results.routes },
      { name: 'Base de données', result: this.results.database }
    ];
    
    tests.forEach(test => {
      console.log(`\n${test.name}: ${test.result.success ? '✅ OK' : '❌ PROBLÈME'}`);
      test.result.details.forEach(detail => {
        console.log(`  ${detail}`);
      });
    });
    
    console.log('\n🔧 SOLUTIONS RECOMMANDÉES:');
    
    if (!this.results.serveur.success) {
      console.log('1. Démarrer le serveur: cd server && npm start');
    }
    
    if (!this.results.auth.success) {
      console.log('2. Vérifier les identifiants de test dans server/data/');
    }
    
    if (!this.results.routes.success) {
      console.log('3. Vérifier les routes dans server/routes/');
    }
    
    if (!this.results.database.success) {
      console.log('4. Installer et démarrer MongoDB');
    }
    
    console.log('\n📝 PROBLÈMES IDENTIFIÉS:');
    console.log('- Création de lives: Vérifier /api/livestreams');
    console.log('- Création d\'événements: Vérifier /api/events');
    console.log('- Envoi de messages: Vérifier /api/messages');
    console.log('- Invitations d\'amis: Vérifier /api/friends');
    console.log('- Photo de profil: Vérifier /api/users');
  }
}

async function main() {
  const diagnostic = new TestProblemesSpecifiques();
  await diagnostic.runDiagnostic();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestProblemesSpecifiques; 