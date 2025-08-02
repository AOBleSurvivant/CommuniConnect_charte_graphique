const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Token d'authentification (à remplacer par un vrai token)
let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxNmQwODNlODg4ZmY0YzE5MzdlNzM2N2MyNmNmZDJlIiwiaWF0IjoxNzUzNjI2NjQxLCJleHAiOjE3NTQyMzE0NDF9.4hPS_Hs7rAyK862-IkDVTzfi6aBDy5_iau3LiDMgvg8';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken}`
};

async function testContentCreation() {
  console.log('🧪 Test de création de contenu...\n');

  // Test 1: Création de post
  try {
    console.log('📝 Test de création de post...');
    const postData = {
      content: 'Ceci est un post de test pour vérifier les fonctionnalités de CommuniConnect.',
      type: 'community', // Champ requis ajouté
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    
    const postResponse = await axios.post(`${API_URL}/posts`, postData, { headers });
    console.log('✅ Post créé avec succès');
    console.log(`   ID: ${postResponse.data._id}`);
    console.log(`   Contenu: ${postResponse.data.content.substring(0, 50)}...`);
  } catch (error) {
    console.log('❌ Échec de création de post:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('   Erreurs de validation:', error.response.data.errors);
    }
  }

  // Test 2: Création d'alerte
  try {
    console.log('\n🚨 Test de création d\'alerte...');
    const alertData = {
      title: 'Alerte de test',
      description: 'Ceci est une alerte de test pour vérifier les fonctionnalités.',
      severity: 'medium',
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    
    const alertResponse = await axios.post(`${API_URL}/alerts`, alertData, { headers });
    console.log('✅ Alerte créée avec succès');
    console.log(`   ID: ${alertResponse.data._id}`);
    console.log(`   Titre: ${alertResponse.data.title}`);
  } catch (error) {
    console.log('❌ Échec de création d\'alerte:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('   Erreurs de validation:', error.response.data.errors);
    }
  }

  // Test 3: Création d'événement
  try {
    console.log('\n🎉 Test de création d\'événement...');
    const eventData = {
      title: 'Événement de test',
      description: 'Ceci est un événement de test pour vérifier les fonctionnalités.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
      location: {
        region: 'Labé',
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Tata'
      }
    };
    
    const eventResponse = await axios.post(`${API_URL}/events`, eventData, { headers });
    console.log('✅ Événement créé avec succès');
    console.log(`   ID: ${eventResponse.data._id}`);
    console.log(`   Titre: ${eventResponse.data.title}`);
  } catch (error) {
    console.log('❌ Échec de création d\'événement:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('   Erreurs de validation:', error.response.data.errors);
    }
  }

  // Test 4: Récupération des posts
  try {
    console.log('\n📋 Test de récupération des posts...');
    const postsResponse = await axios.get(`${API_URL}/posts`, { headers });
    console.log('✅ Posts récupérés avec succès');
    console.log(`   Nombre de posts: ${postsResponse.data.data?.posts?.length || 0}`);
  } catch (error) {
    console.log('❌ Échec de récupération des posts:', error.response?.data?.message || error.message);
  }

  // Test 5: Récupération des alertes
  try {
    console.log('\n🚨 Test de récupération des alertes...');
    const alertsResponse = await axios.get(`${API_URL}/alerts`, { headers });
    console.log('✅ Alertes récupérées avec succès');
    console.log(`   Nombre d'alertes: ${alertsResponse.data.data?.alerts?.length || 0}`);
  } catch (error) {
    console.log('❌ Échec de récupération des alertes:', error.response?.data?.message || error.message);
  }

  // Test 6: Récupération des événements
  try {
    console.log('\n🎉 Test de récupération des événements...');
    const eventsResponse = await axios.get(`${API_URL}/events`, { headers });
    console.log('✅ Événements récupérés avec succès');
    console.log(`   Nombre d'événements: ${eventsResponse.data.data?.events?.length || 0}`);
  } catch (error) {
    console.log('❌ Échec de récupération des événements:', error.response?.data?.message || error.message);
  }
}

testContentCreation().catch(console.error); 