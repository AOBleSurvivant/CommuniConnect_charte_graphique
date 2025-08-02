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

    req.setTimeout(5000, () => {
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

// Fonction pour analyser les fichiers de code
const analyzeCodeFiles = () => {
  log('\n🔍 ANALYSE DES FICHIERS DE CODE', 'cyan');
  
  const filesToCheck = [
    'server/index.js',
    'server/routes/events.js',
    'server/routes/auth.js',
    'client/src/App.js',
    'client/src/components/Events/EventsPage.js',
    'client/package.json',
    'server/package.json'
  ];

  let issues = [];
  let workingFiles = [];

  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Vérifications spécifiques
      if (file.includes('events.js')) {
        if (content.includes('router.get') && content.includes('router.post')) {
          workingFiles.push(file);
        } else {
          issues.push(`${file}: Routes événements manquantes`);
        }
      } else if (file.includes('auth.js')) {
        if (content.includes('router.post') && content.includes('login')) {
          workingFiles.push(file);
        } else {
          issues.push(`${file}: Route login manquante`);
        }
      } else if (file.includes('App.js')) {
        if (content.includes('Route') && content.includes('events')) {
          workingFiles.push(file);
        } else {
          issues.push(`${file}: Routes React manquantes`);
        }
      } else {
        workingFiles.push(file);
      }
    } else {
      issues.push(`${file}: Fichier manquant`);
    }
  }

  log(`   Fichiers fonctionnels: ${workingFiles.length}/${filesToCheck.length}`, 'green');
  if (issues.length > 0) {
    log(`   Problèmes détectés: ${issues.length}`, 'red');
    issues.forEach(issue => log(`     - ${issue}`, 'red'));
  }
};

// Fonction pour tester les événements spécifiquement
const testEventsComprehensive = async () => {
  log('\n🔍 TEST COMPLET - ÉVÉNEMENTS', 'cyan');
  
  // Test 1: Récupération des événements
  log('📅 Test 1: Récupération des événements...', 'yellow');
  const getEvents = await testRoute('GET', '/events');
  log(`   Résultat: ${getEvents.success ? '✅' : '❌'} ${getEvents.status}`, getEvents.success ? 'green' : 'red');
  
  if (!getEvents.success) {
    log(`   Erreur: ${getEvents.message || 'Route non trouvée'}`, 'red');
  }

  // Test 2: Création d'un événement
  log('📝 Test 2: Création d\'un événement...', 'yellow');
  const eventData = {
    title: 'Test Event',
    description: 'Événement de test pour diagnostic',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    location: 'Test Location',
    category: 'test',
    creator: 'test-user'
  };
  
  const createEvent = await testRoute('POST', '/events', eventData);
  log(`   Résultat: ${createEvent.success ? '✅' : '❌'} ${createEvent.status}`, createEvent.success ? 'green' : 'red');
  
  if (!createEvent.success) {
    log(`   Erreur: ${createEvent.message || 'Création échouée'}`, 'red');
  }

  // Test 3: Validation des données
  log('✅ Test 3: Validation des données...', 'yellow');
  const invalidEventData = {
    title: '', // Titre vide
    description: 'Test',
    date: 'invalid-date'
  };
  
  const validateEvent = await testRoute('POST', '/events', invalidEventData);
  log(`   Résultat: ${validateEvent.success ? '❌' : '✅'} ${validateEvent.status}`, validateEvent.success ? 'red' : 'green');
  
  if (validateEvent.success) {
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
  
  const updateEvent = await testRoute('PUT', '/events/1', updateData);
  log(`   Résultat: ${updateEvent.success ? '✅' : '❌'} ${updateEvent.status}`, updateEvent.success ? 'green' : 'red');

  // Test 5: Suppression d'événement
  log('🗑️  Test 5: Suppression d\'événement...', 'yellow');
  const deleteEvent = await testRoute('DELETE', '/events/1');
  log(`   Résultat: ${deleteEvent.success ? '✅' : '❌'} ${deleteEvent.status}`, deleteEvent.success ? 'green' : 'red');
};

// Diagnostic complet
const runDiagnostic = async () => {
  log('🚀 DIAGNOSTIC COMPLET COMMUNICONNECT - VERSION DÉFINITIVE', 'bright');
  log('========================================================', 'bright');
  
  // Test de base - Santé de l'API
  log('\n🔍 Test 1: Santé de l\'API', 'cyan');
  const health = await testRoute('GET', '/health');
  log(`   API Health: ${health.success ? '✅' : '❌'} ${health.status}`, health.success ? 'green' : 'red');
  
  if (!health.success) {
    log('   ⚠️  Le serveur ne répond pas. Vérifiez qu\'il est démarré.', 'yellow');
    log('   💡 Solution: Démarrez le serveur avec "cd server && npm start"', 'yellow');
  }

  // Test des routes principales
  log('\n🔍 Test 2: Routes principales', 'cyan');
  const routes = [
    { name: 'Authentification', endpoint: '/auth/login', method: 'POST' },
    { name: 'Posts', endpoint: '/posts', method: 'GET' },
    { name: 'Messages', endpoint: '/messages', method: 'GET' },
    { name: 'Alertes', endpoint: '/alerts', method: 'GET' },
    { name: 'Amis', endpoint: '/friends', method: 'GET' },
    { name: 'Notifications', endpoint: '/notifications', method: 'GET' },
    { name: 'Utilisateurs', endpoint: '/users', method: 'GET' },
    { name: 'Recherche', endpoint: '/search', method: 'GET' },
    { name: 'Statistiques', endpoint: '/stats', method: 'GET' }
  ];

  let workingRoutes = 0;
  for (const route of routes) {
    const result = await testRoute(route.method, route.endpoint);
    const status = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`   ${route.name}: ${status} ${result.status}`, color);
    
    if (result.success) {
      workingRoutes++;
    } else if (result.status === 404) {
      log(`      ⚠️  Route non trouvée: ${route.endpoint}`, 'yellow');
    }
  }

  log(`   Routes fonctionnelles: ${workingRoutes}/${routes.length}`, workingRoutes > routes.length / 2 ? 'green' : 'red');

  // Test spécial des événements
  await testEventsComprehensive();

  // Test des livestreams
  log('\n🔍 Test 3: Livestreams', 'cyan');
  const livestreams = await testRoute('GET', '/livestreams');
  log(`   Livestreams: ${livestreams.success ? '✅' : '❌'} ${livestreams.status}`, livestreams.success ? 'green' : 'red');

  // Test de l'authentification
  log('\n🔍 Test 4: Authentification', 'cyan');
  const authData = {
    email: 'test@example.com',
    password: 'testpassword'
  };
  
  const auth = await testRoute('POST', '/auth/login', authData);
  log(`   Login: ${auth.success ? '✅' : '❌'} ${auth.status}`, auth.success ? 'green' : 'red');
  
  if (!auth.success) {
    log(`   Erreur: ${auth.message || 'Authentification échouée'}`, 'red');
  }

  // Analyse des fichiers de code
  analyzeCodeFiles();

  // Vérification des processus
  log('\n🔍 Test 5: Processus en cours', 'cyan');
  try {
    const { exec } = require('child_process');
    exec('netstat -an | findstr :5000', (error, stdout) => {
      if (stdout.includes('5000')) {
        log('   Serveur backend: ✅ En cours d\'exécution sur le port 5000', 'green');
      } else {
        log('   Serveur backend: ❌ Non démarré sur le port 5000', 'red');
      }
    });
    
    exec('netstat -an | findstr :3000', (error, stdout) => {
      if (stdout.includes('3000')) {
        log('   Client frontend: ✅ En cours d\'exécution sur le port 3000', 'green');
      } else {
        log('   Client frontend: ❌ Non démarré sur le port 3000', 'red');
      }
    });
  } catch (error) {
    log('   Impossible de vérifier les processus', 'yellow');
  }

  // Recommandations
  log('\n🎯 RECOMMANDATIONS', 'bright');
  log('==================', 'bright');
  
  if (!health.success) {
    log('1. 🔧 DÉMARRER LE SERVEUR', 'red');
    log('   cd server && npm start', 'yellow');
  }
  
  if (workingRoutes < routes.length / 2) {
    log('2. 🔧 CORRIGER LES ROUTES API', 'red');
    log('   Vérifier les fichiers dans server/routes/', 'yellow');
  }
  
  log('3. 🔧 VÉRIFIER LES ÉVÉNEMENTS', 'yellow');
  log('   Le problème principal semble être dans la gestion des événements', 'yellow');
  
  log('4. 🔧 TESTER LE CLIENT', 'yellow');
  log('   cd client && npm start', 'yellow');

  log('\n🎯 DIAGNOSTIC TERMINÉ', 'bright');
  log('========================', 'bright');
};

// Exécution du diagnostic
runDiagnostic().catch(console.error); 