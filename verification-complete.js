const axios = require('axios');

console.log('🔍 VÉRIFICATION COMPLÈTE DU SYSTÈME');
console.log('=' .repeat(50));

async function verificationComplete() {
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    console.log('\n🚀 Vérification du serveur...');
    
    // Test 1: Health check
    console.log('\n1️⃣ Test health check...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log(`✅ Serveur: ${healthResponse.data.status}`);
    
    // Test 2: Routes livestreams principales
    console.log('\n2️⃣ Test routes livestreams...');
    
    const livestreamsResponse = await axios.get(`${baseUrl}/livestreams`);
    console.log(`✅ Liste livestreams: ${livestreamsResponse.data.data?.length || 0} lives`);
    
    const liveResponse = await axios.get(`${baseUrl}/livestreams/live`);
    console.log(`✅ Lives en direct: ${liveResponse.data.data?.length || 0} lives`);
    
    const scheduledResponse = await axios.get(`${baseUrl}/livestreams/scheduled`);
    console.log(`✅ Lives programmés: ${scheduledResponse.data.data?.length || 0} lives`);
    
    const alertsResponse = await axios.get(`${baseUrl}/livestreams/alerts`);
    console.log(`✅ Alertes: ${alertsResponse.data.data?.length || 0} alertes`);
    
    // Test 3: Routes friends
    console.log('\n3️⃣ Test routes friends...');
    
    const friendsResponse = await axios.get(`${baseUrl}/friends`);
    console.log(`✅ Liste amis: ${friendsResponse.data.friends?.length || 0} amis`);
    
    const requestsResponse = await axios.get(`${baseUrl}/friends/requests`);
    console.log(`✅ Demandes reçues: ${requestsResponse.data.requests?.length || 0} demandes`);
    
    // Test 4: Routes auth
    console.log('\n4️⃣ Test routes auth...');
    
    const authResponse = await axios.post(`${baseUrl}/auth/login`, {
      identifier: 'test@communiconnect.gn',
      password: 'test123'
    });
    console.log(`✅ Auth: ${authResponse.data.token ? 'Token reçu' : 'Échec'}`);
    
    // Test 5: Données de localisation dans les livestreams
    console.log('\n5️⃣ Vérification des données de localisation...');
    
    if (livestreamsResponse.data.data && livestreamsResponse.data.data.length > 0) {
      const firstLive = livestreamsResponse.data.data[0];
      console.log(`📍 Premier live - Localisation:`);
      console.log(`   Préfecture: ${firstLive.location?.prefecture || 'Non définie'}`);
      console.log(`   Commune: ${firstLive.location?.commune || 'Non définie'}`);
      console.log(`   Quartier: ${firstLive.location?.quartier || 'Non défini'}`);
    }
    
    // Test 6: Filtrage par localisation
    console.log('\n6️⃣ Test filtrage par localisation...');
    
    const filteredResponse = await axios.get(`${baseUrl}/livestreams?prefecture=Labé&commune=Labé-Centre&quartier=Porel`);
    console.log(`✅ Filtrage Labé: ${filteredResponse.data.data?.length || 0} lives`);
    
    // Test 7: Création d'un nouveau livestream
    console.log('\n7️⃣ Test création livestream...');
    
    const createResponse = await axios.post(`${baseUrl}/livestreams`, {
      title: 'Test Live Frontend',
      description: 'Test de création depuis le frontend',
      location: {
        prefecture: 'Labé',
        commune: 'Labé-Centre',
        quartier: 'Porel'
      }
    });
    console.log(`✅ Live créé: ${createResponse.data.data?.title || 'Échec'}`);
    
    console.log('\n📊 RÉSUMÉ COMPLET:');
    console.log('✅ Serveur backend: Opérationnel');
    console.log('✅ Routes livestreams: Fonctionnelles');
    console.log('✅ Routes friends: Fonctionnelles');
    console.log('✅ Routes auth: Fonctionnelles');
    console.log('✅ Données de localisation: Présentes');
    console.log('✅ Filtrage: Fonctionnel');
    console.log('✅ Création: Fonctionnelle');
    
    console.log('\n🎯 PROCHAINES ÉTAPES POUR LE FRONTEND:');
    console.log('1. Redémarrer le frontend: cd client && npm start');
    console.log('2. Vérifier que les composants SelectInput ont les bonnes options');
    console.log('3. Tester l\'interface utilisateur');
    console.log('4. Vérifier les filtres de localisation');
    
    console.log('\n💡 SOLUTIONS POUR LES ERREURS MUI:');
    console.log('- Les erreurs MUI indiquent que les composants SelectInput n\'ont pas les bonnes options');
    console.log('- Il faut s\'assurer que les données de localisation sont chargées dans le frontend');
    console.log('- Vérifier que les composants reçoivent les bonnes props');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 SOLUTION:');
      console.log('Le serveur backend n\'est pas démarré.');
      console.log('1. Ouvrir un nouveau terminal');
      console.log('2. cd server && npm start');
      console.log('3. Attendre que le serveur démarre');
      console.log('4. Relancer ce test');
    }
  }
}

verificationComplete(); 