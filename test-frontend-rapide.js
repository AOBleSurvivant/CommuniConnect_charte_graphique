const http = require('http');
const fs = require('fs');

console.log('🚀 Test Frontend CommuniConnect - Version Rapide');
console.log('='.repeat(50));

class QuickFrontendTest {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  async test(name, testFunction) {
    this.results.total++;
    try {
      console.log(`\n🧪 Test: ${name}`);
      await testFunction();
      this.results.passed++;
      console.log(`✅ ${name} - RÉUSSI`);
      return true;
    } catch (error) {
      this.results.failed++;
      console.log(`❌ ${name} - ÉCHOUÉ: ${error.message}`);
      return false;
    }
  }

  async makeRequest(path) {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: path,
        method: 'GET',
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data,
            size: data.length
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });

      req.end();
    });
  }

  async testServerAccessibility() {
    const response = await this.makeRequest('/');
    
    if (response.statusCode !== 200) {
      throw new Error(`Serveur non accessible (${response.statusCode})`);
    }
    
    if (response.size === 0) {
      throw new Error('Page vide');
    }
    
    console.log(`📄 Page d'accueil chargée (${response.size} caractères)`);
  }

  async testLoginPage() {
    const response = await this.makeRequest('/login');
    
    if (response.statusCode !== 200) {
      throw new Error(`Page de connexion non accessible (${response.statusCode})`);
    }
    
    console.log(`🔐 Page de connexion accessible`);
  }

  async testRegisterPage() {
    const response = await this.makeRequest('/register');
    
    if (response.statusCode !== 200) {
      throw new Error(`Page d'inscription non accessible (${response.statusCode})`);
    }
    
    console.log(`📝 Page d'inscription accessible`);
  }

  async testProtectedPages() {
    const protectedPages = ['/feed', '/alerts', '/events', '/map', '/messages'];
    let accessibleCount = 0;
    let protectedCount = 0;
    
    for (const page of protectedPages) {
      try {
        const response = await this.makeRequest(page);
        if (response.statusCode === 200) {
          accessibleCount++;
          console.log(`✅ ${page} accessible`);
        } else if (response.statusCode === 404) {
          protectedCount++;
          console.log(`🔒 ${page} protégée (404)`);
        } else {
          console.log(`⚠️ ${page} statut: ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${page} erreur: ${error.message}`);
      }
    }
    
    console.log(`📊 Résumé: ${accessibleCount} accessibles, ${protectedCount} protégées`);
  }

  async testPerformance() {
    const startTime = Date.now();
    const response = await this.makeRequest('/');
    const loadTime = Date.now() - startTime;
    
    console.log(`⚡ Temps de chargement: ${loadTime}ms`);
    console.log(`📦 Taille de la page: ${Math.round(response.size / 1024)} KB`);
    
    if (loadTime > 3000) {
      throw new Error('Temps de chargement trop élevé');
    }
  }

  async testReactApp() {
    const response = await this.makeRequest('/');
    
    const reactIndicators = ['react', 'React', 'root', 'app'];
    let foundCount = 0;
    
    for (const indicator of reactIndicators) {
      if (response.body.toLowerCase().includes(indicator.toLowerCase())) {
        foundCount++;
      }
    }
    
    console.log(`⚛️ Indicateurs React trouvés: ${foundCount}/${reactIndicators.length}`);
    
    if (foundCount < 2) {
      throw new Error('Application React faiblement détectée');
    }
  }

  async testErrorHandling() {
    try {
      const response = await this.makeRequest('/page-inexistante-12345');
      if (response.statusCode === 404) {
        console.log(`🔍 Gestion d'erreur 404 correcte`);
      } else {
        console.log(`⚠️ Statut inattendu pour page inexistante: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors du test 404: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('\n🔍 Vérification du serveur...');
    
    try {
      await this.makeRequest('/');
      console.log('✅ Serveur frontend accessible\n');
    } catch (error) {
      console.log('❌ Serveur frontend non accessible');
      console.log('💡 Assurez-vous que le serveur est démarré avec: cd client && npm start');
      return;
    }

    await this.test('Accessibilité du serveur', () => this.testServerAccessibility());
    await this.test('Page de connexion', () => this.testLoginPage());
    await this.test('Page d\'inscription', () => this.testRegisterPage());
    await this.test('Pages protégées', () => this.testProtectedPages());
    await this.test('Performances', () => this.testPerformance());
    await this.test('Application React', () => this.testReactApp());
    await this.test('Gestion des erreurs', () => this.testErrorHandling());

    this.generateReport();
  }

  generateReport() {
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RAPPORT DE TEST');
    console.log('='.repeat(50));
    console.log(`Total des tests: ${this.results.total}`);
    console.log(`Tests réussis: ${this.results.passed} ✅`);
    console.log(`Tests échoués: ${this.results.failed} ❌`);
    console.log(`Taux de réussite: ${successRate}%`);
    console.log('='.repeat(50));
    
    if (this.results.failed === 0) {
      console.log('\n🎉 Tous les tests sont passés !');
    } else {
      console.log('\n⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
    }
    
    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: successRate
      }
    };
    
    fs.writeFileSync('frontend-quick-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Rapport sauvegardé: frontend-quick-test-report.json');
  }
}

// Exécuter les tests
const testSuite = new QuickFrontendTest();
testSuite.runAllTests().catch(console.error); 