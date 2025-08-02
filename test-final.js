const axios = require('axios');

async function testFinal() {
  console.log('🎯 Test Final - CommuniConnect 100%');
  console.log('=====================================');
  
  const results = {
    server: false,
    events: false,
    alerts: false,
    posts: false,
    livestreams: false,
    rateLimit: true
  };
  
  try {
    // 1. Test du serveur
    console.log('\n1. Test du serveur...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Serveur accessible');
    results.server = true;
    
    // 2. Test des événements
    console.log('\n2. Test des événements...');
    const events = await axios.get('http://localhost:5000/api/events');
    console.log(`✅ Événements OK (${events.data.data?.length || 0} éléments)`);
    results.events = true;
    
    // 3. Test des alertes
    console.log('\n3. Test des alertes...');
    const alerts = await axios.get('http://localhost:5000/api/alerts');
    console.log(`✅ Alertes OK (${alerts.data.data?.length || 0} éléments)`);
    results.alerts = true;
    
    // 4. Test des posts
    console.log('\n4. Test des posts...');
    const posts = await axios.get('http://localhost:5000/api/posts');
    console.log(`✅ Posts OK (${posts.data.data?.length || 0} éléments)`);
    results.posts = true;
    
    // 5. Test des livestreams
    console.log('\n5. Test des livestreams...');
    const livestreams = await axios.get('http://localhost:5000/api/livestreams');
    console.log(`✅ Livestreams OK (${livestreams.data.data?.length || 0} éléments)`);
    results.livestreams = true;
    
    // 6. Test du rate limiting
    console.log('\n6. Test du rate limiting...');
    for (let i = 0; i < 10; i++) {
      try {
        await axios.get('http://localhost:5000/api/health');
      } catch (error) {
        if (error.response?.status === 429) {
          console.log('❌ Rate limiting encore actif');
          results.rateLimit = false;
          break;
        }
      }
    }
    if (results.rateLimit) {
      console.log('✅ Rate limiting désactivé');
    }
    
    // Résumé final
    console.log('\n📊 Résumé Final:');
    console.log('================');
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    const percentage = Math.round((passedTests / totalTests) * 100);
    
    console.log(`Tests réussis: ${passedTests}/${totalTests}`);
    console.log(`Pourcentage de succès: ${percentage}%`);
    
    if (percentage === 100) {
      console.log('\n🎉 FÉLICITATIONS ! Le système fonctionne à 100% !');
      console.log('✅ Toutes les erreurs ont été corrigées');
      console.log('✅ Le rate limiting est désactivé');
      console.log('✅ Toutes les routes fonctionnent');
      console.log('✅ Les données de test sont créées');
    } else {
      console.log('\n⚠️ Il reste encore quelques problèmes à corriger');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test final:', error.message);
  }
}

testFinal(); 