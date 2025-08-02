const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC COMPLET - TOUTES LES FONCTIONNALITÉS');
console.log('=' .repeat(60));

const API_BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Résultats du diagnostic
const results = {
  server: { status: false, details: [] },
  authentication: { status: false, details: [] },
  profile: { status: false, details: [] },
  photoUpload: { status: false, details: [] },
  livestreams: { status: false, details: [] },
  events: { status: false, details: [] },
  friends: { status: false, details: [] },
  messages: { status: false, details: [] },
  posts: { status: false, details: [] },
  notifications: { status: false, details: [] },
  search: { status: false, details: [] },
  staticFiles: { status: false, details: [] }
};

// 1. Test du serveur
async function testServer() {
  console.log('\n1️⃣ Test du serveur backend...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    
    if (response.data.status === 'OK') {
      results.server.status = true;
      results.server.details.push('✅ Serveur opérationnel');
      console.log('✅ Serveur opérationnel');
      return true;
    } else {
      results.server.details.push('❌ Serveur non opérationnel');
      console.log('❌ Serveur non opérationnel');
      return false;
    }
  } catch (error) {
    results.server.details.push(`❌ Serveur inaccessible: ${error.message}`);
    console.log('❌ Serveur inaccessible:', error.message);
    return false;
  }
}

// 2. Test d'authentification
async function testAuthentication() {
  console.log('\n2️⃣ Test d\'authentification...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (response.data.token) {
      results.authentication.status = true;
      results.authentication.details.push('✅ Authentification réussie');
      results.authentication.details.push(`📧 Email: ${response.data.user.email}`);
      results.authentication.details.push(`👤 Nom: ${response.data.user.firstName} ${response.data.user.lastName}`);
      console.log('✅ Authentification réussie');
      return response.data.token;
    } else {
      results.authentication.details.push('❌ Authentification échouée');
      console.log('❌ Authentification échouée');
      return null;
    }
  } catch (error) {
    results.authentication.details.push(`❌ Erreur d'authentification: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur d\'authentification:', error.response?.data?.message || error.message);
    return null;
  }
}

// 3. Test du profil utilisateur
async function testProfile(token) {
  console.log('\n3️⃣ Test du profil utilisateur...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.profile.status = true;
      results.profile.details.push('✅ Profil récupéré avec succès');
      results.profile.details.push(`👤 Utilisateur: ${response.data.user.firstName} ${response.data.user.lastName}`);
      results.profile.details.push(`📧 Email: ${response.data.user.email}`);
      results.profile.details.push(`📱 Téléphone: ${response.data.user.phone}`);
      results.profile.details.push(`📍 Région: ${response.data.user.region}`);
      console.log('✅ Profil récupéré avec succès');
      return true;
    } else {
      results.profile.details.push('❌ Échec de récupération du profil');
      console.log('❌ Échec de récupération du profil');
      return false;
    }
  } catch (error) {
    results.profile.details.push(`❌ Erreur profil: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur profil:', error.response?.data?.message || error.message);
    return false;
  }
}

// 4. Test d'upload de photo de profil
async function testPhotoUpload(token) {
  console.log('\n4️⃣ Test d\'upload de photo de profil...');
  
  try {
    // Créer une image de test
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    const testImageContent = Buffer.from('fake-image-data-for-testing', 'utf8');
    fs.writeFileSync(testImagePath, testImageContent);
    
    // Créer FormData
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('profilePicture', fs.createReadStream(testImagePath));
    
    const response = await axios.put(`${API_BASE_URL}/api/auth/profile/picture`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders()
      },
      timeout: 10000
    });
    
    // Nettoyer le fichier de test
    fs.unlinkSync(testImagePath);
    
    if (response.data.success) {
      results.photoUpload.status = true;
      results.photoUpload.details.push('✅ Upload de photo réussi');
      results.photoUpload.details.push(`📸 URL: ${response.data.profilePicture}`);
      console.log('✅ Upload de photo réussi');
      return response.data.profilePicture;
    } else {
      results.photoUpload.details.push('❌ Upload de photo échoué');
      console.log('❌ Upload de photo échoué');
      return null;
    }
  } catch (error) {
    results.photoUpload.details.push(`❌ Erreur upload: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur upload:', error.response?.data?.message || error.message);
    return null;
  }
}

// 5. Test des livestreams
async function testLivestreams(token) {
  console.log('\n5️⃣ Test des livestreams...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/livestreams`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.livestreams.status = true;
      results.livestreams.details.push('✅ Livestreams récupérés');
      results.livestreams.details.push(`📺 Nombre de livestreams: ${response.data.livestreams.length}`);
      console.log('✅ Livestreams récupérés');
      return true;
    } else {
      results.livestreams.details.push('❌ Échec de récupération des livestreams');
      console.log('❌ Échec de récupération des livestreams');
      return false;
    }
  } catch (error) {
    results.livestreams.details.push(`❌ Erreur livestreams: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur livestreams:', error.response?.data?.message || error.message);
    return false;
  }
}

// 6. Test des événements
async function testEvents(token) {
  console.log('\n6️⃣ Test des événements...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.events.status = true;
      results.events.details.push('✅ Événements récupérés');
      results.events.details.push(`📅 Nombre d\'événements: ${response.data.events.length}`);
      console.log('✅ Événements récupérés');
      return true;
    } else {
      results.events.details.push('❌ Échec de récupération des événements');
      console.log('❌ Échec de récupération des événements');
      return false;
    }
  } catch (error) {
    results.events.details.push(`❌ Erreur événements: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur événements:', error.response?.data?.message || error.message);
    return false;
  }
}

// 7. Test des amis
async function testFriends(token) {
  console.log('\n7️⃣ Test des amis...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/friends`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.friends.status = true;
      results.friends.details.push('✅ Liste d\'amis récupérée');
      results.friends.details.push(`👥 Nombre d\'amis: ${response.data.friends.length}`);
      console.log('✅ Liste d\'amis récupérée');
      return true;
    } else {
      results.friends.details.push('❌ Échec de récupération des amis');
      console.log('❌ Échec de récupération des amis');
      return false;
    }
  } catch (error) {
    results.friends.details.push(`❌ Erreur amis: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur amis:', error.response?.data?.message || error.message);
    return false;
  }
}

// 8. Test des messages
async function testMessages(token) {
  console.log('\n8️⃣ Test des messages...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.messages.status = true;
      results.messages.details.push('✅ Messages récupérés');
      results.messages.details.push(`💬 Nombre de messages: ${response.data.messages.length}`);
      console.log('✅ Messages récupérés');
      return true;
    } else {
      results.messages.details.push('❌ Échec de récupération des messages');
      console.log('❌ Échec de récupération des messages');
      return false;
    }
  } catch (error) {
    results.messages.details.push(`❌ Erreur messages: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur messages:', error.response?.data?.message || error.message);
    return false;
  }
}

// 9. Test des posts
async function testPosts(token) {
  console.log('\n9️⃣ Test des posts...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.posts.status = true;
      results.posts.details.push('✅ Posts récupérés');
      results.posts.details.push(`📝 Nombre de posts: ${response.data.posts.length}`);
      console.log('✅ Posts récupérés');
      return true;
    } else {
      results.posts.details.push('❌ Échec de récupération des posts');
      console.log('❌ Échec de récupération des posts');
      return false;
    }
  } catch (error) {
    results.posts.details.push(`❌ Erreur posts: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur posts:', error.response?.data?.message || error.message);
    return false;
  }
}

// 10. Test des notifications
async function testNotifications(token) {
  console.log('\n🔟 Test des notifications...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.notifications.status = true;
      results.notifications.details.push('✅ Notifications récupérées');
      results.notifications.details.push(`🔔 Nombre de notifications: ${response.data.notifications.length}`);
      console.log('✅ Notifications récupérées');
      return true;
    } else {
      results.notifications.details.push('❌ Échec de récupération des notifications');
      console.log('❌ Échec de récupération des notifications');
      return false;
    }
  } catch (error) {
    results.notifications.details.push(`❌ Erreur notifications: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur notifications:', error.response?.data?.message || error.message);
    return false;
  }
}

// 11. Test de la recherche
async function testSearch(token) {
  console.log('\n1️⃣1️⃣ Test de la recherche...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/search?q=test`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      results.search.status = true;
      results.search.details.push('✅ Recherche fonctionnelle');
      results.search.details.push(`🔍 Résultats trouvés: ${response.data.total}`);
      console.log('✅ Recherche fonctionnelle');
      return true;
    } else {
      results.search.details.push('❌ Échec de la recherche');
      console.log('❌ Échec de la recherche');
      return false;
    }
  } catch (error) {
    results.search.details.push(`❌ Erreur recherche: ${error.response?.data?.message || error.message}`);
    console.log('❌ Erreur recherche:', error.response?.data?.message || error.message);
    return false;
  }
}

// 12. Test des fichiers statiques
async function testStaticFiles() {
  console.log('\n1️⃣2️⃣ Test des fichiers statiques...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/static/avatars/U.jpg`, {
      timeout: 5000
    });
    
    if (response.status === 200) {
      results.staticFiles.status = true;
      results.staticFiles.details.push('✅ Fichiers statiques accessibles');
      results.staticFiles.details.push(`📏 Taille du fichier: ${response.data.length} bytes`);
      console.log('✅ Fichiers statiques accessibles');
      return true;
    } else {
      results.staticFiles.details.push('❌ Fichiers statiques non accessibles');
      console.log('❌ Fichiers statiques non accessibles');
      return false;
    }
  } catch (error) {
    results.staticFiles.details.push(`❌ Erreur fichiers statiques: ${error.message}`);
    console.log('❌ Erreur fichiers statiques:', error.message);
    return false;
  }
}

// Fonction pour afficher les résultats
function displayResults() {
  console.log('\n📊 RÉSULTATS DU DIAGNOSTIC COMPLET');
  console.log('=' .repeat(50));
  
  const categories = [
    { name: 'Serveur', key: 'server' },
    { name: 'Authentification', key: 'authentication' },
    { name: 'Profil', key: 'profile' },
    { name: 'Upload Photo', key: 'photoUpload' },
    { name: 'Livestreams', key: 'livestreams' },
    { name: 'Événements', key: 'events' },
    { name: 'Amis', key: 'friends' },
    { name: 'Messages', key: 'messages' },
    { name: 'Posts', key: 'posts' },
    { name: 'Notifications', key: 'notifications' },
    { name: 'Recherche', key: 'search' },
    { name: 'Fichiers Statiques', key: 'staticFiles' }
  ];
  
  let totalTests = 0;
  let passedTests = 0;
  
  categories.forEach(category => {
    const result = results[category.key];
    const status = result.status ? '✅' : '❌';
    console.log(`${status} ${category.name}`);
    
    result.details.forEach(detail => {
      console.log(`   ${detail}`);
    });
    
    totalTests++;
    if (result.status) passedTests++;
    
    console.log('');
  });
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`📈 TAUX DE RÉUSSITE: ${passedTests}/${totalTests} (${successRate}%)`);
  
  if (successRate >= 80) {
    console.log('🎉 EXCELLENT: La plupart des fonctionnalités fonctionnent !');
  } else if (successRate >= 60) {
    console.log('⚠️ BON: Plusieurs fonctionnalités fonctionnent, mais il y a des améliorations à faire.');
  } else {
    console.log('🚨 ATTENTION: Beaucoup de fonctionnalités ne fonctionnent pas correctement.');
  }
}

// Fonction principale
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic complet...\n');
  
  // Test du serveur
  const serverOk = await testServer();
  if (!serverOk) {
    console.log('\n❌ Serveur non accessible - Arrêt du diagnostic');
    return;
  }
  
  // Test d'authentification
  const token = await testAuthentication();
  if (!token) {
    console.log('\n❌ Authentification échouée - Tests limités');
  }
  
  // Tests avec authentification
  if (token) {
    await testProfile(token);
    await testPhotoUpload(token);
    await testLivestreams(token);
    await testEvents(token);
    await testFriends(token);
    await testMessages(token);
    await testPosts(token);
    await testNotifications(token);
    await testSearch(token);
  }
  
  // Tests sans authentification
  await testStaticFiles();
  
  // Afficher les résultats
  displayResults();
}

// Exécuter le diagnostic
runDiagnostic().catch(error => {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}); 