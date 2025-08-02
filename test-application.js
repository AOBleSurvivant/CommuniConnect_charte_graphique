const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testApplication() {
  console.log('🧪 Test de l\'application CommuniConnect...\n');

  try {
    // Test 1: Vérifier que le serveur fonctionne
    console.log('1️⃣ Test de santé du serveur...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Serveur en ligne:', healthResponse.data.message);

    // Test 2: Test d'authentification
    console.log('\n2️⃣ Test d\'authentification...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Connexion réussie:', loginResponse.data.message);
    console.log('   Token généré:', loginResponse.data.token ? 'Oui' : 'Non');

    // Test 3: Test des routes d'amis
    console.log('\n3️⃣ Test des routes d\'amis...');
    const friendsResponse = await axios.get(`${API_BASE}/friends/list`);
    console.log('✅ Route des amis accessible:', friendsResponse.data.success);

    // Test 4: Test des routes d'alertes
    console.log('\n4️⃣ Test des routes d\'alertes...');
    const alertsResponse = await axios.get(`${API_BASE}/alerts`);
    console.log('✅ Route des alertes accessible:', alertsResponse.data.success);

    // Test 5: Test des données géographiques
    console.log('\n5️⃣ Test des données géographiques...');
    const geographyResponse = await axios.get(`${API_BASE}/locations/guinea-geography`);
    console.log('✅ Données géographiques accessibles:', geographyResponse.data.success);

    console.log('\n🎉 Tous les tests sont passés ! L\'application fonctionne correctement.');
    console.log('\n📋 Résumé :');
    console.log('   ✅ Serveur backend opérationnel');
    console.log('   ✅ Authentification fonctionnelle');
    console.log('   ✅ Routes d\'amis accessibles');
    console.log('   ✅ Routes d\'alertes accessibles');
    console.log('   ✅ Données géographiques disponibles');
    console.log('\n🌐 Application prête à être utilisée !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    console.log('\n🔧 Suggestions de correction :');
    console.log('   - Vérifier que le serveur backend est démarré');
    console.log('   - Vérifier que le port 5000 est disponible');
    console.log('   - Vérifier les variables d\'environnement');
  }
}

testApplication(); 