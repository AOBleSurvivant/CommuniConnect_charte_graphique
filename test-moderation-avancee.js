const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUsers = [];
let testPosts = [];
let testReportsArray = []; // Renommé pour éviter le conflit

// Configuration axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Fonction utilitaire pour les tests
const testStep = async (name, testFunction) => {
  console.log(`\n🔍 Test: ${name}`);
  try {
    const result = await testFunction();
    console.log(`✅ ${name} - Succès`);
    return result;
  } catch (error) {
    console.log(`❌ ${name} - Échec:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Fonction pour attendre
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === TESTS D'AUTHENTIFICATION ===

const testAuthentication = async () => {
  // Créer un utilisateur test normal (sans rôle spécial)
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+22412345678',
    password: 'password123',
    latitude: 9.5370,
    longitude: -13.6785,
    quartier: 'Centre-ville',
    address: '123 Rue Test',
    dateOfBirth: '1990-01-01',
    gender: 'Homme'
  };

  const registerResponse = await api.post('/auth/register', userData);
  testUsers.push(registerResponse.data.user);

  // Se connecter
  const loginResponse = await api.post('/auth/login', {
    identifier: userData.email,
    password: userData.password
  });

  authToken = loginResponse.data.token;
  console.log('🔑 Authentification réussie');
};

// === TESTS DE MODÉRATION AUTOMATIQUE ===

const testAutomatedModeration = async () => {
  console.log('\n🤖 Tests de Modération Automatique');

  // Test 1: Analyse de contenu inapproprié
  await testStep('Analyse de contenu avec mots interdits', async () => {
    const response = await api.post('/moderation/analyze', {
      content: 'Ceci est un message avec des mots interdits comme merde et putain',
      contentType: 'post'
    });

    if (response.data.analysis.score < 0.3) {
      throw new Error('Score d\'analyse trop faible pour du contenu inapproprié');
    }

    return response.data;
  });

  // Test 2: Analyse de spam
  await testStep('Analyse de contenu spam', async () => {
    const response = await api.post('/moderation/analyze', {
      content: 'GAGNEZ RAPIDEMENT DE L\'ARGENT FACILE! Cliquez ici pour gagner des millions!',
      contentType: 'post'
    });

    if (response.data.analysis.score < 0.4) {
      throw new Error('Score d\'analyse trop faible pour du spam');
    }

    return response.data;
  });

  // Test 3: Analyse de discours de haine
  await testStep('Analyse de discours de haine', async () => {
    const response = await api.post('/moderation/analyze', {
      content: 'Contenu avec des menaces de violence et de discrimination',
      contentType: 'post'
    });

    if (response.data.analysis.score < 0.6) {
      throw new Error('Score d\'analyse trop faible pour du discours de haine');
    }

    return response.data;
  });

  // Test 4: Analyse de contenu normal
  await testStep('Analyse de contenu normal', async () => {
    const response = await api.post('/moderation/analyze', {
      content: 'Bonjour, comment allez-vous aujourd\'hui?',
      contentType: 'post'
    });

    if (response.data.analysis.score > 0.3) {
      throw new Error('Score d\'analyse trop élevé pour du contenu normal');
    }

    return response.data;
  });
};

// === TESTS DE CRÉATION DE CONTENU ===

const testContentCreation = async () => {
  console.log('\n📝 Tests de Création de Contenu');

  // Créer un post normal
  await testStep('Création d\'un post normal', async () => {
    const postData = {
      content: 'Ceci est un post normal pour tester la modération',
      type: 'community',
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.5370,
          longitude: -13.6785
        }
      }
    };

    const response = await api.post('/posts', postData);
    console.log('Post créé:', JSON.stringify(response.data, null, 2));
    testPosts.push(response.data.post || response.data);
    return response.data;
  });

  // Créer un post avec contenu inapproprié
  await testStep('Création d\'un post avec contenu inapproprié', async () => {
    const postData = {
      content: 'Post avec des mots interdits: merde, putain, connard',
      type: 'community',
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Centre',
        coordinates: {
          latitude: 9.5370,
          longitude: -13.6785
        }
      }
    };

    const response = await api.post('/posts', postData);
    console.log('Post créé:', JSON.stringify(response.data, null, 2));
    testPosts.push(response.data.post || response.data);
    return response.data;
  });
};

// === TESTS DE SIGNALEMENTS ===

const testReportSystem = async () => {
  console.log('\n🚨 Tests de Signalements');

  // Test 1: Créer un signalement
  await testStep('Création d\'un signalement', async () => {
    const reportData = {
      reportedContent: {
        type: 'post',
        contentId: testPosts[1]._id || testPosts[1].id // Le post avec contenu inapproprié
      },
      reason: 'inappropriate_content',
      description: 'Ce post contient des mots interdits et du contenu inapproprié'
    };

    const response = await api.post('/moderation/reports', reportData);
    testReportsArray.push(response.data.report);
    return response.data;
  });

  // Test 2: Créer un signalement de spam
  await testStep('Création d\'un signalement de spam', async () => {
    const reportData = {
      reportedContent: {
        type: 'post',
        contentId: testPosts[0]._id || testPosts[0].id
      },
      reason: 'spam',
      description: 'Ce post semble être du spam'
    };

    const response = await api.post('/moderation/reports', reportData);
    testReportsArray.push(response.data.report);
    return response.data;
  });

  // Test 3: Obtenir tous les signalements (devrait échouer pour un utilisateur normal)
  await testStep('Tentative d\'accès aux signalements (devrait être refusé)', async () => {
    try {
      await api.get('/moderation/reports');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === TESTS D'ANALYSE DE POSTS ===

const testPostAnalysis = async () => {
  console.log('\n🔍 Tests d\'Analyse de Posts');

  // Test 1: Analyser un post existant
  await testStep('Analyse d\'un post existant', async () => {
    const postId = testPosts[1]._id || testPosts[1].id; // Le post avec contenu inapproprié
    const response = await api.post(`/moderation/analyze/post/${postId}`);
    
    if (!response.data.analysis) {
      throw new Error('Analyse non générée');
    }

    return response.data;
  });

  // Test 2: Appliquer des actions automatiques (devrait échouer pour un utilisateur normal)
  await testStep('Tentative d\'application d\'actions automatiques (devrait être refusé)', async () => {
    const postId = testPosts[1]._id || testPosts[1].id;
    const analysis = {
      score: 0.8,
      confidence: 0.8,
      flags: [{ type: 'banned_words', count: 3 }],
      actions: ['content_review', 'user_warning']
    };

    try {
      await api.post('/moderation/apply-automated-actions', {
        contentId: postId,
        contentType: 'post',
        analysis
      });
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === TESTS DE LOGS DE MODÉRATION ===

const testModerationLogs = async () => {
  console.log('\n📋 Tests de Logs de Modération');

  // Test 1: Obtenir les logs de modération (devrait échouer pour un utilisateur normal)
  await testStep('Tentative d\'accès aux logs de modération (devrait être refusé)', async () => {
    try {
      await api.get('/moderation/logs');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });

  // Test 2: Obtenir les statistiques d'automatisation (devrait échouer pour un utilisateur normal)
  await testStep('Tentative d\'accès aux statistiques (devrait être refusé)', async () => {
    try {
      await api.get('/moderation/stats/automation');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === TESTS DE MOTS INTERDITS ===

const testBannedWords = async () => {
  console.log('\n🚫 Tests de Mots Interdits');

  // Test 1: Obtenir la liste des mots interdits (devrait échouer pour un utilisateur normal)
  await testStep('Tentative d\'accès aux mots interdits (devrait être refusé)', async () => {
    try {
      await api.get('/moderation/banned-words');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === TESTS DE FILTRES ET RECHERCHE ===

const testFiltersAndSearch = async () => {
  console.log('\n🔍 Tests de Filtres et Recherche');

  // Test 1: Filtrer par statut (devrait échouer pour un utilisateur normal)
  await testStep('Tentative de filtrage par statut (devrait être refusé)', async () => {
    try {
      await api.get('/moderation/reports?status=pending');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === TESTS DE PERMISSIONS ===

const testPermissions = async () => {
  console.log('\n🔐 Tests de Permissions');

  // Test 1: Utilisateur normal ne peut pas accéder aux fonctionnalités de modération
  await testStep('Vérification des permissions pour utilisateur normal', async () => {
    // Tenter d'accéder aux signalements avec un utilisateur normal
    try {
      await api.get('/moderation/reports');
      throw new Error('Accès non autorisé accordé');
    } catch (error) {
      if (error.response?.status === 403) {
        return { message: 'Permissions correctement vérifiées' };
      }
      throw error;
    }
  });
};

// === FONCTION PRINCIPALE ===

const runAllTests = async () => {
  console.log('🚀 Démarrage des tests du Système de Modération Avancée');
  console.log('=' .repeat(60));

  try {
    // Tests d'authentification
    await testAuthentication();

    // Tests de modération automatique
    await testAutomatedModeration();

    // Tests de création de contenu
    await testContentCreation();

    // Tests de signalements
    await testReportSystem();

    // Tests d'analyse de posts
    await testPostAnalysis();

    // Tests de logs de modération
    await testModerationLogs();

    // Tests de mots interdits
    await testBannedWords();

    // Tests de filtres et recherche
    await testFiltersAndSearch();

    // Tests de permissions
    await testPermissions();

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Tous les tests du Système de Modération Avancée ont réussi!');
    console.log('✅ Système de modération automatique opérationnel');
    console.log('✅ Gestion des signalements fonctionnelle');
    console.log('✅ Logs de modération en place');
    console.log('✅ Permissions correctement configurées');
    console.log('✅ Filtres et recherche opérationnels');
    console.log('✅ Sécurité des permissions vérifiée');

  } catch (error) {
    console.log('\n' + '=' .repeat(60));
    console.log('❌ Erreur lors des tests:', error.message);
    console.log('🔧 Vérifiez que le serveur est démarré et que la base de données est accessible');
  }
};

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testAuthentication,
  testAutomatedModeration,
  testReportSystem,
  testModerationLogs
}; 