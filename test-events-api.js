const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Données de test pour les événements
const testEvents = [
  {
    title: "Réunion de quartier - Propreté et sécurité",
    description: "Réunion mensuelle du comité de quartier pour discuter des questions de propreté, sécurité et amélioration de notre environnement. Tous les habitants sont invités à participer et à apporter leurs suggestions.",
    type: "reunion",
    category: "communautaire",
    startDate: "2024-02-15T18:00:00.000Z",
    endDate: "2024-02-15T20:00:00.000Z",
    startTime: "18:00",
    endTime: "20:00",
    venue: "Centre communautaire",
    address: "123 Avenue de la République",
    quartier: "Kaloum Centre",
    commune: "Kaloum",
    prefecture: "Conakry",
    region: "Conakry",
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 50,
    isFree: true,
    tags: ["communauté", "propreté", "sécurité"]
  },
  {
    title: "Formation en informatique pour débutants",
    description: "Formation gratuite d'initiation à l'informatique pour les adultes. Apprenez les bases de l'utilisation d'un ordinateur, d'Internet et des outils numériques essentiels.",
    type: "formation",
    category: "educatif",
    startDate: "2024-02-20T14:00:00.000Z",
    endDate: "2024-02-20T17:00:00.000Z",
    startTime: "14:00",
    endTime: "17:00",
    venue: "Bibliothèque municipale",
    address: "456 Rue de l'Éducation",
    quartier: "Dixinn",
    commune: "Dixinn",
    prefecture: "Conakry",
    region: "Conakry",
    latitude: 9.5470,
    longitude: -13.6885,
    capacity: 20,
    isFree: true,
    tags: ["formation", "informatique", "éducation"]
  },
  {
    title: "Campagne de nettoyage du quartier",
    description: "Grande opération de nettoyage du quartier. Apportez vos gants et vos outils de nettoyage. Ensemble, rendons notre quartier plus propre et plus agréable à vivre !",
    type: "nettoyage",
    category: "environnement",
    startDate: "2024-02-25T08:00:00.000Z",
    endDate: "2024-02-25T12:00:00.000Z",
    startTime: "08:00",
    endTime: "12:00",
    venue: "Place du marché",
    address: "789 Boulevard de l'Environnement",
    quartier: "Ratoma",
    commune: "Ratoma",
    prefecture: "Conakry",
    region: "Conakry",
    latitude: 9.5570,
    longitude: -13.6985,
    capacity: 100,
    isFree: true,
    tags: ["nettoyage", "environnement", "communauté"]
  },
  {
    title: "Festival de musique traditionnelle",
    description: "Festival annuel de musique traditionnelle guinéenne. Découvrez les rythmes et mélodies de nos ancêtres avec des artistes locaux et internationaux.",
    type: "festival",
    category: "culturel",
    startDate: "2024-03-01T19:00:00.000Z",
    endDate: "2024-03-01T23:00:00.000Z",
    startTime: "19:00",
    endTime: "23:00",
    venue: "Stade du 28 Septembre",
    address: "Stade du 28 Septembre",
    quartier: "Kaloum",
    commune: "Kaloum",
    prefecture: "Conakry",
    region: "Conakry",
    latitude: 9.5270,
    longitude: -13.6685,
    capacity: 5000,
    isFree: false,
    price: {
      amount: 5000,
      currency: "GNF"
    },
    tags: ["festival", "musique", "culture", "tradition"]
  },
  {
    title: "Tournoi de football de quartier",
    description: "Tournoi de football amical entre les équipes des différents quartiers. Inscription gratuite pour les équipes. Trophées à gagner !",
    type: "sport",
    category: "sportif",
    startDate: "2024-03-10T09:00:00.000Z",
    endDate: "2024-03-10T18:00:00.000Z",
    startTime: "09:00",
    endTime: "18:00",
    venue: "Terrain de football municipal",
    address: "Terrain de football",
    quartier: "Almamya",
    commune: "Ratoma",
    prefecture: "Conakry",
    region: "Conakry",
    latitude: 9.5170,
    longitude: -13.6585,
    capacity: 200,
    isFree: true,
    tags: ["sport", "football", "tournoi", "amical"]
  }
];

// Fonction pour créer un événement de test
async function createTestEvent(eventData) {
  try {
    console.log(`📅 Création de l'événement: ${eventData.title}`);
    
    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json'
        // Pas d'authentification en mode développement pour les tests
      }
    });

    console.log(`✅ Événement créé avec succès:`, response.data.message);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de l'événement:`, error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction pour récupérer tous les événements
async function getEvents() {
  try {
    console.log('📋 Récupération de tous les événements...');
    
    const response = await axios.get(`${API_BASE_URL}/events`);
    
    console.log(`✅ ${response.data.data.events.length} événements récupérés`);
    return response.data.data.events;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour récupérer les événements à venir
async function getUpcomingEvents() {
  try {
    console.log('📅 Récupération des événements à venir...');
    
    const response = await axios.get(`${API_BASE_URL}/events/upcoming`);
    
    console.log(`✅ ${response.data.data.length} événements à venir récupérés`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements à venir:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour récupérer les événements à proximité
async function getNearbyEvents() {
  try {
    console.log('📍 Récupération des événements à proximité...');
    
    const response = await axios.get(`${API_BASE_URL}/events/nearby?latitude=9.5370&longitude=-13.6785&radius=10`);
    
    console.log(`✅ ${response.data.data.length} événements à proximité récupérés`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements à proximité:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour participer à un événement
async function participateInEvent(eventId) {
  try {
    console.log(`✅ Participation à l'événement ${eventId}...`);
    
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/participate`, {
      status: 'confirmed'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Participation enregistrée avec succès');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la participation:', error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction pour signaler un événement
async function reportEvent(eventId) {
  try {
    console.log(`🚨 Signalement de l'événement ${eventId}...`);
    
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/report`, {
      reason: 'inappropriate',
      description: 'Test de signalement'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Événement signalé avec succès');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors du signalement:', error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('📅 Test de l\'API des Événements Communautaires\n');

  // Test 1: Créer des événements de test
  console.log('=== Test 1: Création d\'événements de test ===');
  const createdEvents = [];
  
  for (const eventData of testEvents) {
    const createdEvent = await createTestEvent(eventData);
    if (createdEvent) {
      createdEvents.push(createdEvent);
    }
    // Attendre un peu entre chaque création
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 ${createdEvents.length} événements créés avec succès\n`);

  // Test 2: Récupérer tous les événements
  console.log('=== Test 2: Récupération de tous les événements ===');
  const allEvents = await getEvents();
  
  if (allEvents.length > 0) {
    console.log('📋 Détails des événements:');
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.type})`);
      console.log(`   Lieu: ${event.location?.venue}, ${event.location?.quartier}`);
      console.log(`   Date: ${new Date(event.startDate).toLocaleDateString('fr-FR')} à ${event.startTime}`);
      console.log(`   Participants: ${event.participantsCount || 0}${event.capacity ? ` / ${event.capacity}` : ''}\n`);
    });
  }

  // Test 3: Récupérer les événements à venir
  console.log('=== Test 3: Récupération des événements à venir ===');
  const upcomingEvents = await getUpcomingEvents();
  
  if (upcomingEvents.length > 0) {
    console.log('📅 Événements à venir:');
    upcomingEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Date: ${new Date(event.startDate).toLocaleDateString('fr-FR')}`);
    });
  }

  // Test 4: Récupérer les événements à proximité
  console.log('\n=== Test 4: Récupération des événements à proximité ===');
  const nearbyEvents = await getNearbyEvents();
  
  if (nearbyEvents.length > 0) {
    console.log('📍 Événements à proximité:');
    nearbyEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.location?.quartier})`);
    });
  }

  // Test 5: Participer à un événement (si des événements existent)
  if (createdEvents.length > 0) {
    console.log('\n=== Test 5: Participation à un événement ===');
    // Utiliser un ID MongoDB valide pour les tests
    const testEventId = '507f1f77bcf86cd799439011';
    await participateInEvent(testEventId);
  }

  // Test 6: Signaler un événement (si des événements existent)
  if (createdEvents.length > 0) {
    console.log('\n=== Test 6: Signalement d\'un événement ===');
    // Utiliser un ID MongoDB valide pour les tests
    const testEventId = '507f1f77bcf86cd799439011';
    await reportEvent(testEventId);
  }

  console.log('\n✅ Tests terminés avec succès!');
}

// Exécuter les tests
runTests().catch(console.error); 