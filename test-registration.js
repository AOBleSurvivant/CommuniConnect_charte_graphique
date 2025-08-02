const axios = require('axios');

async function testRegistration() {
  console.log('🧪 Test de l\'API d\'inscription...\n');

  try {
    // 1. Test de santé du serveur
    console.log('1️⃣ Test de santé du serveur...');
    const healthResponse = await axios.get('http://localhost:5000/api/auth');
    console.log('✅ Serveur en ligne:', healthResponse.data.message);

    // 2. Test d'inscription avec données valides
    console.log('\n2️⃣ Test d\'inscription...');
    const testUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '22412345678',
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Almamya I',
      address: 'Almamya I, Kaloum, Conakry, Guinée',
      latitude: 9.5144,
      longitude: -13.6783,
      dateOfBirth: '1990-01-01',
      gender: 'Homme'
    };

    console.log('Données envoyées:', testUserData);

    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUserData);
    console.log('✅ Inscription réussie:', registerResponse.data);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testRegistration(); 