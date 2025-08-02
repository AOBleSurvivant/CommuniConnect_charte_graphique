const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPhotoProfil() {
  console.log('🔍 TEST PHOTO DE PROFIL');
  
  try {
    // Test 1: Vérifier la route de téléchargement de photo de profil
    console.log('\n📸 Test 1: Route photo de profil...');
    const response1 = await axios.get(`${BASE_URL}/auth/profile/picture`);
    console.log('✅ Route accessible:', response1.status);
    
    // Test 2: Essayer de télécharger une photo (simulation)
    console.log('\n📤 Test 2: Téléchargement photo...');
    const formData = new FormData();
    formData.append('profilePicture', 'test-image.jpg');
    
    try {
      const response2 = await axios.post(`${BASE_URL}/auth/profile/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('✅ Téléchargement réussi:', response2.data);
    } catch (error) {
      console.log('❌ Erreur téléchargement:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.log('❌ Erreur générale:', error.response?.status, error.response?.data);
  }
}

testPhotoProfil(); 