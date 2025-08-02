const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC ERREUR RÉCUPÉRATION AMIS');
console.log('==========================================');

// 1. Vérifier le slice Redux
console.log('\n📁 TEST 1: friendsSlice.js');
const friendsSlicePath = 'client/src/store/slices/friendsSlice.js';
if (fs.existsSync(friendsSlicePath)) {
  const content = fs.readFileSync(friendsSlicePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier fetchFriends
  const hasFetchFriends = content.includes('fetchFriends');
  console.log(`   ${hasFetchFriends ? '✅' : '❌'} Action fetchFriends`);
  
  // Vérifier l'URL de l'API
  const hasApiUrl = content.includes('/api/friends') || content.includes('friends');
  console.log(`   ${hasApiUrl ? '✅' : '❌'} URL API friends`);
  
  // Afficher la définition de fetchFriends
  const fetchFriendsMatch = content.match(/export const fetchFriends = createAsyncThunk\([^)]+\)/);
  if (fetchFriendsMatch) {
    console.log('   📄 Définition fetchFriends trouvée');
  } else {
    console.log('   ❌ Définition fetchFriends manquante');
  }
} else {
  console.log('   ❌ Fichier manquant');
}

// 2. Vérifier FriendsPage.js
console.log('\n📁 TEST 2: FriendsPage.js');
const friendsPagePath = 'client/src/pages/Friends/FriendsPage.js';
if (fs.existsSync(friendsPagePath)) {
  const content = fs.readFileSync(friendsPagePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier l'import de fetchFriends
  const hasImport = content.includes('fetchFriends');
  console.log(`   ${hasImport ? '✅' : '❌'} Import fetchFriends`);
  
  // Vérifier l'utilisation
  const hasDispatch = content.includes('dispatch(fetchFriends');
  console.log(`   ${hasDispatch ? '✅' : '❌'} Dispatch fetchFriends`);
  
  // Vérifier la gestion d'erreur
  const hasErrorHandling = content.includes('error') || content.includes('catch');
  console.log(`   ${hasErrorHandling ? '✅' : '❌'} Gestion d'erreur`);
} else {
  console.log('   ❌ Fichier manquant');
}

// 3. Vérifier la route serveur
console.log('\n📁 TEST 3: Route serveur friends');
const friendsRoutePath = 'server/routes/friends.js';
if (fs.existsSync(friendsRoutePath)) {
  const content = fs.readFileSync(friendsRoutePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier la route GET
  const hasGetRoute = content.includes('router.get');
  console.log(`   ${hasGetRoute ? '✅' : '❌'} Route GET`);
  
  // Vérifier l'export
  const hasExport = content.includes('module.exports');
  console.log(`   ${hasExport ? '✅' : '❌'} Export module`);
} else {
  console.log('   ❌ Fichier manquant');
}

// 4. Vérifier la configuration serveur
console.log('\n📁 TEST 4: Configuration serveur');
const serverIndexPath = 'server/index.js';
if (fs.existsSync(serverIndexPath)) {
  const content = fs.readFileSync(serverIndexPath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier l'import des routes friends
  const hasFriendsImport = content.includes('friends') || content.includes('./routes/friends');
  console.log(`   ${hasFriendsImport ? '✅' : '❌'} Import routes friends`);
  
  // Vérifier l'utilisation des routes
  const hasFriendsUse = content.includes('app.use') && content.includes('friends');
  console.log(`   ${hasFriendsUse ? '✅' : '❌'} Utilisation routes friends`);
} else {
  console.log('   ❌ Fichier manquant');
}

console.log('\n🎯 DIAGNOSTIC TERMINÉ');
console.log('========================'); 