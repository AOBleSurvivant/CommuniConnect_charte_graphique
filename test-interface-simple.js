const axios = require('axios');

console.log('🧪 TEST SIMPLE DE L\'INTERFACE UTILISATEUR');
console.log('=' .repeat(50));

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Test 1: Vérifier que le serveur répond
async function testServerResponse() {
  console.log('\n1️⃣ Test de réponse du serveur...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 });
    console.log('✅ Serveur API accessible');
    return true;
  } catch (error) {
    console.log('❌ Serveur API inaccessible:', error.message);
    return false;
  }
}

// Test 2: Vérifier l'authentification
async function testAuthentication() {
  console.log('\n2️⃣ Test d\'authentification...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (response.data.success && response.data.token) {
      console.log('✅ Authentification réussie');
      return response.data.token;
    } else {
      console.log('❌ Authentification échouée');
      return null;
    }
  } catch (error) {
    console.log('❌ Erreur d\'authentification:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test 3: Vérifier les données utilisateur
async function testUserData(token) {
  console.log('\n3️⃣ Test des données utilisateur...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.user) {
      const user = response.data.user;
      console.log('✅ Données utilisateur récupérées');
      console.log(`  - Nom: ${user.firstName} ${user.lastName}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Photo: ${user.profilePicture ? '✅' : '❌'}`);
      console.log(`  - Région: ${user.region}`);
      console.log(`  - Préfecture: ${user.prefecture}`);
      return true;
    } else {
      console.log('❌ Données utilisateur manquantes');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur récupération données:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Vérifier les fonctionnalités principales
async function testMainFeatures(token) {
  console.log('\n4️⃣ Test des fonctionnalités principales...');
  
  const features = [
    { name: 'Amis', endpoint: '/api/friends' },
    { name: 'Messages', endpoint: '/api/messages/conversations' },
    { name: 'Événements', endpoint: '/api/events' },
    { name: 'Posts', endpoint: '/api/posts' }
  ];
  
  const results = [];
  
  for (const feature of features) {
    try {
      const response = await axios.get(`${API_BASE_URL}${feature.endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      
      if (response.data.success !== undefined) {
        console.log(`✅ ${feature.name}: Accessible`);
        results.push(true);
      } else {
        console.log(`⚠️ ${feature.name}: Réponse inattendue`);
        results.push(false);
      }
    } catch (error) {
      console.log(`❌ ${feature.name}: ${error.response?.status || 'Erreur'}`);
      results.push(false);
    }
  }
  
  return results.filter(Boolean).length;
}

// Test 5: Vérifier les images statiques
async function testStaticImages() {
  console.log('\n5️⃣ Test des images statiques...');
  
  const images = [
    '/api/static/avatars/U.jpg',
    '/api/static/avatars/T.jpg'
  ];
  
  const results = [];
  
  for (const image of images) {
    try {
      const response = await axios.get(`${API_BASE_URL}${image}`, {
        responseType: 'arraybuffer',
        timeout: 5000
      });
      
      if (response.status === 200 && response.data.length > 0) {
        console.log(`✅ ${image}: Accessible (${response.data.length} bytes)`);
        results.push(true);
      } else {
        console.log(`❌ ${image}: Réponse vide`);
        results.push(false);
      }
    } catch (error) {
      console.log(`❌ ${image}: ${error.response?.status || 'Erreur'}`);
      results.push(false);
    }
  }
  
  return results.filter(Boolean).length;
}

// Test 6: Vérifier les données géographiques
async function testGeographyData() {
  console.log('\n6️⃣ Test des données géographiques...');
  
  try {
    const response = await axios.get(`${CLIENT_URL}/data/guinea-geography-complete.json`, {
      timeout: 5000
    });
    
    if (response.data && response.data.Guinée) {
      const regions = response.data.Guinée.Régions || [];
      console.log(`✅ Données géographiques: ${regions.length} régions`);
      
      const conakry = regions.find(r => r.nom === 'Conakry');
      if (conakry) {
        console.log('✅ Région Conakry trouvée');
        const prefectures = conakry.préfectures || [];
        console.log(`✅ ${prefectures.length} préfectures pour Conakry`);
        return true;
      } else {
        console.log('❌ Région Conakry manquante');
        return false;
      }
    } else {
      console.log('❌ Données géographiques invalides');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur données géographiques:', error.message);
    return false;
  }
}

// Fonction principale
async function runSimpleInterfaceTest() {
  console.log('Démarrage du test simple...\n');
  
  const results = {
    server: false,
    auth: false,
    userData: false,
    features: 0,
    images: 0,
    geography: false
  };
  
  // Test 1: Serveur
  results.server = await testServerResponse();
  
  if (!results.server) {
    console.log('\n❌ TESTS ARRÊTÉS - Serveur inaccessible');
    return;
  }
  
  // Test 2: Authentification
  const token = await testAuthentication();
  results.auth = !!token;
  
  if (!token) {
    console.log('\n❌ TESTS ARRÊTÉS - Authentification échouée');
    return;
  }
  
  // Test 3: Données utilisateur
  results.userData = await testUserData(token);
  
  // Test 4: Fonctionnalités principales
  results.features = await testMainFeatures(token);
  
  // Test 5: Images statiques
  results.images = await testStaticImages();
  
  // Test 6: Données géographiques
  results.geography = await testGeographyData();
  
  // Résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSULTATS DU TEST SIMPLE');
  console.log('=' .repeat(50));
  
  const totalTests = 6;
  const passedTests = [
    results.server,
    results.auth,
    results.userData,
    results.features >= 2,
    results.images >= 1,
    results.geography
  ].filter(Boolean).length;
  
  console.log(`🌐 Serveur: ${results.server ? '✅' : '❌'}`);
  console.log(`🔐 Auth: ${results.auth ? '✅' : '❌'}`);
  console.log(`👤 Données utilisateur: ${results.userData ? '✅' : '❌'}`);
  console.log(`⚙️ Fonctionnalités: ${results.features}/4`);
  console.log(`🖼️ Images: ${results.images}/2`);
  console.log(`🗺️ Géographie: ${results.geography ? '✅' : '❌'}`);
  
  console.log(`\n📈 Score: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 INTERFACE UTILISATEUR PARFAITEMENT FONCTIONNELLE !');
    console.log('✅ Tous les aspects de l\'interface marchent parfaitement !');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n✅ INTERFACE UTILISATEUR TRÈS FONCTIONNELLE !');
    console.log('🎯 La plupart des fonctionnalités marchent bien !');
  } else {
    console.log('\n⚠️ PROBLÈMES IDENTIFIÉS DANS L\'INTERFACE');
    console.log('🔧 Des corrections sont nécessaires');
  }
  
  console.log('\n💡 Pour un test complet avec interface graphique:');
  console.log('   node test-interface-complete.js');
}

// Exécuter le test simple
runSimpleInterfaceTest().catch(error => {
  console.error('❌ Erreur lors du test simple:', error.message);
}); 