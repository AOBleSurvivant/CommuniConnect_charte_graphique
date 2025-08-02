const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC - ROUTES FRIENDS');
console.log('=' .repeat(50));

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Fonction pour vérifier si le serveur est démarré
async function checkServerStatus() {
  console.log('\n1️⃣ Vérification du serveur backend...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    
    if (response.data.status === 'OK') {
      console.log('✅ Serveur backend opérationnel');
      return true;
    } else {
      console.log('❌ Serveur backend non opérationnel');
      return false;
    }
  } catch (error) {
    console.log('❌ Serveur backend inaccessible:', error.message);
    console.log('💡 Solution: Démarrer le serveur avec "npm start" dans le dossier server/');
    return false;
  }
}

// Fonction pour tester les routes friends
async function testFriendsRoutes() {
  console.log('\n2️⃣ Test des routes friends...');
  
  const routes = [
    { method: 'GET', path: '/api/friends', name: 'Liste des amis' },
    { method: 'GET', path: '/api/friends/requests', name: 'Demandes reçues' },
    { method: 'POST', path: '/api/friends/request', name: 'Envoyer demande' }
  ];
  
  const results = {};
  
  for (const route of routes) {
    try {
      let response;
      
      if (route.method === 'GET') {
        response = await axios.get(`${API_BASE_URL}${route.path}`, {
          timeout: 5000
        });
      } else if (route.method === 'POST') {
        response = await axios.post(`${API_BASE_URL}${route.path}`, {
          recipientId: 'test@example.com'
        }, {
          timeout: 5000
        });
      }
      
      if (response.status === 200 || response.status === 201) {
        console.log(`✅ ${route.name}: ${response.status}`);
        results[route.path] = true;
      } else {
        console.log(`❌ ${route.name}: ${response.status}`);
        results[route.path] = false;
      }
    } catch (error) {
      console.log(`❌ ${route.name}: ${error.response?.status || error.message}`);
      results[route.path] = false;
    }
  }
  
  return results;
}

// Fonction pour vérifier les fichiers de routes
function checkRouteFiles() {
  console.log('\n3️⃣ Vérification des fichiers de routes...');
  
  const files = [
    'server/routes/friends.js',
    'server/middleware/devAuth.js',
    'server/index.js'
  ];
  
  const results = {};
  
  files.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    results[file] = exists;
  });
  
  return results;
}

// Fonction pour vérifier la configuration dans index.js
function checkIndexConfiguration() {
  console.log('\n4️⃣ Vérification de la configuration dans index.js...');
  
  const indexPath = 'server/index.js';
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Fichier server/index.js non trouvé');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Vérifier l'import de la route friends
  const hasFriendsImport = content.includes("require('./routes/friends')");
  console.log(`${hasFriendsImport ? '✅' : '❌'} Import route friends`);
  
  // Vérifier l'utilisation de la route friends
  const hasFriendsUse = content.includes("app.use('/api/friends'");
  console.log(`${hasFriendsUse ? '✅' : '❌'} Utilisation route friends`);
  
  return hasFriendsImport && hasFriendsUse;
}

// Fonction pour corriger les problèmes
function fixFriendsRoutes() {
  console.log('\n5️⃣ Correction des problèmes identifiés...');
  
  // Vérifier et corriger le fichier friends.js
  const friendsPath = 'server/routes/friends.js';
  
  if (!fs.existsSync(friendsPath)) {
    console.log('⚠️ Création du fichier friends.js...');
    
    const friendsContent = `const express = require('express');
const { body, validationResult } = require('express-validator');
const devAuth = require('../middleware/devAuth');

const router = express.Router();

// GET /api/friends - Récupérer la liste des amis
router.get('/', devAuth, async (req, res) => {
  try {
    const friends = [
      {
        _id: 'friend-1',
        firstName: 'Mamadou',
        lastName: 'Diallo',
        email: 'mamadou.diallo@communiconnect.gn',
        status: 'accepted',
        friendshipId: 'friendship-1'
      },
      {
        _id: 'friend-2',
        firstName: 'Fatou',
        lastName: 'Camara',
        email: 'fatou.camara@communiconnect.gn',
        status: 'accepted',
        friendshipId: 'friendship-2'
      }
    ];

    res.json({
      success: true,
      friends
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste d\'amis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/friends/requests - Récupérer les demandes reçues
router.get('/requests', devAuth, async (req, res) => {
  try {
    const requests = [
      {
        _id: 'req-1',
        requester: {
          _id: 'user-4',
          firstName: 'Aissatou',
          lastName: 'Bah',
          email: 'aissatou.bah@communiconnect.gn'
        },
        status: 'pending',
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'amis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/friends/request - Envoyer une demande d'ami
router.post('/request', devAuth, [
  body('recipientId').notEmpty().withMessage('ID du destinataire requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { recipientId } = req.body;
    const requesterId = req.user._id || req.user.id;

    const friendRequest = {
      _id: \`req-\${Date.now()}\`,
      requester: {
        _id: requesterId,
        firstName: req.user.firstName || 'Test',
        lastName: req.user.lastName || 'User'
      },
      recipient: {
        _id: \`user-\${Date.now()}\`,
        firstName: 'Autre',
        lastName: 'Utilisateur',
        email: recipientId
      },
      status: 'pending',
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Demande d\\'ami envoyée avec succès',
      friendRequest
    });
  } catch (error) {
    console.error('Erreur lors de l\\'envoi de la demande d\\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;`;
    
    fs.writeFileSync(friendsPath, friendsContent);
    console.log('✅ Fichier friends.js créé');
  } else {
    console.log('✅ Fichier friends.js existe déjà');
  }
  
  // Vérifier et corriger le middleware devAuth
  const devAuthPath = 'server/middleware/devAuth.js';
  
  if (!fs.existsSync(devAuthPath)) {
    console.log('⚠️ Création du fichier devAuth.js...');
    
    const devAuthContent = `// Middleware d'authentification pour le mode développement
const devAuth = (req, res, next) => {
  // En mode développement, permettre l'accès sans authentification
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    // Créer un utilisateur de test
    req.user = {
      _id: 'test-user-id',
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@communiconnect.gn',
      isVerified: true
    };
    return next();
  }
  
  // En production, utiliser l'authentification normale
  const auth = require('./auth');
  return auth(req, res, next);
};

module.exports = devAuth;`;
    
    fs.writeFileSync(devAuthPath, devAuthContent);
    console.log('✅ Fichier devAuth.js créé');
  } else {
    console.log('✅ Fichier devAuth.js existe déjà');
  }
  
  // Vérifier et corriger index.js
  const indexPath = 'server/index.js';
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Vérifier si la route friends est configurée
    if (!content.includes("app.use('/api/friends'")) {
      console.log('⚠️ Ajout de la route friends dans index.js...');
      
      // Trouver la ligne après les autres routes
      const routesIndex = content.indexOf("app.use('/api/");
      if (routesIndex !== -1) {
        const insertIndex = content.indexOf('\n', routesIndex) + 1;
        const friendsRoute = "app.use('/api/friends', require('./routes/friends'));\n";
        
        content = content.slice(0, insertIndex) + friendsRoute + content.slice(insertIndex);
        fs.writeFileSync(indexPath, content);
        console.log('✅ Route friends ajoutée dans index.js');
      }
    } else {
      console.log('✅ Route friends déjà configurée dans index.js');
    }
  }
}

// Fonction principale
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic des routes friends...\n');
  
  const results = {
    server: false,
    routes: {},
    files: {},
    config: false
  };
  
  // Test 1: Serveur
  results.server = await checkServerStatus();
  
  if (!results.server) {
    console.log('\n❌ DIAGNOSTIC ARRÊTÉ - Serveur non disponible');
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Ouvrir un terminal dans le dossier server/');
    console.log('2. Exécuter: npm start');
    console.log('3. Attendre que le serveur démarre (port 5000)');
    return;
  }
  
  // Test 2: Routes
  results.routes = await testFriendsRoutes();
  
  // Test 3: Fichiers
  results.files = checkRouteFiles();
  
  // Test 4: Configuration
  results.config = checkIndexConfiguration();
  
  // Résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSULTATS DU DIAGNOSTIC');
  console.log('=' .repeat(50));
  
  console.log(`🖥️ Serveur: ${results.server ? '✅' : '❌'}`);
  console.log(`📁 Fichiers: ${Object.values(results.files).filter(Boolean).length}/${Object.keys(results.files).length} présents`);
  console.log(`⚙️ Configuration: ${results.config ? '✅' : '❌'}`);
  
  const routeSuccess = Object.values(results.routes).filter(Boolean).length;
  const routeTotal = Object.keys(results.routes).length;
  console.log(`🔗 Routes: ${routeSuccess}/${routeTotal} fonctionnelles`);
  
  // Si des problèmes sont détectés, proposer des corrections
  if (routeSuccess < routeTotal || !results.config) {
    console.log('\n🔧 CORRECTIONS NÉCESSAIRES');
    fixFriendsRoutes();
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('1. Redémarrer le serveur: cd server && npm start');
    console.log('2. Tester à nouveau: node diagnostic-routes-friends.js');
    console.log('3. Vérifier l\'interface: http://localhost:3000');
  } else {
    console.log('\n✅ TOUTES LES ROUTES FRIENDS FONCTIONNENT !');
  }
  
  console.log('\n💡 Pour tester l\'interface:');
  console.log('   Ouvrez http://localhost:3000 et allez dans "Mes Amis"');
}

// Exécuter le diagnostic
runDiagnostic().catch(error => {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}); 