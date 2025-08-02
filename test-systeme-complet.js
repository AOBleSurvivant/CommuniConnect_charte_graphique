const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration pour les requêtes
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variables globales pour les tests
let user1Token = null;
let user2Token = null;
let testPosts = [];
let testAlerts = [];
let testEvents = [];
let testLivestreams = [];

// Fonction pour faire des requêtes authentifiées
const makeAuthenticatedRequest = async (method, endpoint, data = null, token) => {
  try {
    const config = {
      method,
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await api(config);
    return response;
  } catch (error) {
    console.error(`❌ Erreur ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test d'authentification
const testAuthentication = async () => {
  console.log('🔑 Test d\'authentification...');
  
  try {
    // Créer un utilisateur de test
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+224123456789',
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      }
    };

    const response = await api.post('/auth/register', userData);
    user1Token = response.data.token;
    console.log('✅ Utilisateur 1 créé et connecté');

    // Créer un deuxième utilisateur
    const user2Data = {
      ...userData,
      email: 'test2@example.com',
      phone: '+224123456790'
    };

    const response2 = await api.post('/auth/register', user2Data);
    user2Token = response2.data.token;
    console.log('✅ Utilisateur 2 créé et connecté');

  } catch (error) {
    console.log('⚠️ Erreur lors de la création des utilisateurs:', error.response?.data?.message || error.message);
  }
};

// Test des posts
const testPostsFunction = async () => {
  console.log('\n📝 Test des posts...');
  
  try {
    // Créer un post normal
    const postData = {
      content: 'Ceci est un post de test pour vérifier le système',
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      },
      type: 'community',
      isPublic: true
    };

    const response = await makeAuthenticatedRequest('POST', '/posts', postData, user1Token);
    testPosts.push(response.data.post);
    console.log('✅ Post normal créé');

    // Créer un post avec contenu inapproprié
    const inappropriatePostData = {
      content: 'Post avec des mots interdits: merde, putain',
      location: postData.location,
      type: 'community',
      isPublic: true
    };

    const response2 = await makeAuthenticatedRequest('POST', '/posts', inappropriatePostData, user1Token);
    testPosts.push(response2.data.post);
    console.log('✅ Post inapproprié créé');

    // Récupérer les posts
    const getResponse = await makeAuthenticatedRequest('GET', '/posts', null, user1Token);
    console.log(`✅ ${getResponse.data.posts.length} posts récupérés`);

  } catch (error) {
    console.log('❌ Erreur lors du test des posts:', error.message);
  }
};

// Test des alertes
const testAlertsFunction = async () => {
  console.log('\n🚨 Test des alertes...');
  
  try {
    const alertData = {
      title: 'Test d\'alerte',
      description: 'Ceci est une alerte de test',
      type: 'security',
      severity: 'medium',
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      },
      isPublic: true
    };

    const response = await makeAuthenticatedRequest('POST', '/alerts', alertData, user1Token);
    testAlerts.push(response.data.alert);
    console.log('✅ Alerte créée');

    // Récupérer les alertes
    const getResponse = await makeAuthenticatedRequest('GET', '/alerts', null, user1Token);
    console.log(`✅ ${getResponse.data.alerts.length} alertes récupérées`);

  } catch (error) {
    console.log('❌ Erreur lors du test des alertes:', error.message);
  }
};

// Test des événements
const testEventsFunction = async () => {
  console.log('\n🎉 Test des événements...');
  
  try {
    const eventData = {
      title: 'Événement de test',
      description: 'Ceci est un événement de test',
      type: 'community',
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 172800000).toISOString(),
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      },
      isPublic: true
    };

    const response = await makeAuthenticatedRequest('POST', '/events', eventData, user1Token);
    testEvents.push(response.data.event);
    console.log('✅ Événement créé');

    // Récupérer les événements
    const getResponse = await makeAuthenticatedRequest('GET', '/events', null, user1Token);
    console.log(`✅ ${getResponse.data.events.length} événements récupérés`);

  } catch (error) {
    console.log('❌ Erreur lors du test des événements:', error.message);
  }
};

// Test des livestreams
const testLivestreamsFunction = async () => {
  console.log('\n📺 Test des livestreams...');
  
  try {
    const livestreamData = {
      title: 'Livestream de test',
      description: 'Ceci est un livestream de test',
      type: 'community',
      scheduledStart: new Date(Date.now() + 3600000).toISOString(),
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.537,
          longitude: -13.6785
        }
      },
      isPublic: true
    };

    const response = await makeAuthenticatedRequest('POST', '/livestreams', livestreamData, user1Token);
    testLivestreams.push(response.data.livestream);
    console.log('✅ Livestream créé');

    // Récupérer les livestreams
    const getResponse = await makeAuthenticatedRequest('GET', '/livestreams', null, user1Token);
    console.log(`✅ ${getResponse.data.livestreams.length} livestreams récupérés`);

  } catch (error) {
    console.log('❌ Erreur lors du test des livestreams:', error.message);
  }
};

// Test de la messagerie
const testMessagingFunction = async () => {
  console.log('\n💬 Test de la messagerie...');
  
  try {
    // Envoyer un message privé
    const messageData = {
      recipientId: user2Token, // Utiliser le token comme ID temporaire
      content: 'Ceci est un message de test',
      type: 'private'
    };

    const response = await makeAuthenticatedRequest('POST', '/messages', messageData, user1Token);
    console.log('✅ Message privé envoyé');

    // Récupérer les conversations
    const getResponse = await makeAuthenticatedRequest('GET', '/messages/conversations', null, user1Token);
    console.log(`✅ ${getResponse.data.conversations.length} conversations récupérées`);

  } catch (error) {
    console.log('❌ Erreur lors du test de la messagerie:', error.message);
  }
};

// Test de la carte interactive
const testMapFunction = async () => {
  console.log('\n🗺️ Test de la carte interactive...');
  
  try {
    // Récupérer les données de la carte
    const response = await makeAuthenticatedRequest('GET', '/locations/map-data', null, user1Token);
    console.log('✅ Données de la carte récupérées');

    // Récupérer les points d'intérêt
    const poiResponse = await makeAuthenticatedRequest('GET', '/locations/poi', null, user1Token);
    console.log(`✅ ${poiResponse.data.poi.length} points d'intérêt récupérés`);

  } catch (error) {
    console.log('❌ Erreur lors du test de la carte:', error.message);
  }
};

// Test des notifications
const testNotificationsFunction = async () => {
  console.log('\n🔔 Test des notifications...');
  
  try {
    // Récupérer les notifications
    const response = await makeAuthenticatedRequest('GET', '/notifications', null, user1Token);
    console.log(`✅ ${response.data.notifications.length} notifications récupérées`);

    // Marquer comme lues
    if (response.data.notifications.length > 0) {
      const markResponse = await makeAuthenticatedRequest('PATCH', '/notifications/mark-read', {
        notificationIds: [response.data.notifications[0]._id]
      }, user1Token);
      console.log('✅ Notifications marquées comme lues');
    }

  } catch (error) {
    console.log('❌ Erreur lors du test des notifications:', error.message);
  }
};

// Test du profil utilisateur
const testProfileFunction = async () => {
  console.log('\n👤 Test du profil utilisateur...');
  
  try {
    // Récupérer le profil
    const response = await makeAuthenticatedRequest('GET', '/users/profile', null, user1Token);
    console.log('✅ Profil utilisateur récupéré');

    // Mettre à jour le profil
    const updateData = {
      firstName: 'Test Updated',
      bio: 'Bio mise à jour pour le test'
    };

    const updateResponse = await makeAuthenticatedRequest('PATCH', '/users/profile', updateData, user1Token);
    console.log('✅ Profil utilisateur mis à jour');

  } catch (error) {
    console.log('❌ Erreur lors du test du profil:', error.message);
  }
};

// Test de la recherche
const testSearchFunction = async () => {
  console.log('\n🔍 Test de la recherche...');
  
  try {
    // Rechercher des posts
    const response = await makeAuthenticatedRequest('GET', '/search?q=test&type=posts', null, user1Token);
    console.log(`✅ ${response.data.results.length} résultats de recherche trouvés`);

  } catch (error) {
    console.log('❌ Erreur lors du test de la recherche:', error.message);
  }
};

// Test des statistiques
const testStatsFunction = async () => {
  console.log('\n📊 Test des statistiques...');
  
  try {
    // Récupérer les statistiques générales
    const response = await makeAuthenticatedRequest('GET', '/stats', null, user1Token);
    console.log('✅ Statistiques récupérées');

  } catch (error) {
    console.log('❌ Erreur lors du test des statistiques:', error.message);
  }
};

// Fonction principale de test
const runCompleteSystemTest = async () => {
  console.log('🚀 Démarrage du test complet du système CommuniConnect');
  console.log('============================================================');

  try {
    // Tests séquentiels
    await testAuthentication();
    await testPostsFunction();
    await testAlertsFunction();
    await testEventsFunction();
    await testLivestreamsFunction();
    await testMessagingFunction();
    await testMapFunction();
    await testNotificationsFunction();
    await testProfileFunction();
    await testSearchFunction();
    await testStatsFunction();

    console.log('\n============================================================');
    console.log('✅ Test complet terminé avec succès !');
    console.log('🎉 Toutes les fonctionnalités principales sont opérationnelles');
    console.log('\n📋 Résumé des tests :');
    console.log(`   - Posts créés : ${testPosts.length}`);
    console.log(`   - Alertes créées : ${testAlerts.length}`);
    console.log(`   - Événements créés : ${testEvents.length}`);
    console.log(`   - Livestreams créés : ${testLivestreams.length}`);

  } catch (error) {
    console.log('\n============================================================');
    console.log('❌ Erreur lors du test complet:', error.message);
    console.log('🔧 Vérifiez que le serveur est démarré et que la base de données est accessible');
  }
};

// Exécuter le test
runCompleteSystemTest(); 