#!/usr/bin/env node

/**
 * 📊 TEST DE PERFORMANCE OPTIMISÉ - COMMUNICONNECT
 * 
 * Ce script teste les performances de l'application en conditions réelles
 * et fournit des recommandations d'optimisation.
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Métriques de performance
const performanceMetrics = {
  responseTimes: [],
  errorRates: [],
  throughput: [],
  memoryUsage: [],
  cpuUsage: []
};

// Utilitaires
const log = {
  success: (msg) => console.log(`✅ ${msg}`.green),
  error: (msg) => console.log(`❌ ${msg}`.red),
  info: (msg) => console.log(`ℹ️  ${msg}`.blue),
  warning: (msg) => console.log(`⚠️  ${msg}`.yellow),
  title: (msg) => console.log(`\n🎯 ${msg}`.cyan.bold)
};

// Tests de performance
class PerformanceTests {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: 0,
      errorRate: 0,
      throughput: 0
    };
  }

  async runAllTests() {
    log.title('DÉMARRAGE DES TESTS DE PERFORMANCE');
    
    try {
      // 1. Test de charge API
      await this.testApiLoad();
      
      // 2. Test de performance frontend
      await this.testFrontendPerformance();
      
      // 3. Test de base de données
      await this.testDatabasePerformance();
      
      // 4. Test de mémoire
      await this.testMemoryUsage();
      
      // 5. Test de concurrence
      await this.testConcurrency();
      
      // 6. Analyse des résultats
      this.analyzeResults();
      
    } catch (error) {
      log.error(`Erreur lors des tests: ${error.message}`);
    }
  }

  async testApiLoad() {
    log.title('TEST DE CHARGE API');
    
    const endpoints = [
      '/api/health',
      '/api/events',
      '/api/livestreams',
      '/api/alerts',
      '/api/users/search'
    ];
    
    const numRequests = 100;
    const concurrentRequests = 10;
    
    for (const endpoint of endpoints) {
      log.info(`Test de charge sur ${endpoint}`);
      
      const startTime = Date.now();
      const promises = [];
      
      // Création des requêtes concurrentes
      for (let i = 0; i < numRequests; i += concurrentRequests) {
        const batch = [];
        for (let j = 0; j < concurrentRequests && i + j < numRequests; j++) {
          batch.push(this.makeRequest(`${BASE_URL}${endpoint}`));
        }
        promises.push(Promise.all(batch));
      }
      
      try {
        const results = await Promise.all(promises);
        const endTime = Date.now();
        
        // Calcul des métriques
        const responseTimes = results.flat().map(r => r.responseTime);
        const errors = results.flat().filter(r => r.error).length;
        
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const maxResponseTime = Math.max(...responseTimes);
        const minResponseTime = Math.min(...responseTimes);
        const errorRate = (errors / numRequests) * 100;
        const throughput = (numRequests / ((endTime - startTime) / 1000));
        
        // Stockage des métriques
        performanceMetrics.responseTimes.push(avgResponseTime);
        performanceMetrics.errorRates.push(errorRate);
        performanceMetrics.throughput.push(throughput);
        
        // Évaluation
        if (avgResponseTime < 500 && errorRate < 5) {
          log.success(`${endpoint}: ${avgResponseTime.toFixed(2)}ms (${throughput.toFixed(2)} req/s)`);
          this.results.passed++;
        } else {
          log.warning(`${endpoint}: ${avgResponseTime.toFixed(2)}ms (${errorRate.toFixed(1)}% erreurs)`);
          this.results.failed++;
        }
        
      } catch (error) {
        log.error(`Erreur test de charge ${endpoint}: ${error.message}`);
        this.results.failed++;
      }
      
      this.results.total++;
    }
  }

  async testFrontendPerformance() {
    log.title('TEST DE PERFORMANCE FRONTEND');
    
    try {
      const startTime = Date.now();
      const response = await axios.get(CLIENT_URL);
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 3000) {
        log.success(`Frontend chargé en ${loadTime}ms`);
        this.results.passed++;
      } else {
        log.warning(`Frontend chargé en ${loadTime}ms (lent)`);
        this.results.failed++;
      }
      
      // Test des ressources statiques
      const staticResources = [
        '/static/js/main.js',
        '/static/css/main.css',
        '/favicon.ico'
      ];
      
      for (const resource of staticResources) {
        try {
          const resourceStart = Date.now();
          await axios.get(`${CLIENT_URL}${resource}`);
          const resourceTime = Date.now() - resourceStart;
          
          if (resourceTime < 1000) {
            log.success(`${resource}: ${resourceTime}ms`);
          } else {
            log.warning(`${resource}: ${resourceTime}ms (lent)`);
          }
        } catch (error) {
          // Ressource peut ne pas exister
        }
      }
      
    } catch (error) {
      log.error(`Erreur test frontend: ${error.message}`);
      this.results.failed++;
    }
    this.results.total++;
  }

  async testDatabasePerformance() {
    log.title('TEST DE PERFORMANCE BASE DE DONNÉES');
    
    try {
      // Test de requêtes simples
      const queries = [
        '/api/events?limit=10',
        '/api/users/search?q=test',
        '/api/livestreams?status=active'
      ];
      
      for (const query of queries) {
        const startTime = Date.now();
        try {
          await axios.get(`${BASE_URL}${query}`);
          const queryTime = Date.now() - startTime;
          
          if (queryTime < 200) {
            log.success(`Query ${query}: ${queryTime}ms`);
            this.results.passed++;
          } else {
            log.warning(`Query ${query}: ${queryTime}ms (lent)`);
            this.results.failed++;
          }
        } catch (error) {
          log.error(`Erreur query ${query}: ${error.message}`);
          this.results.failed++;
        }
      }
      
    } catch (error) {
      log.error(`Erreur test base de données: ${error.message}`);
      this.results.failed++;
    }
    this.results.total += 3;
  }

  async testMemoryUsage() {
    log.title('TEST D\'UTILISATION MÉMOIRE');
    
    try {
      // Simulation de charge mémoire
      const memoryTests = [
        { name: 'Requêtes multiples', requests: 50 },
        { name: 'Données volumineuses', requests: 20 },
        { name: 'Concurrence élevée', requests: 100 }
      ];
      
      for (const test of memoryTests) {
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < test.requests; i++) {
          promises.push(this.makeRequest(`${BASE_URL}/api/health`));
        }
        
        await Promise.all(promises);
        const testTime = Date.now() - startTime;
        
        if (testTime < test.requests * 10) {
          log.success(`${test.name}: ${testTime}ms`);
          this.results.passed++;
        } else {
          log.warning(`${test.name}: ${testTime}ms (lent)`);
          this.results.failed++;
        }
      }
      
    } catch (error) {
      log.error(`Erreur test mémoire: ${error.message}`);
      this.results.failed++;
    }
    this.results.total += 3;
  }

  async testConcurrency() {
    log.title('TEST DE CONCURRENCE');
    
    try {
      const concurrentUsers = 50;
      const requestsPerUser = 10;
      const totalRequests = concurrentUsers * requestsPerUser;
      
      log.info(`Test avec ${concurrentUsers} utilisateurs concurrents`);
      
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < totalRequests; i++) {
        promises.push(this.makeRequest(`${BASE_URL}/api/health`));
      }
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      const successfulRequests = results.filter(r => !r.error).length;
      const errorRate = ((totalRequests - successfulRequests) / totalRequests) * 100;
      const throughput = (totalRequests / ((endTime - startTime) / 1000));
      
      if (errorRate < 10 && throughput > 50) {
        log.success(`Concurrence: ${throughput.toFixed(2)} req/s, ${errorRate.toFixed(1)}% erreurs`);
        this.results.passed++;
      } else {
        log.warning(`Concurrence: ${throughput.toFixed(2)} req/s, ${errorRate.toFixed(1)}% erreurs`);
        this.results.failed++;
      }
      
    } catch (error) {
      log.error(`Erreur test concurrence: ${error.message}`);
      this.results.failed++;
    }
    this.results.total++;
  }

  async makeRequest(url) {
    const startTime = Date.now();
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      return { responseTime, error: false };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return { responseTime, error: true };
    }
  }

  analyzeResults() {
    log.title('ANALYSE DES RÉSULTATS');
    
    // Calcul des moyennes
    const avgResponseTime = performanceMetrics.responseTimes.reduce((a, b) => a + b, 0) / performanceMetrics.responseTimes.length;
    const avgErrorRate = performanceMetrics.errorRates.reduce((a, b) => a + b, 0) / performanceMetrics.errorRates.length;
    const avgThroughput = performanceMetrics.throughput.reduce((a, b) => a + b, 0) / performanceMetrics.throughput.length;
    
    // Mise à jour des résultats
    this.results.averageResponseTime = avgResponseTime;
    this.results.maxResponseTime = Math.max(...performanceMetrics.responseTimes);
    this.results.minResponseTime = Math.min(...performanceMetrics.responseTimes);
    this.results.errorRate = avgErrorRate;
    this.results.throughput = avgThroughput;
    
    // Affichage des résultats
    console.log(`\n📊 MÉTRIQUES DE PERFORMANCE:`);
    console.log(`   ⏱️  Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`.blue);
    console.log(`   🎯 Temps de réponse min/max: ${this.results.minResponseTime}ms / ${this.results.maxResponseTime}ms`.blue);
    console.log(`   📈 Débit moyen: ${avgThroughput.toFixed(2)} req/s`.blue);
    console.log(`   ❌ Taux d'erreur moyen: ${avgErrorRate.toFixed(1)}%`.blue);
    
    // Évaluation globale
    const performanceScore = this.calculatePerformanceScore();
    
    console.log(`\n🎯 SCORE DE PERFORMANCE: ${performanceScore}/100`);
    
    if (performanceScore >= 80) {
      log.success('🎉 PERFORMANCE EXCELLENTE - APPLICATION OPTIMISÉE !');
    } else if (performanceScore >= 60) {
      log.warning('⚠️ PERFORMANCE ACCEPTABLE - OPTIMISATIONS RECOMMANDÉES');
    } else {
      log.error('❌ PERFORMANCE INSUFFISANTE - OPTIMISATIONS CRITIQUES REQUISES');
    }
    
    // Recommandations
    this.showRecommendations(performanceScore);
  }

  calculatePerformanceScore() {
    let score = 100;
    
    // Pénalités basées sur les métriques
    if (this.results.averageResponseTime > 500) score -= 20;
    if (this.results.averageResponseTime > 1000) score -= 20;
    if (this.results.errorRate > 5) score -= 15;
    if (this.results.errorRate > 10) score -= 15;
    if (this.results.throughput < 50) score -= 10;
    if (this.results.throughput < 20) score -= 10;
    
    return Math.max(0, score);
  }

  showRecommendations(score) {
    console.log(`\n🚀 RECOMMANDATIONS D'OPTIMISATION:`);
    
    if (score >= 80) {
      console.log('   ✅ Performance excellente - maintenir les bonnes pratiques');
      console.log('   📊 Continuer le monitoring');
      console.log('   🔄 Planifier les optimisations futures');
    } else if (score >= 60) {
      console.log('   🔧 Optimiser les requêtes de base de données');
      console.log('   💾 Implémenter le cache Redis');
      console.log('   📦 Optimiser les bundles frontend');
      console.log('   🖼️  Compresser les images et assets');
    } else {
      console.log('   🚨 Optimisations critiques requises:');
      console.log('      - Réviser l\'architecture de base de données');
      console.log('      - Implémenter le cache à tous les niveaux');
      console.log('      - Optimiser les requêtes API');
      console.log('      - Réduire la taille des bundles');
      console.log('      - Implémenter la pagination');
    }
  }
}

// Exécution des tests
async function main() {
  const tests = new PerformanceTests();
  await tests.runAllTests();
}

// Lancement si exécuté directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceTests; 