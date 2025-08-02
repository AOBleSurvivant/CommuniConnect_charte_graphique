const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Données de test pour les alertes
const testAlerts = [
  {
    title: "Accident de circulation sur la route de Donka",
    description: "Accident grave impliquant deux véhicules sur la route principale de Donka. La circulation est complètement bloquée. Les services d'urgence sont sur place.",
  type: "accident",
  category: "circulation",
  priority: "urgent",
    quartier: "Donka",
    address: "Route de Donka, près du marché central",
    latitude: 9.5370,
    longitude: -13.6785,
    impactRadius: 3
  },
  {
    title: "Coupure d'électricité dans le quartier Almamya",
    description: "Coupure d'électricité généralisée dans tout le quartier Almamya depuis 2 heures. La SOGEL est au courant et travaille pour rétablir le courant.",
  type: "infrastructure",
  category: "coupure_electricite",
    priority: "important",
    quartier: "Almamya",
    address: "Quartier Almamya, zone résidentielle",
    latitude: 9.5470,
    longitude: -13.6885,
    impactRadius: 5
  },
  {
    title: "Manifestation prévue demain matin",
    description: "Manifestation prévue demain matin à 8h sur la route de Kaloum. Les manifestants demandent une amélioration des conditions de vie. Circulation perturbée attendue.",
    type: "securite",
    category: "manifestation",
  priority: "information",
    quartier: "Kaloum",
    address: "Route de Kaloum, centre-ville",
    latitude: 9.5270,
    longitude: -13.6685,
    impactRadius: 2
  },
  {
    title: "Inondation dans le quartier Ratoma",
    description: "Suite aux fortes pluies, plusieurs rues du quartier Ratoma sont inondées. Les habitants sont invités à la prudence et à éviter les zones inondées.",
    type: "meteo",
    category: "inondation",
    priority: "important",
    quartier: "Ratoma",
    address: "Quartier Ratoma, zones basses",
    latitude: 9.5570,
    longitude: -13.6985,
    impactRadius: 4
  },
  {
    title: "Agression signalée près du marché de Madina",
    description: "Agression signalée hier soir près du marché de Madina. Les autorités sont en train d'enquêter. Les habitants sont invités à la vigilance.",
    type: "securite",
    category: "agression",
    priority: "important",
    quartier: "Madina",
    address: "Marché de Madina, zone commerciale",
    latitude: 9.5170,
    longitude: -13.6585,
    impactRadius: 2
  }
];

// Fonction pour créer une alerte de test
async function createTestAlert(alertData) {
  try {
    console.log(`🚨 Création de l'alerte: ${alertData.title}`);
    
        const response = await axios.post(`${API_BASE_URL}/alerts`, alertData, {
      headers: {
        'Content-Type': 'application/json'
        // Pas d'authentification en mode développement pour les tests
      }
    });

    console.log(`✅ Alerte créée avec succès:`, response.data.message);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de l'alerte:`, error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction pour récupérer toutes les alertes
async function getAlerts() {
  try {
    console.log('📋 Récupération de toutes les alertes...');
    
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    
    console.log(`✅ ${response.data.data.alerts.length} alertes récupérées`);
    return response.data.data.alerts;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des alertes:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour récupérer les alertes urgentes
async function getUrgentAlerts() {
  try {
    console.log('🚨 Récupération des alertes urgentes...');
    
    const response = await axios.get(`${API_BASE_URL}/alerts/urgent`);
    
    console.log(`✅ ${response.data.data.length} alertes urgentes récupérées`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des alertes urgentes:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour récupérer les alertes à proximité
async function getNearbyAlerts() {
  try {
    console.log('📍 Récupération des alertes à proximité...');
    
    const response = await axios.get(`${API_BASE_URL}/alerts/nearby?latitude=9.5370&longitude=-13.6785&radius=5`);
    
    console.log(`✅ ${response.data.data.length} alertes à proximité récupérées`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des alertes à proximité:', error.response?.data?.message || error.message);
    return [];
  }
}

// Fonction pour confirmer une alerte
async function confirmAlert(alertId) {
  try {
    console.log(`✅ Confirmation de l'alerte ${alertId}...`);
    
    const response = await axios.post(`${API_BASE_URL}/alerts/${alertId}/confirm`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Alerte confirmée avec succès');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation:', error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction pour ajouter une mise à jour à une alerte
async function addAlertUpdate(alertId, updateContent) {
  try {
    console.log(`📝 Ajout d'une mise à jour à l'alerte ${alertId}...`);
    
    const response = await axios.post(`${API_BASE_URL}/alerts/${alertId}/update`, {
      content: updateContent
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Mise à jour ajoutée avec succès');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la mise à jour:', error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction principale de test
async function runTests() {
console.log('🚨 Test de l\'API des Alertes d\'Urgence\n');

  // Test 1: Créer des alertes de test
  console.log('=== Test 1: Création d\'alertes de test ===');
  const createdAlerts = [];
  
  for (const alertData of testAlerts) {
    const createdAlert = await createTestAlert(alertData);
    if (createdAlert) {
      createdAlerts.push(createdAlert);
    }
    // Attendre un peu entre chaque création
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 ${createdAlerts.length} alertes créées avec succès\n`);

  // Test 2: Récupérer toutes les alertes
  console.log('=== Test 2: Récupération de toutes les alertes ===');
  const allAlerts = await getAlerts();
  
  if (allAlerts.length > 0) {
    console.log('📋 Détails des alertes:');
    allAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.title} (${alert.priority})`);
      console.log(`   Localisation: ${alert.location?.quartier}, ${alert.location?.commune}`);
      console.log(`   Créée le: ${new Date(alert.createdAt).toLocaleString('fr-FR')}\n`);
    });
  }

  // Test 3: Récupérer les alertes urgentes
  console.log('=== Test 3: Récupération des alertes urgentes ===');
  const urgentAlerts = await getUrgentAlerts();
  
  if (urgentAlerts.length > 0) {
    console.log('🚨 Alertes urgentes:');
    urgentAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.title}`);
    });
  }

  // Test 4: Récupérer les alertes à proximité
  console.log('\n=== Test 4: Récupération des alertes à proximité ===');
  const nearbyAlerts = await getNearbyAlerts();
  
  if (nearbyAlerts.length > 0) {
    console.log('📍 Alertes à proximité:');
    nearbyAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.title} (${alert.location?.quartier})`);
    });
  }

  // Test 5: Confirmer une alerte (si des alertes existent)
  if (createdAlerts.length > 0) {
    console.log('\n=== Test 5: Confirmation d\'une alerte ===');
    const firstAlert = createdAlerts[0];
    await confirmAlert(firstAlert._id);
  }

  // Test 6: Ajouter une mise à jour (si des alertes existent)
  if (createdAlerts.length > 0) {
    console.log('\n=== Test 6: Ajout d\'une mise à jour ===');
    const firstAlert = createdAlerts[0];
    await addAlertUpdate(firstAlert._id, "Mise à jour: La situation est maintenant sous contrôle. Les services d'urgence ont terminé leur intervention.");
  }

  console.log('\n✅ Tests terminés avec succès!');
}

// Exécuter les tests
runTests().catch(console.error); 