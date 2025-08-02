const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC COMPLET - PHOTO DE PROFIL');
console.log('=' .repeat(60));

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Fonction pour vérifier si le serveur est démarré
async function checkServerStatus() {
  console.log('\n1️⃣ Vérification du serveur backend...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/status`, {
      timeout: 5000
    });
    
    if (response.data.success) {
      console.log('✅ Serveur backend opérationnel');
      return true;
    } else {
      console.log('❌ Serveur backend non opérationnel');
      return false;
    }
  } catch (error) {
    console.log('❌ Serveur backend inaccessible:', error.message);
    console.log('💡 Solution: Démarrer le serveur avec "npm start" dans le dossier server/');
    return false;
  }
}

// Fonction pour tester l'authentification
async function testAuthentication() {
  console.log('\n2️⃣ Test d\'authentification...');
  
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
  console.log('\n3️⃣ Test d\'upload de photo de profil...');
  
  try {
    // Créer un fichier image factice pour le test
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    const testImageContent = Buffer.from('fake-image-data', 'utf8');
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
      console.log('✅ Upload de photo réussi');
      console.log('📸 Nouvelle photo:', response.data.profilePicture);
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
    }
    
    return null;
  }
}

// Fonction pour vérifier l'affichage de la photo
async function testPhotoDisplay(token) {
  console.log('\n4️⃣ Test d\'affichage de la photo...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.user.profilePicture) {
      console.log('✅ Photo de profil disponible:', response.data.user.profilePicture);
      
      // Tester l'accès à l'image
      try {
        const imageUrl = `${API_BASE_URL}${response.data.user.profilePicture}`;
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 5000
        });
        
        if (imageResponse.status === 200) {
          console.log('✅ Image accessible (taille:', imageResponse.data.length, 'bytes)');
          return true;
        } else {
          console.log('❌ Image non accessible');
          return false;
        }
      } catch (imageError) {
        console.log('❌ Erreur accès image:', imageError.message);
        return false;
      }
    } else {
      console.log('❌ Aucune photo de profil trouvée');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur récupération profil:', error.response?.data?.message || error.message);
    return false;
  }
}

// Fonction pour vérifier la configuration CORS
async function checkCORSConfiguration() {
  console.log('\n5️⃣ Vérification de la configuration CORS...');
  
  try {
    const response = await axios.options(`${API_BASE_URL}/api/auth/profile/picture`, {
      headers: {
        'Origin': CLIENT_URL,
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    const corsHeaders = response.headers;
    console.log('✅ Headers CORS présents');
    console.log('   Access-Control-Allow-Origin:', corsHeaders['access-control-allow-origin']);
    console.log('   Access-Control-Allow-Methods:', corsHeaders['access-control-allow-methods']);
    console.log('   Access-Control-Allow-Headers:', corsHeaders['access-control-allow-headers']);
    
    return true;
  } catch (error) {
    console.log('❌ Problème CORS:', error.message);
    console.log('💡 Solution: Vérifier la configuration CORS dans server/index.js');
    return false;
  }
}

// Fonction pour vérifier les fichiers statiques
function checkStaticFiles() {
  console.log('\n6️⃣ Vérification des fichiers statiques...');
  
  const avatarsDir = path.join(__dirname, 'server/static/avatars');
  
  if (fs.existsSync(avatarsDir)) {
    const files = fs.readdirSync(avatarsDir);
    console.log('✅ Dossier avatars trouvé');
    console.log('📁 Fichiers disponibles:', files.join(', '));
    
    if (files.length > 0) {
      console.log('✅ Fichiers d\'avatars présents');
      return true;
    } else {
      console.log('❌ Aucun fichier d\'avatar trouvé');
      return false;
    }
  } else {
    console.log('❌ Dossier avatars manquant');
    console.log('💡 Solution: Créer le dossier server/static/avatars/');
    return false;
  }
}

// Fonction principale
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic complet...\n');
  
  const results = {
    server: false,
    auth: false,
    upload: false,
    display: false,
    cors: false,
    static: false
  };
  
  // Test 1: Serveur
  results.server = await checkServerStatus();
  
  if (!results.server) {
    console.log('\n❌ DIAGNOSTIC ARRÊTÉ - Serveur non disponible');
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Ouvrir un terminal dans le dossier server/');
    console.log('2. Exécuter: npm install');
    console.log('3. Exécuter: npm start');
    console.log('4. Attendre que le serveur démarre (port 5000)');
    return;
  }
  
  // Test 2: Authentification
  const token = await testAuthentication();
  results.auth = !!token;
  
  if (!token) {
    console.log('\n❌ DIAGNOSTIC ARRÊTÉ - Authentification échouée');
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Vérifier que la base de données est connectée');
    console.log('2. Créer un compte de test si nécessaire');
    console.log('3. Vérifier les identifiants de connexion');
    return;
  }
  
  // Test 3: Upload
  results.upload = await testPhotoUpload(token);
  
  // Test 4: Affichage
  results.display = await testPhotoDisplay(token);
  
  // Test 5: CORS
  results.cors = await checkCORSConfiguration();
  
  // Test 6: Fichiers statiques
  results.static = checkStaticFiles();
  
  // Résultats
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSULTATS DU DIAGNOSTIC');
  console.log('=' .repeat(60));
  
  const total = Object.keys(results).length;
  const success = Object.values(results).filter(Boolean).length;
  
  console.log(`🖥️ Serveur: ${results.server ? '✅' : '❌'}`);
  console.log(`🔐 Auth: ${results.auth ? '✅' : '❌'}`);
  console.log(`📤 Upload: ${results.upload ? '✅' : '❌'}`);
  console.log(`🖼️ Affichage: ${results.display ? '✅' : '❌'}`);
  console.log(`🌐 CORS: ${results.cors ? '✅' : '❌'}`);
  console.log(`📁 Statiques: ${results.static ? '✅' : '❌'}`);
  
  console.log(`\n📈 Score: ${success}/${total} tests réussis`);
  
  // Recommandations
  console.log('\n🔧 RECOMMANDATIONS:');
  
  if (!results.upload) {
    console.log('• Vérifier la configuration multer dans server/index.js');
    console.log('• Vérifier les permissions du dossier uploads/');
    console.log('• Vérifier la taille maximale des fichiers');
  }
  
  if (!results.display) {
    console.log('• Vérifier que les fichiers statiques sont servis correctement');
    console.log('• Vérifier les chemins d\'accès aux images');
  }
  
  if (!results.cors) {
    console.log('• Configurer CORS pour accepter multipart/form-data');
    console.log('• Vérifier les origines autorisées');
  }
  
  if (!results.static) {
    console.log('• Créer le dossier server/static/avatars/');
    console.log('• Ajouter quelques images d\'exemple');
  }
  
  console.log('\n💡 Pour tester l\'interface:');
  console.log('   Ouvrez http://localhost:3000 et essayez de changer votre photo');
}

// Exécuter le diagnostic
runDiagnostic().catch(error => {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}); 