const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class PerformanceTester {
  constructor() {
    this.results = {
      loadTest: null,
      stressTest: null,
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0
      }
    };
  }

  async runLoadTest() {
    console.log('🚀 Démarrage du test de charge...');
    
    return new Promise((resolve, reject) => {
      const loadTestPath = path.join(__dirname, 'load-test.yml');
      
      exec(`npx artillery run ${loadTestPath} --output load-test-results.json`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur lors du test de charge:', error);
          reject(error);
          return;
        }
        
        console.log('✅ Test de charge terminé');
        console.log(stdout);
        
        // Analyser les résultats
        this.analyzeResults('load-test-results.json', 'loadTest');
        resolve();
      });
    });
  }

  async runStressTest() {
    console.log('🔥 Démarrage du test de stress...');
    
    return new Promise((resolve, reject) => {
      const stressTestPath = path.join(__dirname, 'stress-test.yml');
      
      exec(`npx artillery run ${stressTestPath} --output stress-test-results.json`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur lors du test de stress:', error);
          reject(error);
          return;
        }
        
        console.log('✅ Test de stress terminé');
        console.log(stdout);
        
        // Analyser les résultats
        this.analyzeResults('stress-test-results.json', 'stressTest');
        resolve();
      });
    });
  }

  analyzeResults(filePath, testType) {
    try {
      if (fs.existsSync(filePath)) {
        const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const metrics = {
          totalRequests: results.aggregate.counters.requests,
          totalResponses: results.aggregate.counters.responses,
          errors: results.aggregate.counters.errors || 0,
          timeouts: results.aggregate.counters.timeouts || 0,
          averageResponseTime: results.aggregate.latency.median,
          maxResponseTime: results.aggregate.latency.max,
          minResponseTime: results.aggregate.latency.min,
          rps: results.aggregate.rps.median
        };
        
        this.results[testType] = metrics;
        
        console.log(`📊 Résultats ${testType}:`);
        console.log(`   - Requêtes totales: ${metrics.totalRequests}`);
        console.log(`   - Réponses: ${metrics.totalResponses}`);
        console.log(`   - Erreurs: ${metrics.errors}`);
        console.log(`   - Timeouts: ${metrics.timeouts}`);
        console.log(`   - Temps de réponse moyen: ${metrics.averageResponseTime}ms`);
        console.log(`   - Temps de réponse max: ${metrics.maxResponseTime}ms`);
        console.log(`   - RPS moyen: ${metrics.rps}`);
        
        // Mettre à jour le résumé global
        this.updateSummary(metrics);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse des résultats ${testType}:`, error);
    }
  }

  updateSummary(metrics) {
    this.results.summary.totalTests++;
    
    if (metrics.errors === 0 && metrics.timeouts === 0) {
      this.results.summary.passedTests++;
    } else {
      this.results.summary.failedTests++;
    }
    
    // Mettre à jour les temps de réponse
    if (this.results.summary.averageResponseTime === 0) {
      this.results.summary.averageResponseTime = metrics.averageResponseTime;
      this.results.summary.maxResponseTime = metrics.maxResponseTime;
      this.results.summary.minResponseTime = metrics.minResponseTime;
    } else {
      this.results.summary.averageResponseTime = 
        (this.results.summary.averageResponseTime + metrics.averageResponseTime) / 2;
      this.results.summary.maxResponseTime = 
        Math.max(this.results.summary.maxResponseTime, metrics.maxResponseTime);
      this.results.summary.minResponseTime = 
        Math.min(this.results.summary.minResponseTime, metrics.minResponseTime);
    }
  }

  generateReport() {
    console.log('\n📋 RAPPORT DE PERFORMANCE');
    console.log('========================');
    
    console.log(`\n📊 Résumé global:`);
    console.log(`   - Tests exécutés: ${this.results.summary.totalTests}`);
    console.log(`   - Tests réussis: ${this.results.summary.passedTests}`);
    console.log(`   - Tests échoués: ${this.results.summary.failedTests}`);
    console.log(`   - Taux de succès: ${((this.results.summary.passedTests / this.results.summary.totalTests) * 100).toFixed(2)}%`);
    
    console.log(`\n⏱️  Métriques de performance:`);
    console.log(`   - Temps de réponse moyen: ${this.results.summary.averageResponseTime}ms`);
    console.log(`   - Temps de réponse max: ${this.results.summary.maxResponseTime}ms`);
    console.log(`   - Temps de réponse min: ${this.results.summary.minResponseTime}ms`);
    
    // Évaluer les performances
    this.evaluatePerformance();
  }

  evaluatePerformance() {
    console.log(`\n🎯 Évaluation des performances:`);
    
    const avgResponseTime = this.results.summary.averageResponseTime;
    const successRate = (this.results.summary.passedTests / this.results.summary.totalTests) * 100;
    
    if (avgResponseTime < 500 && successRate > 95) {
      console.log('   ✅ EXCELLENT - Performances optimales');
    } else if (avgResponseTime < 1000 && successRate > 90) {
      console.log('   ✅ BON - Performances satisfaisantes');
    } else if (avgResponseTime < 2000 && successRate > 80) {
      console.log('   ⚠️  MOYEN - Améliorations recommandées');
    } else {
      console.log('   ❌ CRITIQUE - Optimisations nécessaires');
    }
    
    // Recommandations
    console.log(`\n💡 Recommandations:`);
    if (avgResponseTime > 1000) {
      console.log('   - Optimiser les requêtes de base de données');
      console.log('   - Implémenter la mise en cache');
      console.log('   - Réduire la taille des réponses');
    }
    
    if (successRate < 95) {
      console.log('   - Vérifier la stabilité du serveur');
      console.log('   - Optimiser la gestion des erreurs');
      console.log('   - Augmenter les ressources serveur');
    }
  }

  async runAllTests() {
    console.log('🚀 DÉMARRAGE DES TESTS DE PERFORMANCE');
    console.log('=====================================\n');
    
    try {
      await this.runLoadTest();
      await this.runStressTest();
      this.generateReport();
      
      // Sauvegarder les résultats
      fs.writeFileSync('performance-results.json', JSON.stringify(this.results, null, 2));
      console.log('\n💾 Résultats sauvegardés dans performance-results.json');
      
    } catch (error) {
      console.error('❌ Erreur lors des tests de performance:', error);
    }
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests();
}

module.exports = PerformanceTester; 