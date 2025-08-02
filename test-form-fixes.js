const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testFormFixes() {
  try {
    console.log('🧪 Test des corrections du formulaire...');
    
    // 1. Tester la création d'un événement avec des valeurs par défaut
    const eventData = {
      title: 'Test Formulaire Corrigé',
      description: 'Test pour vérifier les corrections du formulaire',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-26',
      endDate: '2024-12-26',
      startTime: '15:00',
      endTime: '17:00',
      venue: 'Salle de test',
      address: '123 Rue Test, Conakry',
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
        venue: 'Salle de test',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      }
    };
    
    console.log('📤 Données à envoyer:', JSON.stringify(eventData, null, 2));
    
    const createResponse = await axios.post(`${API_BASE_URL}/events`, eventData);
    console.log('✅ Événement créé avec succès:');
    console.log('- ID:', createResponse.data.data._id);
    console.log('- Titre:', createResponse.data.data.title);
    console.log('- Statut:', createResponse.data.data.status);
    console.log('- Localisation:', createResponse.data.data.location);
    
    // 2. Vérifier que l'événement apparaît dans la liste
    console.log('\n📋 Vérification de l\'apparition dans la liste...');
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
    const events = eventsResponse.data.data?.events || eventsResponse.data.events || [];
    
    const createdEvent = events.find(e => e._id === createResponse.data.data._id);
    if (createdEvent) {
      console.log('✅ Événement trouvé dans la liste');
      console.log('- Titre:', createdEvent.title);
      console.log('- Date de début:', createdEvent.startDate);
      console.log('- Date de fin:', createdEvent.endDate);
      console.log('- Localisation:', createdEvent.location);
    } else {
      console.log('❌ Événement non trouvé dans la liste');
    }
    
    // 3. Nettoyer - supprimer l'événement de test
    console.log('\n🧹 Nettoyage...');
    await axios.delete(`${API_BASE_URL}/events/${createResponse.data.data._id}`);
    console.log('✅ Événement de test supprimé');
    
    console.log('\n🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFormFixes(); 