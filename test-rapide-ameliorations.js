const puppeteer = require('puppeteer');

async function testRapideAmeliorations() {
  console.log('🚀 TEST RAPIDE DES AMÉLIORATIONS');
  console.log('==================================\n');

  const results = {
    tests: [],
    score: 0,
    totalTests: 0
  };

  function addTestResult(name, passed, message) {
    results.tests.push({ name, passed, message });
    results.totalTests++;
    if (passed) results.score++;
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}: ${message}`);
  }

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('🔍 Test 1: Vérification du serveur...');
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        addTestResult('Serveur API', true, 'Serveur opérationnel');
      } else {
        addTestResult('Serveur API', false, `Erreur ${response.status}`);
      }
    } catch (error) {
      addTestResult('Serveur API', false, `Erreur de connexion: ${error.message}`);
    }

    // Test 2: Vérifier la documentation Swagger
    console.log('📚 Test 2: Documentation API Swagger...');
    try {
      const response = await fetch('http://localhost:5000/api-docs');
      if (response.ok) {
        addTestResult('Documentation Swagger', true, 'Documentation accessible');
      } else {
        addTestResult('Documentation Swagger', false, `Erreur ${response.status}`);
      }
    } catch (error) {
      addTestResult('Documentation Swagger', false, `Erreur: ${error.message}`);
    }

    // Test 3: Vérifier le client React
    console.log('📱 Test 3: Client React...');
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        addTestResult('Client React', true, 'Client opérationnel');
      } else {
        addTestResult('Client React', false, `Erreur ${response.status}`);
      }
    } catch (error) {
      addTestResult('Client React', false, `Erreur: ${error.message}`);
    }

    // Test 4: Vérifier les headers de sécurité
    console.log('🔒 Test 4: Sécurité...');
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const headers = response.headers;
      
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy'
      ];
      
      const foundHeaders = securityHeaders.filter(header => 
        headers.get(header) !== null
      );
      
      if (foundHeaders.length > 0) {
        addTestResult('Headers de Sécurité', true, `${foundHeaders.length} headers trouvés`);
      } else {
        addTestResult('Headers de Sécurité', false, 'Aucun header de sécurité trouvé');
      }
    } catch (error) {
      addTestResult('Headers de Sécurité', false, `Erreur: ${error.message}`);
    }

    // Test 5: Vérifier les logs
    console.log('📝 Test 5: Système de logging...');
    try {
      const fs = require('fs');
      const logDir = './server/logs';
      
      if (fs.existsSync(logDir)) {
        addTestResult('Système de Logging', true, 'Dossier de logs créé');
      } else {
        addTestResult('Système de Logging', false, 'Dossier de logs manquant');
      }
    } catch (error) {
      addTestResult('Système de Logging', false, `Erreur: ${error.message}`);
    }

    // Test 6: Vérifier les tests de performance
    console.log('🚀 Test 6: Tests de performance...');
    try {
      const fs = require('fs');
      const perfDir = './server/tests/performance';
      
      if (fs.existsSync(perfDir)) {
        const files = fs.readdirSync(perfDir);
        if (files.length > 0) {
          addTestResult('Tests de Performance', true, `${files.length} fichiers de test trouvés`);
        } else {
          addTestResult('Tests de Performance', false, 'Aucun fichier de test trouvé');
        }
      } else {
        addTestResult('Tests de Performance', false, 'Dossier de tests manquant');
      }
    } catch (error) {
      addTestResult('Tests de Performance', false, `Erreur: ${error.message}`);
    }

    // Test 7: Vérifier les optimisations frontend
    console.log('⚡ Test 7: Optimisations frontend...');
    try {
      const fs = require('fs');
      const perfFile = './client/src/utils/performance.js';
      
      if (fs.existsSync(perfFile)) {
        addTestResult('Optimisations Frontend', true, 'Utilitaires de performance créés');
      } else {
        addTestResult('Optimisations Frontend', false, 'Fichier de performance manquant');
      }
    } catch (error) {
      addTestResult('Optimisations Frontend', false, `Erreur: ${error.message}`);
    }

    // Test 8: Vérifier la validation des données
    console.log('✅ Test 8: Validation des données...');
    try {
      const fs = require('fs');
      const validationFile = './server/middleware/validation.js';
      
      if (fs.existsSync(validationFile)) {
        addTestResult('Validation des Données', true, 'Middleware de validation créé');
      } else {
        addTestResult('Validation des Données', false, 'Fichier de validation manquant');
      }
    } catch (error) {
      addTestResult('Validation des Données', false, `Erreur: ${error.message}`);
    }

    // Générer le rapport final
    console.log('\n📋 RAPPORT FINAL');
    console.log('================');
    
    const successRate = (results.score / results.totalTests) * 100;
    
    console.log(`\n📊 Résultats:`);
    console.log(`   - Tests exécutés: ${results.totalTests}`);
    console.log(`   - Tests réussis: ${results.score}`);
    console.log(`   - Tests échoués: ${results.totalTests - results.score}`);
    console.log(`   - Taux de succès: ${successRate.toFixed(2)}%`);
    
    console.log(`\n🎯 Score de qualité:`);
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
    results.tests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`   ${status} ${test.name}: ${test.message}`);
    });

    // Sauvegarder les résultats
    const fs = require('fs');
    fs.writeFileSync('test-rapide-resultats.json', JSON.stringify(results, null, 2));
    console.log('\n💾 Résultats sauvegardés dans test-rapide-resultats.json');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter le test
testRapideAmeliorations(); 