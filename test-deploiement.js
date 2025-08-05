const fs = require('fs');
const path = require('path');

console.log('🧪 Test de préparation au déploiement CommuniConnect');
console.log('==================================================');

// Vérifications
const checks = [
  {
    name: 'Package.json principal',
    check: () => fs.existsSync('package.json'),
    fix: 'Créer un package.json principal'
  },
  {
    name: 'Package.json client',
    check: () => fs.existsSync('client/package.json'),
    fix: 'Créer un package.json dans le dossier client'
  },
  {
    name: 'Package.json serveur',
    check: () => fs.existsSync('server/package.json'),
    fix: 'Créer un package.json dans le dossier server'
  },
  {
    name: 'Configuration Vercel',
    check: () => fs.existsSync('vercel.json'),
    fix: 'Créer un fichier vercel.json'
  },
  {
    name: 'Configuration Netlify',
    check: () => fs.existsSync('netlify.toml'),
    fix: 'Créer un fichier netlify.toml'
  },
  {
    name: 'Script de déploiement',
    check: () => fs.existsSync('deploy-vercel.sh') || fs.existsSync('deploy-vercel.ps1'),
    fix: 'Créer un script de déploiement'
  },
  {
    name: 'Dossier client/src',
    check: () => fs.existsSync('client/src'),
    fix: 'Créer le dossier client/src avec les fichiers React'
  },
  {
    name: 'Fichier serveur principal',
    check: () => fs.existsSync('server/index.js'),
    fix: 'Créer le fichier server/index.js'
  }
];

let passed = 0;
let failed = 0;

console.log('\n📋 Vérifications en cours...\n');

checks.forEach((check, index) => {
  const result = check.check();
  const status = result ? '✅' : '❌';
  const message = result ? 'PASS' : 'FAIL';
  
  console.log(`${status} ${index + 1}. ${check.name}: ${message}`);
  
  if (!result) {
    console.log(`   💡 Solution: ${check.fix}`);
  }
  
  if (result) {
    passed++;
  } else {
    failed++;
  }
});

console.log('\n📊 Résultats:');
console.log(`✅ Passés: ${passed}`);
console.log(`❌ Échoués: ${failed}`);
console.log(`📈 Taux de réussite: ${Math.round((passed / checks.length) * 100)}%`);

if (failed === 0) {
  console.log('\n🎉 Tous les tests sont passés! Votre projet est prêt pour le déploiement.');
  console.log('\n🚀 Prochaines étapes:');
  console.log('1. Exécutez: npm run install-all');
  console.log('2. Exécutez: vercel login');
  console.log('3. Exécutez: vercel --prod');
} else {
  console.log('\n⚠️  Certains tests ont échoué. Veuillez corriger les problèmes avant le déploiement.');
  console.log('\n📖 Consultez DEPLOIEMENT_GRATUIT_RAPIDE.md pour plus d\'informations.');
}

// Vérification des variables d'environnement
console.log('\n🔧 Vérification des variables d\'environnement...');

const envFiles = [
  'client/.env.local',
  'server/.env',
  '.env'
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`⚠️  ${file} n'existe pas (optionnel)`);
  }
});

console.log('\n💡 Conseil: Créez un fichier .env.local dans le dossier client avec:');
console.log('REACT_APP_API_URL=https://votre-app.vercel.app/api');
console.log('REACT_APP_SOCKET_URL=https://votre-app.vercel.app'); 