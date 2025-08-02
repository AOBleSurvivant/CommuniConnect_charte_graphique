const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testFrontendEvents() {
  try {
    console.log('🔍 Test des problèmes frontend...');
    
    // 1. Tester la récupération des événements
    console.log('\n📊 1. Test de récupération des événements...');
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
    console.log('Status:', eventsResponse.status);
    console.log('Nombre d\'événements:', eventsResponse.data.data.events.length);
    console.log('Premier événement:', eventsResponse.data.data.events[0]?.title);
    
    // 2. Créer un événement de test
    console.log('\n📝 2. Création d\'un événement de test...');
    const eventData = {
      title: 'Test Frontend Event',
      description: 'Test pour diagnostiquer les problèmes frontend',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-28',
      endDate: '2024-12-28',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle de test frontend',
      address: '123 Rue Test Frontend, Conakry',
      latitude: 9.537,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' },
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        address: 'Centre, Kaloum, Conakry, Conakry, Guinée',
        venue: 'Salle de test frontend',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      }
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/events`, eventData);
    console.log('✅ Événement créé:', createResponse.data.data._id);
    
    // 3. Vérifier que l'événement apparaît dans la liste
    console.log('\n🔍 3. Vérification de l\'apparition...');
    const updatedEventsResponse = await axios.get(`${API_BASE_URL}/events`);
    const createdEvent = updatedEventsResponse.data.data.events.find(e => e._id === createResponse.data.data._id);
    
    if (createdEvent) {
      console.log('✅ Événement trouvé dans la liste');
      console.log('- Titre:', createdEvent.title);
      console.log('- Type:', createdEvent.type);
      console.log('- Statut:', createdEvent.status);
      console.log('- Organisateur:', createdEvent.organizer);
      console.log('- Participants:', createdEvent.participants?.length || 0);
      console.log('- Localisation:', createdEvent.location);
    } else {
      console.log('❌ Événement non trouvé dans la liste');
    }
    
    // 4. Tester la récupération d'un événement spécifique
    console.log('\n🔍 4. Test de récupération d\'un événement spécifique...');
    try {
      const singleEventResponse = await axios.get(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
      console.log('✅ Événement récupéré individuellement');
      console.log('- Titre:', singleEventResponse.data.data.title);
      console.log('- Description:', singleEventResponse.data.data.description);
    } catch (error) {
      console.log('❌ Erreur lors de la récupération individuelle:', error.response?.data?.message || error.message);
    }
    
    // 5. Nettoyer
    console.log('\n🧹 5. Nettoyage...');
    try {
      await axios.delete(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
      console.log('✅ Événement supprimé');
    } catch (error) {
      console.log('⚠️ Erreur lors de la suppression:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎉 Test frontend terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test frontend:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFrontendEvents(); 