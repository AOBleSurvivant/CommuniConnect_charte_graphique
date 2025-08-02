const axios = require('axios');

console.log('🔍 VÉRIFICATION DU STATUT DU SERVEUR');
console.log('=' .repeat(50));

async function testServerStatus() {
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    console.log('\n🚀 Test de connexion au serveur...');
    
    // Test 1: Health check
    console.log('\n1️⃣ Test health check...');
    const healthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    console.log(`✅ Serveur: ${healthResponse.data.status}`);
    
    // Test 2: Routes livestreams
    console.log('\n2️⃣ Test routes livestreams...');
    
    const livestreamsResponse = await axios.get(`${baseUrl}/livestreams`, { timeout: 5000 });
    console.log(`✅ Liste livestreams: ${livestreamsResponse.data.data?.length || 0} lives`);
    
    const liveResponse = await axios.get(`${baseUrl}/livestreams/live`, { timeout: 5000 });
    console.log(`✅ Lives en direct: ${liveResponse.data.data?.length || 0} lives`);
    
    const scheduledResponse = await axios.get(`${baseUrl}/livestreams/scheduled`, { timeout: 5000 });
    console.log(`✅ Lives programmés: ${scheduledResponse.data.data?.length || 0} lives`);
    
    const alertsResponse = await axios.get(`${baseUrl}/livestreams/alerts`, { timeout: 5000 });
    console.log(`✅ Alertes: ${alertsResponse.data.data?.length || 0} alertes`);
    
    // Test 3: Routes friends
    console.log('\n3️⃣ Test routes friends...');
    
    const friendsResponse = await axios.get(`${baseUrl}/friends`, { timeout: 5000 });
    console.log(`✅ Liste amis: ${friendsResponse.data.friends?.length || 0} amis`);
    
    console.log('\n📊 RÉSUMÉ:');
    console.log('✅ Serveur backend: Opérationnel');
    console.log('✅ Routes livestreams: Fonctionnelles');
    console.log('✅ Routes friends: Fonctionnelles');
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('1. Le serveur fonctionne correctement');
    console.log('2. Redémarrer le frontend si nécessaire');
    console.log('3. Tester l\'interface utilisateur');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('\n🔧 PROBLÈME: Le serveur backend n\'est pas démarré');
      console.log('\n📋 SOLUTIONS:');
      console.log('1. Ouvrir un nouveau terminal');
      console.log('2. cd server && npm start');
      console.log('3. Attendre que le serveur démarre');
      console.log('4. Relancer ce test');
    } else if (error.response?.status === 404) {
      console.log('\n🔧 PROBLÈME: Routes non trouvées');
      console.log('Le serveur fonctionne mais les routes ne sont pas configurées');
    }
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  testServerStatus();
}, 3000); 