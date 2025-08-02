const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEventCreation() {
  try {
    console.log('🧪 Test de création d\'événement avec dates identiques...');
    
    const eventData = {
      title: 'Test événement avec dates identiques',
      description: 'Test pour vérifier que la validation des dates accepte des dates identiques',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-25',
      endDate: '2024-12-25', // Même date que startDate
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle communale',
      address: '123 Rue Test, Conakry',
      latitude: 9.5370,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' }
    };

    console.log('📤 Envoi des données:', JSON.stringify(eventData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Succès ! Événement créé avec des dates identiques');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test:');
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data);
    } else {
      console.error('🔍 Erreur:', error.message);
    }
  }
}

// Test avec des dates différentes (doit aussi fonctionner)
async function testEventCreationDifferentDates() {
  try {
    console.log('\n🧪 Test de création d\'événement avec dates différentes...');
    
    const eventData = {
      title: 'Test événement avec dates différentes',
      description: 'Test pour vérifier que la validation des dates accepte des dates différentes',
      type: 'formation',
      category: 'educatif',
      startDate: '2024-12-25',
      endDate: '2024-12-26', // Date différente
      startTime: '09:00',
      endTime: '17:00',
      venue: 'Centre de formation',
      address: '456 Avenue Test, Conakry',
      latitude: 9.5370,
      longitude: -13.6785,
      capacity: 30,
      isFree: true,
      price: { amount: 0, currency: 'GNF' }
    };

    console.log('📤 Envoi des données:', JSON.stringify(eventData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Succès ! Événement créé avec des dates différentes');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test:');
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data);
    } else {
      console.error('🔍 Erreur:', error.message);
    }
  }
}

// Test avec date de fin antérieure (doit échouer)
async function testEventCreationInvalidDates() {
  try {
    console.log('\n🧪 Test de création d\'événement avec date de fin antérieure (doit échouer)...');
    
    const eventData = {
      title: 'Test événement avec date de fin antérieure',
      description: 'Test pour vérifier que la validation rejette une date de fin antérieure',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-26',
      endDate: '2024-12-25', // Date antérieure
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle communale',
      address: '123 Rue Test, Conakry',
      latitude: 9.5370,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' }
    };

    console.log('📤 Envoi des données:', JSON.stringify(eventData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Erreur: Le test aurait dû échouer mais a réussi');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Succès ! La validation a correctement rejeté la date de fin antérieure');
      console.log('📝 Message d\'erreur:', error.response.data.message);
    } else {
      console.error('❌ Erreur inattendue:', error.message);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests de validation des dates...\n');
  
  await testEventCreation();
  await testEventCreationDifferentDates();
  await testEventCreationInvalidDates();
  
  console.log('\n🏁 Tests terminés !');
}

runAllTests(); 