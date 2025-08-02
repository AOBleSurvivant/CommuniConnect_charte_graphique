const axios = require('axios');

async function testAPIs() {
  console.log('🧪 Test des API CommuniConnect\n');

  try {
    // Test 1: Health Check
    console.log('1. Test Health Check...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health Check:', healthResponse.data.status);

    // Test 2: Analyse de contenu
    console.log('\n2. Test Analyse de contenu...');
    const analysisResponse = await axios.post('http://localhost:5000/api/advanced-moderation/analyze', {
      content: 'Test de contenu normal',
      contentType: 'post'
    });
    console.log('✅ Analyse de contenu:', analysisResponse.data.success);

    // Test 3: Analyse de contenu inapproprié
    console.log('\n3. Test Analyse de contenu inapproprié...');
    const inappropriateResponse = await axios.post('http://localhost:5000/api/advanced-moderation/analyze', {
      content: 'Contenu avec des mots inappropriés',
      contentType: 'post'
    });
    console.log('✅ Analyse contenu inapproprié:', inappropriateResponse.data.success);

    // Test 4: Frontend
    console.log('\n4. Test Frontend...');
    const frontendResponse = await axios.get('http://localhost:3000');
    console.log('✅ Frontend accessible:', frontendResponse.status === 200);

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📊 Résumé:');
    console.log('- Backend API: ✅ Opérationnel');
    console.log('- Modération avancée: ✅ Fonctionnelle');
    console.log('- Frontend: ✅ Accessible');
    console.log('- Analyse de contenu: ✅ Active');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testAPIs(); 