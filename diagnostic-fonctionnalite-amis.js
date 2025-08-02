const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 DIAGNOSTIC COMPLET - FONCTIONNALITÉ "MES AMIS"');
console.log('==================================================');

// Configuration
const BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Fonction pour tester une route API
const testRoute = (endpoint, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: response,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Vérifier les fichiers clés
const checkFiles = () => {
  console.log('\n📁 Vérification des fichiers clés:');
  
  const filesToCheck = [
    'client/src/pages/Friends/FriendsPage.js',
    'client/src/components/common/LazyLoader.js',
    'client/src/App.js',
    'server/routes/friends.js',
    'client/src/store/slices/friendsSlice.js',
    'client/src/services/friendsService.js'
  ];

  filesToCheck.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
};

// Vérifier les routes dans App.js
const checkAppRoutes = () => {
  console.log('\n🔍 Vérification des routes dans App.js:');
  
  const appPath = 'client/src/App.js';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');
    
    const hasFriendsRoute = content.includes('path="friends"') && content.includes('LazyFriendsPage');
    console.log(`   ${hasFriendsRoute ? '✅' : '❌'} Route /friends définie`);
    
    const hasLazyFriendsImport = content.includes('LazyFriendsPage');
    console.log(`   ${hasLazyFriendsImport ? '✅' : '❌'} Import LazyFriendsPage`);
    
    const hasFriendsElement = content.includes('<LazyFriendsPage />');
    console.log(`   ${hasFriendsElement ? '✅' : '❌'} Élément LazyFriendsPage`);
  }
};

// Vérifier LazyLoader.js
const checkLazyLoader = () => {
  console.log('\n🔍 Vérification de LazyLoader.js:');
  
  const lazyLoaderPath = 'client/src/components/common/LazyLoader.js';
  if (fs.existsSync(lazyLoaderPath)) {
    const content = fs.readFileSync(lazyLoaderPath, 'utf8');
    
    const hasLazyFriendsPage = content.includes('LazyFriendsPage') && 
                               content.includes('import(\'../../pages/Friends/FriendsPage\')');
    console.log(`   ${hasLazyFriendsPage ? '✅' : '❌'} LazyFriendsPage défini`);
    
    const hasFriendsImport = content.includes('Friends/FriendsPage');
    console.log(`   ${hasFriendsImport ? '✅' : '❌'} Import FriendsPage`);
  }
};

// Vérifier FriendsPage.js
const checkFriendsPage = () => {
  console.log('\n🔍 Vérification de FriendsPage.js:');
  
  const friendsPagePath = 'client/src/pages/Friends/FriendsPage.js';
  if (fs.existsSync(friendsPagePath)) {
    const content = fs.readFileSync(friendsPagePath, 'utf8');
    
    const hasExport = content.includes('export default FriendsPage');
    console.log(`   ${hasExport ? '✅' : '❌'} Export FriendsPage`);
    
    const hasReactImport = content.includes('import React');
    console.log(`   ${hasReactImport ? '✅' : '❌'} Import React`);
    
    const hasMuiImports = content.includes('@mui/material');
    console.log(`   ${hasMuiImports ? '✅' : '❌'} Imports Material-UI`);
    
    const hasReduxImports = content.includes('useDispatch') && content.includes('useSelector');
    console.log(`   ${hasReduxImports ? '✅' : '❌'} Imports Redux`);
    
    const hasFriendsSlice = content.includes('friendsSlice');
    console.log(`   ${hasFriendsSlice ? '✅' : '❌'} Import friendsSlice`);
  }
};

// Vérifier les routes backend
const checkBackendRoutes = () => {
  console.log('\n🔍 Vérification des routes backend:');
  
  const serverIndexPath = 'server/index.js';
  if (fs.existsSync(serverIndexPath)) {
    const content = fs.readFileSync(serverIndexPath, 'utf8');
    
    const hasFriendsRoute = content.includes('/api/friends') && content.includes('require(\'./routes/friends\')');
    console.log(`   ${hasFriendsRoute ? '✅' : '❌'} Route /api/friends définie`);
  }
  
  const friendsRoutePath = 'server/routes/friends.js';
  if (fs.existsSync(friendsRoutePath)) {
    const content = fs.readFileSync(friendsRoutePath, 'utf8');
    
    const hasListRoute = content.includes('router.get(\'/list\'');
    console.log(`   ${hasListRoute ? '✅' : '❌'} Route GET /list`);
    
    const hasRequestsRoute = content.includes('router.get(\'/requests\'');
    console.log(`   ${hasRequestsRoute ? '✅' : '❌'} Route GET /requests`);
    
    const hasRequestRoute = content.includes('router.post(\'/request\'');
    console.log(`   ${hasRequestRoute ? '✅' : '❌'} Route POST /request`);
    
    const hasAcceptRoute = content.includes('router.post(\'/accept/');
    console.log(`   ${hasAcceptRoute ? '✅' : '❌'} Route POST /accept/:id`);
    
    const hasRejectRoute = content.includes('router.post(\'/reject/');
    console.log(`   ${hasRejectRoute ? '✅' : '❌'} Route POST /reject/:id`);
    
    const hasRemoveRoute = content.includes('router.delete(\'/remove/');
    console.log(`   ${hasRemoveRoute ? '✅' : '❌'} Route DELETE /remove/:id`);
  }
};

// Tester les routes API
const testApiRoutes = async () => {
  console.log('\n🧪 Test des routes API:');
  
  try {
    // Test route health
    const healthResult = await testRoute('/api/health');
    console.log(`   ${healthResult.success ? '✅' : '❌'} API Health: ${healthResult.status}`);
    
    // Test route friends list
    const friendsListResult = await testRoute('/api/friends/list');
    console.log(`   ${friendsListResult.success ? '✅' : '❌'} Friends List: ${friendsListResult.status}`);
    if (friendsListResult.success) {
      console.log(`      📊 ${friendsListResult.data.friends?.length || 0} amis trouvés`);
    }
    
    // Test route friends requests
    const friendsRequestsResult = await testRoute('/api/friends/requests');
    console.log(`   ${friendsRequestsResult.success ? '✅' : '❌'} Friends Requests: ${friendsRequestsResult.status}`);
    if (friendsRequestsResult.success) {
      console.log(`      📊 ${friendsRequestsResult.data.requests?.length || 0} demandes trouvées`);
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur lors des tests API: ${error.message}`);
  }
};

// Vérifier le store Redux
const checkReduxStore = () => {
  console.log('\n🔍 Vérification du store Redux:');
  
  const friendsSlicePath = 'client/src/store/slices/friendsSlice.js';
  if (fs.existsSync(friendsSlicePath)) {
    const content = fs.readFileSync(friendsSlicePath, 'utf8');
    
    const hasSlice = content.includes('createSlice');
    console.log(`   ${hasSlice ? '✅' : '❌'} Slice créé`);
    
    const hasFetchFriends = content.includes('fetchFriends');
    console.log(`   ${hasFetchFriends ? '✅' : '❌'} Action fetchFriends`);
    
    const hasFetchRequests = content.includes('fetchFriendRequests');
    console.log(`   ${hasFetchRequests ? '✅' : '❌'} Action fetchFriendRequests`);
    
    const hasSendRequest = content.includes('sendFriendRequest');
    console.log(`   ${hasSendRequest ? '✅' : '❌'} Action sendFriendRequest`);
    
    const hasAcceptRequest = content.includes('acceptFriendRequest');
    console.log(`   ${hasAcceptRequest ? '✅' : '❌'} Action acceptFriendRequest`);
    
    const hasRejectRequest = content.includes('rejectFriendRequest');
    console.log(`   ${hasRejectRequest ? '✅' : '❌'} Action rejectFriendRequest`);
    
    const hasRemoveFriend = content.includes('removeFriend');
    console.log(`   ${hasRemoveFriend ? '✅' : '❌'} Action removeFriend`);
  }
};

// Vérifier le service
const checkService = () => {
  console.log('\n🔍 Vérification du service:');
  
  const friendsServicePath = 'client/src/services/friendsService.js';
  if (fs.existsSync(friendsServicePath)) {
    const content = fs.readFileSync(friendsServicePath, 'utf8');
    
    const hasService = content.includes('export') || content.includes('function');
    console.log(`   ${hasService ? '✅' : '❌'} Service défini`);
    
    const hasApiCalls = content.includes('/api/friends');
    console.log(`   ${hasApiCalls ? '✅' : '❌'} Appels API /friends`);
  }
};

// Créer un composant de test simple
const createTestComponent = () => {
  const testComponent = `import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const TestFriendsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const testApiCall = async (endpoint) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`http://localhost:5000/api\${endpoint}\`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Erreur API');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testFriendsList = async () => {
    try {
      const result = await testApiCall('/friends/list');
      setFriends(result.friends || []);
      console.log('✅ Liste d\'amis récupérée:', result);
    } catch (error) {
      setError(\`Erreur liste d'amis: \${error.message}\`);
      console.error('❌ Erreur liste d\'amis:', error);
    }
  };

  const testFriendsRequests = async () => {
    try {
      const result = await testApiCall('/friends/requests');
      setRequests(result.requests || []);
      console.log('✅ Demandes d\'amis récupérées:', result);
    } catch (error) {
      setError(\`Erreur demandes d'amis: \${error.message}\`);
      console.error('❌ Erreur demandes d\'amis:', error);
    }
  };

  useEffect(() => {
    testFriendsList();
    testFriendsRequests();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Fonctionnalité Amis
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ce composant teste la fonctionnalité "Mes amis" et les routes API associées.
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Chargement...</Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testFriendsList}
          disabled={loading}
        >
          🧪 Tester Liste Amis
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testFriendsRequests}
          disabled={loading}
        >
          🧪 Tester Demandes
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Amis ({friends.length})
          </Typography>
          {friends.map((friend, index) => (
            <Box key={index} sx={{ p: 1, border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
              <Typography variant="body2">
                {friend.firstName} {friend.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {friend.email}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Demandes ({requests.length})
          </Typography>
          {requests.map((request, index) => (
            <Box key={index} sx={{ p: 1, border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
              <Typography variant="body2">
                {request.requester?.firstName} {request.requester?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.requester?.email}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TestFriendsPage;
`;

  fs.writeFileSync('client/src/pages/Friends/TestFriendsPage.js', testComponent);
  console.log('\n✅ Composant de test TestFriendsPage créé');
};

// Exécution du diagnostic
const runDiagnostic = async () => {
  console.log('\n🔧 Application du diagnostic...');
  
  checkFiles();
  checkAppRoutes();
  checkLazyLoader();
  checkFriendsPage();
  checkBackendRoutes();
  checkReduxStore();
  checkService();
  await testApiRoutes();
  createTestComponent();
  
  console.log('\n🎯 DIAGNOSTIC TERMINÉ');
  console.log('========================');
  console.log('✅ Analyse des fichiers terminée');
  console.log('✅ Routes API testées');
  console.log('✅ Composant de test créé');
  console.log('\n💡 Prochaines étapes:');
  console.log('1. Redémarrez le serveur: cd server && npm start');
  console.log('2. Redémarrez le client: cd client && npm start');
  console.log('3. Testez la page /friends dans le navigateur');
  console.log('4. Vérifiez la console pour les erreurs JavaScript');
  console.log('5. Si le problème persiste, testez TestFriendsPage');
};

runDiagnostic(); 