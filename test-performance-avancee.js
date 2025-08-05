const axios = require('axios');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:5000';

console.log('🚀 TEST DE PERFORMANCE AVANCÉE - COMMUNICONNECT');
console.log('================================================\n');

class PerformanceTester {
    constructor() {
        this.results = [];
        this.authToken = null;
    }

    async authenticate() {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                identifier: 'test@example.com',
                password: 'password123'
            });
            this.authToken = response.data.token;
            console.log('✅ Authentification réussie');
        } catch (error) {
            console.error('❌ Erreur d\'authentification:', error.message);
            throw error;
        }
    }

    async testEndpoint(endpoint, method = 'GET', data = null, description = '') {
        const start = performance.now();
        let success = false;
        let statusCode = 0;
        let error = null;

        try {
            const config = {
                method,
                url: `${BASE_URL}${endpoint}`,
                headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            statusCode = response.status;
            success = true;
        } catch (err) {
            error = err.message;
            statusCode = err.response?.status || 0;
        }

        const duration = performance.now() - start;
        
        const result = {
            endpoint,
            method,
            description,
            duration,
            success,
            statusCode,
            error,
            timestamp: new Date().toISOString()
        };

        this.results.push(result);
        
        const status = success ? '✅' : '❌';
        console.log(`${status} ${description || endpoint} - ${duration.toFixed(2)}ms - ${statusCode}`);
        
        return result;
    }

    async runLoadTest(endpoint, method = 'GET', data = null, description = '', concurrency = 10, duration = 30) {
        console.log(`\n🔥 Test de charge: ${description || endpoint}`);
        console.log(`Concurrence: ${concurrency}, Durée: ${duration}s`);
        
        const startTime = Date.now();
        const promises = [];
        
        while (Date.now() - startTime < duration * 1000) {
            for (let i = 0; i < concurrency; i++) {
                promises.push(this.testEndpoint(endpoint, method, data, description));
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // Pause entre les vagues
        }
        
        await Promise.all(promises);
        
        // Analyser les résultats
        const successfulRequests = this.results.filter(r => r.success);
        const failedRequests = this.results.filter(r => !r.success);
        
        const avgDuration = successfulRequests.length > 0 
            ? successfulRequests.reduce((sum, r) => sum + r.duration, 0) / successfulRequests.length 
            : 0;
        
        const minDuration = successfulRequests.length > 0 
            ? Math.min(...successfulRequests.map(r => r.duration)) 
            : 0;
        
        const maxDuration = successfulRequests.length > 0 
            ? Math.max(...successfulRequests.map(r => r.duration)) 
            : 0;
        
        console.log(`\n📊 Résultats du test de charge:`);
        console.log(`Total requêtes: ${this.results.length}`);
        console.log(`Succès: ${successfulRequests.length}`);
        console.log(`Échecs: ${failedRequests.length}`);
        console.log(`Taux de succès: ${((successfulRequests.length / this.results.length) * 100).toFixed(2)}%`);
        console.log(`Durée moyenne: ${avgDuration.toFixed(2)}ms`);
        console.log(`Durée min: ${minDuration.toFixed(2)}ms`);
        console.log(`Durée max: ${maxDuration.toFixed(2)}ms`);
        console.log(`Requêtes/sec: ${(successfulRequests.length / (duration)).toFixed(2)}`);
    }

    async runAllTests() {
        console.log('🔧 Initialisation des tests de performance...\n');
        
        await this.authenticate();
        
        // Tests de base
        console.log('\n📋 TESTS DE BASE');
        console.log('================');
        
        await this.testEndpoint('/api/health', 'GET', null, 'Health Check');
        await this.testEndpoint('/api/auth/status', 'GET', null, 'Auth Status');
        await this.testEndpoint('/api/friends', 'GET', null, 'Liste des amis');
        await this.testEndpoint('/api/livestreams', 'GET', null, 'Liste des livestreams');
        await this.testEndpoint('/api/conversations', 'GET', null, 'Liste des conversations');
        
        // Tests de création
        console.log('\n📝 TESTS DE CRÉATION');
        console.log('===================');
        
        await this.testEndpoint('/api/livestreams', 'POST', {
            title: 'Test Performance',
            description: 'Test de performance',
            location: { latitude: 9.5370, longitude: -13.6785 },
            category: 'test'
        }, 'Création livestream');
        
        await this.testEndpoint('/api/conversations', 'POST', {
            participants: ['user1', 'user2'],
            name: 'Test Performance'
        }, 'Création conversation');
        
        // Tests de charge
        console.log('\n🔥 TESTS DE CHARGE');
        console.log('==================');
        
        await this.runLoadTest('/api/health', 'GET', null, 'Health Check (Charge)', 20, 10);
        await this.runLoadTest('/api/friends', 'GET', null, 'Liste des amis (Charge)', 15, 15);
        await this.runLoadTest('/api/livestreams', 'GET', null, 'Liste des livestreams (Charge)', 10, 20);
        
        // Tests de stress
        console.log('\n💥 TESTS DE STRESS');
        console.log('==================');
        
        await this.runLoadTest('/api/health', 'GET', null, 'Health Check (Stress)', 50, 30);
        
        this.generateReport();
    }

    generateReport() {
        console.log('\n📊 RAPPORT DE PERFORMANCE');
        console.log('==========================');
        
        const totalTests = this.results.length;
        const successfulTests = this.results.filter(r => r.success).length;
        const failedTests = this.results.filter(r => !r.success).length;
        
        const avgDuration = this.results.length > 0 
            ? this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length 
            : 0;
        
        console.log(`\n📈 Statistiques générales:`);
        console.log(`Total tests: ${totalTests}`);
        console.log(`Tests réussis: ${successfulTests}`);
        console.log(`Tests échoués: ${failedTests}`);
        console.log(`Taux de succès: ${((successfulTests / totalTests) * 100).toFixed(2)}%`);
        console.log(`Durée moyenne: ${avgDuration.toFixed(2)}ms`);
        
        // Recommandations
        console.log('\n💡 RECOMMANDATIONS:');
        
        if (avgDuration > 1000) {
            console.log('⚠️  Temps de réponse élevé - Optimiser les requêtes');
        }
        
        if (failedTests > totalTests * 0.1) {
            console.log('⚠️  Taux d\'échec élevé - Vérifier la stabilité');
        }
        
        if (successfulTests / totalTests > 0.95) {
            console.log('✅ Excellente stabilité');
        }
        
        if (avgDuration < 500) {
            console.log('✅ Excellente performance');
        }
        
        console.log('\n🎉 Tests de performance terminés !');
    }
}

// Exécuter les tests
const tester = new PerformanceTester();
tester.runAllTests().catch(console.error); 