const fs = require('fs');

console.log('🔍 TEST RAPIDE - FONCTIONNALITÉ "MES AMIS"');
console.log('============================================');

// Test 1: Fichiers essentiels
console.log('\n📁 Test 1: Fichiers essentiels');
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

// Test 2: App.js
console.log('\n🔍 Test 2: App.js');
if (fs.existsSync('client/src/App.js')) {
  const content = fs.readFileSync('client/src/App.js', 'utf8');
  const lazyCount = (content.match(/LazyFriendsPage/g) || []).length;
  console.log(`   LazyFriendsPage: ${lazyCount} occurrences`);
  console.log(`   Route /friends: ${content.includes('path="friends"') ? '✅' : '❌'}`);
}

// Test 3: LazyLoader.js
console.log('\n🔍 Test 3: LazyLoader.js');
if (fs.existsSync('client/src/components/common/LazyLoader.js')) {
  const content = fs.readFileSync('client/src/components/common/LazyLoader.js', 'utf8');
  console.log(`   Export LazyFriendsPage: ${content.includes('export const LazyFriendsPage') ? '✅' : '❌'}`);
}

// Test 4: FriendsPage.js
console.log('\n🔍 Test 4: FriendsPage.js');
if (fs.existsSync('client/src/pages/Friends/FriendsPage.js')) {
  const content = fs.readFileSync('client/src/pages/Friends/FriendsPage.js', 'utf8');
  console.log(`   Export default: ${content.includes('export default FriendsPage') ? '✅' : '❌'}`);
}

// Test 5: Serveur principal
console.log('\n🔍 Test 5: Serveur principal');
if (fs.existsSync('server/server.js')) {
  const content = fs.readFileSync('server/server.js', 'utf8');
  console.log(`   Route friends: ${content.includes('friends') ? '✅' : '❌'}`);
}

console.log('\n🎯 TEST TERMINÉ');
console.log('================'); 