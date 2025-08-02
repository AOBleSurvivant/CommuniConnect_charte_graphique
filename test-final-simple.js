const http = require('http');

console.log('🚀 TEST FINAL - VÉRIFICATION RAPIDE');
console.log('=====================================');

// Test de l'API
const testAPI = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            success: res.statusCode === 200,
            status: res.statusCode,
            data: result
          });
        } catch (error) {
          resolve({
            success: false,
            status: res.statusCode,
            error: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });

    req.end();
  });
};

// Test des événements
const testEvents = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/events',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            success: res.statusCode === 200,
            status: res.statusCode,
            data: result
          });
        } catch (error) {
          resolve({
            success: false,
            status: res.statusCode,
            error: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });

    req.end();
  });
};

// Test de création d'événement
const testCreateEvent = () => {
  return new Promise((resolve) => {
    const eventData = JSON.stringify({
      title: 'Test Event Final',
      description: 'Événement de test final pour vérification',
      type: 'reunion',
      category: 'communautaire',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      startTime: '14:00',
      endTime: '16:00',
      latitude: 9.537,
      longitude: -13.6785,
      venue: 'Salle de test',
      address: 'Adresse de test, Conakry'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/events',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(eventData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            success: res.statusCode === 201,
            status: res.statusCode,
            data: result
          });
        } catch (error) {
          resolve({
            success: false,
            status: res.statusCode,
            error: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });

    req.write(eventData);
    req.end();
  });
};

// Test principal
const runTests = async () => {
  console.log('\n🔍 Test 1: API Health');
  const health = await testAPI();
  console.log(`   ${health.success ? '✅' : '❌'} ${health.status} - ${health.success ? 'API fonctionnelle' : health.error || 'Erreur'}`);

  if (!health.success) {
    console.log('\n❌ Le serveur ne répond pas. Vérifiez qu\'il est démarré avec "cd server && npm start"');
    return;
  }

  console.log('\n🔍 Test 2: Récupération des événements');
  const events = await testEvents();
  console.log(`   ${events.success ? '✅' : '❌'} ${events.status} - ${events.success ? `${events.data?.data?.events?.length || 0} événements trouvés` : events.error || 'Erreur'}`);

  console.log('\n🔍 Test 3: Création d\'événement');
  const createEvent = await testCreateEvent();
  console.log(`   ${createEvent.success ? '✅' : '❌'} ${createEvent.status} - ${createEvent.success ? 'Événement créé avec succès' : createEvent.error || 'Erreur'}`);

  // Résumé
  console.log('\n🎯 RÉSUMÉ FINAL');
  console.log('================');
  
  const tests = [health.success, events.success, createEvent.success];
  const passed = tests.filter(Boolean).length;
  const total = tests.length;
  
  console.log(`Tests réussis: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 SUCCÈS ! Tous les tests sont passés !');
    console.log('✅ L\'application CommuniConnect fonctionne parfaitement');
    console.log('✅ Le système d\'événements est opérationnel');
    console.log('✅ L\'API est accessible et fonctionnelle');
    console.log('\n🌐 Accédez à l\'application sur: http://localhost:3000');
  } else {
    console.log('\n⚠️  Certains tests ont échoué');
    console.log('Vérifiez les logs du serveur pour plus de détails');
  }
};

// Exécution des tests
runTests().catch(console.error); 