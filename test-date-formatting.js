const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDateFormatting() {
  try {
    console.log('🧪 Test de formatage des dates...');
    
    // 1. Créer un événement avec des dates spécifiques
    console.log('📝 Création d\'un événement de test...');
    const eventData = {
      title: 'Test Formatage Dates',
      description: 'Test pour vérifier le formatage des dates',
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

    // 2. Récupérer l'événement créé
    console.log('📋 Récupération de l\'événement...');
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
    console.log('📊 Structure de la réponse:', JSON.stringify(eventsResponse.data, null, 2));
    
    const events = eventsResponse.data.data?.events || eventsResponse.data.events || [];
    console.log('📋 Événements trouvés:', events.length);
    console.log('📋 IDs des événements:', events.map(e => e._id));
    
    const createdEvent = events.find(e => e._id === createResponse.data.data._id);
    if (createdEvent) {
      console.log('✅ Événement trouvé:');
      console.log('- ID:', createdEvent._id);
      console.log('- Titre:', createdEvent.title);
      console.log('- startDate:', createdEvent.startDate);
      console.log('- endDate:', createdEvent.endDate);
      console.log('- startTime:', createdEvent.startTime);
      console.log('- endTime:', createdEvent.endTime);
      
      // 3. Tester le formatage des dates
      console.log('\n📅 Test de formatage:');
      
      // Test formatDate
      const testDate = new Date(createdEvent.startDate);
      console.log('- Date brute:', createdEvent.startDate);
      console.log('- Date formatée:', testDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
      
      // Test formatTime
      console.log('- Heure brute:', `${createdEvent.startTime} - ${createdEvent.endTime}`);
      
    } else {
      console.log('❌ Événement créé non trouvé');
    }

    // 4. Nettoyer
    console.log('🧹 Suppression de l\'événement de test...');
    await axios.delete(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
    console.log('✅ Événement supprimé');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

testDateFormatting(); 