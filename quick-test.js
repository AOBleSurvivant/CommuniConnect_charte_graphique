const axios = require('axios');

console.log('🧪 Test rapide CommuniConnect...\n');

// Test simple d'authentification
axios.post('http://localhost:5000/api/auth/login', {
  identifier: 'test@communiconnect.gn',
  password: 'test123'
})
.then(response => {
  if (response.data.success) {
    console.log('✅ Authentification réussie');
    const token = response.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test création live
    return axios.post('http://localhost:5000/api/livestreams', {
      title: 'Test Live Fictif',
      description: 'Test de création de live',
      type: 'alert',
      urgency: 'critical',
      isPublic: true,
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: { latitude: 9.537, longitude: -13.6785 }
      }
    }, { headers });
  }
})
.then(response => {
  if (response && response.data.success) {
    console.log('✅ Live créé avec succès');
  }
})
.catch(error => {
  console.log('❌ Erreur:', error.message);
});

console.log('Test en cours...'); 