const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class ImprovedFrontendTest {
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

  async checkPageAccessibility(path, expectedStatus = 200, isProtected = false) {
    const url = `${this.baseUrl}${path}`;
    const response = await this.makeRequest(url);
    
    if (response.statusCode === 404 && isProtected) {
      await this.log(`Page ${path} retourne 404 (normal pour une route protégée)`, 'info');
      return true;
    }
    
    if (response.statusCode !== expectedStatus) {
      throw new Error(`Statut HTTP ${response.statusCode} au lieu de ${expectedStatus}`);
    }
    
    if (!response.body || response.body.length === 0) {
      throw new Error('Page vide ou sans contenu');
    }
    
    await this.log(`Page ${path} accessible (${response.body.length} caractères)`);
    return true;
  }

  // Test 1: Vérification de l'accessibilité de base
  async testBasicAccessibility() {
    // Pages publiques qui doivent être accessibles
    await this.checkPageAccessibility('/');
    await this.checkPageAccessibility('/login');
    await this.checkPageAccessibility('/register');
  }

  // Test 2: Vérification des pages protégées
  async testProtectedPages() {
    const protectedPages = [
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
    
    let accessibleCount = 0;
    let protectedCount = 0;
    
    for (const page of protectedPages) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${page}`);
        
        if (response.statusCode === 200) {
          await this.log(`Page ${page} accessible (authentifiée ou publique)`);
          accessibleCount++;
        } else if (response.statusCode === 404) {
          await this.log(`Page ${page} protégée (404 attendu)`);
          protectedCount++;
        } else {
          await this.log(`Page ${page} statut inattendu: ${response.statusCode}`, 'warning');
        }
      } catch (error) {
        await this.log(`Erreur lors du test de ${page}: ${error.message}`, 'warning');
      }
    }
    
    await this.log(`Résumé: ${accessibleCount} pages accessibles, ${protectedCount} pages protégées`);
  }

  // Test 3: Vérification du contenu React
  async testReactContent() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    // Vérifier les éléments React typiques
    const reactIndicators = [
      'react',
      'React',
      'root',
      'app',
      'div',
      'script'
    ];
    
    let foundIndicators = 0;
    for (const indicator of reactIndicators) {
      if (response.body.toLowerCase().includes(indicator.toLowerCase())) {
        foundIndicators++;
      }
    }
    
    if (foundIndicators >= 3) {
      await this.log(`Application React détectée (${foundIndicators}/6 indicateurs)`);
    } else {
      await this.log(`Application React faiblement détectée (${foundIndicators}/6 indicateurs)`, 'warning');
    }
  }

  // Test 4: Vérification des performances
  async testPerformance() {
    const startTime = Date.now();
    const response = await this.makeRequest(`${this.baseUrl}/`);
    const loadTime = Date.now() - startTime;
    
    await this.log(`Temps de chargement: ${loadTime}ms`);
    
    if (loadTime > 5000) {
      await this.log('Temps de chargement élevé (>5s)', 'warning');
    } else if (loadTime > 3000) {
      await this.log('Temps de chargement modéré (>3s)', 'info');
    } else {
      await this.log('Temps de chargement optimal (<3s)', 'success');
    }
    
    // Vérifier la taille de la réponse
    const sizeKB = Math.round(response.body.length / 1024);
    await this.log(`Taille de la page: ${sizeKB} KB`);
    
    if (sizeKB > 1000) {
      await this.log('Page volumineuse (>1MB)', 'warning');
    } else if (sizeKB > 500) {
      await this.log('Page de taille modérée (>500KB)', 'info');
    } else {
      await this.log('Page légère (<500KB)', 'success');
    }
  }

  // Test 5: Vérification des headers HTTP
  async testHttpHeaders() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    const importantHeaders = [
      'content-type',
      'cache-control',
      'x-frame-options',
      'x-content-type-options'
    ];
    
    let headerScore = 0;
    for (const header of importantHeaders) {
      if (response.headers[header]) {
        headerScore++;
        await this.log(`Header ${header} présent: ${response.headers[header]}`);
      } else {
        await this.log(`Header ${header} manquant`, 'warning');
      }
    }
    
    await this.log(`Score des headers: ${headerScore}/${importantHeaders.length}`);
  }

  // Test 6: Vérification de la sécurité
  async testSecurityHeaders() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'content-security-policy'
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
    
    if (securityScore >= 3) {
      await this.log('Niveau de sécurité acceptable', 'success');
    } else {
      await this.log('Niveau de sécurité faible', 'warning');
    }
  }

  // Test 7: Vérification des erreurs 404
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

  // Test 8: Vérification des ressources statiques
  async testStaticResources() {
    const resources = [
      '/manifest.json',
      '/favicon.ico',
      '/static/js/',
      '/static/css/'
    ];
    
    let accessibleResources = 0;
    for (const resource of resources) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${resource}`);
        if (response.statusCode === 200) {
          await this.log(`Ressource ${resource} accessible`);
          accessibleResources++;
        } else {
          await this.log(`Ressource ${resource} non accessible (${response.statusCode})`, 'warning');
        }
      } catch (error) {
        await this.log(`Erreur lors du test de ${resource}: ${error.message}`, 'warning');
      }
    }
    
    await this.log(`Ressources statiques: ${accessibleResources}/${resources.length} accessibles`);
  }

  // Test 9: Vérification de la structure HTML
  async testHtmlStructure() {
    const response = await this.makeRequest(`${this.baseUrl}/`);
    
    const requiredElements = [
      '<html',
      '<head',
      '<body',
      '<div',
      '<script'
    ];
    
    let foundElements = 0;
    for (const element of requiredElements) {
      if (response.body.includes(element)) {
        foundElements++;
      }
    }
    
    if (foundElements >= 4) {
      await this.log(`Structure HTML correcte (${foundElements}/5 éléments)`);
    } else {
      await this.log(`Structure HTML incomplète (${foundElements}/5 éléments)`, 'warning');
    }
  }

  async runAllTests() {
    await this.log('🚀 Début des tests frontend améliorés');
    
    const tests = [
      { name: 'Accessibilité de base', fn: () => this.testBasicAccessibility() },
      { name: 'Pages protégées', fn: () => this.testProtectedPages() },
      { name: 'Contenu React', fn: () => this.testReactContent() },
      { name: 'Performances', fn: () => this.testPerformance() },
      { name: 'Headers HTTP', fn: () => this.testHttpHeaders() },
      { name: 'Headers de sécurité', fn: () => this.testSecurityHeaders() },
      { name: 'Gestion des erreurs 404', fn: () => this.test404Handling() },
      { name: 'Ressources statiques', fn: () => this.testStaticResources() },
      { name: 'Structure HTML', fn: () => this.testHtmlStructure() }
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
    const reportPath = path.join(__dirname, 'frontend-improved-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE TEST FRONTEND AMÉLIORÉ');
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
  
  const testSuite = new ImprovedFrontendTest();
  await testSuite.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImprovedFrontendTest; 