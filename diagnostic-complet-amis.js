const fs = require('fs');

console.log('🔍 DIAGNOSTIC COMPLET - FONCTIONNALITÉ "MES AMIS"');
console.log('===================================================');

// 1. Vérification des fichiers essentiels
console.log('\n📁 1. VÉRIFICATION DES FICHIERS:');
const files = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js',
  'server/server.js'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 2. Vérification détaillée de App.js
console.log('\n🔍 2. VÉRIFICATION DÉTAILLÉE DE App.js:');
if (fs.existsSync('client/src/App.js')) {
  const appContent = fs.readFileSync('client/src/App.js', 'utf8');
  
  // Compter les occurrences de LazyFriendsPage
  const importMatches = appContent.match(/LazyFriendsPage/g);
  const importCount = importMatches ? importMatches.length : 0;
  
  console.log(`   Import LazyFriendsPage: ${importCount} fois`);
  console.log(`   Route /friends: ${appContent.includes('path="friends"') ? '✅' : '❌'}`);
  console.log(`   Élément LazyFriendsPage: ${appContent.includes('element={<LazyFriendsPage />}') ? '✅' : '❌'}`);
  
  // Afficher les lignes importantes
  console.log('\n📄 Extrait de App.js:');
  const lines = appContent.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('LazyFriendsPage') || line.includes('path="friends"')) {
      console.log(`   Ligne ${index + 1}: ${line.trim()}`);
    }
  });
}

// 3. Vérification de LazyLoader.js
console.log('\n🔍 3. VÉRIFICATION DE LazyLoader.js:');
if (fs.existsSync('client/src/components/common/LazyLoader.js')) {
  const lazyContent = fs.readFileSync('client/src/components/common/LazyLoader.js', 'utf8');
  
  console.log(`   Export LazyFriendsPage: ${lazyContent.includes('export const LazyFriendsPage') ? '✅' : '❌'}`);
  console.log(`   Import FriendsPage: ${lazyContent.includes('import(\'../../pages/Friends/FriendsPage\')') ? '✅' : '❌'}`);
  
  // Afficher la ligne d'export
  const exportLine = lazyContent.split('\n').find(line => line.includes('LazyFriendsPage'));
  if (exportLine) {
    console.log(`   Ligne d'export: ${exportLine.trim()}`);
  }
}

// 4. Vérification de FriendsPage.js
console.log('\n🔍 4. VÉRIFICATION DE FriendsPage.js:');
if (fs.existsSync('client/src/pages/Friends/FriendsPage.js')) {
  const friendsContent = fs.readFileSync('client/src/pages/Friends/FriendsPage.js', 'utf8');
  
  console.log(`   Définition const FriendsPage: ${friendsContent.includes('const FriendsPage') ? '✅' : '❌'}`);
  console.log(`   Export par défaut: ${friendsContent.includes('export default FriendsPage') ? '✅' : '❌'}`);
  console.log(`   Return JSX: ${friendsContent.includes('return (') ? '✅' : '❌'}`);
  
  // Afficher les premières lignes
  console.log('\n📄 Premières lignes de FriendsPage.js:');
  const lines = friendsContent.split('\n').slice(0, 10);
  lines.forEach((line, index) => {
    console.log(`   ${index + 1}: ${line.trim()}`);
  });
}

// 5. Vérification du serveur principal
console.log('\n🔍 5. VÉRIFICATION DU SERVEUR PRINCIPAL:');
if (fs.existsSync('server/server.js')) {
  const serverContent = fs.readFileSync('server/server.js', 'utf8');
  
  console.log(`   Route friends incluse: ${serverContent.includes('friends') ? '✅' : '❌'}`);
  console.log(`   Configuration route friends: ${serverContent.includes('app.use(\'/api/friends\'') ? '✅' : '❌'}`);
  
  // Chercher les lignes avec "friends"
  const friendLines = serverContent.split('\n').filter(line => line.includes('friends'));
  if (friendLines.length > 0) {
    console.log('\n📄 Lignes avec "friends" dans server.js:');
    friendLines.forEach(line => {
      console.log(`   ${line.trim()}`);
    });
  } else {
    console.log('   ❌ Aucune référence à "friends" trouvée dans server.js');
  }
}

// 6. Test de compilation
console.log('\n🧪 6. TEST DE COMPILATION:');
console.log('   🔄 Vérification de la syntaxe...');

if (fs.existsSync('client/src/App.js')) {
  const appContent = fs.readFileSync('client/src/App.js', 'utf8');
  
  const errors = [];
  
  // Vérifier les imports en double
  const importMatches = appContent.match(/LazyFriendsPage/g);
  if (importMatches && importMatches.length > 1) {
    errors.push(`Import en double de LazyFriendsPage (${importMatches.length} fois)`);
  }
  
  // Vérifier les accolades
  const openBraces = (appContent.match(/\{/g) || []).length;
  const closeBraces = (appContent.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Accolades non équilibrées (${openBraces} ouvertes, ${closeBraces} fermées)`);
  }
  
  // Vérifier les parenthèses
  const openParens = (appContent.match(/\(/g) || []).length;
  const closeParens = (appContent.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Parenthèses non équilibrées (${openParens} ouvertes, ${closeParens} fermées)`);
  }
  
  if (errors.length === 0) {
    console.log('   ✅ Aucune erreur de syntaxe détectée');
  } else {
    console.log('   ❌ Erreurs de syntaxe détectées:');
    errors.forEach(error => console.log(`      - ${error}`));
  }
}

// 7. Recommandations
console.log('\n💡 7. RECOMMANDATIONS:');
console.log('   Si des ❌ sont présents:');
console.log('   1. Corrigez les erreurs de syntaxe');
console.log('   2. Ajoutez la route friends dans server.js si manquante');
console.log('   3. Vérifiez que FriendsPage.js exporte correctement');
console.log('   4. Redémarrez le serveur et le client');

console.log('\n🎯 DIAGNOSTIC TERMINÉ');
console.log('======================='); 