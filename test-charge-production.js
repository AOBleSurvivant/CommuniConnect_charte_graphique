#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE TEST DE CHARGE - COMMUNICONNECT
 * 
 * Ce script simule une charge utilisateur pour tester les performances
 * avant le déploiement en production.
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:5000/api';
const CONCURRENT_USERS = 50;
const REQUESTS_PER_USER = 10;
const DELAY_BETWEEN_REQUESTS = 100; // ms

// Couleurs pour l'affichage
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Endpoints à tester
const endpoints = [
  { name: 'Health Check', url: '/health', method: 'GET' },
  { name: 'Calendrier Événements', url: '/events/calendar', method: 'GET' },
  { name: 'Recommandations', url: '/events/recommendations', method: 'GET' },
  { name: 'Régions', url: '/location/regions', method: 'GET' },
  { name: 'Géolocalisation', url: '/location/nearby?latitude=9.5370&longitude=-13.6785', method: 'GET' },
  { name: 'Recherche Utilisateurs', url: '/users/search?q=test', method: 'GET' }
];

// Statistiques de performance
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let responseTimes = [];
let errors = [];

// Simuler un utilisateur
async function simulateUser(userId) {
  const userStats = {
    userId,
    requests: 0,
    successful: 0,
    failed: 0,
    totalTime: 0
  };

  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const startTime = performance.now();

    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      const endTime = performance.now();
      const duration = endTime - startTime;

      responseTimes.push(duration);
      userStats.requests++;
      userStats.successful++;
      userStats.totalTime += duration;
      totalRequests++;
      successfulRequests++;

      // Log progress
      if (i % 5 === 0) {
        logInfo(`Utilisateur ${userId}: ${i + 1}/${REQUESTS_PER_USER} requêtes`);
      }

    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      responseTimes.push(duration);
      userStats.requests++;
      userStats.failed++;
      userStats.totalTime += duration;
      totalRequests++;
      failedRequests++;

      errors.push({
        userId,
        endpoint: endpoint.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Délai entre les requêtes
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
  }

  return userStats;
}

// Test de charge principal
async function runLoadTest() {
  log('\n🚀 TEST DE CHARGE - COMMUNICONNECT', 'magenta');
  log('====================================', 'magenta');
  log(`👥 Utilisateurs simultanés: ${CONCURRENT_USERS}`, 'cyan');
  log(`📊 Requêtes par utilisateur: ${REQUESTS_PER_USER}`, 'cyan');
  log(`🔄 Total des requêtes: ${CONCURRENT_USERS * REQUESTS_PER_USER}`, 'cyan');
  log(`⏱️  Délai entre requêtes: ${DELAY_BETWEEN_REQUESTS}ms`, 'cyan');

  const startTime = performance.now();
  const userPromises = [];

  // Lancer tous les utilisateurs simultanément
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }

  logInfo('\n🔄 Lancement des tests de charge...');
  const userResults = await Promise.all(userPromises);
  const endTime = performance.now();
  const totalDuration = endTime - startTime;

  // Analyser les résultats
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);
  const successRate = (successfulRequests / totalRequests) * 100;

  // Calculer les percentiles
  const sortedTimes = responseTimes.sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

  // Afficher les résultats
  log('\n📊 RÉSULTATS DU TEST DE CHARGE', 'magenta');
  log('================================', 'magenta');
  log(`⏱️  Durée totale: ${(totalDuration / 1000).toFixed(2)}s`, 'blue');
  log(`📈 Requêtes totales: ${totalRequests}`, 'blue');
  log(`✅ Requêtes réussies: ${successfulRequests}`, 'green');
  log(`❌ Requêtes échouées: ${failedRequests}`, 'red');
  log(`📊 Taux de succès: ${successRate.toFixed(2)}%`, successRate >= 95 ? 'green' : 'yellow');

  log('\n⚡ PERFORMANCE', 'magenta');
  log('==============', 'magenta');
  log(`📊 Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`, 'blue');
  log(`🚀 Temps de réponse minimum: ${minResponseTime.toFixed(2)}ms`, 'green');
  log(`🐌 Temps de réponse maximum: ${maxResponseTime.toFixed(2)}ms`, 'red');
  log(`📈 P50 (médiane): ${p50.toFixed(2)}ms`, 'blue');
  log(`📈 P90: ${p90.toFixed(2)}ms`, 'blue');
  log(`📈 P95: ${p95.toFixed(2)}ms`, 'yellow');
  log(`📈 P99: ${p99.toFixed(2)}ms`, 'red');

  // Évaluer les performances
  const performanceGrade = evaluatePerformance(avgResponseTime, successRate, p95);
  log(`\n🎯 GRADE DE PERFORMANCE: ${performanceGrade.grade}`, performanceGrade.color);
  log(`💡 Recommandation: ${performanceGrade.recommendation}`, 'cyan');

  // Afficher les erreurs si il y en a
  if (errors.length > 0) {
    log('\n❌ ERREURS DÉTECTÉES', 'red');
    log('====================', 'red');
    errors.slice(0, 10).forEach((error, index) => {
      log(`${index + 1}. Utilisateur ${error.userId} - ${error.endpoint}: ${error.error}`, 'red');
    });
    if (errors.length > 10) {
      log(`... et ${errors.length - 10} autres erreurs`, 'red');
    }
  }

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    successRate,
    avgResponseTime,
    p95,
    performanceGrade
  };
}

// Évaluer les performances
function evaluatePerformance(avgResponseTime, successRate, p95) {
  if (successRate >= 99 && avgResponseTime <= 100 && p95 <= 200) {
    return {
      grade: 'A+ (EXCELLENT)',
      color: 'green',
      recommendation: 'Prêt pour la production - Performances optimales'
    };
  } else if (successRate >= 95 && avgResponseTime <= 200 && p95 <= 500) {
    return {
      grade: 'A (TRÈS BON)',
      color: 'green',
      recommendation: 'Prêt pour la production - Performances très bonnes'
    };
  } else if (successRate >= 90 && avgResponseTime <= 500 && p95 <= 1000) {
    return {
      grade: 'B (BON)',
      color: 'yellow',
      recommendation: 'Acceptable pour la production - Optimisations recommandées'
    };
  } else if (successRate >= 80 && avgResponseTime <= 1000 && p95 <= 2000) {
    return {
      grade: 'C (MOYEN)',
      color: 'yellow',
      recommendation: 'Optimisations nécessaires avant la production'
    };
  } else {
    return {
      grade: 'D (INSUFFISANT)',
      color: 'red',
      recommendation: 'Optimisations critiques requises avant la production'
    };
  }
}

// Test de stress (charge maximale)
async function runStressTest() {
  log('\n🔥 TEST DE STRESS - CHARGE MAXIMALE', 'magenta');
  log('====================================', 'magenta');
  
  const stressUsers = CONCURRENT_USERS * 2;
  const stressRequests = REQUESTS_PER_USER * 2;
  
  log(`👥 Utilisateurs: ${stressUsers}`, 'cyan');
  log(`📊 Requêtes par utilisateur: ${stressRequests}`, 'cyan');
  log(`🔄 Total: ${stressUsers * stressRequests} requêtes`, 'cyan');

  // Simuler une charge de stress
  const startTime = performance.now();
  const promises = [];

  for (let i = 1; i <= stressUsers; i++) {
    promises.push(simulateUser(i));
  }

  const results = await Promise.all(promises);
  const endTime = performance.now();

  const totalDuration = endTime - startTime;
  const totalRequests = results.reduce((sum, user) => sum + user.requests, 0);
  const totalSuccessful = results.reduce((sum, user) => sum + user.successful, 0);
  const successRate = (totalSuccessful / totalRequests) * 100;

  log('\n📊 RÉSULTATS DU TEST DE STRESS', 'magenta');
  log('==============================', 'magenta');
  log(`⏱️  Durée: ${(totalDuration / 1000).toFixed(2)}s`, 'blue');
  log(`📈 Requêtes: ${totalRequests}`, 'blue');
  log(`✅ Succès: ${totalSuccessful}`, 'green');
  log(`📊 Taux de succès: ${successRate.toFixed(2)}%`, successRate >= 80 ? 'green' : 'red');

  return { successRate, totalDuration };
}

// Point d'entrée
async function main() {
  try {
    // Vérifier la connectivité
    logInfo('Vérification de la connectivité...');
    await axios.get(`${BASE_URL}/health`);
    logSuccess('Serveur accessible');

    // Test de charge normal
    const loadResults = await runLoadTest();

    // Test de stress si les performances sont bonnes
    if (loadResults.successRate >= 95) {
      logInfo('\n🔄 Lancement du test de stress...');
      const stressResults = await runStressTest();
      
      log('\n🎯 RECOMMANDATION FINALE', 'magenta');
      log('========================', 'magenta');
      
      if (stressResults.successRate >= 80) {
        logSuccess('✅ PRÊT POUR LA PRODUCTION');
        logInfo('L\'application gère bien la charge et le stress');
      } else {
        logWarning('⚠️  OPTIMISATIONS RECOMMANDÉES');
        logInfo('Considérer l\'optimisation avant le déploiement');
      }
    } else {
      logError('❌ OPTIMISATIONS CRITIQUES REQUISES');
      logInfo('L\'application nécessite des optimisations avant la production');
    }

  } catch (error) {
    logError(`Erreur lors du test de charge: ${error.message}`);
    process.exit(1);
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  logError(`Erreur non gérée: ${error.message}`);
  process.exit(1);
});

// Lancement
if (require.main === module) {
  main().catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runLoadTest,
  runStressTest,
  evaluatePerformance
}; 