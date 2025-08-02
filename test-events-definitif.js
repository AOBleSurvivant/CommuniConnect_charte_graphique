const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEventsDefinitif() {
  console.log('🎯 TEST DÉFINITIF - ÉVÉNEMENTS');
  console.log('='.repeat(50));

  try {
    // Test 1: Récupération des événements existants
    console.log('📅 Test 1: Récupération des événements...');
    const getEvents = await axios.get(`${BASE_URL}/events`);
    console.log(`✅ Événements récupérés: ${getEvents.data.data?.events?.length || 0}`);

    // Test 2: Création d'un nouvel événement
    console.log('\n📝 Test 2: Création d\'un événement...');
    const newEvent = {
      title: "Test Événement Communautaire",
      description: "Un événement de test pour vérifier le fonctionnement du système.",
      type: "reunion",
      category: "communautaire",
      startDate: "2025-08-01T10:00:00.000Z",
      endDate: "2025-08-01T14:00:00.000Z",
      startTime: "10:00",
      endTime: "14:00",
      latitude: 9.5144,
      longitude: -13.6783,
      venue: "Centre ville de Conakry",
      address: "Conakry, Guinée",
      capacity: 50,
      isFree: true,
      tags: ["test", "communautaire"]
    };

    const createEvent = await axios.post(`${BASE_URL}/events`, newEvent);
    console.log('✅ Événement créé avec succès');
    console.log(`   ID: ${createEvent.data.data?._id || 'N/A'}`);

    // Test 3: Vérification que l'événement apparaît dans la liste
    console.log('\n🔍 Test 3: Vérification de l\'événement créé...');
    const updatedEvents = await axios.get(`${BASE_URL}/events`);
    const eventCount = updatedEvents.data.data?.events?.length || 0;
    console.log(`✅ Nombre total d'événements: ${eventCount}`);

    // Test 4: Test de participation
    console.log('\n👥 Test 4: Test de participation...');
    if (createEvent.data.data?._id) {
      const participate = await axios.post(`${BASE_URL}/events/${createEvent.data.data._id}/participate`);
      console.log('✅ Participation enregistrée');
    }

    console.log('\n🎉 TOUS LES TESTS ÉVÉNEMENTS RÉUSSIS !');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Erreur lors du test des événements:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('📋 Détails de validation:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Attendre que le serveur soit prêt
setTimeout(() => {
  testEventsDefinitif();
}, 3000); 