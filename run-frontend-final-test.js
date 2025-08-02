#!/usr/bin/env node

const { runFrontendFinalTests } = require('./test-frontend-final.js');

console.log('🚀 Lancement des tests frontend finaux...');
console.log('⏳ Veuillez patienter pendant l\'exécution des tests...\n');

runFrontendFinalTests()
  .then(() => {
    console.log('\n✅ Tests frontend finaux terminés avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de l\'exécution des tests:', error.message);
    process.exit(1);
  }); 