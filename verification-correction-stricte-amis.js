const fs = require('fs');
const path = require('path');

console.log('🔧 VÉRIFICATION ET CORRECTION STRICTE - FONCTIONNALITÉ "MES AMIS"');
console.log('==================================================================');

// Configuration des chemins
const PATHS = {
  client: 'client',
  server: 'server',
  friendsPage: 'client/src/pages/Friends/FriendsPage.js',
  lazyLoader: 'client/src/components/common/LazyLoader.js',
  appJs: 'client/src/App.js',
  friendsRoute: 'server/routes/friends.js',
  packageJson: 'client/package.json',
  serverPackageJson: 'server/package.json'
};

// Fonction de vérification des fichiers
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

// Fonction de vérification du contenu
function checkContent(filePath, checks, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ Fichier non trouvé: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n🔍 Vérification de ${description}:`);
  
  let allPassed = true;
  checks.forEach(check => {
    const passed = content.includes(check.search);
    console.log(`   ${passed ? '✅' : '❌'} ${check.description}`);
    if (!passed) allPassed = false;
  });
  
  return allPassed;
}

// Fonction de correction automatique
function fixFile(filePath, fixes, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ Impossible de corriger: ${filePath} n'existe pas`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  console.log(`\n🔧 Application des corrections pour ${description}:`);
  
  fixes.forEach(fix => {
    if (!content.includes(fix.search)) {
      content = content.replace(fix.replace, fix.with);
      console.log(`   ✅ Appliqué: ${fix.description}`);
      modified = true;
    } else {
      console.log(`   ✅ Déjà correct: ${fix.description}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`   💾 Fichier ${filePath} mis à jour`);
  }
  
  return true;
}

// VÉRIFICATIONS PRINCIPALES
console.log('\n📁 VÉRIFICATION DES FICHIERS ESSENTIELS:');
console.log('==========================================');

const essentialFiles = [
  { path: PATHS.friendsPage, desc: 'FriendsPage.js' },
  { path: PATHS.lazyLoader, desc: 'LazyLoader.js' },
  { path: PATHS.appJs, desc: 'App.js' },
  { path: PATHS.friendsRoute, desc: 'Route friends.js' },
  { path: PATHS.packageJson, desc: 'package.json client' },
  { path: PATHS.serverPackageJson, desc: 'package.json server' }
];

let allFilesExist = true;
essentialFiles.forEach(file => {
  if (!checkFile(file.path, file.desc)) {
    allFilesExist = false;
  }
});

// VÉRIFICATION DU CONTENU
console.log('\n🔍 VÉRIFICATION DU CONTENU:');
console.log('============================');

// Vérification App.js
const appChecks = [
  { search: 'import LazyFriendsPage', description: 'Import LazyFriendsPage' },
  { search: 'path="friends"', description: 'Route /friends définie' },
  { search: '<LazyFriendsPage />', description: 'Élément LazyFriendsPage dans le routeur' },
  { search: 'element={<LazyFriendsPage />}', description: 'Configuration correcte de la route' }
];

const appOk = checkContent(PATHS.appJs, appChecks, 'App.js');

// Vérification LazyLoader.js
const lazyChecks = [
  { search: 'LazyFriendsPage = createLazyComponent', description: 'Définition LazyFriendsPage' },
  { search: 'Friends/FriendsPage', description: 'Import FriendsPage' },
  { search: 'export { LazyFriendsPage }', description: 'Export LazyFriendsPage' }
];

const lazyOk = checkContent(PATHS.lazyLoader, lazyChecks, 'LazyLoader.js');

// Vérification FriendsPage.js
const friendsChecks = [
  { search: 'export default FriendsPage', description: 'Export par défaut' },
  { search: 'function FriendsPage', description: 'Définition de la fonction' },
  { search: 'return (', description: 'Return JSX' }
];

const friendsOk = checkContent(PATHS.friendsPage, friendsChecks, 'FriendsPage.js');

// Vérification route friends.js
const routeChecks = [
  { search: 'router.get', description: 'Route GET définie' },
  { search: 'router.post', description: 'Route POST définie' },
  { search: 'module.exports', description: 'Export du module' }
];

const routeOk = checkContent(PATHS.friendsRoute, routeChecks, 'Route friends.js');

// CORRECTIONS AUTOMATIQUES
console.log('\n🔧 CORRECTIONS AUTOMATIQUES:');
console.log('============================');

// Correction App.js si nécessaire
if (!appOk) {
  const appFixes = [
    {
      search: 'import LazyFriendsPage',
      replace: 'import React from "react";',
      with: 'import React from "react";\nimport LazyFriendsPage from "./components/common/LazyLoader";',
      description: 'Ajout import LazyFriendsPage'
    },
    {
      search: 'path="friends"',
      replace: '<Route path="/" element={<HomePage />} />',
      with: '<Route path="/" element={<HomePage />} />\n        <Route path="/friends" element={<LazyFriendsPage />} />',
      description: 'Ajout route /friends'
    }
  ];
  
  fixFile(PATHS.appJs, appFixes, 'App.js');
}

// Correction LazyLoader.js si nécessaire
if (!lazyOk) {
  const lazyFixes = [
    {
      search: 'LazyFriendsPage = createLazyComponent',
      replace: 'const createLazyComponent = (importFunc) => {',
      with: 'const createLazyComponent = (importFunc) => {\nconst LazyFriendsPage = createLazyComponent(() => import("../pages/Friends/FriendsPage"));',
      description: 'Ajout définition LazyFriendsPage'
    },
    {
      search: 'export { LazyFriendsPage }',
      replace: 'export default createLazyComponent;',
      with: 'export default createLazyComponent;\nexport { LazyFriendsPage };',
      description: 'Ajout export LazyFriendsPage'
    }
  ];
  
  fixFile(PATHS.lazyLoader, lazyFixes, 'LazyLoader.js');
}

// VÉRIFICATION DES DÉPENDANCES
console.log('\n📦 VÉRIFICATION DES DÉPENDANCES:');
console.log('================================');

if (fs.existsSync(PATHS.packageJson)) {
  const packageContent = fs.readFileSync(PATHS.packageJson, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
  console.log('Dépendances client requises:');
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${hasDep ? '✅' : '❌'} ${dep}`);
  });
}

if (fs.existsSync(PATHS.serverPackageJson)) {
  const packageContent = fs.readFileSync(PATHS.serverPackageJson, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  const requiredDeps = ['express', 'cors', 'mongoose'];
  console.log('\nDépendances serveur requises:');
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${hasDep ? '✅' : '❌'} ${dep}`);
  });
}

// RÉSUMÉ FINAL
console.log('\n🎯 RÉSUMÉ DE LA VÉRIFICATION:');
console.log('==============================');
console.log(`📁 Fichiers essentiels: ${allFilesExist ? '✅' : '❌'}`);
console.log(`🔍 App.js: ${appOk ? '✅' : '❌'}`);
console.log(`🔍 LazyLoader.js: ${lazyOk ? '✅' : '❌'}`);
console.log(`🔍 FriendsPage.js: ${friendsOk ? '✅' : '❌'}`);
console.log(`🔍 Route friends.js: ${routeOk ? '✅' : '❌'}`);

const overallStatus = allFilesExist && appOk && lazyOk && friendsOk && routeOk;

console.log(`\n🎯 STATUT GLOBAL: ${overallStatus ? '✅ FONCTIONNALITÉ OPÉRATIONNELLE' : '❌ PROBLÈMES DÉTECTÉS'}`);

if (overallStatus) {
  console.log('\n💡 PROCHAINES ÉTAPES:');
  console.log('1. Redémarrez le client: cd client && npm start');
  console.log('2. Videz le cache du navigateur (Ctrl+F5)');
  console.log('3. Testez la navigation vers /friends');
  console.log('4. Vérifiez la console pour les erreurs JavaScript');
} else {
  console.log('\n⚠️ PROBLÈMES IDENTIFIÉS:');
  console.log('1. Vérifiez que tous les fichiers existent');
  console.log('2. Assurez-vous que les imports sont corrects');
  console.log('3. Vérifiez la syntaxe des composants');
  console.log('4. Redémarrez le serveur et le client');
}

console.log('\n🔧 VÉRIFICATION TERMINÉE');
console.log('========================'); 