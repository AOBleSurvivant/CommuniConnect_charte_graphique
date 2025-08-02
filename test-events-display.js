const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEventDisplay() {
  try {
    console.log('🧪 Test d\'affichage des événements...');
    
    // 1. Créer un événement
    console.log('📝 Création d\'un événement de test...');
    const eventData = {
      title: 'Test Affichage Événement',
      description: 'Test pour vérifier que l\'événement s\'affiche dans l\'interface',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle de test',
      address: '123 Rue Test, Conakry',
      latitude: 9.537,
      longitude: -13.6785,
      capacity: 50,
      isFree: true,
      price: { amount: 0, currency: 'GNF' }
    };

    const createResponse = await axios.post(`${API_BASE_URL}/events`, eventData);
    console.log('✅ Événement créé:', createResponse.data.data._id);

    // 2. Récupérer tous les événements
    console.log('📋 Récupération de tous les événements...');
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
    
    console.log('📊 Résultats:');
    console.log('- Réponse complète:', JSON.stringify(eventsResponse.data, null, 2));
    
    // Vérifier la structure de la réponse
    const events = eventsResponse.data.events || eventsResponse.data.data || [];
    console.log('- Nombre total d\'événements:', events.length);
    
    const createdEvent = events.find(e => e._id === createResponse.data.data._id);
    if (createdEvent) {
      console.log('✅ Événement trouvé dans la liste:');
      console.log('- ID:', createdEvent._id);
      console.log('- Titre:', createdEvent.title);
      console.log('- Statut:', createdEvent.status);
      console.log('- Type:', createdEvent.type);
    } else {
      console.log('❌ Événement créé non trouvé dans la liste');
      console.log('Événements disponibles:', events.map(e => ({ id: e._id, title: e.title, status: e.status })));
    }

    // 3. Vérifier les événements par statut
    const publishedEvents = events.filter(e => e.status === 'published');
    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    
    console.log('📈 Répartition par statut:');
    console.log('- Événements publiés:', publishedEvents.length);
    console.log('- Événements à venir:', upcomingEvents.length);
    
    // 4. Nettoyer - supprimer l'événement de test
    console.log('🧹 Suppression de l\'événement de test...');
    await axios.delete(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
    console.log('✅ Événement supprimé');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Données:', error.response.data);
    }
  }
}

testEventDisplay(); 