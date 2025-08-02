const axios = require('axios');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:3000';

// Résultats du diagnostic
const diagnostic = {
  timestamp: new Date().toISOString(),
  serveur: { statut: 'INCONNU', erreurs: [] },
  client: { statut: 'INCONNU', erreurs: [] },
  fonctionnalites: {},
  score: 0
};

// Test simple d'endpoint
const testEndpoint = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status || 'N/A',
      message: error.message 
    };
  }
};

// Diagnostic principal
const diagnosticRapide = async () => {
  console.log('🔍 DIAGNOSTIC RAPIDE - ÉTAT ACTUEL');
  console.log('='.repeat(60));
  
  // Test serveur
  console.log('\n🏗️ TEST DU SERVEUR:');
  const health = await testEndpoint('/health');
  if (health.success) {
    diagnostic.serveur.statut = 'FONCTIONNEL';
    console.log('✅ Serveur backend accessible');
  } else {
    diagnostic.serveur.statut = 'INACCESSIBLE';
    diagnostic.serveur.erreurs.push(health.message);
    console.log('❌ Serveur backend inaccessible');
    return;
  }
  
  // Test client
  console.log('\n🌐 TEST DU CLIENT:');
  try {
    await axios.get(CLIENT_URL, { timeout: 5000 });
    diagnostic.client.statut = 'FONCTIONNEL';
    console.log('✅ Client frontend accessible');
  } catch (error) {
    diagnostic.client.statut = 'INACCESSIBLE';
    diagnostic.client.erreurs.push(error.message);
    console.log('❌ Client frontend inaccessible');
  }
  
  // Test des fonctionnalités principales
  console.log('\n🔧 TEST DES FONCTIONNALITÉS:');
  
  const fonctionnalites = [
    { nom: 'Authentification', endpoint: '/auth/login', method: 'POST', data: { identifier: 'test@communiconnect.gn', password: 'test123' } },
    { nom: 'Posts', endpoint: '/posts' },
    { nom: 'Événements', endpoint: '/events' },
    { nom: 'Alertes', endpoint: '/alerts' },
    { nom: 'Livestreams', endpoint: '/livestreams' },
    { nom: 'Messages', endpoint: '/messages/conversations' },
    { nom: 'Amis', endpoint: '/friends/list' },
    { nom: 'Notifications', endpoint: '/notifications' },
    { nom: 'Modération', endpoint: '/moderation/reports' },
    { nom: 'Recherche', endpoint: '/search?q=test' },
    { nom: 'Statistiques', endpoint: '/stats' },
    { nom: 'Géolocalisation', endpoint: '/locations' }
  ];
  
  let fonctionnalitesOk = 0;
  
  for (const func of fonctionnalites) {
    const result = await testEndpoint(func.endpoint, func.method, func.data);
    diagnostic.fonctionnalites[func.nom] = result;
    
    if (result.success) {
      console.log(`✅ ${func.nom} - OK`);
      fonctionnalitesOk++;
    } else {
      console.log(`❌ ${func.nom} - Erreur: ${result.message}`);
    }
  }
  
  // Calcul du score
  let score = 0;
  
  // Serveur (30 points)
  if (diagnostic.serveur.statut === 'FONCTIONNEL') score += 30;
  
  // Client (20 points)
  if (diagnostic.client.statut === 'FONCTIONNEL') score += 20;
  
  // Fonctionnalités (50 points)
  const pourcentageFonctionnalites = (fonctionnalitesOk / fonctionnalites.length) * 50;
  score += pourcentageFonctionnalites;
  
  diagnostic.score = Math.round(score);
  
  // Rapport final
  console.log('\n📊 RAPPORT FINAL:');
  console.log('='.repeat(60));
  console.log(`🏗️ Serveur: ${diagnostic.serveur.statut}`);
  console.log(`🌐 Client: ${diagnostic.client.statut}`);
  console.log(`🔧 Fonctionnalités: ${fonctionnalitesOk}/${fonctionnalites.length} OK`);
  console.log(`📈 Score global: ${diagnostic.score}/100`);
  
  if (diagnostic.score >= 90) {
    console.log('🏆 EXCELLENT - Application prête pour la production');
  } else if (diagnostic.score >= 75) {
    console.log('✅ BON - Application fonctionnelle avec quelques améliorations');
  } else if (diagnostic.score >= 50) {
    console.log('⚠️ MOYEN - Problèmes identifiés nécessitant des corrections');
  } else {
    console.log('❌ CRITIQUE - Problèmes majeurs nécessitant une intervention');
  }
  
  // Détails des erreurs
  if (diagnostic.serveur.erreurs.length > 0) {
    console.log('\n❌ Erreurs serveur:');
    diagnostic.serveur.erreurs.forEach(err => console.log(`  - ${err}`));
  }
  
  if (diagnostic.client.erreurs.length > 0) {
    console.log('\n❌ Erreurs client:');
    diagnostic.client.erreurs.forEach(err => console.log(`  - ${err}`));
  }
  
  // Sauvegarder le rapport
  const rapportFile = `DIAGNOSTIC_RAPIDE_${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(rapportFile, JSON.stringify(diagnostic, null, 2));
  console.log(`\n💾 Rapport sauvegardé: ${rapportFile}`);
  
  console.log('\n🎉 DIAGNOSTIC TERMINÉ');
  console.log('='.repeat(60));
};

// Lancer le diagnostic
diagnosticRapide(); 