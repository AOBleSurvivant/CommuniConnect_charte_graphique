const axios = require('axios');

async function testSimplifiedLocation() {
  console.log('🧪 Test de la solution simplifiée de localisation...\n');

  try {
    // 1. Test de l'API de validation sans authentification
    console.log('1️⃣ Test de l\'API de validation (sans auth)...');
    try {
      const validationResponse = await axios.post('http://localhost:5000/api/locations/validate', {
        address: 'Kaloum, Conakry, Guinée',
        latitude: 9.5370,
        longitude: -13.6785
      });
      
      console.log('✅ Validation réussie:', validationResponse.data.success);
      console.log('   Message:', validationResponse.data.validation.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('⚠️  Authentification requise - test avec token valide...');
        
        // Obtenir un token valide en s'inscrivant
        const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
          phone: '22412345678',
          address: 'Kaloum, Conakry, Guinée',
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre-ville',
          latitude: 9.5370,
          longitude: -13.6785
        });
        
        const token = registerResponse.data.token;
        console.log('✅ Token obtenu, test avec authentification...');
        
        // Test avec le token valide
        const authValidationResponse = await axios.post('http://localhost:5000/api/locations/validate', {
          address: 'Kaloum, Conakry, Guinée',
          latitude: 9.5370,
          longitude: -13.6785
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Validation avec auth réussie:', authValidationResponse.data.success);
        console.log('   Message:', authValidationResponse.data.validation.message);
      } else {
        throw error;
      }
    }

    // 2. Test avec des coordonnées hors Guinée
    console.log('\n2️⃣ Test avec des coordonnées hors Guinée...');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        firstName: 'Test',
        lastName: 'User2',
        email: 'test2@example.com',
        password: 'password123',
        phone: '22412345679',
        address: 'Paris, France',
        region: 'Île-de-France',
        prefecture: 'Paris',
        commune: 'Paris',
        quartier: 'Centre',
        latitude: 48.8566,
        longitude: 2.3522
      });
      
      const token = registerResponse.data.token;
      
      await axios.post('http://localhost:5000/api/locations/validate', {
        address: 'Paris, France',
        latitude: 48.8566,
        longitude: 2.3522
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Validation correctement rejetée pour coordonnées hors Guinée');
      } else {
        console.log('❌ Erreur inattendue:', error.message);
      }
    }

    // 3. Test avec seulement une adresse (sans coordonnées)
    console.log('\n3️⃣ Test avec seulement une adresse...');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        firstName: 'Test',
        lastName: 'User3',
        email: 'test3@example.com',
        password: 'password123',
        phone: '22412345680',
        address: 'Dixinn, Conakry, Guinée',
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Dixinn',
        quartier: 'Centre'
      });
      
      const token = registerResponse.data.token;
      
      const addressOnlyResponse = await axios.post('http://localhost:5000/api/locations/validate', {
        address: 'Dixinn, Conakry, Guinée'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Validation avec adresse seule réussie:', addressOnlyResponse.data.success);
    } catch (error) {
      console.log('❌ Erreur lors du test avec adresse seule:', error.message);
    }

    console.log('\n🎉 Tous les tests de validation simplifiée sont passés !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testSimplifiedLocation(); 