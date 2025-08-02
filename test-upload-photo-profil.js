const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

console.log('📸 TEST UPLOAD PHOTO DE PROFIL - NOUVELLE CONFIGURATION');
console.log('=' .repeat(60));

const API_BASE_URL = 'http://localhost:5000';

// Fonction pour créer une image de test
function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.jpg');
  const testImageContent = Buffer.from('fake-image-data-for-testing', 'utf8');
  fs.writeFileSync(testImagePath, testImageContent);
  return testImagePath;
}

// Fonction pour tester l'authentification
async function testAuthentication() {
  console.log('\n1️⃣ Test d\'authentification...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    
    if (response.data.token) {
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

// Fonction pour tester l'upload de photo
async function testPhotoUpload(token) {
  console.log('\n2️⃣ Test d\'upload de photo de profil...');
  
  try {
    // Créer une image de test
    const testImagePath = createTestImage();
    
    // Créer FormData
    const formData = new FormData();
    formData.append('profilePicture', fs.createReadStream(testImagePath));
    
    console.log('📤 Envoi de la requête d\'upload...');
    
    const response = await axios.put(`${API_BASE_URL}/api/auth/profile/picture`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders()
      },
      timeout: 15000
    });
    
    // Nettoyer le fichier de test
    fs.unlinkSync(testImagePath);
    
    if (response.data.success) {
      console.log('✅ Upload de photo réussi !');
      console.log('📸 URL de la photo:', response.data.profilePicture);
      console.log('📝 Message:', response.data.message);
      return response.data.profilePicture;
    } else {
      console.log('❌ Upload échoué:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Erreur upload:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Vérifier que le serveur est démarré');
    } else if (error.response?.status === 401) {
      console.log('💡 Solution: Vérifier l\'authentification');
    } else if (error.response?.status === 413) {
      console.log('💡 Solution: Réduire la taille de l\'image');
    } else if (error.response?.status === 400) {
      console.log('💡 Solution: Vérifier le format de l\'image');
    }
    
    return null;
  }
}

// Fonction pour tester l'affichage de la photo
async function testPhotoDisplay(photoUrl) {
  console.log('\n3️⃣ Test d\'affichage de la photo...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}${photoUrl}`, {
      timeout: 5000,
      responseType: 'arraybuffer'
    });
    
    if (response.status === 200) {
      console.log('✅ Photo accessible via URL');
      console.log('📏 Taille de la photo:', response.data.length, 'bytes');
      return true;
    } else {
      console.log('❌ Photo non accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur d\'accès à la photo:', error.message);
    return false;
  }
}

// Fonction pour vérifier la configuration du serveur
async function checkServerConfiguration() {
  console.log('\n4️⃣ Vérification de la configuration du serveur...');
  
  try {
    // Vérifier que le serveur répond
    const response = await axios.get(`${API_BASE_URL}/api/auth/status`, {
      timeout: 5000
    });
    
    if (response.data.success) {
      console.log('✅ Serveur opérationnel');
      
      // Vérifier que le dossier avatars existe
      const avatarsDir = path.join(__dirname, 'server/static/avatars');
      if (fs.existsSync(avatarsDir)) {
        console.log('✅ Dossier avatars existe');
        
        // Lister les fichiers dans le dossier
        const files = fs.readdirSync(avatarsDir);
        console.log('📁 Fichiers dans le dossier avatars:', files.length);
        
        return true;
      } else {
        console.log('❌ Dossier avatars manquant');
        return false;
      }
    } else {
      console.log('❌ Serveur non opérationnel');
      return false;
    }
  } catch (error) {
    console.log('❌ Serveur inaccessible:', error.message);
    return false;
  }
}

// Fonction principale
async function runTest() {
  console.log('🚀 Démarrage du test d\'upload de photo de profil...\n');
  
  // Vérifier la configuration du serveur
  const serverOk = await checkServerConfiguration();
  if (!serverOk) {
    console.log('\n❌ Configuration serveur incorrecte');
    console.log('💡 Solutions:');
    console.log('   1. Démarrer le serveur: npm start dans server/');
    console.log('   2. Vérifier que multer est installé: npm install multer');
    console.log('   3. Vérifier que le dossier static/avatars existe');
    return;
  }
  
  // Test d'authentification
  const token = await testAuthentication();
  if (!token) {
    console.log('\n❌ Impossible de s\'authentifier');
    return;
  }
  
  // Test d'upload
  const photoUrl = await testPhotoUpload(token);
  if (!photoUrl) {
    console.log('\n❌ Upload de photo échoué');
    return;
  }
  
  // Test d'affichage
  const displayOk = await testPhotoDisplay(photoUrl);
  
  // Résultats
  console.log('\n📊 RÉSULTATS DU TEST');
  console.log('=' .repeat(30));
  console.log('✅ Configuration serveur: OK');
  console.log('✅ Authentification: OK');
  console.log('✅ Upload de photo: OK');
  console.log(displayOk ? '✅ Affichage photo: OK' : '❌ Affichage photo: ÉCHEC');
  
  if (displayOk) {
    console.log('\n🎉 SUCCÈS: Upload de photo de profil fonctionnel !');
    console.log('📸 URL de la photo:', photoUrl);
  } else {
    console.log('\n⚠️ ATTENTION: Upload réussi mais affichage problématique');
    console.log('💡 Vérifier la configuration des fichiers statiques');
  }
}

// Exécuter le test
runTest().catch(error => {
  console.error('❌ Erreur lors du test:', error.message);
}); 