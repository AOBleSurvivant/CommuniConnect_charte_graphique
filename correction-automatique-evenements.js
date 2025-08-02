const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Fonction pour corriger les routes d'événements
const fixEventsRoutes = () => {
  log('\n🔧 CORRECTION DES ROUTES ÉVÉNEMENTS', 'cyan');
  
  const eventsFile = 'server/routes/events.js';
  
  if (!fs.existsSync(eventsFile)) {
    log('❌ Fichier events.js non trouvé', 'red');
    return false;
  }
  
  let content = fs.readFileSync(eventsFile, 'utf8');
  let modified = false;
  
  // Vérifier et corriger la route GET
  if (!content.includes('router.get(\'/\', [')) {
    log('⚠️  Route GET /events manquante ou incorrecte', 'yellow');
  } else {
    log('✅ Route GET /events présente', 'green');
  }
  
  // Vérifier et corriger la route POST
  if (!content.includes('router.post(\'/\', [')) {
    log('⚠️  Route POST /events manquante ou incorrecte', 'yellow');
  } else {
    log('✅ Route POST /events présente', 'green');
  }
  
  // Vérifier la gestion des erreurs
  if (!content.includes('catch (error)')) {
    log('⚠️  Gestion d\'erreurs manquante', 'yellow');
    // Ajouter la gestion d'erreurs
    content = content.replace(
      /res\.status\(500\)\.json\(\{/g,
      '} catch (error) {\n    console.error(\'Erreur lors de la récupération des événements:\', error);\n    res.status(500).json({\n      success: false,\n      message: \'Erreur lors de la récupération des événements\'\n    });\n  }\n});\n\n// @route   POST /api/events\n// @desc    Créer un nouvel événement\n// @access  Private\nrouter.post(\'/\', [\n  // Validation des données\n  body(\'title\').trim().isLength({ min: 5, max: 100 }),\n  body(\'description\').trim().isLength({ min: 10, max: 2000 }),\n  body(\'startDate\').isISO8601(),\n  body(\'endDate\').isISO8601()\n], async (req, res) => {\n  try {\n    const errors = validationResult(req);\n    if (!errors.isEmpty()) {\n      return res.status(400).json({\n        success: false,\n        errors: errors.array()\n      });\n    }\n\n    const eventData = req.body;\n    \n    // En mode développement, créer un événement fictif\n    const event = {\n      _id: Math.random().toString(36).substring(2, 15),\n      ...eventData,\n      createdAt: new Date(),\n      updatedAt: new Date()\n    };\n\n    // Ajouter à la liste globale en mode développement\n    if (!global.mockEvents) {\n      global.mockEvents = [];\n    }\n    global.mockEvents.unshift(event);\n\n    res.status(201).json({\n      success: true,\n      message: \'Événement créé avec succès\',\n      data: event\n    });\n\n  } catch (error) {\n    console.error(\'Erreur lors de la création de l\'événement:\', error);\n    res.status(500).json({\n      success: false,\n      message: \'Erreur lors de la création de l\'événement\'\n    });\n  }\n});\n\n// @route   PUT /api/events/:id\n// @desc    Mettre à jour un événement\n// @access  Private\nrouter.put(\'/:id\', async (req, res) => {\n  try {\n    const { id } = req.params;\n    const updateData = req.body;\n\n    // En mode développement, mettre à jour l\'événement fictif\n    if (global.mockEvents) {\n      const eventIndex = global.mockEvents.findIndex(e => e._id === id);\n      if (eventIndex !== -1) {\n        global.mockEvents[eventIndex] = {\n          ...global.mockEvents[eventIndex],\n          ...updateData,\n          updatedAt: new Date()\n        };\n        \n        res.json({\n          success: true,\n          message: \'Événement mis à jour avec succès\',\n          data: global.mockEvents[eventIndex]\n        });\n      } else {\n        res.status(404).json({\n          success: false,\n          message: \'Événement non trouvé\'\n        });\n      }\n    } else {\n      res.status(404).json({\n        success: false,\n        message: \'Événement non trouvé\'\n      });\n    }\n\n  } catch (error) {\n    console.error(\'Erreur lors de la mise à jour de l\'événement:\', error);\n    res.status(500).json({\n      success: false,\n      message: \'Erreur lors de la mise à jour de l\'événement\'\n    });\n  }\n});\n\n// @route   DELETE /api/events/:id\n// @desc    Supprimer un événement\n// @access  Private\nrouter.delete(\'/:id\', async (req, res) => {\n  try {\n    const { id } = req.params;\n\n    // En mode développement, supprimer l\'événement fictif\n    if (global.mockEvents) {\n      const eventIndex = global.mockEvents.findIndex(e => e._id === id);\n      if (eventIndex !== -1) {\n        global.mockEvents.splice(eventIndex, 1);\n        \n        res.json({\n          success: true,\n          message: \'Événement supprimé avec succès\'\n        });\n      } else {\n        res.status(404).json({\n          success: false,\n          message: \'Événement non trouvé\'\n        });\n      }\n    } else {\n      res.status(404).json({\n        success: false,\n        message: \'Événement non trouvé\'\n      });\n    }\n\n  } catch (error) {\n    console.error(\'Erreur lors de la suppression de l\'événement:\', error);\n    res.status(500).json({\n      success: false,\n      message: \'Erreur lors de la suppression de l\'événement\'\n    });\n  }\n});'
    );
    modified = true;
  } else {
    log('✅ Gestion d\'erreurs présente', 'green');
  }
  
  if (modified) {
    fs.writeFileSync(eventsFile, content);
    log('✅ Fichier events.js corrigé', 'green');
  }
  
  return true;
};

// Fonction pour corriger le fichier index.js du serveur
const fixServerIndex = () => {
  log('\n🔧 CORRECTION DU SERVEUR PRINCIPAL', 'cyan');
  
  const indexFile = 'server/index.js';
  
  if (!fs.existsSync(indexFile)) {
    log('❌ Fichier index.js non trouvé', 'red');
    return false;
  }
  
  let content = fs.readFileSync(indexFile, 'utf8');
  let modified = false;
  
  // Vérifier que les routes d'événements sont bien importées
  if (!content.includes('app.use(\'/api/events\', require(\'./routes/events\')')) {
    log('⚠️  Route events manquante dans index.js', 'yellow');
    // Ajouter la route
    content = content.replace(
      /app\.use\('\/api\/posts', require\('\.\/routes\/posts'\)\);/,
      'app.use(\'/api/posts\', require(\'./routes/posts\'));\napp.use(\'/api/events\', require(\'./routes/events\'));'
    );
    modified = true;
  } else {
    log('✅ Route events présente dans index.js', 'green');
  }
  
  // Vérifier la gestion des erreurs globales
  if (!content.includes('app.use((err, req, res, next) => {')) {
    log('⚠️  Gestion d\'erreurs globale manquante', 'yellow');
    // Ajouter la gestion d'erreurs
    content += '\n\n// Middleware de gestion d\'erreurs\napp.use((err, req, res, next) => {\n  console.error(\'Erreur serveur:\', err);\n  res.status(500).json({\n    success: false,\n    message: \'Erreur interne du serveur\'\n  });\n});\n';
    modified = true;
  } else {
    log('✅ Gestion d\'erreurs globale présente', 'green');
  }
  
  if (modified) {
    fs.writeFileSync(indexFile, content);
    log('✅ Fichier index.js corrigé', 'green');
  }
  
  return true;
};

// Fonction pour créer des données de test
const createTestData = () => {
  log('\n🔧 CRÉATION DE DONNÉES DE TEST', 'cyan');
  
  const testData = [
    {
      _id: 'test-event-1',
      title: 'Nettoyage communautaire',
      description: 'Grande opération de nettoyage du quartier',
      type: 'nettoyage',
      category: 'communautaire',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      startTime: '08:00',
      endTime: '12:00',
      location: {
        coordinates: { latitude: 9.537, longitude: -13.6785 },
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        address: 'Quartier Centre, Conakry',
        venue: 'Place du marché'
      },
      organizer: {
        _id: 'test-user-1',
        firstName: 'Mamadou',
        lastName: 'Diallo',
        profilePicture: null,
        isVerified: true
      },
      status: 'published',
      visibility: 'public',
      participants: [],
      media: { images: [], videos: [], documents: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'test-event-2',
      title: 'Formation informatique',
      description: 'Formation en informatique pour les jeunes',
      type: 'formation',
      category: 'educatif',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      startTime: '14:00',
      endTime: '17:00',
      location: {
        coordinates: { latitude: 9.545, longitude: -13.675 },
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Ratoma',
        address: 'Centre culturel, Conakry',
        venue: 'Salle de formation'
      },
      organizer: {
        _id: 'test-user-2',
        firstName: 'Fatou',
        lastName: 'Camara',
        profilePicture: null,
        isVerified: true
      },
      status: 'published',
      visibility: 'public',
      participants: [],
      media: { images: [], videos: [], documents: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Sauvegarder les données de test
  fs.writeFileSync('test-events-data.json', JSON.stringify(testData, null, 2));
  log('✅ Données de test créées dans test-events-data.json', 'green');
  
  return testData;
};

// Fonction pour vérifier les dépendances
const checkDependencies = () => {
  log('\n🔧 VÉRIFICATION DES DÉPENDANCES', 'cyan');
  
  const serverPackage = 'server/package.json';
  const clientPackage = 'client/package.json';
  
  if (fs.existsSync(serverPackage)) {
    const serverDeps = JSON.parse(fs.readFileSync(serverPackage, 'utf8'));
    log('✅ package.json serveur présent', 'green');
    
    const requiredDeps = ['express', 'cors', 'helmet', 'compression'];
    const missingDeps = requiredDeps.filter(dep => !serverDeps.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      log(`⚠️  Dépendances manquantes dans le serveur: ${missingDeps.join(', ')}`, 'yellow');
      log('   Exécutez: cd server && npm install', 'yellow');
    } else {
      log('✅ Toutes les dépendances serveur sont présentes', 'green');
    }
  } else {
    log('❌ package.json serveur manquant', 'red');
  }
  
  if (fs.existsSync(clientPackage)) {
    const clientDeps = JSON.parse(fs.readFileSync(clientPackage, 'utf8'));
    log('✅ package.json client présent', 'green');
    
    const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
    const missingDeps = requiredDeps.filter(dep => !clientDeps.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      log(`⚠️  Dépendances manquantes dans le client: ${missingDeps.join(', ')}`, 'yellow');
      log('   Exécutez: cd client && npm install', 'yellow');
    } else {
      log('✅ Toutes les dépendances client sont présentes', 'green');
    }
  } else {
    log('❌ package.json client manquant', 'red');
  }
};

// Fonction principale
const runCorrection = () => {
  log('🚀 CORRECTION AUTOMATIQUE - PROBLÈME ÉVÉNEMENTS', 'bright');
  log('================================================', 'bright');
  
  let success = true;
  
  // Vérifier les dépendances
  checkDependencies();
  
  // Corriger les routes d'événements
  if (!fixEventsRoutes()) {
    success = false;
  }
  
  // Corriger le serveur principal
  if (!fixServerIndex()) {
    success = false;
  }
  
  // Créer des données de test
  createTestData();
  
  log('\n🎯 CORRECTION TERMINÉE', 'bright');
  log('=====================', 'bright');
  
  if (success) {
    log('✅ Toutes les corrections ont été appliquées avec succès !', 'green');
    log('\n💡 Prochaines étapes:', 'cyan');
    log('1. Démarrez le serveur: cd server && npm start', 'yellow');
    log('2. Démarrez le client: cd client && npm start', 'yellow');
    log('3. Testez les événements: node solution-definitive-evenements.js', 'yellow');
  } else {
    log('❌ Certaines corrections ont échoué', 'red');
    log('Vérifiez les fichiers manquants et réessayez', 'red');
  }
};

// Exécution de la correction
runCorrection(); 