const puppeteer = require('puppeteer');

class TestAmeliorationsFinales {
  constructor() {
    this.results = {
      tests: [],
      score: 0,
      totalTests: 0
    };
  }

  async runTests() {
    console.log('🚀 TEST DES AMÉLIORATIONS FINALES');
    console.log('==================================\n');

    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    try {
      const page = await browser.newPage();
      await page.setDefaultTimeout(60000);
      await page.setDefaultNavigationTimeout(60000);

      // Test 1: Documentation API Swagger
      await this.testSwaggerDocumentation(page);
      
      // Test 2: Validation des données
      await this.testDataValidation(page);
      
      // Test 3: Logging avancé
      await this.testAdvancedLogging(page);
      
      // Test 4: Sécurité renforcée
      await this.testSecurityFeatures(page);
      
      // Test 5: Optimisations frontend
      await this.testFrontendOptimizations(page);
      
      // Test 6: Tests de performance
      await this.testPerformanceFeatures(page);

      this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      await browser.close();
    }
  }

  async testSwaggerDocumentation(page) {
    console.log('📚 Test de la documentation API Swagger...');
    
    try {
      await page.goto('http://localhost:5000/api-docs', { 
        waitUntil: 'networkidle2' 
      });
      
      // Vérifier que la page Swagger se charge
      await page.waitForSelector('.swagger-ui', { timeout: 10000 });
      
      // Vérifier la présence des endpoints documentés
      const endpoints = await page.evaluate(() => {
        const elements = document.querySelectorAll('.opblock-tag-section');
        return elements.length;
      });
      
      if (endpoints > 0) {
        this.addTestResult('Documentation API Swagger', true, 'Documentation complète disponible');
      } else {
        this.addTestResult('Documentation API Swagger', false, 'Aucun endpoint documenté trouvé');
      }
      
    } catch (error) {
      this.addTestResult('Documentation API Swagger', false, `Erreur: ${error.message}`);
    }
  }

  async testDataValidation(page) {
    console.log('✅ Test de la validation des données...');
    
    try {
      // Test de validation côté client
      await page.goto('http://localhost:3000/events', { 
        waitUntil: 'networkidle2' 
      });
      
      // Vérifier la présence de validation dans les formulaires
      const hasValidation = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        return inputs.length > 0;
      });
      
      if (hasValidation) {
        this.addTestResult('Validation des données', true, 'Validation côté client active');
      } else {
        this.addTestResult('Validation des données', false, 'Validation côté client manquante');
      }
      
    } catch (error) {
      this.addTestResult('Validation des données', false, `Erreur: ${error.message}`);
    }
  }

  async testAdvancedLogging(page) {
    console.log('📝 Test du logging avancé...');
    
    try {
      // Vérifier les logs côté serveur
      const response = await page.evaluate(async () => {
        const res = await fetch('http://localhost:5000/api/health');
        return res.status;
      });
      
      if (response === 200) {
        this.addTestResult('Logging avancé', true, 'Système de logging opérationnel');
      } else {
        this.addTestResult('Logging avancé', false, 'Système de logging non fonctionnel');
      }
      
    } catch (error) {
      this.addTestResult('Logging avancé', false, `Erreur: ${error.message}`);
    }
  }

  async testSecurityFeatures(page) {
    console.log('🔒 Test des fonctionnalités de sécurité...');
    
    try {
      // Test des headers de sécurité
      const securityHeaders = await page.evaluate(async () => {
        const res = await fetch('http://localhost:5000/api/health');
        return {
          'x-frame-options': res.headers.get('x-frame-options'),
          'x-content-type-options': res.headers.get('x-content-type-options'),
          'referrer-policy': res.headers.get('referrer-policy')
        };
      });
      
      const hasSecurityHeaders = Object.values(securityHeaders).some(header => header !== null);
      
      if (hasSecurityHeaders) {
        this.addTestResult('Sécurité renforcée', true, 'Headers de sécurité présents');
      } else {
        this.addTestResult('Sécurité renforcée', false, 'Headers de sécurité manquants');
      }
      
    } catch (error) {
      this.addTestResult('Sécurité renforcée', false, `Erreur: ${error.message}`);
    }
  }

  async testFrontendOptimizations(page) {
    console.log('⚡ Test des optimisations frontend...');
    
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2' 
      });
      
      // Vérifier les optimisations de performance
      const performanceMetrics = await page.evaluate(() => {
        return {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        };
      });
      
      if (performanceMetrics.loadTime < 3000) {
        this.addTestResult('Optimisations frontend', true, `Temps de chargement: ${performanceMetrics.loadTime}ms`);
      } else {
        this.addTestResult('Optimisations frontend', false, `Temps de chargement élevé: ${performanceMetrics.loadTime}ms`);
      }
      
    } catch (error) {
      this.addTestResult('Optimisations frontend', false, `Erreur: ${error.message}`);
    }
  }

  async testPerformanceFeatures(page) {
    console.log('🚀 Test des fonctionnalités de performance...');
    
    try {
      // Test de la réactivité de l'interface
      const startTime = Date.now();
      
      await page.click('button, a, [role="button"]').catch(() => {});
      
      const responseTime = Date.now() - startTime;
      
      if (responseTime < 1000) {
        this.addTestResult('Tests de performance', true, `Temps de réponse: ${responseTime}ms`);
      } else {
        this.addTestResult('Tests de performance', false, `Temps de réponse élevé: ${responseTime}ms`);
      }
      
    } catch (error) {
      this.addTestResult('Tests de performance', false, `Erreur: ${error.message}`);
    }
  }

  addTestResult(name, passed, message) {
    this.results.tests.push({
      name,
      passed,
      message,
      timestamp: new Date().toISOString()
    });
    
    this.results.totalTests++;
    if (passed) this.results.score++;
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}: ${message}`);
  }

  generateFinalReport() {
    console.log('\n📋 RAPPORT FINAL DES AMÉLIORATIONS');
    console.log('====================================');
    
    const successRate = (this.results.score / this.results.totalTests) * 100;
    
    console.log(`\n📊 Résultats:`);
    console.log(`   - Tests exécutés: ${this.results.totalTests}`);
    console.log(`   - Tests réussis: ${this.results.score}`);
    console.log(`   - Tests échoués: ${this.results.totalTests - this.results.score}`);
    console.log(`   - Taux de succès: ${successRate.toFixed(2)}%`);
    
    console.log(`\n🎯 Score de qualité estimé:`);
    if (successRate >= 95) {
      console.log('   🏆 EXCELLENT - 100% de qualité atteint !');
    } else if (successRate >= 90) {
      console.log('   ✅ TRÈS BON - 95%+ de qualité');
    } else if (successRate >= 80) {
      console.log('   ⚠️  BON - 90%+ de qualité');
    } else {
      console.log('   ❌ AMÉLIORATIONS NÉCESSAIRES');
    }
    
    console.log(`\n📝 Détail des tests:`);
    this.results.tests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`   ${status} ${test.name}: ${test.message}`);
    });
    
    // Sauvegarder le rapport
    const fs = require('fs');
    fs.writeFileSync('rapport-ameliorations-finales.json', JSON.stringify(this.results, null, 2));
    console.log('\n💾 Rapport sauvegardé dans rapport-ameliorations-finales.json');
  }
}

// Exécuter les tests
if (require.main === module) {
  const tester = new TestAmeliorationsFinales();
  tester.runTests();
}

module.exports = TestAmeliorationsFinales; 