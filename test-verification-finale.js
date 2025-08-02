
const fs = require('fs');

console.log('🎯 TEST FINAL - VÉRIFICATION RAPIDE');
console.log('====================================');

const files = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier les imports et exports
if (fs.existsSync('client/src/App.js')) {
  const appContent = fs.readFileSync('client/src/App.js', 'utf8');
  console.log(`   ${appContent.includes('LazyFriendsPage') ? '✅' : '❌'} Import LazyFriendsPage`);
  console.log(`   ${appContent.includes('path="friends"') ? '✅' : '❌'} Route /friends`);
}

if (fs.existsSync('client/src/components/common/LazyLoader.js')) {
  const lazyContent = fs.readFileSync('client/src/components/common/LazyLoader.js', 'utf8');
  console.log(`   ${lazyContent.includes('export const LazyFriendsPage') ? '✅' : '❌'} Export LazyFriendsPage`);
}

console.log('\n🎯 VÉRIFICATION TERMINÉE');
