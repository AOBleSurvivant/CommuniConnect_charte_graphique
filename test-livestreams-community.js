const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Token d'authentification (à remplacer par un vrai token)
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJlZ2lvbiI6IkNvbmFrcnkiLCJwcmVmZWN0dXJlIjoiQ29uYWtyeSIsImNvbW11bmUiOiJLYWxvdW0iLCJxdWFydGllciI6IkNlbnRyZSIsImNvb3JkaW5hdGVzIjp7ImxhdGl0dWRlIjo5LjUzNzAsImxvbmdpdHVkZSI6LTEzLjY3ODV9fSwiaWF0IjoxNzMyNzQ5NjAwLCJleHAiOjE3MzI4MzYwMDB9.test';

// Configuration axios avec token d'authentification
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

console.log('🎥 Test de l\'API des Lives Communautaires CommuniConnect\n');

// Fonction pour créer un live communautaire
async function createCommunityLive(liveData) {
  try {
    console.log(`📹 Création du live: ${liveData.title}`);
    const response = await api.post('/livestreams', liveData);
    console.log(`✅ Live créé avec succès: ${response.data.message}`);
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de la création du live: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Fonction pour récupérer les lives de la communauté
async function getCommunityLives() {
  try {
    console.log('📋 Récupération des lives communautaires...');
    const response = await api.get('/livestreams');
    console.log(`✅ ${response.data.data.length} lives récupérés`);
    
    console.log('📋 Détails des lives:');
    response.data.data.forEach((stream, index) => {
      console.log(`${index + 1}. ${stream.title} (${stream.type})`);
      console.log(`   Urgence: ${stream.urgency}`);
      console.log(`   Visibilité: ${stream.visibility}`);
      console.log(`   Auteur: ${stream.author.firstName} ${stream.author.lastName}`);
      console.log(`   Spectateurs: ${stream.stats.currentViewers}`);
      console.log('');
    });
    
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de la récupération des lives: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

// Fonction pour récupérer les alertes
async function getAlerts() {
  try {
    console.log('🚨 Récupération des alertes en direct...');
    const response = await api.get('/livestreams/alerts');
    console.log(`✅ ${response.data.data.length} alertes récupérées`);
    
    console.log('🚨 Alertes en cours:');
    response.data.data.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.title}`);
      console.log(`   Urgence: ${alert.urgency}`);
      console.log(`   Localisation: ${alert.location.quartier}, ${alert.location.commune}`);
      console.log(`   Spectateurs: ${alert.stats.currentViewers}`);
      console.log('');
    });
    
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de la récupération des alertes: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

// Fonction pour récupérer les lives d'un quartier spécifique
async function getCommunityStreams(quartier, commune) {
  try {
    console.log(`🏘️ Récupération des lives du quartier ${quartier}...`);
    const response = await api.get(`/livestreams/community?quartier=${quartier}&commune=${commune}`);
    console.log(`✅ ${response.data.data.length} lives du quartier récupérés`);
    
    console.log(`🏘️ Lives du quartier ${quartier}:`);
    response.data.data.forEach((stream, index) => {
      console.log(`${index + 1}. ${stream.title} (${stream.type})`);
      console.log(`   Urgence: ${stream.urgency}`);
      console.log(`   Auteur: ${stream.author.firstName} ${stream.author.lastName}`);
      console.log('');
    });
    
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de la récupération des lives du quartier: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

// Fonction pour obtenir un live spécifique
async function getLiveStream(id) {
  try {
    console.log(`📺 Récupération du live ${id}...`);
    const response = await api.get(`/livestreams/${id}`);
    console.log(`✅ Live récupéré: ${response.data.data.title}`);
    
    const stream = response.data.data;
    console.log(`📊 Détails du live:`);
    console.log(`   Titre: ${stream.title}`);
    console.log(`   Type: ${stream.type}`);
    console.log(`   Urgence: ${stream.urgency}`);
    console.log(`   Visibilité: ${stream.visibility}`);
    console.log(`   Localisation: ${stream.location.quartier}, ${stream.location.commune}`);
    console.log(`   Spectateurs actuels: ${stream.stats.currentViewers}`);
    console.log(`   Messages: ${stream.messages?.length || 0}`);
    console.log('');
    
    return stream;
  } catch (error) {
    console.log(`❌ Erreur lors de la récupération du live: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Fonction pour démarrer un live
async function startLiveStream(id) {
  try {
    console.log(`▶️ Démarrage du live ${id}...`);
    const response = await api.post(`/livestreams/${id}/start`);
    console.log(`✅ Live démarré avec succès: ${response.data.message}`);
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors du démarrage du live: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Fonction pour rejoindre un live
async function joinLiveStream(id) {
  try {
    console.log(`👥 Rejoindre le live ${id}...`);
    const response = await api.post(`/livestreams/${id}/join`);
    console.log(`✅ Rejoint le live avec succès: ${response.data.message}`);
    return true;
  } catch (error) {
    console.log(`❌ Erreur lors de la connexion au live: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Fonction pour envoyer un message
async function sendMessage(id, message) {
  try {
    console.log(`💬 Envoi du message: "${message}"`);
    const response = await api.post(`/livestreams/${id}/message`, { message });
    console.log(`✅ Message envoyé avec succès: ${response.data.message}`);
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de l'envoi du message: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Fonction pour ajouter une réaction
async function addReaction(id, reactionType) {
  try {
    console.log(`👍 Ajout de la réaction: ${reactionType}`);
    const response = await api.post(`/livestreams/${id}/reaction`, { type: reactionType });
    console.log(`✅ Réaction ajoutée avec succès: ${response.data.message}`);
    return response.data.data;
  } catch (error) {
    console.log(`❌ Erreur lors de l'ajout de la réaction: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test principal
async function runTests() {
  const createdLives = [];

  // Test 1: Création de lives communautaires
  console.log('=== Test 1: Création de lives communautaires ===');
  
  // Alerte urgente
  const alertData = {
    type: 'alert',
    title: 'Incendie dans le quartier Centre',
    description: 'Incendie signalé rue principale, pompiers en route',
    urgency: 'critical',
    visibility: 'quartier'
  };

  // Réunion de quartier
  const meetingData = {
    type: 'meeting',
    title: 'Réunion de quartier - Propreté',
    description: 'Réunion mensuelle pour discuter de la propreté du quartier',
    urgency: 'low',
    visibility: 'quartier'
  };

  // Session de sensibilisation
  const sensitizationData = {
    type: 'sensitization',
    title: 'Sensibilisation sur la propreté',
    description: 'Session de sensibilisation sur la gestion des déchets',
    urgency: 'medium',
    visibility: 'commune'
  };

  const alertLive = await createCommunityLive(alertData);
  if (alertLive) createdLives.push(alertLive);

  const meetingLive = await createCommunityLive(meetingData);
  if (meetingLive) createdLives.push(meetingLive);

  const sensitizationLive = await createCommunityLive(sensitizationData);
  if (sensitizationLive) createdLives.push(sensitizationLive);

  console.log(`📊 ${createdLives.length} lives communautaires créés avec succès\n`);

  // Test 2: Récupération des lives communautaires
  console.log('=== Test 2: Récupération des lives communautaires ===');
  await getCommunityLives();

  // Test 3: Récupération des alertes
  console.log('=== Test 3: Récupération des alertes ===');
  await getAlerts();

  // Test 4: Récupération des lives d'un quartier spécifique
  console.log('=== Test 4: Récupération des lives du quartier Centre ===');
  await getCommunityStreams('Centre', 'Kaloum');

  // Test 5: Obtenir un live spécifique
  if (createdLives.length > 0) {
    console.log('=== Test 5: Récupération d\'un live spécifique ===');
    const firstLive = createdLives[0];
    await getLiveStream(firstLive._id);
  }

  // Test 6: Démarrer un live
  if (createdLives.length > 0) {
    console.log('=== Test 6: Démarrage d\'un live ===');
    const firstLive = createdLives[0];
    await startLiveStream(firstLive._id);
  }

  // Test 7: Rejoindre un live
  if (createdLives.length > 0) {
    console.log('=== Test 7: Rejoindre un live ===');
    const firstLive = createdLives[0];
    await joinLiveStream(firstLive._id);
  }

  // Test 8: Envoyer des messages
  if (createdLives.length > 0) {
    console.log('=== Test 8: Envoi de messages ===');
    const firstLive = createdLives[0];
    await sendMessage(firstLive._id, 'Merci pour l\'information !');
    await sendMessage(firstLive._id, 'Les pompiers arrivent bientôt');
  }

  // Test 9: Ajouter des réactions
  if (createdLives.length > 0) {
    console.log('=== Test 9: Ajout de réactions ===');
    const firstLive = createdLives[0];
    await addReaction(firstLive._id, 'like');
    await addReaction(firstLive._id, 'alert');
  }

  console.log('✅ Tests terminés avec succès!');
}

// Exécuter les tests
runTests().catch(console.error); 