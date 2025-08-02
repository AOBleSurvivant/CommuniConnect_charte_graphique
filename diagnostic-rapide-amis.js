const fs = require('fs');

console.log('🔍 DIAGNOSTIC RAPIDE - PROBLÈME ROUTE /FRIENDS');
console.log('=================================================');

// Vérification des fichiers essentiels
const files = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js'
];

console.log('\n📁 Vérification des fichiers:');
files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Vérification détaillée de App.js
console.log('\n🔍 Vérification détaillée de App.js:');
if (fs.existsSync('client/src/App.js')) {
  const appContent = fs.readFileSync('client/src/App.js', 'utf8');
  
  const checks = [
    { search: 'LazyFriendsPage', name: 'Import LazyFriendsPage' },
    { search: 'path="friends"', name: 'Route /friends' },
    { search: 'element={<LazyFriendsPage />}', name: 'Élément LazyFriendsPage' },
    { search: 'import {', name: 'Import avec destructuring' },
    { search: 'LazyFriendsPage,', name: 'LazyFriendsPage dans destructuring' }
  ];
  
  checks.forEach(check => {
    const found = appContent.includes(check.search);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
  
  // Afficher les lignes importantes
  console.log('\n📄 Extrait de App.js:');
  const lines = appContent.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('LazyFriendsPage') || line.includes('path="friends"')) {
      console.log(`   Ligne ${index + 1}: ${line.trim()}`);
    }
  });
}

// Vérification de LazyLoader.js
console.log('\n🔍 Vérification de LazyLoader.js:');
if (fs.existsSync('client/src/components/common/LazyLoader.js')) {
  const lazyContent = fs.readFileSync('client/src/components/common/LazyLoader.js', 'utf8');
  
  const checks = [
    { search: 'export const LazyFriendsPage', name: 'Export LazyFriendsPage' },
    { search: 'import(\'../../pages/Friends/FriendsPage\')', name: 'Import FriendsPage' },
    { search: 'createLazyComponent', name: 'Fonction createLazyComponent' }
  ];
  
  checks.forEach(check => {
    const found = lazyContent.includes(check.search);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
}

// Vérification de FriendsPage.js
console.log('\n🔍 Vérification de FriendsPage.js:');
if (fs.existsSync('client/src/pages/Friends/FriendsPage.js')) {
  const friendsContent = fs.readFileSync('client/src/pages/Friends/FriendsPage.js', 'utf8');
  
  const checks = [
    { search: 'const FriendsPage', name: 'Définition const FriendsPage' },
    { search: 'function FriendsPage', name: 'Définition function FriendsPage' },
    { search: 'export default FriendsPage', name: 'Export par défaut' },
    { search: 'return (', name: 'Return JSX' }
  ];
  
  checks.forEach(check => {
    const found = friendsContent.includes(check.search);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
}

// Vérification de la route serveur
console.log('\n🔍 Vérification de la route serveur:');
if (fs.existsSync('server/routes/friends.js')) {
  const routeContent = fs.readFileSync('server/routes/friends.js', 'utf8');
  
  const checks = [
    { search: 'router.get', name: 'Route GET' },
    { search: 'router.post', name: 'Route POST' },
    { search: 'module.exports', name: 'Export module' }
  ];
  
  checks.forEach(check => {
    const found = routeContent.includes(check.search);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
}

// Vérification du serveur principal
console.log('\n🔍 Vérification du serveur principal:');
if (fs.existsSync('server/server.js')) {
  const serverContent = fs.readFileSync('server/server.js', 'utf8');
  
  const checks = [
    { search: 'friends', name: 'Route friends incluse' },
    { search: 'app.use(\'/api/friends\'', name: 'Configuration route friends' }
  ];
  
  checks.forEach(check => {
    const found = serverContent.includes(check.search);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
}

console.log('\n🎯 DIAGNOSTIC TERMINÉ');
console.log('=======================');
console.log('💡 Si des ❌ sont présents, exécutez:');
console.log('node correction-finale-amis.js'); 