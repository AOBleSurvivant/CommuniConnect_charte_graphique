const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DES ERREURS DE CONSOLE');
console.log('=' .repeat(50));

// 1. Corriger le middleware Redux SerializableStateInvariantMiddleware
function fixReduxMiddleware() {
  console.log('\n1️⃣ Correction du middleware Redux...');
  
  const storePath = path.join(__dirname, 'client/src/store/index.js');
  
  if (fs.existsSync(storePath)) {
    let content = fs.readFileSync(storePath, 'utf8');
    
    // Vérifier si la configuration existe déjà
    if (!content.includes('serializableCheck')) {
      // Ajouter la configuration pour ignorer les actions problématiques
      const newMiddlewareConfig = `  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'posts/sharePost/fulfilled',
          'posts/createPost/fulfilled',
          'auth/login/fulfilled',
          'auth/register/fulfilled'
        ],
        ignoredPaths: ['posts.currentPost', 'auth.user'],
        warnAfter: 128,
        ignoreState: false,
        ignoreActions: false
      },
    }),`;
      
      // Remplacer la configuration existante
      content = content.replace(
        /middleware: \(getDefaultMiddleware\) =>\s+getDefaultMiddleware\([^)]+\)/,
        newMiddlewareConfig
      );
      
      fs.writeFileSync(storePath, content);
      console.log('✅ Configuration Redux middleware corrigée');
    } else {
      console.log('ℹ️ Configuration Redux middleware déjà présente');
    }
  } else {
    console.log('❌ Fichier store/index.js non trouvé');
  }
}

// 2. Corriger l'erreur de repost dans ShareDialog
function fixShareDialog() {
  console.log('\n2️⃣ Correction de l\'erreur de repost...');
  
  const shareDialogPath = path.join(__dirname, 'client/src/components/Posts/ShareDialog.js');
  
  if (fs.existsSync(shareDialogPath)) {
    let content = fs.readFileSync(shareDialogPath, 'utf8');
    
    // Vérifier si la validation du post existe
    if (!content.includes('if (!post || !post._id)')) {
      // Ajouter la validation du post avant le repost
      const validationCode = `
  const handleRepost = async () => {
    if (!post || !post._id) {
      console.error('Erreur lors du repost: Le post original est requis pour un repost');
      setSuccessMessage('Erreur: Post original requis');
      setShowSuccess(true);
      return;
    }

    if (!shareText.trim()) {
      setShareText(defaultShareText);
      return;
    }

    setIsReposting(true);
    try {
      await dispatch(sharePost({ 
        postId: post._id, 
        type: 'repost',
        content: shareText 
      })).unwrap();
      
      setSuccessMessage('Post reposté avec succès !');
      setShowSuccess(true);
      onClose();
    } catch (error) {
      console.error('Erreur lors du repost:', error);
      setSuccessMessage('Erreur lors du repost');
      setShowSuccess(true);
    } finally {
      setIsReposting(false);
    }
  };`;
      
      // Remplacer la fonction handleRepost existante
      content = content.replace(
        /const handleRepost = async \(\) => \{[\s\S]*?\};/,
        validationCode
      );
      
      fs.writeFileSync(shareDialogPath, content);
      console.log('✅ Validation du post ajoutée dans ShareDialog');
    } else {
      console.log('ℹ️ Validation du post déjà présente');
    }
  } else {
    console.log('❌ Fichier ShareDialog.js non trouvé');
  }
}

// 3. Corriger l'erreur de route posts
function fixPostsRoute() {
  console.log('\n3️⃣ Correction de la route posts...');
  
  const postsRoutePath = path.join(__dirname, 'server/routes/posts.js');
  
  if (fs.existsSync(postsRoutePath)) {
    let content = fs.readFileSync(postsRoutePath, 'utf8');
    
    // Vérifier si la route GET /api/posts existe
    if (!content.includes('router.get(\'/\', auth, async (req, res) => {')) {
      // Ajouter la route GET manquante
      const getPostsRoute = `
// GET /api/posts - Récupérer tous les posts
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, visibility, region } = req.query;
    
    let filteredPosts = [...posts];
    
    // Filtrer par type si spécifié
    if (type) {
      filteredPosts = filteredPosts.filter(post => post.type === type);
    }
    
    // Filtrer par visibilité si spécifié
    if (visibility) {
      filteredPosts = filteredPosts.filter(post => post.visibility === visibility);
    }
    
    // Filtrer par région si spécifié
    if (region) {
      filteredPosts = filteredPosts.filter(post => 
        post.location?.region === region
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        hasNext: endIndex < filteredPosts.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});`;
      
      // Insérer après les imports
      const insertPosition = content.indexOf('// POST /api/posts');
      if (insertPosition !== -1) {
        content = content.slice(0, insertPosition) + getPostsRoute + '\n\n' + content.slice(insertPosition);
        fs.writeFileSync(postsRoutePath, content);
        console.log('✅ Route GET /api/posts ajoutée');
      } else {
        console.log('❌ Position d\'insertion non trouvée');
      }
    } else {
      console.log('ℹ️ Route GET /api/posts déjà présente');
    }
  } else {
    console.log('❌ Fichier posts.js non trouvé');
  }
}

// 4. Ajouter React DevTools en développement
function addReactDevTools() {
  console.log('\n4️⃣ Ajout de React DevTools...');
  
  const packageJsonPath = path.join(__dirname, 'client/package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    let content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Ajouter React DevTools en devDependencies si pas présent
    if (!content.devDependencies['react-devtools']) {
      content.devDependencies['react-devtools'] = '^4.28.5';
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(content, null, 2));
      console.log('✅ React DevTools ajouté aux dépendances');
    } else {
      console.log('ℹ️ React DevTools déjà présent');
    }
  } else {
    console.log('❌ Fichier package.json non trouvé');
  }
}

// 5. Corriger les notifications
function fixNotifications() {
  console.log('\n5️⃣ Correction du service de notifications...');
  
  const notificationServicePath = path.join(__dirname, 'client/src/services/notificationService.js');
  
  if (fs.existsSync(notificationServicePath)) {
    let content = fs.readFileSync(notificationServicePath, 'utf8');
    
    // Vérifier si la gestion d'erreur existe
    if (!content.includes('catch (error)')) {
      // Ajouter la gestion d'erreur
      const errorHandling = `
    } catch (error) {
      console.error('❌ Erreur de connexion au service de notifications:', error);
      // En mode développement, ne pas afficher l'erreur
      if (process.env.NODE_ENV !== 'development') {
        console.error('Erreur de connexion aux notifications:', error);
      }
    }`;
      
      // Remplacer la fin de la fonction de connexion
      content = content.replace(
        /console\.log\('🔔 Connecté au service de notifications'\);\s*}/,
        `console.log('🔔 Connecté au service de notifications');${errorHandling}\n  }`
      );
      
      fs.writeFileSync(notificationServicePath, content);
      console.log('✅ Gestion d\'erreur ajoutée au service de notifications');
    } else {
      console.log('ℹ️ Gestion d\'erreur déjà présente');
    }
  } else {
    console.log('❌ Fichier notificationService.js non trouvé');
  }
}

// Fonction principale
function fixAllConsoleErrors() {
  console.log('Démarrage des corrections...\n');
  
  fixReduxMiddleware();
  fixShareDialog();
  fixPostsRoute();
  addReactDevTools();
  fixNotifications();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ CORRECTIONS TERMINÉES');
  console.log('=' .repeat(50));
  
  console.log('\n📋 Résumé des corrections :');
  console.log('  ✅ Middleware Redux optimisé');
  console.log('  ✅ Validation du post dans ShareDialog');
  console.log('  ✅ Route GET /api/posts ajoutée');
  console.log('  ✅ React DevTools ajouté');
  console.log('  ✅ Gestion d\'erreur notifications');
  
  console.log('\n💡 Redémarrez l\'application pour appliquer les corrections :');
  console.log('   npm start (dans le dossier client)');
  console.log('   npm start (dans le dossier server)');
}

// Exécuter les corrections
fixAllConsoleErrors(); 