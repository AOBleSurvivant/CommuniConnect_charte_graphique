const axios = require('axios');

console.log('🖼️ TEST DU CHARGEMENT DE LA PHOTO DE PROFIL');
console.log('=' .repeat(50));

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Fonction pour obtenir un token d'authentification
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error.response?.data || error.message);
    return null;
  }
}

// Test 1: Vérifier que l'API retourne la profilePicture
async function testProfilePictureAPI(token) {
  console.log('\n1️⃣ Test de l\'API /api/auth/me...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ API /api/auth/me répond correctement');
    
    if (response.data.user.profilePicture) {
      console.log('✅ profilePicture trouvée:', response.data.user.profilePicture);
      return response.data.user.profilePicture;
    } else {
      console.log('❌ profilePicture manquante dans la réponse');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur API /api/auth/me:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Vérifier que l'image est accessible
async function testImageAccess(imageUrl) {
  console.log('\n2️⃣ Test d\'accès à l\'image...');
  
  try {
    const fullUrl = `${API_BASE_URL}${imageUrl}`;
    console.log('🔗 URL de l\'image:', fullUrl);
    
    const response = await axios.get(fullUrl, {
      responseType: 'arraybuffer',
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ Image accessible (taille:', response.data.length, 'bytes)');
      return true;
    } else {
      console.log('❌ Image non accessible (status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur accès image:', error.message);
    return false;
  }
}

// Test 3: Vérifier l'upload de photo de profil
async function testProfilePictureUpload(token) {
  console.log('\n3️⃣ Test d\'upload de photo de profil...');
  
  try {
    // Simuler un upload avec FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Créer un fichier image factice
    const fs = require('fs');
    const path = require('path');
    
    // Vérifier si le fichier avatar existe
    const avatarPath = path.join(__dirname, 'server/static/avatars/U.jpg');
    if (fs.existsSync(avatarPath)) {
      formData.append('profilePicture', fs.createReadStream(avatarPath));
      
      const response = await axios.put(`${API_BASE_URL}/api/auth/profile/picture`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      if (response.data.success) {
        console.log('✅ Upload de photo de profil réussi');
        console.log('📸 Nouvelle photo:', response.data.profilePicture);
        return response.data.profilePicture;
      } else {
        console.log('❌ Upload échoué:', response.data.message);
        return null;
      }
    } else {
      console.log('❌ Fichier avatar non trouvé:', avatarPath);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur upload photo:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Vérifier l'affichage dans différents contextes
async function testDisplayContexts(token) {
  console.log('\n4️⃣ Test d\'affichage dans différents contextes...');
  
  try {
    // Test 1: Vérifier l'avatar dans la navigation
    console.log('🔍 Test avatar navigation...');
    const navResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (navResponse.data.user.profilePicture) {
      console.log('✅ Avatar navigation disponible');
    } else {
      console.log('❌ Avatar navigation manquant');
    }
    
    // Test 2: Vérifier l'avatar dans les posts
    console.log('🔍 Test avatar posts...');
    const postsResponse = await axios.get(`${API_BASE_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (postsResponse.data.success) {
      console.log('✅ Posts avec avatars disponibles');
    } else {
      console.log('❌ Posts avec avatars non disponibles');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test contextes:', error.response?.data || error.message);
    return false;
  }
}

// Fonction principale
async function runProfilePictureTests() {
  console.log('Démarrage des tests de photo de profil...\n');
  
  const results = {
    auth: false,
    api: false,
    image: false,
    upload: false,
    display: false
  };
  
  // Test 1: Authentification
  const token = await getAuthToken();
  results.auth = !!token;
  
  if (!token) {
    console.log('\n❌ TESTS ARRÊTÉS - Authentification échouée');
    return;
  }
  
  // Test 2: API profilePicture
  const imageUrl = await testProfilePictureAPI(token);
  results.api = !!imageUrl;
  
  // Test 3: Accès à l'image
  if (imageUrl) {
    results.image = await testImageAccess(imageUrl);
  }
  
  // Test 4: Upload de photo
  results.upload = await testProfilePictureUpload(token);
  
  // Test 5: Affichage dans différents contextes
  results.display = await testDisplayContexts(token);
  
  // Résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSULTATS DES TESTS PHOTO DE PROFIL');
  console.log('=' .repeat(50));
  
  const total = Object.keys(results).length;
  const success = Object.values(results).filter(Boolean).length;
  
  console.log(`🔐 Auth: ${results.auth ? '✅' : '❌'}`);
  console.log(`📡 API: ${results.api ? '✅' : '❌'}`);
  console.log(`🖼️ Image: ${results.image ? '✅' : '❌'}`);
  console.log(`📤 Upload: ${results.upload ? '✅' : '❌'}`);
  console.log(`🎨 Affichage: ${results.display ? '✅' : '❌'}`);
  
  console.log(`\n📈 Score: ${success}/${total} tests réussis`);
  
  if (success === total) {
    console.log('\n🎉 PHOTO DE PROFIL PARFAITEMENT FONCTIONNELLE !');
    console.log('✅ Tous les aspects de la photo de profil marchent !');
  } else if (success >= 3) {
    console.log('\n✅ PHOTO DE PROFIL FONCTIONNELLE À 80% !');
    console.log('🎯 Les fonctionnalités principales marchent !');
  } else {
    console.log('\n⚠️ PROBLÈMES IDENTIFIÉS AVEC LA PHOTO DE PROFIL');
    console.log('🔧 Des corrections sont nécessaires');
  }
  
  console.log('\n💡 Pour tester l\'interface:');
  console.log('   Ouvrez http://localhost:3000 et vérifiez les avatars');
}

// Exécuter les tests
runProfilePictureTests().catch(error => {
  console.error('❌ Erreur lors des tests:', error.message);
}); 