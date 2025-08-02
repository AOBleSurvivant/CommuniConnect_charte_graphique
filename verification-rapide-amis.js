const fs = require('fs');

console.log('🔍 VÉRIFICATION RAPIDE - FONCTIONNALITÉ AMIS');
console.log('=============================================');

// Vérifier les fichiers essentiels
const essentialFiles = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js'
];

console.log('\n📁 Vérification des fichiers:');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier les routes dans App.js
const appPath = 'client/src/App.js';
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  const hasFriendsRoute = content.includes('path="friends"');
  const hasLazyFriendsImport = content.includes('LazyFriendsPage');
  const hasLazyFriendsElement = content.includes('<LazyFriendsPage />');
  
  console.log('\n🔍 Vérification des routes:');
  console.log(`   ${hasFriendsRoute ? '✅' : '❌'} Route /friends définie`);
  console.log(`   ${hasLazyFriendsImport ? '✅' : '❌'} Import LazyFriendsPage`);
  console.log(`   ${hasLazyFriendsElement ? '✅' : '❌'} Élément LazyFriendsPage`);
}

// Vérifier LazyLoader.js
const lazyLoaderPath = 'client/src/components/common/LazyLoader.js';
if (fs.existsSync(lazyLoaderPath)) {
  const content = fs.readFileSync(lazyLoaderPath, 'utf8');
  
  const hasLazyFriendsPage = content.includes('LazyFriendsPage = createLazyComponent');
  const hasFriendsImport = content.includes('Friends/FriendsPage');
  
  console.log('\n🔍 Vérification du lazy loading:');
  console.log(`   ${hasLazyFriendsPage ? '✅' : '❌'} LazyFriendsPage défini`);
  console.log(`   ${hasFriendsImport ? '✅' : '❌'} Import FriendsPage`);
}

console.log('\n🎯 VÉRIFICATION TERMINÉE');
console.log('==========================');
console.log('💡 Si tous les tests sont ✅, le problème peut être:');
console.log('1. Erreur JavaScript dans la console du navigateur');
console.log('2. Problème de cache du navigateur');
console.log('3. Serveur non démarré');
console.log('4. Problème de build du client');
