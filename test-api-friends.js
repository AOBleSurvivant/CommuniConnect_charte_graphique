const http = require('http');

console.log('🔍 TEST API FRIENDS');
console.log('====================');

// Test de l'API friends
const testApiFriends = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/friends',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Réponse API (${res.statusCode}):`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Headers: ${JSON.stringify(res.headers)}`);
        console.log(`   Data: ${data}`);
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Erreur de connexion: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Timeout - Serveur non accessible');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Test principal
const runTest = async () => {
  try {
    console.log('🔄 Test de connexion au serveur...');
    await testApiFriends();
    console.log('✅ API accessible');
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    console.log('\n💡 Solutions possibles:');
    console.log('1. Vérifiez que le serveur est démarré: cd server && npm start');
    console.log('2. Vérifiez le port 5000');
    console.log('3. Vérifiez les logs du serveur');
  }
};

runTest(); 