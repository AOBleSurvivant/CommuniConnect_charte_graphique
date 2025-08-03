const axios = require('axios');

console.log('========================================');
console.log('VERIFICATION DE L\'ETAT DE COMMUNICONNECT');
console.log('========================================');
console.log('');

async function testServeur() {
    try {
        console.log('1. Test du serveur...');
        const response = await axios.get('http://localhost:5000/api/health');
        console.log('✅ Serveur accessible - Status:', response.status);
        return true;
    } catch (error) {
        console.log('❌ Serveur inaccessible - Démarrez le serveur d\'abord');
        console.log('Pour démarrer le serveur:');
        console.log('cd server');
        console.log('npm start');
        return false;
    }
}

async function testAuthentification() {
    try {
        console.log('\n2. Test d\'authentification...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            identifier: 'test@communiconnect.gn',
            password: 'test123'
        });
        console.log('✅ Authentification réussie');
        return response.data.token;
    } catch (error) {
        console.log('❌ Erreur d\'authentification:', error.response?.data || error.message);
        return null;
    }
}

async function testAmis(token) {
    try {
        console.log('\n3. Test gestion des amis...');
        const response = await axios.get('http://localhost:5000/api/friends', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Liste des amis récupérée');
        return true;
    } catch (error) {
        console.log('❌ Erreur gestion des amis:', error.response?.data || error.message);
        return false;
    }
}

async function testConversations(token) {
    try {
        console.log('\n4. Test des conversations...');
        const response = await axios.get('http://localhost:5000/api/conversations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Conversations récupérées');
        return true;
    } catch (error) {
        console.log('❌ Erreur conversations:', error.response?.data || error.message);
        return false;
    }
}

async function testMessages(token) {
    try {
        console.log('\n5. Test des messages...');
        const response = await axios.get('http://localhost:5000/api/messages', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Messages récupérés');
        return true;
    } catch (error) {
        console.log('❌ Erreur messages:', error.response?.data || error.message);
        return false;
    }
}

async function testLivestreams(token) {
    try {
        console.log('\n6. Test des livestreams...');
        const response = await axios.get('http://localhost:5000/api/livestreams', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Livestreams récupérés');
        return true;
    } catch (error) {
        console.log('❌ Erreur livestreams:', error.response?.data || error.message);
        return false;
    }
}

async function testFrontend() {
    try {
        console.log('\n7. Test du frontend...');
        const response = await axios.get('http://localhost:3000');
        console.log('✅ Frontend accessible');
        return true;
    } catch (error) {
        console.log('❌ Frontend inaccessible - Démarrez le client');
        console.log('Pour démarrer le frontend:');
        console.log('cd client');
        console.log('npm start');
        return false;
    }
}

async function runTests() {
    const serveurOk = await testServeur();
    if (!serveurOk) {
        console.log('\n❌ Tests arrêtés - Serveur non disponible');
        return;
    }

    const token = await testAuthentification();
    if (!token) {
        console.log('\n❌ Tests arrêtés - Authentification échouée');
        return;
    }

    const tests = [
        testAmis(token),
        testConversations(token),
        testMessages(token),
        testLivestreams(token),
        testFrontend()
    ];

    const results = await Promise.allSettled(tests);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

    console.log('\n========================================');
    console.log('RÉSULTATS DES TESTS');
    console.log('========================================');
    console.log(`✅ Tests réussis: ${successCount}/5`);
    console.log(`📊 Score: ${(successCount/5*100).toFixed(0)}%`);

    if (successCount >= 4) {
        console.log('\n🎉 COMMUNICONNECT FONCTIONNE PARFAITEMENT !');
    } else if (successCount >= 2) {
        console.log('\n⚠️ COMMUNICONNECT FONCTIONNE PARTIELLEMENT');
    } else {
        console.log('\n❌ COMMUNICONNECT A DES PROBLÈMES');
    }
}

runTests().catch(console.error); 