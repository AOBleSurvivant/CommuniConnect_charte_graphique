const fs = require('fs');
const path = require('path');

console.log('🔍 TEST RAPIDE - ÉTAT DU PROJET');
console.log('==================================');

// Vérifier les fichiers essentiels
const filesToCheck = [
  'server/package.json',
  'client/package.json',
  'server/index.js',
  'server/routes/events.js',
  'client/src/App.js'
];

console.log('\n📁 Vérification des fichiers:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier le contenu des routes d'événements
console.log('\n🔧 Vérification des routes d\'événements:');
const eventsFile = 'server/routes/events.js';
if (fs.existsSync(eventsFile)) {
  const content = fs.readFileSync(eventsFile, 'utf8');
  
  const hasGetRoute = content.includes('router.get(\'/\', [');
  const hasPostRoute = content.includes('router.post(\'/\', [');
  const hasErrorHandling = content.includes('catch (error)');
  
  console.log(`   ${hasGetRoute ? '✅' : '❌'} Route GET /events`);
  console.log(`   ${hasPostRoute ? '✅' : '❌'} Route POST /events`);
  console.log(`   ${hasErrorHandling ? '✅' : '❌'} Gestion d'erreurs`);
} else {
  console.log('   ❌ Fichier events.js non trouvé');
}

// Vérifier le serveur principal
console.log('\n🚀 Vérification du serveur principal:');
const indexFile = 'server/index.js';
if (fs.existsSync(indexFile)) {
  const content = fs.readFileSync(indexFile, 'utf8');
  
  const hasEventsRoute = content.includes('app.use(\'/api/events\'');
  const hasErrorHandling = content.includes('app.use((err, req, res, next)');
  const hasHealthRoute = content.includes('/api/health');
  
  console.log(`   ${hasEventsRoute ? '✅' : '❌'} Route events dans index.js`);
  console.log(`   ${hasErrorHandling ? '✅' : '❌'} Gestion d'erreurs globale`);
  console.log(`   ${hasHealthRoute ? '✅' : '❌'} Route health`);
} else {
  console.log('   ❌ Fichier index.js non trouvé');
}

// Vérifier les dépendances
console.log('\n📦 Vérification des dépendances:');
const serverPackage = 'server/package.json';
if (fs.existsSync(serverPackage)) {
  try {
    const serverDeps = JSON.parse(fs.readFileSync(serverPackage, 'utf8'));
    const requiredDeps = ['express', 'cors', 'helmet'];
    const missingDeps = requiredDeps.filter(dep => !serverDeps.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('   ✅ Toutes les dépendances serveur sont présentes');
    } else {
      console.log(`   ⚠️  Dépendances manquantes: ${missingDeps.join(', ')}`);
    }
  } catch (error) {
    console.log('   ❌ Erreur lecture package.json serveur');
  }
}

const clientPackage = 'client/package.json';
if (fs.existsSync(clientPackage)) {
  try {
    const clientDeps = JSON.parse(fs.readFileSync(clientPackage, 'utf8'));
    const requiredDeps = ['react', 'react-dom'];
    const missingDeps = requiredDeps.filter(dep => !clientDeps.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('   ✅ Toutes les dépendances client sont présentes');
    } else {
      console.log(`   ⚠️  Dépendances manquantes: ${missingDeps.join(', ')}`);
    }
  } catch (error) {
    console.log('   ❌ Erreur lecture package.json client');
  }
}

console.log('\n🎯 RÉSUMÉ:');
console.log('===========');

const workingFiles = filesToCheck.filter(file => fs.existsSync(file)).length;
const totalFiles = filesToCheck.length;

console.log(`📁 Fichiers: ${workingFiles}/${totalFiles} présents`);
console.log(`🔧 Routes: ${fs.existsSync(eventsFile) ? 'Présentes' : 'Manquantes'}`);
console.log(`🚀 Serveur: ${fs.existsSync(indexFile) ? 'Configuré' : 'Non configuré'}`);

if (workingFiles === totalFiles) {
  console.log('\n✅ PROJET EN BON ÉTAT - Prêt pour les tests');
} else {
  console.log('\n⚠️  PROJET INCOMPLET - Corrections nécessaires');
}

console.log('\n💡 Prochaines étapes:');
console.log('1. cd server && npm start');
console.log('2. cd client && npm start');
console.log('3. Tester les événements'); 