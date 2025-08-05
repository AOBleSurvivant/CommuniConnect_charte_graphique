const axios = require('axios');
const { performance } = require('perf_hooks');

console.log('🚀 TEST DE PERFORMANCE OPTIMISÉ - COMMUNICONNECT');
console.log('================================================\n');

class PerformanceOptimizer {
    constructor() {
        this.baseUrl = 'http://localhost:5000';
        this.results = [];
        this.cache = new Map();
    }

    async authenticate() {
        try {
            const response = await axios.post(`${this.baseUrl}/api/auth/login`, {
                identifier: 'test@example.com',
                password: 'password123'
            });
            return response.data.token;
        } catch (error) {
            console.error('❌ Erreur d\'authentification:', error.message);
            return null;
        }
    }

    async testEndpointWithCache(endpoint, method = 'GET', data = null, description = '') {
        const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;
        
        // Vérifier le cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            console.log(`⚡ ${description} (CACHE) - ${cached.time}ms`);
            return cached;
        }

        // Test réel
        const start = performance.now();
        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}${endpoint}`,
                data,
                timeout: 5000
            });
            const time = performance.now() - start;
            
            const result = {
                endpoint,
                method,
                time,
                status: response.status,
                success: true
            };

            // Mettre en cache pour 30 secondes
            this.cache.set(cacheKey, result);
            setTimeout(() => this.cache.delete(cacheKey), 30000);

            console.log(`✅ ${description} - ${time.toFixed(2)}ms`);
            this.results.push(result);
            return result;
        } catch (error) {
            const time = performance.now() - start;
            console.log(`❌ ${description} - ${time.toFixed(2)}ms (${error.response?.status || 'ERROR'})`);
            return { endpoint, method, time, status: error.response?.status || 0, success: false };
        }
    }

    async runOptimizedTests() {
        console.log('🔐 Authentification...');
        const token = await this.authenticate();
        if (!token) {
            console.log('❌ Impossible de continuer sans authentification');
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n📊 Tests de performance optimisés...\n');

        // Tests avec cache
        await this.testEndpointWithCache('/api/health', 'GET', null, 'Health Check');
        await this.testEndpointWithCache('/api/friends', 'GET', null, 'Liste des amis');
        await this.testEndpointWithCache('/api/livestreams', 'GET', null, 'Livestreams');
        await this.testEndpointWithCache('/api/conversations', 'GET', null, 'Conversations');
        await this.testEndpointWithCache('/api/messages', 'GET', null, 'Messages');

        // Tests de création (sans cache)
        console.log('\n📝 Tests de création...\n');
        await this.testEndpointWithCache('/api/livestreams', 'POST', {
            title: 'Test Performance',
            description: 'Test de performance',
            location: { latitude: 9.5370, longitude: -13.6785 },
            category: 'test'
        }, 'Création livestream');

        await this.testEndpointWithCache('/api/conversations', 'POST', {
            participants: ['user1', 'user2'],
            name: 'Test Performance'
        }, 'Création conversation');

        // Tests répétés pour vérifier le cache
        console.log('\n🔄 Tests répétés (cache)...\n');
        await this.testEndpointWithCache('/api/health', 'GET', null, 'Health Check (cache)');
        await this.testEndpointWithCache('/api/friends', 'GET', null, 'Liste des amis (cache)');

        this.generateOptimizedReport();
    }

    generateOptimizedReport() {
        console.log('\n📊 RAPPORT DE PERFORMANCE OPTIMISÉ');
        console.log('====================================');

        const successfulTests = this.results.filter(r => r.success);
        const failedTests = this.results.filter(r => !r.success);

        if (successfulTests.length > 0) {
            const avgTime = successfulTests.reduce((sum, r) => sum + r.time, 0) / successfulTests.length;
            const minTime = Math.min(...successfulTests.map(r => r.time));
            const maxTime = Math.max(...successfulTests.map(r => r.time));

            console.log(`✅ Tests réussis: ${successfulTests.length}/${this.results.length}`);
            console.log(`⏱️  Temps moyen: ${avgTime.toFixed(2)}ms`);
            console.log(`⚡ Temps minimum: ${minTime.toFixed(2)}ms`);
            console.log(`🐌 Temps maximum: ${maxTime.toFixed(2)}ms`);

            // Analyse des performances
            if (avgTime < 100) {
                console.log('🚀 Performance EXCELLENTE');
            } else if (avgTime < 500) {
                console.log('✅ Performance TRÈS BONNE');
            } else if (avgTime < 1000) {
                console.log('⚠️  Performance ACCEPTABLE');
            } else {
                console.log('🚨 Performance À AMÉLIORER');
            }
        }

        if (failedTests.length > 0) {
            console.log(`❌ Tests échoués: ${failedTests.length}`);
        }

        // Recommandations d'optimisation
        console.log('\n💡 RECOMMANDATIONS D\'OPTIMISATION:');
        console.log('====================================');
        
        const slowTests = this.results.filter(r => r.success && r.time > 500);
        if (slowTests.length > 0) {
            console.log('🔧 Endpoints lents à optimiser:');
            slowTests.forEach(test => {
                console.log(`   - ${test.method} ${test.endpoint}: ${test.time.toFixed(2)}ms`);
            });
        }

        console.log('📦 Implémenter Redis pour le cache');
        console.log('🔄 Optimiser les requêtes de base de données');
        console.log('📱 Implémenter la pagination');
        console.log('🎯 Utiliser la compression gzip');
        console.log('⚡ Optimiser les images et assets');

        console.log('\n🎉 Test de performance optimisé terminé !');
    }
}

// Exécuter les tests
const optimizer = new PerformanceOptimizer();
optimizer.runOptimizedTests().catch(console.error); 