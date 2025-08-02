const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testPhotoProfil() {
  console.log('🔍 DIAGNOSTIC PHOTO DE PROFIL');
  
  try {
    // Test 1: Vérifier si le serveur répond
    console.log('\n1️⃣ Test de connexion au serveur...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/api/health');
      console.log('✅ Serveur accessible:', healthResponse.data.status);
    } catch (error) {
      console.log('❌ Serveur inaccessible:', error.message);
      return;
    }

    // Test 2: Vérifier l'authentification
    console.log('\n2️⃣ Test d\'authentification...');
    let token;
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginResponse.data.token;
      console.log('✅ Authentification réussie');
    } catch (error) {
      console.log('⚠️ Authentification échouée, utilisation du mode développement');
    }

    // Test 3: Vérifier le profil utilisateur
    console.log('\n3️⃣ Test du profil utilisateur...');
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const profileResponse = await axios.get('http://localhost:5000/api/auth/me', { headers });
      
      if (profileResponse.data.user.profilePicture) {
        console.log('✅ ProfilePicture trouvée:', profileResponse.data.user.profilePicture);
        
        // Test 4: Vérifier l'accès à l'image
        console.log('\n4️⃣ Test d\'accès à l\'image...');
        try {
          const imageUrl = `http://localhost:5000${profileResponse.data.user.profilePicture}`;
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          console.log('✅ Image accessible, taille:', imageResponse.data.length, 'bytes');
        } catch (error) {
          console.log('❌ Image inaccessible:', error.message);
          console.log('URL testée:', `http://localhost:5000${profileResponse.data.user.profilePicture}`);
        }
      } else {
        console.log('❌ ProfilePicture manquante dans la réponse');
      }
    } catch (error) {
      console.log('❌ Erreur lors de la récupération du profil:', error.message);
    }

    // Test 5: Vérifier les fichiers d'avatars
    console.log('\n5️⃣ Test des fichiers d\'avatars...');
    const avatarsDir = path.join(__dirname, 'server/static/avatars');
    const avatarFiles = ['U.jpg', 'T.jpg'];
    
    avatarFiles.forEach(file => {
      const filePath = path.join(avatarsDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file} existe (${stats.size} bytes)`);
      } else {
        console.log(`❌ ${file} manquant`);
      }
    });

    // Test 6: Vérifier la route statique
    console.log('\n6️⃣ Test de la route statique...');
    try {
      const staticResponse = await axios.get('http://localhost:5000/api/static/avatars/U.jpg', {
        responseType: 'arraybuffer'
      });
      console.log('✅ Route statique fonctionnelle, taille:', staticResponse.data.length, 'bytes');
    } catch (error) {
      console.log('❌ Route statique inaccessible:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le test
testPhotoProfil().then(() => {
  console.log('\n🎯 DIAGNOSTIC TERMINÉ');
  console.log('\n💡 Solutions possibles:');
  console.log('1. Vérifier que le serveur est démarré sur le port 5000');
  console.log('2. Vérifier que les fichiers d\'avatars existent dans server/static/avatars/');
  console.log('3. Vérifier la configuration CORS');
  console.log('4. Vérifier les logs du serveur pour d\'éventuelles erreurs');
}); 