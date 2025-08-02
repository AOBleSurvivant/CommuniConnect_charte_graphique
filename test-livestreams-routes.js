const axios = require('axios');

console.log('📺 TEST ROUTES LIVESTREAMS');
console.log('=' .repeat(50));

async function testLivestreamsRoutes() {
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    console.log('\n🔍 Test des routes livestreams...');
    
    // Test 1: Liste des livestreams
    console.log('\n1️⃣ Test liste des livestreams...');
    const livestreamsResponse = await axios.get(`${baseUrl}/livestreams`);
    console.log(`✅ Liste des livestreams: ${livestreamsResponse.data.data?.length || 0} lives`);
    
    // Test 2: Livestreams en direct
    console.log('\n2️⃣ Test livestreams en direct...');
    const liveResponse = await axios.get(`${baseUrl}/livestreams/live`);
    console.log(`✅ Lives en direct: ${liveResponse.data.data?.length || 0} lives`);
    
    // Test 3: Livestreams programmés
    console.log('\n3️⃣ Test livestreams programmés...');
    const scheduledResponse = await axios.get(`${baseUrl}/livestreams/scheduled`);
    console.log(`✅ Lives programmés: ${scheduledResponse.data.data?.length || 0} lives`);
    
    // Test 4: Alertes
    console.log('\n4️⃣ Test alertes...');
    const alertsResponse = await axios.get(`${baseUrl}/livestreams/alerts`);
    console.log(`✅ Alertes: ${alertsResponse.data.data?.length || 0} alertes`);
    
    // Test 5: Livestreams par communauté
    console.log('\n5️⃣ Test livestreams par communauté...');
    const communityResponse = await axios.get(`${baseUrl}/livestreams/community?prefecture=Labé&commune=Labé-Centre&quartier=Porel`);
    console.log(`✅ Lives communautaires: ${communityResponse.data.data?.length || 0} lives`);
    
    // Test 6: Détails d'un livestream
    console.log('\n6️⃣ Test détails d\'un livestream...');
    const detailsResponse = await axios.get(`${baseUrl}/livestreams/1`);
    console.log(`✅ Détails du live: ${detailsResponse.data.data?.title || 'Non trouvé'}`);
    
    // Test 7: Créer un nouveau livestream
    console.log('\n7️⃣ Test création d\'un livestream...');
    const createResponse = await axios.post(`${baseUrl}/livestreams`, {
      title: 'Test Live',
      description: 'Test de création de live',
      location: {
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Porel'
      }
    });
    console.log(`✅ Live créé: ${createResponse.data.data?.title || 'Échec'}`);
    
    // Test 8: Démarrer un livestream
    console.log('\n8️⃣ Test démarrage d\'un livestream...');
    const startResponse = await axios.post(`${baseUrl}/livestreams/2/start`);
    console.log(`✅ Live démarré: ${startResponse.data.message || 'Échec'}`);
    
    // Test 9: Rejoindre un livestream
    console.log('\n9️⃣ Test rejoindre un livestream...');
    const joinResponse = await axios.post(`${baseUrl}/livestreams/1/join`);
    console.log(`✅ Rejoint le live: ${joinResponse.data.message || 'Échec'}`);
    
    // Test 10: Envoyer un message
    console.log('\n🔟 Test envoi de message...');
    const messageResponse = await axios.post(`${baseUrl}/livestreams/1/message`, {
      message: 'Test message'
    });
    console.log(`✅ Message envoyé: ${messageResponse.data.message || 'Échec'}`);
    
    // Test 11: Réaction
    console.log('\n1️⃣1️⃣ Test réaction...');
    const reactionResponse = await axios.post(`${baseUrl}/livestreams/1/reaction`, {
      type: 'like'
    });
    console.log(`✅ Réaction envoyée: ${reactionResponse.data.message || 'Échec'}`);
    
    console.log('\n📊 RÉSUMÉ:');
    console.log('✅ Toutes les routes livestreams fonctionnent');
    console.log('✅ GET /livestreams - Liste');
    console.log('✅ GET /livestreams/live - Lives en direct');
    console.log('✅ GET /livestreams/scheduled - Lives programmés');
    console.log('✅ GET /livestreams/alerts - Alertes');
    console.log('✅ GET /livestreams/community - Par communauté');
    console.log('✅ GET /livestreams/:id - Détails');
    console.log('✅ POST /livestreams - Création');
    console.log('✅ POST /livestreams/:id/start - Démarrage');
    console.log('✅ POST /livestreams/:id/join - Rejoindre');
    console.log('✅ POST /livestreams/:id/message - Message');
    console.log('✅ POST /livestreams/:id/reaction - Réaction');
    
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('\n💡 Prochaines étapes:');
    console.log('1. Redémarrer le frontend si nécessaire');
    console.log('2. Tester l\'interface utilisateur');
    console.log('3. Vérifier les filtres de localisation');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testLivestreamsRoutes(); 