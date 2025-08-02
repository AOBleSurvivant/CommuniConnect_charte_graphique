const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function diagnosticEvents() {
  try {
    console.log('🔍 Diagnostic des événements...');
    
    // 1. Vérifier l'état initial
    console.log('\n📊 1. État initial des événements...');
    const initialResponse = await axios.get(`${API_BASE_URL}/events`);
    console.log('Status:', initialResponse.status);
    console.log('Structure de la réponse:', Object.keys(initialResponse.data));
    
    const initialEvents = initialResponse.data.data?.events || initialResponse.data.events || [];
    console.log('Nombre d\'événements initial:', initialEvents.length);
    console.log('IDs des événements:', initialEvents.map(e => e._id));
    
    // 2. Créer un événement de test
    console.log('\n📝 2. Création d\'un événement de test...');
    const eventData = {
      title: 'Test Diagnostic',
      description: 'Test pour diagnostiquer le problème d\'affichage',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-27',
      endDate: '2024-12-27',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle de diagnostic',
      address: '123 Rue Diagnostic, Conakry',
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
        venue: 'Salle de diagnostic',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      }
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/events`, eventData);
    console.log('✅ Événement créé:', createResponse.data.data._id);
    console.log('Statut:', createResponse.data.data.status);
    
    // 3. Vérifier immédiatement après création
    console.log('\n🔍 3. Vérification immédiate...');
    const immediateResponse = await axios.get(`${API_BASE_URL}/events`);
    const immediateEvents = immediateResponse.data.data?.events || immediateResponse.data.events || [];
    
    const foundEvent = immediateEvents.find(e => e._id === createResponse.data.data._id);
    if (foundEvent) {
      console.log('✅ Événement trouvé immédiatement');
      console.log('- Titre:', foundEvent.title);
      console.log('- Statut:', foundEvent.status);
      console.log('- Date de début:', foundEvent.startDate);
    } else {
      console.log('❌ Événement NON trouvé immédiatement');
      console.log('IDs disponibles:', immediateEvents.map(e => e._id));
    }
    
    // 4. Vérifier la structure de la réponse
    console.log('\n📋 4. Structure détaillée de la réponse...');
    console.log('Toutes les clés de la réponse:', Object.keys(immediateResponse.data));
    if (immediateResponse.data.data) {
      console.log('Clés de data:', Object.keys(immediateResponse.data.data));
    }
    
    // 5. Vérifier les filtres backend
    console.log('\n🔍 5. Vérification des filtres...');
    const allEventsResponse = await axios.get(`${API_BASE_URL}/events?limit=100&page=1`);
    const allEvents = allEventsResponse.data.data?.events || allEventsResponse.data.events || [];
    console.log('Nombre total d\'événements (sans limite):', allEvents.length);
    
    const testEvent = allEvents.find(e => e._id === createResponse.data.data._id);
    if (testEvent) {
      console.log('✅ Événement trouvé dans la liste complète');
      console.log('- Statut:', testEvent.status);
      console.log('- Type:', testEvent.type);
      console.log('- Catégorie:', testEvent.category);
    } else {
      console.log('❌ Événement toujours non trouvé');
    }
    
    // 6. Nettoyer
    console.log('\n🧹 6. Nettoyage...');
    try {
      await axios.delete(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
      console.log('✅ Événement supprimé');
    } catch (deleteError) {
      console.log('⚠️ Erreur lors de la suppression:', deleteError.response?.data?.message || deleteError.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

diagnosticEvents(); 