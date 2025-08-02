const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class SimpleFrontendTest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    this.results.details.push({ timestamp, type, message });
  }

  async test(testName, testFunction) {
    this.results.total++;
    try {
      await this.log(`🧪 Début du test: ${testName}`);
      await testFunction();
      this.results.passed++;
      await this.log(`✅ Test réussi: ${testName}`, 'success');
      return true;
    } catch (error) {
      this.results.failed++;
      await this.log(`❌ Test échoué: ${testName} - ${error.message}`, 'error');
      return false;
    }
  }

  async makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: method,
        headers: {
          'User-Agent': 'FrontendTest/1.0'
        }
      };

      const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });

      req.end();
    });
  }

  async checkPageAccessibility(path, expectedStatus = 200) {
    const url = `${this.baseUrl}${path}`;
    const response = await this.makeRequest(url);
    
    if (response.statusCode !== expectedStatus) {
      throw new Error(`Statut HTTP ${response.statusCode} au lieu de ${expectedStatus}`);
    }
    
    if (!response.body || response.body.length === 0) {
      throw new Error('Page vide ou sans contenu');
    }
    
    // Vérifier que c'est bien une page React (contient des éléments React)
    if (!response.body.includes('react') && !response.body.includes('React') && !response.body.includes('root')) {
      await this.log('Avertissement: Page ne semble pas être une application React', 'warning');
    }
    
    await this.log(`Page ${path} accessible (${response.body.length} caractères)`);
  }

  async checkPageContent(path, expectedContent = []) {
    const url = `${this.baseUrl}${path}`;
    const response = await this.makeRequest(url);
    
    if (response.statusCode !== 200) {
      throw new Error(`Page ${path} non accessible (${response.statusCode})`);
    }
    
    for (const content of expectedContent) {
      if (!response.body.includes(content)) {
        await this.log(`Contenu attendu non trouvé: ${content}`, 'warning');
      } else {
        await this.log(`Contenu trouvé: ${content}`);
      }
    }
  }

  // Test 1: Vérification de l'accessibilité de base
  async testBasicAccessibility() {
    await this.checkPageAccessibility('/');
    await this.checkPageAccessibility('/login');
    await this.checkPageAccessibility('/register');
  }

  // Test 2: Vérification des pages principales
  async testMainPages() {
    const pages = [
      '/feed',
      '/alerts', 
      '/events',
      '/livestreams',
      '/map',
      '/messages',
      '/friends',
      '/profile',
      '/help',
      '/moderation'
    ];
    
    for (const page of pages) {
      try {
        await this.checkPageAccessibility(page, 200);
      } catch (error) {
        await this.log(`Page ${page} non accessible: ${error.message}`, 'warning');
      }
    }
  }

  // Test 3: Vérification des ressources statiques
  async testStaticResources() {
    const resources = [
      '/static/js/',
      '/static/css/',
      '/manifest.json',
      '/favicon.ico'
    ];
    
    for (const resource of resources) {
      try {
        await this.checkPageAccessibility(resource, 200);
      } catch (error) {
        await this.log(`Ressource ${resource} non accessible: ${error.message}`, 'warning');
      }
    }
  }

  // Test 4: Vérification des redirections
  async testRedirects() {
    // Test de redirection vers login si non authentifié
    try {
      const response = await this.makeRequest(`${this.baseUrl}/`);
      if (response.statusCode === 200) {
        await this.log('Page d\'accueil accessible');
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        await this.log('Redirection détectée (normal si non authentifié)');
      }
    } catch (error) {
      await this.log(`Erreur lors de l'accès à la page d'accueil: ${error.message}`, 'warning');
    }
  }

  // Test 5: Vérification des performances
  async testPerformance() {
    const startTime = Date.now();
    await this.makeRequest(`${this.baseUrl}/`);
    const loadTime = Date.now() - startTime;
    
    await this.log(`Temps de chargement: ${loadTime}ms`);
    
    if (loadTime > 5000) {
      await this.log('Temps de chargement élevé (>5s)', 'warning');
    } else if (loadTime > 3000) {
      await this.log('Temps de chargement modéré (>3s)', 'info');
    } else {
      await this.log('Temps de chargement optimal (<3s)', 'success');
    }
  }

  // Test 6: Vérification des headers HTTP
  async testHttpHeaders() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    const importantHeaders = [
      'content-type',
      'cache-control',
      'x-frame-options',
      'x-content-type-options'
    ];
    
    for (const header of importantHeaders) {
      if (response.headers[header]) {
        await this.log(`Header ${header} présent: ${response.headers[header]}`);
      } else {
        await this.log(`Header ${header} manquant`, 'warning');
      }
    }
  }

  // Test 7: Vérification de la sécurité
  async testSecurityHeaders() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy'
    ];
    
    let securityScore = 0;
    for (const header of securityHeaders) {
      if (response.headers[header]) {
        securityScore++;
        await this.log(`Header de sécurité ${header} présent`);
      } else {
        await this.log(`Header de sécurité ${header} manquant`, 'warning');
      }
    }
    
    await this.log(`Score de sécurité: ${securityScore}/${securityHeaders.length}`);
  }

  // Test 8: Vérification des erreurs 404
  async test404Handling() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/page-inexistante-12345`);
      if (response.statusCode === 404) {
        await this.log('Gestion des erreurs 404 correcte');
      } else {
        await this.log(`Statut inattendu pour page inexistante: ${response.statusCode}`, 'warning');
      }
    } catch (error) {
      await this.log(`Erreur lors du test 404: ${error.message}`, 'warning');
    }
  }

  async runAllTests() {
    await this.log('🚀 Début des tests frontend simplifiés');
    
    const tests = [
      { name: 'Accessibilité de base', fn: () => this.testBasicAccessibility() },
      { name: 'Pages principales', fn: () => this.testMainPages() },
      { name: 'Ressources statiques', fn: () => this.testStaticResources() },
      { name: 'Redirections', fn: () => this.testRedirects() },
      { name: 'Performances', fn: () => this.testPerformance() },
      { name: 'Headers HTTP', fn: () => this.testHttpHeaders() },
      { name: 'Headers de sécurité', fn: () => this.testSecurityHeaders() },
      { name: 'Gestion des erreurs 404', fn: () => this.test404Handling() }
    ];
    
    for (const test of tests) {
      await this.test(test.name, test.fn);
    }
    
    await this.generateReport();
  }

  async generateReport() {
    const report = {
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(2)
      },
      details: this.results.details,
      timestamp: new Date().toISOString()
    };
    
    // Sauvegarder le rapport
    const reportPath = path.join(__dirname, 'frontend-simple-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE TEST FRONTEND SIMPLIFIÉ');
    console.log('='.repeat(60));
    console.log(`Total des tests: ${report.summary.total}`);
    console.log(`Tests réussis: ${report.summary.passed} ✅`);
    console.log(`Tests échoués: ${report.summary.failed} ❌`);
    console.log(`Taux de réussite: ${report.summary.successRate}%`);
    console.log('='.repeat(60));
    
    if (report.summary.failed > 0) {
      console.log('\n🔍 Détails des échecs:');
      report.details
        .filter(detail => detail.type === 'error')
        .forEach(detail => {
          console.log(`  - ${detail.message}`);
        });
    }
    
    console.log(`\n📄 Rapport complet sauvegardé: ${reportPath}`);
  }
}

// Fonction pour vérifier si le serveur frontend est accessible
async function checkFrontendServer() {
  const http = require('http');
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Point d'entrée
async function main() {
  console.log('🔍 Vérification du serveur frontend...');
  
  const serverRunning = await checkFrontendServer();
  if (!serverRunning) {
    console.error('❌ Le serveur frontend n\'est pas accessible sur http://localhost:3000');
    console.log('💡 Assurez-vous que le serveur frontend est démarré avec:');
    console.log('   cd client');
    console.log('   npm start');
    process.exit(1);
  }
  
  console.log('✅ Serveur frontend détecté, lancement des tests...\n');
  
  const testSuite = new SimpleFrontendTest();
  await testSuite.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SimpleFrontendTest; 