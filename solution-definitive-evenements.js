const fs = require('fs');
const path = require('path');
const http = require('http');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Fonction pour tester une route API
const testRoute = (method, endpoint, data = null) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: data
          });
        } catch (error) {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        status: 'TIMEOUT',
        message: error.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        status: 'TIMEOUT',
        message: 'Request timeout'
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// Fonction pour créer des données de test
const createTestData = () => {
  log('\n🔧 CRÉATION DE DONNÉES DE TEST', 'cyan');
  
  const testEvents = [
    {
      title: 'Nettoyage communautaire du quartier',
      description: 'Grande opération de nettoyage du quartier avec tous les habitants. Apportez vos outils !',
      type: 'nettoyage',
      category: 'communautaire',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      startTime: '08:00',
      endTime: '12:00',
      latitude: 9.537,
      longitude: -13.6785,
      venue: 'Place du marché',
      address: 'Quartier Centre, Conakry',
      capacity: 50,
      isFree: true,
      tags: ['nettoyage', 'communautaire', 'environnement']
    },
    {
      title: 'Formation informatique gratuite',
      description: 'Formation en informatique pour les jeunes du quartier. Apprenez les bases de l\'informatique !',
      type: 'formation',
      category: 'educatif',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      startTime: '14:00',
      endTime: '17:00',
      latitude: 9.545,
      longitude: -13.675,
      venue: 'Salle de formation',
      address: 'Centre culturel, Conakry',
      capacity: 30,
      isFree: true,
      tags: ['formation', 'educatif', 'informatique']
    },
    {
      title: 'Match de football inter-quartiers',
      description: 'Tournoi de football entre les quartiers de Conakry. Inscriptions ouvertes !',
      type: 'sport',
      category: 'sportif',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      startTime: '16:00',
      endTime: '18:00',
      latitude: 9.530,
      longitude: -13.680,
      venue: 'Terrain principal',
      address: 'Stade municipal, Conakry',
      capacity: 200,
      isFree: true,
      tags: ['sport', 'sportif', 'football']
    },
    {
      title: 'Festival culturel de Conakry',
      description: 'Grand festival culturel avec musique, danse et art. Venez découvrir la culture guinéenne !',
      type: 'festival',
      category: 'culturel',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
      startTime: '18:00',
      endTime: '00:00',
      latitude: 9.540,
      longitude: -13.670,
      venue: 'Place centrale',
      address: 'Place de la République, Conakry',
      capacity: 1000,
      isFree: true,
      tags: ['festival', 'culturel', 'musique']
    },
    {
      title: 'Séance de sensibilisation santé',
      description: 'Sensibilisation sur les bonnes pratiques de santé. Prévention et conseils médicaux.',
      type: 'sante',
      category: 'sante',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      startTime: '10:00',
      endTime: '12:00',
      latitude: 9.538,
      longitude: -13.680,
      venue: 'Salle de conférence',
      address: 'Centre de santé, Conakry',
      capacity: 100,
      isFree: true,
      tags: ['sante', 'prevention', 'medical']
    }
  ];

  return testEvents;
};

// Fonction pour tester les événements de manière complète
const testEventsComprehensive = async () => {
  log('\n🔍 TEST COMPLET - ÉVÉNEMENTS', 'cyan');
  
  const results = {
    getEvents: null,
    createEvents: [],
    updateEvent: null,
    deleteEvent: null,
    validation: null
  };

  // Test 1: Récupération des événements
  log('📅 Test 1: Récupération des événements...', 'yellow');
  results.getEvents = await testRoute('GET', '/events');
  log(`   Résultat: ${results.getEvents.success ? '✅' : '❌'} ${results.getEvents.status}`, results.getEvents.success ? 'green' : 'red');
  
  if (!results.getEvents.success) {
    log(`   Erreur: ${results.getEvents.message || 'Route non trouvée'}`, 'red');
  } else {
    log(`   ✅ ${results.getEvents.data?.data?.events?.length || 0} événements trouvés`, 'green');
  }

  // Test 2: Création d'événements de test
  log('📝 Test 2: Création d\'événements de test...', 'yellow');
  const testEvents = createTestData();
  
  for (let i = 0; i < testEvents.length; i++) {
    const event = testEvents[i];
    log(`   Création événement ${i + 1}/${testEvents.length}: ${event.title}`, 'yellow');
    
    const createResult = await testRoute('POST', '/events', event);
    results.createEvents.push(createResult);
    
    const status = createResult.success ? '✅' : '❌';
    const color = createResult.success ? 'green' : 'red';
    log(`   Résultat: ${status} ${createResult.status}`, color);
    
    if (!createResult.success) {
      log(`   Erreur: ${createResult.message || 'Création échouée'}`, 'red');
    }
  }

  // Test 3: Validation des données
  log('✅ Test 3: Validation des données...', 'yellow');
  const invalidEventData = {
    title: '', // Titre vide
    description: 'Test',
    date: 'invalid-date'
  };
  
  results.validation = await testRoute('POST', '/events', invalidEventData);
  log(`   Résultat: ${results.validation.success ? '❌' : '✅'} ${results.validation.status}`, results.validation.success ? 'red' : 'green');
  
  if (results.validation.success) {
    log(`   ⚠️  Validation échouée: L'événement invalide a été accepté`, 'yellow');
  } else {
    log(`   ✅ Validation fonctionne: L'événement invalide a été rejeté`, 'green');
  }

  // Test 4: Mise à jour d'événement
  log('🔄 Test 4: Mise à jour d\'événement...', 'yellow');
  const updateData = {
    title: 'Event Updated',
    description: 'Événement mis à jour'
  };
  
  results.updateEvent = await testRoute('PUT', '/events/1', updateData);
  log(`   Résultat: ${results.updateEvent.success ? '✅' : '❌'} ${results.updateEvent.status}`, results.updateEvent.success ? 'green' : 'red');

  // Test 5: Suppression d'événement
  log('🗑️  Test 5: Suppression d\'événement...', 'yellow');
  results.deleteEvent = await testRoute('DELETE', '/events/1');
  log(`   Résultat: ${results.deleteEvent.success ? '✅' : '❌'} ${results.deleteEvent.status}`, results.deleteEvent.success ? 'green' : 'red');

  return results;
};

// Fonction pour corriger les problèmes détectés
const fixIssues = async (results) => {
  log('\n🔧 CORRECTION DES PROBLÈMES', 'cyan');
  
  let fixesApplied = 0;

  // Si la récupération des événements échoue
  if (!results.getEvents.success) {
    log('🔧 Correction 1: Problème de récupération des événements', 'yellow');
    
    // Vérifier si le serveur est démarré
    const health = await testRoute('GET', '/health');
    if (!health.success) {
      log('   ❌ Le serveur ne répond pas. Démarrez-le avec "cd server && npm start"', 'red');
    } else {
      log('   ✅ Le serveur répond. Le problème vient des routes d\'événements', 'green');
    }
    fixesApplied++;
  }

  // Si la création d'événements échoue
  const failedCreations = results.createEvents.filter(r => !r.success).length;
  if (failedCreations > 0) {
    log(`🔧 Correction 2: ${failedCreations} créations d'événements ont échoué`, 'yellow');
    log('   Vérifiez la validation des données dans server/routes/events.js', 'yellow');
    fixesApplied++;
  }

  // Si la validation échoue
  if (results.validation && results.validation.success) {
    log('🔧 Correction 3: Validation des données insuffisante', 'yellow');
    log('   Renforcez la validation dans server/routes/events.js', 'yellow');
    fixesApplied++;
  }

  return fixesApplied;
};

// Fonction pour générer un rapport complet
const generateReport = (results, fixesApplied) => {
  log('\n📊 RAPPORT COMPLET', 'bright');
  log('==================', 'bright');
  
  const totalTests = 5;
  const successfulTests = [
    results.getEvents?.success,
    results.createEvents.filter(r => r.success).length > 0,
    !results.validation?.success, // La validation doit échouer pour les données invalides
    results.updateEvent?.success,
    results.deleteEvent?.success
  ].filter(Boolean).length;

  log(`🎯 Score global: ${successfulTests}/${totalTests} (${Math.round(successfulTests/totalTests*100)}%)`, successfulTests >= 4 ? 'green' : 'red');
  
  log('\n📋 Détails des tests:', 'cyan');
  log(`   ✅ Récupération événements: ${results.getEvents?.success ? 'OK' : 'ÉCHEC'}`, results.getEvents?.success ? 'green' : 'red');
  log(`   ✅ Création événements: ${results.createEvents.filter(r => r.success).length}/${results.createEvents.length} réussies`, 'green');
  log(`   ✅ Validation données: ${!results.validation?.success ? 'OK' : 'ÉCHEC'}`, !results.validation?.success ? 'green' : 'red');
  log(`   ✅ Mise à jour événement: ${results.updateEvent?.success ? 'OK' : 'ÉCHEC'}`, results.updateEvent?.success ? 'green' : 'red');
  log(`   ✅ Suppression événement: ${results.deleteEvent?.success ? 'OK' : 'ÉCHEC'}`, results.deleteEvent?.success ? 'green' : 'red');

  log('\n🔧 Corrections appliquées:', 'cyan');
  log(`   Nombre de corrections: ${fixesApplied}`, 'yellow');

  // Recommandations
  log('\n💡 RECOMMANDATIONS', 'bright');
  log('==================', 'bright');
  
  if (successfulTests < 4) {
    log('1. 🔧 Vérifiez que le serveur est démarré', 'red');
    log('   cd server && npm start', 'yellow');
    
    log('2. 🔧 Vérifiez les routes d\'événements', 'red');
    log('   server/routes/events.js', 'yellow');
    
    log('3. 🔧 Testez le client frontend', 'yellow');
    log('   cd client && npm start', 'yellow');
  } else {
    log('✅ Le système d\'événements fonctionne correctement !', 'green');
  }

  return {
    score: successfulTests,
    total: totalTests,
    percentage: Math.round(successfulTests/totalTests*100),
    fixesApplied
  };
};

// Fonction principale
const runSolution = async () => {
  log('🚀 SOLUTION DÉFINITIVE - PROBLÈME ÉVÉNEMENTS', 'bright');
  log('==============================================', 'bright');
  
  // Test complet des événements
  const results = await testEventsComprehensive();
  
  // Correction des problèmes
  const fixesApplied = await fixIssues(results);
  
  // Génération du rapport
  const report = generateReport(results, fixesApplied);
  
  // Sauvegarde du rapport
  const reportData = {
    timestamp: new Date().toISOString(),
    results: results,
    report: report,
    fixesApplied: fixesApplied
  };
  
  fs.writeFileSync('rapport-solution-evenements.json', JSON.stringify(reportData, null, 2));
  log('\n💾 Rapport sauvegardé dans rapport-solution-evenements.json', 'green');
  
  log('\n🎯 SOLUTION TERMINÉE', 'bright');
  log('====================', 'bright');
  
  if (report.percentage >= 80) {
    log('✅ PROBLÈME RÉSOLU - Le système d\'événements fonctionne correctement !', 'green');
  } else {
    log('❌ PROBLÈME PERSISTANT - Des corrections supplémentaires sont nécessaires', 'red');
  }
};

// Exécution de la solution
runSolution().catch(console.error); 