const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios avec timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Données de test pour les événements
const testEvents = [
  {
    title: 'Réunion de quartier - Sécurité',
    description: 'Réunion mensuelle pour discuter de la sécurité du quartier et des mesures à prendre',
    type: 'reunion',
    category: 'communautaire',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // + 2 heures
    startTime: '18:00',
    endTime: '20:00',
    venue: 'Salle communale',
    address: 'Place de l\'Indépendance, Centre, Kaloum, Conakry',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 50,
    isFree: true,
    tags: ['sécurité', 'communauté']
  },
  {
    title: 'Nettoyage communautaire',
    description: 'Journée de nettoyage du quartier pour maintenir la propreté',
    type: 'nettoyage',
    category: 'environnement',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dans 3 jours
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // + 4 heures
    startTime: '08:00',
    endTime: '12:00',
    venue: 'Point de rassemblement',
    address: 'Rue principale, Centre, Kaloum, Conakry',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 30,
    isFree: true,
    tags: ['nettoyage', 'environnement']
  },
  {
    title: 'Formation premiers secours',
    description: 'Formation gratuite sur les gestes de premiers secours',
    type: 'formation',
    category: 'sante',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Dans 14 jours
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // + 6 heures
    startTime: '14:00',
    endTime: '20:00',
    venue: 'Salle de formation',
    address: 'Centre de santé, Centre, Kaloum, Conakry',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 25,
    isFree: true,
    tags: ['formation', 'santé']
  }
];

// Données de test pour les alertes
const testAlerts = [
  {
    title: 'Coupure d\'électricité prévue',
    description: 'Coupure d\'électricité prévue dans le quartier Centre de 14h à 16h pour maintenance',
    type: 'infrastructure',
    category: 'coupure_electricite',
    priority: 'important',
    urgency: 'medium',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      coordinates: {
        latitude: 9.5370,
        longitude: -13.6785
      }
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expire dans 24h
    status: 'active'
  },
  {
    title: 'Route bloquée - Travaux',
    description: 'La rue principale est temporairement bloquée pour des travaux de réparation',
    type: 'infrastructure',
    category: 'circulation',
    priority: 'urgent',
    urgency: 'high',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      coordinates: {
        latitude: 9.5370,
        longitude: -13.6785
      }
    },
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // Expire dans 12h
    status: 'active'
  },
  {
    title: 'Personne disparue',
    description: 'Recherche d\'une personne disparue dans le quartier. Contactez les autorités si vous avez des informations.',
    type: 'securite',
    category: 'agression',
    priority: 'urgent',
    urgency: 'critical',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      coordinates: {
        latitude: 9.5370,
        longitude: -13.6785
      }
    },
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Expire dans 48h
    status: 'active'
  }
];

// Données de test pour les posts
const testPosts = [
  {
    content: 'Bonjour à tous ! J\'organise une réunion de quartier ce weekend pour discuter de la sécurité. Venez nombreux !',
    type: 'general',
    visibility: 'public',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    },
    tags: ['communauté', 'sécurité', 'réunion'],
    media: []
  },
  {
    content: 'Vente de fruits frais du marché local. Prix abordables et qualité garantie !',
    type: 'vente',
    visibility: 'public',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    },
    tags: ['vente', 'fruits', 'local'],
    media: []
  },
  {
    content: 'Recherche un plombier pour réparer une fuite d\'eau. Urgent !',
    type: 'besoin',
    visibility: 'public',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    },
    tags: ['aide', 'plomberie', 'urgent'],
    media: []
  }
];

// Données de test pour les livestreams
const testLivestreams = [
  {
    title: 'Réunion de quartier en direct',
    description: 'Réunion de quartier pour discuter de la propreté et de la sécurité',
    type: 'meeting',
    urgency: 'low',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    },
    visibility: 'quartier',
    status: 'live'
  },
  {
    title: 'Alerte météo - Pluies intenses',
    description: 'Alerte météo pour pluies intenses dans la région',
    type: 'alert',
    urgency: 'high',
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    },
    visibility: 'quartier',
    status: 'live'
  }
];

// Fonction pour créer des événements de test
async function createTestEvents() {
  console.log('🎉 Création des événements de test...');
  
  for (const event of testEvents) {
    try {
      const response = await api.post('/events', event);
      console.log(`✅ Événement créé: ${event.title}`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`⚠️ Événement ${event.title}: Nécessite authentification`);
      } else if (error.response?.status === 400) {
        console.log(`❌ Erreur validation événement ${event.title}:`, error.response?.data?.errors || error.response?.data?.message);
      } else {
        console.log(`❌ Erreur création événement ${event.title}:`, error.response?.data?.message || error.message);
      }
    }
  }
}

// Fonction pour créer des alertes de test
async function createTestAlerts() {
  console.log('🚨 Création des alertes de test...');
  
  for (const alert of testAlerts) {
    try {
      const response = await api.post('/alerts', alert);
      console.log(`✅ Alerte créée: ${alert.title}`);
    } catch (error) {
      console.log(`❌ Erreur création alerte ${alert.title}:`, error.response?.data?.message || error.message);
    }
  }
}

// Fonction pour créer des posts de test
async function createTestPosts() {
  console.log('📝 Création des posts de test...');
  
  for (const post of testPosts) {
    try {
      const response = await api.post('/posts', post);
      console.log(`✅ Post créé: ${post.content.substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ Erreur création post:`, error.response?.data?.message || error.message);
    }
  }
}

// Fonction pour créer des livestreams de test
async function createTestLivestreams() {
  console.log('📺 Création des livestreams de test...');
  
  for (const stream of testLivestreams) {
    try {
      const response = await api.post('/livestreams', stream);
      console.log(`✅ Livestream créé: ${stream.title}`);
    } catch (error) {
      console.log(`❌ Erreur création livestream ${stream.title}:`, error.response?.data?.message || error.message);
    }
  }
}

// Fonction pour tester tous les endpoints
async function testAllEndpoints() {
  console.log('🧪 Test de tous les endpoints...');
  
  const endpoints = [
    { url: '/events', method: 'get' },
    { url: '/events/upcoming', method: 'get' },
    { url: '/events/nearby?latitude=9.5370&longitude=-13.6785&radius=10', method: 'get' },
    { url: '/alerts', method: 'get' },
    { url: '/alerts/urgent', method: 'get' },
    { url: '/alerts/nearby?latitude=9.5370&longitude=-13.6785&radius=10', method: 'get' },
    { url: '/posts', method: 'get' },
    { url: '/livestreams', method: 'get' },
    { url: '/livestreams/live', method: 'get' },
    { url: '/livestreams/scheduled', method: 'get' },
    { url: '/livestreams/alerts', method: 'get' },
    { url: '/notifications', method: 'get' },
    { url: '/stats', method: 'get' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint.url);
      console.log(`✅ ${endpoint.url} - OK`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`⚠️ ${endpoint.url} - Nécessite authentification`);
      } else {
        console.log(`❌ ${endpoint.url} - Erreur: ${error.response?.status || error.message}`);
      }
    }
  }
  
  // Test des routes protégées séparément
  const protectedEndpoints = [
    { url: '/friends/list', method: 'get' },
    { url: '/friends/requests', method: 'get' },
    { url: '/search?q=test', method: 'get' }
  ];
  
  console.log('\n🔒 Test des routes protégées (nécessitent authentification):');
  for (const endpoint of protectedEndpoints) {
    try {
      const response = await api.get(endpoint.url);
      console.log(`✅ ${endpoint.url} - OK`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`⚠️ ${endpoint.url} - Nécessite authentification (comportement normal)`);
      } else {
        console.log(`❌ ${endpoint.url} - Erreur: ${error.response?.status || error.message}`);
      }
    }
  }
}

// Fonction principale
async function createTestData() {
  console.log('🚀 Création des données de test CommuniConnect');
  console.log('==============================================');
  
  try {
    // Tester d'abord si le serveur répond
    console.log('🔍 Test de connexion au serveur...');
    const healthResponse = await api.get('/health');
    console.log('✅ Serveur accessible');
    
    // Créer les données de test
    await createTestEvents();
    await createTestAlerts();
    await createTestPosts();
    await createTestLivestreams();
    
    // Tester tous les endpoints
    await testAllEndpoints();
    
    console.log('\n✅ Création des données de test terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error.message);
  }
}

// Exécuter le script
createTestData();