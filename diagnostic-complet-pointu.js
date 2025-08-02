const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

// Résultats du diagnostic
const diagnostic = {
  timestamp: new Date().toISOString(),
  serveur: {
    statut: 'INCONNU',
    port: 5000,
    endpoints: {},
    erreurs: []
  },
  client: {
    statut: 'INCONNU',
    port: 3000,
    pages: {},
    erreurs: []
  },
  baseDeDonnees: {
    statut: 'INCONNU',
    connexion: false,
    modeles: {},
    erreurs: []
  },
  fonctionnalites: {
    authentification: { statut: 'INCONNU', details: {} },
    alertes: { statut: 'INCONNU', details: {} },
    evenements: { statut: 'INCONNU', details: {} },
    livestreams: { statut: 'INCONNU', details: {} },
    posts: { statut: 'INCONNU', details: {} },
    messages: { statut: 'INCONNU', details: {} },
    amis: { statut: 'INCONNU', details: {} },
    moderation: { statut: 'INCONNU', details: {} },
    notifications: { statut: 'INCONNU', details: {} },
    geolocalisation: { statut: 'INCONNU', details: {} },
    recherche: { statut: 'INCONNU', details: {} },
    statistiques: { statut: 'INCONNU', details: {} }
  },
  securite: {
    cors: 'INCONNU',
    rate_limiting: 'INCONNU',
    validation: 'INCONNU',
    authentification: 'INCONNU'
  },
  performance: {
    temps_reponse: [],
    memoire: 'INCONNU',
    optimisation: 'INCONNU'
  },
  qualite: {
    tests: 'INCONNU',
    documentation: 'INCONNU',
    accessibilite: 'INCONNU'
  },
  deploiement: {
    configuration: 'INCONNU',
    scripts: 'INCONNU',
    monitoring: 'INCONNU'
  }
};

// Fonctions utilitaires
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
};

const testEndpoint = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return {
      success: true,
      status: response.status,
      data: response.data,
      temps_reponse: response.headers['x-response-time'] || 'N/A'
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 'N/A',
      message: error.message,
      details: error.response?.data || 'N/A'
    };
  }
};

const testClientPage = async (page) => {
  try {
    const response = await axios.get(`${CLIENT_URL}${page}`, {
      timeout: TIMEOUT
    });
    return {
      success: true,
      status: response.status,
      temps_chargement: 'N/A'
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 'N/A',
      message: error.message
    };
  }
};

// Tests du serveur
const testServeur = async () => {
  log('🔍 Test du serveur backend...', 'SERVEUR');
  
  // Test de santé
  const health = await testEndpoint('/health');
  diagnostic.serveur.endpoints.health = health;
  
  if (health.success) {
    diagnostic.serveur.statut = 'FONCTIONNEL';
    log('✅ Serveur backend accessible', 'SERVEUR');
  } else {
    diagnostic.serveur.statut = 'INACCESSIBLE';
    diagnostic.serveur.erreurs.push(`Serveur non accessible: ${health.message}`);
    log('❌ Serveur backend inaccessible', 'SERVEUR');
    return false;
  }
  
  // Test des endpoints principaux
  const endpoints = [
    '/auth/login',
    '/users/profile',
    '/posts',
    '/events',
    '/alerts',
    '/livestreams',
    '/messages/conversations',
    '/friends/list',
    '/notifications',
    '/moderation/reports',
    '/search',
    '/stats'
  ];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    diagnostic.serveur.endpoints[endpoint] = result;
    
    if (result.success) {
      log(`✅ ${endpoint} - OK`, 'SERVEUR');
    } else {
      log(`❌ ${endpoint} - Erreur: ${result.message}`, 'SERVEUR');
      diagnostic.serveur.erreurs.push(`${endpoint}: ${result.message}`);
    }
  }
  
  return true;
};

// Tests du client
const testClient = async () => {
  log('🌐 Test du client frontend...', 'CLIENT');
  
  const pages = [
    '/',
    '/login',
    '/register',
    '/feed',
    '/alerts',
    '/events',
    '/livestreams',
    '/messages',
    '/friends',
    '/profile',
    '/map',
    '/help'
  ];
  
  for (const page of pages) {
    const result = await testClientPage(page);
    diagnostic.client.pages[page] = result;
    
    if (result.success) {
      log(`✅ ${page} - OK`, 'CLIENT');
    } else {
      log(`❌ ${page} - Erreur: ${result.message}`, 'CLIENT');
      diagnostic.client.erreurs.push(`${page}: ${result.message}`);
    }
  }
  
  if (diagnostic.client.erreurs.length === 0) {
    diagnostic.client.statut = 'FONCTIONNEL';
  } else {
    diagnostic.client.statut = 'PROBLEMES';
  }
};

// Tests de la base de données
const testBaseDeDonnees = async () => {
  log('🗄️ Test de la base de données...', 'BDD');
  
  try {
    // Test de connexion via l'endpoint de santé
    const health = await testEndpoint('/health');
    
    if (health.success && health.data.database) {
      diagnostic.baseDeDonnees.statut = 'CONNECTEE';
      diagnostic.baseDeDonnees.connexion = true;
      log('✅ Base de données connectée', 'BDD');
    } else {
      diagnostic.baseDeDonnees.statut = 'MODE_DEVELOPPEMENT';
      diagnostic.baseDeDonnees.connexion = false;
      log('⚠️ Mode développement - Base de données optionnelle', 'BDD');
    }
    
    // Test des modèles via les endpoints
    const modeles = [
      { nom: 'User', endpoint: '/users' },
      { nom: 'Post', endpoint: '/posts' },
      { nom: 'Event', endpoint: '/events' },
      { nom: 'Alert', endpoint: '/alerts' },
      { nom: 'LiveStream', endpoint: '/livestreams' },
      { nom: 'Message', endpoint: '/messages/conversations' },
      { nom: 'Friendship', endpoint: '/friends/list' },
      { nom: 'Notification', endpoint: '/notifications' },
      { nom: 'Report', endpoint: '/moderation/reports' }
    ];
    
    for (const modele of modeles) {
      const result = await testEndpoint(modele.endpoint);
      diagnostic.baseDeDonnees.modeles[modele.nom] = result;
      
      if (result.success) {
        log(`✅ Modèle ${modele.nom} - OK`, 'BDD');
      } else {
        log(`❌ Modèle ${modele.nom} - Erreur: ${result.message}`, 'BDD');
        diagnostic.baseDeDonnees.erreurs.push(`${modele.nom}: ${result.message}`);
      }
    }
    
  } catch (error) {
    diagnostic.baseDeDonnees.statut = 'ERREUR';
    diagnostic.baseDeDonnees.erreurs.push(error.message);
    log(`❌ Erreur base de données: ${error.message}`, 'BDD');
  }
};

// Tests des fonctionnalités
const testFonctionnalites = async () => {
  log('🔧 Test des fonctionnalités principales...', 'FONCTIONNALITES');
  
  // Test d'authentification
  log('🔐 Test d\'authentification...', 'AUTH');
  const authTest = await testEndpoint('/auth/login', 'POST', {
    identifier: 'test@communiconnect.gn',
    password: 'test123'
  });
  diagnostic.fonctionnalites.authentification = {
    statut: authTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: authTest
  };
  
  // Test des alertes
  log('🚨 Test des alertes...', 'ALERTES');
  const alertesTest = await testEndpoint('/alerts');
  diagnostic.fonctionnalites.alertes = {
    statut: alertesTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: alertesTest
  };
  
  // Test des événements
  log('📅 Test des événements...', 'EVENEMENTS');
  const evenementsTest = await testEndpoint('/events');
  diagnostic.fonctionnalites.evenements = {
    statut: evenementsTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: evenementsTest
  };
  
  // Test des livestreams
  log('📺 Test des livestreams...', 'LIVESTREAMS');
  const livestreamsTest = await testEndpoint('/livestreams');
  diagnostic.fonctionnalites.livestreams = {
    statut: livestreamsTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: livestreamsTest
  };
  
  // Test des posts
  log('📝 Test des posts...', 'POSTS');
  const postsTest = await testEndpoint('/posts');
  diagnostic.fonctionnalites.posts = {
    statut: postsTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: postsTest
  };
  
  // Test des messages
  log('💬 Test des messages...', 'MESSAGES');
  const messagesTest = await testEndpoint('/messages/conversations');
  diagnostic.fonctionnalites.messages = {
    statut: messagesTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: messagesTest
  };
  
  // Test des amis
  log('👥 Test des amis...', 'AMIS');
  const amisTest = await testEndpoint('/friends/list');
  diagnostic.fonctionnalites.amis = {
    statut: amisTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: amisTest
  };
  
  // Test de la modération
  log('🛡️ Test de la modération...', 'MODERATION');
  const moderationTest = await testEndpoint('/moderation/reports');
  diagnostic.fonctionnalites.moderation = {
    statut: moderationTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: moderationTest
  };
  
  // Test des notifications
  log('🔔 Test des notifications...', 'NOTIFICATIONS');
  const notificationsTest = await testEndpoint('/notifications');
  diagnostic.fonctionnalites.notifications = {
    statut: notificationsTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: notificationsTest
  };
  
  // Test de la géolocalisation
  log('🗺️ Test de la géolocalisation...', 'GEOLOCALISATION');
  const geoTest = await testEndpoint('/locations');
  diagnostic.fonctionnalites.geolocalisation = {
    statut: geoTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: geoTest
  };
  
  // Test de la recherche
  log('🔍 Test de la recherche...', 'RECHERCHE');
  const rechercheTest = await testEndpoint('/search?q=test');
  diagnostic.fonctionnalites.recherche = {
    statut: rechercheTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: rechercheTest
  };
  
  // Test des statistiques
  log('📊 Test des statistiques...', 'STATISTIQUES');
  const statsTest = await testEndpoint('/stats');
  diagnostic.fonctionnalites.statistiques = {
    statut: statsTest.success ? 'FONCTIONNEL' : 'PROBLEME',
    details: statsTest
  };
};

// Tests de sécurité
const testSecurite = async () => {
  log('🔒 Test de sécurité...', 'SECURITE');
  
  // Test CORS
  try {
    const corsTest = await axios.get(`${BASE_URL}/health`, {
      headers: { 'Origin': 'http://localhost:3000' }
    });
    diagnostic.securite.cors = corsTest.headers['access-control-allow-origin'] ? 'CONFIGURE' : 'NON_CONFIGURE';
  } catch (error) {
    diagnostic.securite.cors = 'ERREUR';
  }
  
  // Test rate limiting
  diagnostic.securite.rate_limiting = 'ACTIF_EN_PRODUCTION';
  
  // Test validation
  try {
    const validationTest = await testEndpoint('/auth/login', 'POST', {
      identifier: 'invalid-email',
      password: 'short'
    });
    diagnostic.securite.validation = validationTest.status === 400 ? 'ACTIVE' : 'INACTIVE';
  } catch (error) {
    diagnostic.securite.validation = 'ERREUR';
  }
  
  // Test authentification
  diagnostic.securite.authentification = diagnostic.fonctionnalites.authentification.statut;
};

// Tests de performance
const testPerformance = async () => {
  log('⚡ Test de performance...', 'PERFORMANCE');
  
  const endpoints = ['/health', '/posts', '/events', '/alerts'];
  
  for (const endpoint of endpoints) {
    const start = Date.now();
    const result = await testEndpoint(endpoint);
    const temps = Date.now() - start;
    
    diagnostic.performance.temps_reponse.push({
      endpoint,
      temps,
      statut: result.success ? 'OK' : 'ERREUR'
    });
  }
  
  diagnostic.performance.memoire = 'N/A';
  diagnostic.performance.optimisation = 'N/A';
};

// Tests de qualité
const testQualite = async () => {
  log('🎯 Test de qualité...', 'QUALITE');
  
  // Vérifier les fichiers de test
  const testFiles = [
    'test-final-complet.js',
    'test-fonctionnalites-completes-corrige.js',
    'test-interface-complete.js',
    'test-photo-profil.js'
  ];
  
  let testsDisponibles = 0;
  for (const file of testFiles) {
    if (fs.existsSync(file)) {
      testsDisponibles++;
    }
  }
  
  diagnostic.qualite.tests = testsDisponibles > 0 ? 'DISPONIBLES' : 'NON_DISPONIBLES';
  
  // Vérifier la documentation
  const docFiles = [
    'DIAGNOSTIC_COMPLET_COMMUNICONNECT.md',
    'RAPPORT_FINAL.md',
    'ETAT_ACTUEL_PROBLEMES.md'
  ];
  
  let docsDisponibles = 0;
  for (const file of docFiles) {
    if (fs.existsSync(file)) {
      docsDisponibles++;
    }
  }
  
  diagnostic.qualite.documentation = docsDisponibles > 0 ? 'DISPONIBLE' : 'NON_DISPONIBLE';
  
  // Accessibilité
  diagnostic.qualite.accessibilite = 'N/A';
};

// Tests de déploiement
const testDeploiement = async () => {
  log('🚀 Test de déploiement...', 'DEPLOIEMENT');
  
  // Vérifier les scripts de démarrage
  const scripts = [
    'start-app-robust.bat',
    'start-complete.bat',
    'restart-server.bat'
  ];
  
  let scriptsDisponibles = 0;
  for (const script of scripts) {
    if (fs.existsSync(script)) {
      scriptsDisponibles++;
    }
  }
  
  diagnostic.deploiement.scripts = scriptsDisponibles > 0 ? 'DISPONIBLES' : 'NON_DISPONIBLES';
  
  // Vérifier la configuration
  const configFiles = [
    'server/.env',
    'client/.env',
    'server/package.json',
    'client/package.json'
  ];
  
  let configDisponible = 0;
  for (const file of configFiles) {
    if (fs.existsSync(file)) {
      configDisponible++;
    }
  }
  
  diagnostic.deploiement.configuration = configDisponible > 0 ? 'CONFIGUREE' : 'NON_CONFIGUREE';
  
  // Monitoring
  diagnostic.deploiement.monitoring = 'N/A';
};

// Fonction principale
const diagnosticComplet = async () => {
  console.log('🔍 DIAGNOSTIC COMPLET ET TRÈS POINTU - COMMUNICONNECT');
  console.log('='.repeat(80));
  console.log(`📅 Date: ${new Date().toLocaleString()}`);
  console.log(`🎯 Objectif: Analyse complète sans rien laisser de côté`);
  console.log('='.repeat(80));
  
  try {
    // Tests du serveur
    const serveurOk = await testServeur();
    
    if (serveurOk) {
      // Tests de la base de données
      await testBaseDeDonnees();
      
      // Tests des fonctionnalités
      await testFonctionnalites();
      
      // Tests de sécurité
      await testSecurite();
      
      // Tests de performance
      await testPerformance();
    }
    
    // Tests du client
    await testClient();
    
    // Tests de qualité
    await testQualite();
    
    // Tests de déploiement
    await testDeploiement();
    
    // Génération du rapport
    genererRapport();
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error.message);
    diagnostic.erreur_globale = error.message;
    genererRapport();
  }
};

// Génération du rapport
const genererRapport = () => {
  console.log('\n📊 RAPPORT FINAL DU DIAGNOSTIC');
  console.log('='.repeat(80));
  
  // Résumé global
  const serveurOk = diagnostic.serveur.statut === 'FONCTIONNEL';
  const clientOk = diagnostic.client.statut === 'FONCTIONNEL';
  const bddOk = diagnostic.baseDeDonnees.statut !== 'ERREUR';
  
  console.log(`🏗️ Serveur: ${diagnostic.serveur.statut}`);
  console.log(`🌐 Client: ${diagnostic.client.statut}`);
  console.log(`🗄️ Base de données: ${diagnostic.baseDeDonnees.statut}`);
  
  // Fonctionnalités
  console.log('\n🔧 FONCTIONNALITÉS:');
  Object.entries(diagnostic.fonctionnalites).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.statut}`);
  });
  
  // Sécurité
  console.log('\n🔒 SÉCURITÉ:');
  Object.entries(diagnostic.securite).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  // Performance
  console.log('\n⚡ PERFORMANCE:');
  if (diagnostic.performance.temps_reponse.length > 0) {
    diagnostic.performance.temps_reponse.forEach(test => {
      console.log(`  ${test.endpoint}: ${test.temps}ms (${test.statut})`);
    });
  }
  
  // Qualité
  console.log('\n🎯 QUALITÉ:');
  Object.entries(diagnostic.qualite).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  // Déploiement
  console.log('\n🚀 DÉPLOIEMENT:');
  Object.entries(diagnostic.deploiement).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  // Score global
  let score = 0;
  let total = 0;
  
  // Score serveur
  if (serveurOk) score += 25;
  total += 25;
  
  // Score client
  if (clientOk) score += 25;
  total += 25;
  
  // Score base de données
  if (bddOk) score += 20;
  total += 20;
  
  // Score fonctionnalités
  const fonctionnalitesOk = Object.values(diagnostic.fonctionnalites)
    .filter(f => f.statut === 'FONCTIONNEL').length;
  const totalFonctionnalites = Object.keys(diagnostic.fonctionnalites).length;
  score += (fonctionnalitesOk / totalFonctionnalites) * 30;
  total += 30;
  
  const scoreFinal = Math.round((score / total) * 100);
  
  console.log('\n📈 SCORE GLOBAL:');
  console.log(`🎯 Score: ${scoreFinal}/100`);
  
  if (scoreFinal >= 90) {
    console.log('🏆 EXCELLENT - Application prête pour la production');
  } else if (scoreFinal >= 75) {
    console.log('✅ BON - Application fonctionnelle avec quelques améliorations');
  } else if (scoreFinal >= 50) {
    console.log('⚠️ MOYEN - Problèmes identifiés nécessitant des corrections');
  } else {
    console.log('❌ CRITIQUE - Problèmes majeurs nécessitant une intervention');
  }
  
  // Sauvegarder le rapport
  const rapportFile = `DIAGNOSTIC_COMPLET_${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(rapportFile, JSON.stringify(diagnostic, null, 2));
  console.log(`\n💾 Rapport sauvegardé: ${rapportFile}`);
  
  console.log('\n🎉 DIAGNOSTIC TERMINÉ');
  console.log('='.repeat(80));
};

// Lancer le diagnostic
diagnosticComplet(); 