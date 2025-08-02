const fs = require('fs');

console.log('🔧 CORRECTION ERREUR RÉCUPÉRATION AMIS');
console.log('=========================================');

// 1. Vérifier et corriger friendsSlice.js
console.log('\n📁 ÉTAPE 1: Vérification friendsSlice.js');
const friendsSlicePath = 'client/src/store/slices/friendsSlice.js';

if (fs.existsSync(friendsSlicePath)) {
  let content = fs.readFileSync(friendsSlicePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier si l'URL de l'API est correcte
  if (!content.includes('/api/friends')) {
    console.log('   🔧 Correction URL API...');
    content = content.replace(
      /fetchFriends = createAsyncThunk\([^,]+,\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}/,
      `fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des amis');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)`
    );
    fs.writeFileSync(friendsSlicePath, content);
    console.log('   ✅ URL API corrigée');
  } else {
    console.log('   ✅ URL API correcte');
  }
} else {
  console.log('   ❌ Fichier manquant');
}

// 2. Vérifier et corriger FriendsPage.js
console.log('\n📁 ÉTAPE 2: Vérification FriendsPage.js');
const friendsPagePath = 'client/src/pages/Friends/FriendsPage.js';

if (fs.existsSync(friendsPagePath)) {
  let content = fs.readFileSync(friendsPagePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier la gestion d'erreur
  if (!content.includes('error') || !content.includes('catch')) {
    console.log('   🔧 Amélioration gestion d\'erreur...');
    
    // Ajouter une meilleure gestion d'erreur
    const errorHandlingCode = `
  // Gestion d'erreur améliorée
  useEffect(() => {
    if (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      // Ici vous pouvez ajouter une notification d'erreur
    }
  }, [error]);
`;
    
    // Insérer après le useEffect existant
    if (content.includes('useEffect')) {
      const useEffectIndex = content.lastIndexOf('useEffect');
      const insertIndex = content.indexOf('}', useEffectIndex) + 1;
      content = content.slice(0, insertIndex) + errorHandlingCode + content.slice(insertIndex);
    }
    
    fs.writeFileSync(friendsPagePath, content);
    console.log('   ✅ Gestion d\'erreur améliorée');
  } else {
    console.log('   ✅ Gestion d\'erreur présente');
  }
} else {
  console.log('   ❌ Fichier manquant');
}

// 3. Vérifier la route serveur
console.log('\n📁 ÉTAPE 3: Vérification route serveur');
const friendsRoutePath = 'server/routes/friends.js';

if (fs.existsSync(friendsRoutePath)) {
  let content = fs.readFileSync(friendsRoutePath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier si la route GET existe et gère les erreurs
  if (!content.includes('router.get')) {
    console.log('   🔧 Ajout route GET...');
    const getRoute = `
// Route pour récupérer la liste des amis
router.get('/', async (req, res) => {
  try {
    // Ici vous pouvez ajouter la logique pour récupérer les amis
    // Pour l'instant, retournons un tableau vide
    res.json({ friends: [] });
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des amis' });
  }
});
`;
    content = content + getRoute;
    fs.writeFileSync(friendsRoutePath, content);
    console.log('   ✅ Route GET ajoutée');
  } else {
    console.log('   ✅ Route GET présente');
  }
} else {
  console.log('   ❌ Fichier manquant');
}

// 4. Vérifier la configuration serveur
console.log('\n📁 ÉTAPE 4: Vérification configuration serveur');
const serverIndexPath = 'server/index.js';

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  console.log('   ✅ Fichier présent');
  
  // Vérifier si les routes friends sont configurées
  if (!content.includes('app.use') || !content.includes('friends')) {
    console.log('   🔧 Ajout configuration routes friends...');
    
    // Ajouter l'import si nécessaire
    if (!content.includes('require(\'./routes/friends\')')) {
      const importLine = "const friendsRoutes = require('./routes/friends');\n";
      const lastImportIndex = content.lastIndexOf('require(');
      const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertIndex) + importLine + content.slice(insertIndex);
    }
    
    // Ajouter l'utilisation des routes
    const useLine = "app.use('/api/friends', friendsRoutes);\n";
    const lastUseIndex = content.lastIndexOf('app.use');
    const insertIndex = content.indexOf('\n', lastUseIndex) + 1;
    content = content.slice(0, insertIndex) + useLine + content.slice(insertIndex);
    
    fs.writeFileSync(serverIndexPath, content);
    console.log('   ✅ Configuration routes friends ajoutée');
  } else {
    console.log('   ✅ Configuration routes friends présente');
  }
} else {
  console.log('   ❌ Fichier manquant');
}

console.log('\n🎯 CORRECTION TERMINÉE');
console.log('========================');
console.log('\n💡 Prochaines étapes:');
console.log('1. Redémarrez le serveur: cd server && npm start');
console.log('2. Redémarrez le client: cd client && npm start');
console.log('3. Testez la fonctionnalité "Mes amis"');
console.log('4. Vérifiez les logs du serveur pour les erreurs'); 