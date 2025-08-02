const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class FrontendTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.baseUrl = 'http://localhost:3000';
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    this.results.details.push({ timestamp, type, message });
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.log('Navigateur initialisé avec succès');
      return true;
    } catch (error) {
      await this.log(`Erreur lors de l'initialisation: ${error.message}`, 'error');
      return false;
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      await this.log('Navigateur fermé');
    }
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

  async waitForElement(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      throw new Error(`Élément ${selector} non trouvé après ${timeout}ms`);
    }
  }

  async waitForNavigation(timeout = 5000) {
    try {
      await this.page.waitForNavigation({ timeout });
      return true;
    } catch (error) {
      throw new Error(`Navigation échouée après ${timeout}ms`);
    }
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, `screenshots/${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    await this.log(`📸 Screenshot sauvegardé: ${screenshotPath}`);
  }

  // Test 1: Vérification de l'accessibilité de l'application
  async testApplicationAccessibility() {
    await this.page.goto(this.baseUrl);
    await this.waitForElement('body');
    
    // Vérifier que l'application se charge
    const title = await this.page.title();
    if (!title || title === '') {
      throw new Error('Titre de la page manquant');
    }
    
    // Vérifier la présence d'éléments de base
    await this.waitForElement('div[data-testid="app"]', 3000);
    
    await this.takeScreenshot('01-application-accessibility');
  }

  // Test 2: Test de la page de connexion
  async testLoginPage() {
    await this.page.goto(`${this.baseUrl}/login`);
    await this.waitForElement('form');
    
    // Vérifier les éléments du formulaire de connexion
    await this.waitForElement('input[name="email"]');
    await this.waitForElement('input[name="password"]');
    await this.waitForElement('button[type="submit"]');
    
    // Test de validation des champs
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(1000);
    
    // Vérifier les messages d'erreur
    const errorMessages = await this.page.$$('.error-message, .MuiAlert-standardError');
    if (errorMessages.length === 0) {
      await this.log('Aucun message d\'erreur de validation trouvé');
    }
    
    await this.takeScreenshot('02-login-page');
  }

  // Test 3: Test de la page d'inscription
  async testRegisterPage() {
    await this.page.goto(`${this.baseUrl}/register`);
    await this.waitForElement('form');
    
    // Vérifier les champs du formulaire d'inscription
    const requiredFields = [
      'input[name="username"]',
      'input[name="email"]',
      'input[name="password"]',
      'input[name="confirmPassword"]',
      'select[name="region"]',
      'select[name="prefecture"]'
    ];
    
    for (const field of requiredFields) {
      await this.waitForElement(field);
    }
    
    await this.takeScreenshot('03-register-page');
  }

  // Test 4: Test de la navigation
  async testNavigation() {
    // Aller sur la page d'accueil
    await this.page.goto(this.baseUrl);
    
    // Vérifier la présence de la navigation
    await this.waitForElement('nav');
    
    // Tester les liens de navigation
    const navLinks = [
      { path: '/feed', name: 'Feed' },
      { path: '/alerts', name: 'Alertes' },
      { path: '/events', name: 'Événements' },
      { path: '/livestreams', name: 'Livestreams' },
      { path: '/map', name: 'Carte' },
      { path: '/messages', name: 'Messages' },
      { path: '/friends', name: 'Amis' },
      { path: '/profile', name: 'Profil' },
      { path: '/help', name: 'Aide' }
    ];
    
    for (const link of navLinks) {
      try {
        await this.page.click(`a[href="${link.path}"]`);
        await this.waitForNavigation();
        await this.log(`Navigation vers ${link.name} réussie`);
        await this.takeScreenshot(`04-nav-${link.name.toLowerCase()}`);
      } catch (error) {
        await this.log(`Navigation vers ${link.name} échouée: ${error.message}`, 'warning');
      }
    }
  }

  // Test 5: Test de la page Feed
  async testFeedPage() {
    await this.page.goto(`${this.baseUrl}/feed`);
    await this.waitForElement('div[data-testid="feed-container"]', 3000);
    
    // Vérifier la présence du formulaire de création de post
    try {
      await this.waitForElement('form[data-testid="create-post-form"]');
      await this.log('Formulaire de création de post trouvé');
    } catch (error) {
      await this.log('Formulaire de création de post non trouvé', 'warning');
    }
    
    // Vérifier la liste des posts
    try {
      await this.waitForElement('div[data-testid="posts-list"]');
      await this.log('Liste des posts trouvée');
    } catch (error) {
      await this.log('Liste des posts non trouvée', 'warning');
    }
    
    await this.takeScreenshot('05-feed-page');
  }

  // Test 6: Test de la page Alertes
  async testAlertsPage() {
    await this.page.goto(`${this.baseUrl}/alerts`);
    await this.waitForElement('div[data-testid="alerts-container"]', 3000);
    
    // Vérifier le formulaire de création d'alerte
    try {
      await this.waitForElement('form[data-testid="create-alert-form"]');
      await this.log('Formulaire de création d\'alerte trouvé');
    } catch (error) {
      await this.log('Formulaire de création d\'alerte non trouvé', 'warning');
    }
    
    // Vérifier la liste des alertes
    try {
      await this.waitForElement('div[data-testid="alerts-list"]');
      await this.log('Liste des alertes trouvée');
    } catch (error) {
      await this.log('Liste des alertes non trouvée', 'warning');
    }
    
    await this.takeScreenshot('06-alerts-page');
  }

  // Test 7: Test de la page Événements
  async testEventsPage() {
    await this.page.goto(`${this.baseUrl}/events`);
    await this.waitForElement('div[data-testid="events-container"]', 3000);
    
    // Vérifier le formulaire de création d'événement
    try {
      await this.waitForElement('form[data-testid="create-event-form"]');
      await this.log('Formulaire de création d\'événement trouvé');
    } catch (error) {
      await this.log('Formulaire de création d\'événement non trouvé', 'warning');
    }
    
    // Vérifier la liste des événements
    try {
      await this.waitForElement('div[data-testid="events-list"]');
      await this.log('Liste des événements trouvée');
    } catch (error) {
      await this.log('Liste des événements non trouvée', 'warning');
    }
    
    await this.takeScreenshot('07-events-page');
  }

  // Test 8: Test de la page Livestreams
  async testLivestreamsPage() {
    await this.page.goto(`${this.baseUrl}/livestreams`);
    await this.waitForElement('div[data-testid="livestreams-container"]', 3000);
    
    // Vérifier le formulaire de création de livestream
    try {
      await this.waitForElement('form[data-testid="create-livestream-form"]');
      await this.log('Formulaire de création de livestream trouvé');
    } catch (error) {
      await this.log('Formulaire de création de livestream non trouvé', 'warning');
    }
    
    // Vérifier la liste des livestreams
    try {
      await this.waitForElement('div[data-testid="livestreams-list"]');
      await this.log('Liste des livestreams trouvée');
    } catch (error) {
      await this.log('Liste des livestreams non trouvée', 'warning');
    }
    
    await this.takeScreenshot('08-livestreams-page');
  }

  // Test 9: Test de la page Carte
  async testMapPage() {
    await this.page.goto(`${this.baseUrl}/map`);
    await this.waitForElement('div[data-testid="map-container"]', 3000);
    
    // Vérifier la présence de la carte
    try {
      await this.waitForElement('.leaflet-container');
      await this.log('Carte Leaflet trouvée');
    } catch (error) {
      await this.log('Carte Leaflet non trouvée', 'warning');
    }
    
    // Vérifier les filtres de carte
    try {
      await this.waitForElement('div[data-testid="map-filters"]');
      await this.log('Filtres de carte trouvés');
    } catch (error) {
      await this.log('Filtres de carte non trouvés', 'warning');
    }
    
    await this.takeScreenshot('09-map-page');
  }

  // Test 10: Test de la page Messages
  async testMessagesPage() {
    await this.page.goto(`${this.baseUrl}/messages`);
    await this.waitForElement('div[data-testid="messages-container"]', 3000);
    
    // Vérifier la liste des conversations
    try {
      await this.waitForElement('div[data-testid="conversations-list"]');
      await this.log('Liste des conversations trouvée');
    } catch (error) {
      await this.log('Liste des conversations non trouvée', 'warning');
    }
    
    // Vérifier la zone de chat
    try {
      await this.waitForElement('div[data-testid="chat-area"]');
      await this.log('Zone de chat trouvée');
    } catch (error) {
      await this.log('Zone de chat non trouvée', 'warning');
    }
    
    await this.takeScreenshot('10-messages-page');
  }

  // Test 11: Test de la page Amis
  async testFriendsPage() {
    await this.page.goto(`${this.baseUrl}/friends`);
    await this.waitForElement('div[data-testid="friends-container"]', 3000);
    
    // Vérifier la liste des amis
    try {
      await this.waitForElement('div[data-testid="friends-list"]');
      await this.log('Liste des amis trouvée');
    } catch (error) {
      await this.log('Liste des amis non trouvée', 'warning');
    }
    
    // Vérifier les demandes d'amis
    try {
      await this.waitForElement('div[data-testid="friend-requests"]');
      await this.log('Demandes d\'amis trouvées');
    } catch (error) {
      await this.log('Demandes d\'amis non trouvées', 'warning');
    }
    
    await this.takeScreenshot('11-friends-page');
  }

  // Test 12: Test de la page Profil
  async testProfilePage() {
    await this.page.goto(`${this.baseUrl}/profile`);
    await this.waitForElement('div[data-testid="profile-container"]', 3000);
    
    // Vérifier les informations du profil
    try {
      await this.waitForElement('div[data-testid="profile-info"]');
      await this.log('Informations du profil trouvées');
    } catch (error) {
      await this.log('Informations du profil non trouvées', 'warning');
    }
    
    // Vérifier le formulaire de modification
    try {
      await this.waitForElement('form[data-testid="profile-form"]');
      await this.log('Formulaire de modification du profil trouvé');
    } catch (error) {
      await this.log('Formulaire de modification du profil non trouvé', 'warning');
    }
    
    await this.takeScreenshot('12-profile-page');
  }

  // Test 13: Test de la page Aide
  async testHelpPage() {
    await this.page.goto(`${this.baseUrl}/help`);
    await this.waitForElement('div[data-testid="help-container"]', 3000);
    
    // Vérifier le contenu d'aide
    try {
      await this.waitForElement('div[data-testid="help-content"]');
      await this.log('Contenu d\'aide trouvé');
    } catch (error) {
      await this.log('Contenu d\'aide non trouvé', 'warning');
    }
    
    await this.takeScreenshot('13-help-page');
  }

  // Test 14: Test de la page Modération (si accessible)
  async testModerationPage() {
    await this.page.goto(`${this.baseUrl}/moderation`);
    
    try {
      await this.waitForElement('div[data-testid="moderation-container"]', 3000);
      await this.log('Page de modération accessible');
      
      // Vérifier les outils de modération
      try {
        await this.waitForElement('div[data-testid="moderation-tools"]');
        await this.log('Outils de modération trouvés');
      } catch (error) {
        await this.log('Outils de modération non trouvés', 'warning');
      }
      
      await this.takeScreenshot('14-moderation-page');
    } catch (error) {
      await this.log('Page de modération non accessible (redirection attendue)', 'info');
    }
  }

  // Test 15: Test des notifications
  async testNotifications() {
    await this.page.goto(this.baseUrl);
    
    // Vérifier la présence du système de notifications
    try {
      await this.waitForElement('div[data-testid="notification-center"]');
      await this.log('Centre de notifications trouvé');
    } catch (error) {
      await this.log('Centre de notifications non trouvé', 'warning');
    }
    
    // Vérifier les toasts de notification
    try {
      await this.waitForElement('div[data-testid="notification-toast"]');
      await this.log('Toasts de notification trouvés');
    } catch (error) {
      await this.log('Toasts de notification non trouvés', 'warning');
    }
    
    await this.takeScreenshot('15-notifications');
  }

  // Test 16: Test de la responsivité
  async testResponsiveness() {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await this.page.goto(this.baseUrl);
      await this.waitForElement('body');
      
      await this.takeScreenshot(`16-responsiveness-${viewport.name}`);
      await this.log(`Test de responsivité pour ${viewport.name} terminé`);
    }
  }

  // Test 17: Test des performances
  async testPerformance() {
    await this.page.goto(this.baseUrl);
    
    // Mesurer le temps de chargement
    const startTime = Date.now();
    await this.waitForElement('body');
    const loadTime = Date.now() - startTime;
    
    await this.log(`Temps de chargement: ${loadTime}ms`);
    
    if (loadTime > 5000) {
      await this.log('Temps de chargement élevé', 'warning');
    }
    
    // Vérifier les erreurs de console
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await this.page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      await this.log(`Erreurs de console détectées: ${consoleErrors.length}`, 'warning');
      consoleErrors.forEach(error => {
        await this.log(`  - ${error}`, 'warning');
      });
    } else {
      await this.log('Aucune erreur de console détectée');
    }
  }

  // Test 18: Test de l'accessibilité
  async testAccessibility() {
    await this.page.goto(this.baseUrl);
    
    // Vérifier les attributs d'accessibilité
    const accessibilityChecks = [
      'img[alt]',
      'button[aria-label], button[aria-labelledby]',
      'input[aria-label], input[aria-labelledby]',
      'nav[role="navigation"]',
      'main[role="main"]'
    ];
    
    for (const selector of accessibilityChecks) {
      try {
        const elements = await this.page.$$(selector);
        if (elements.length > 0) {
          await this.log(`Éléments d'accessibilité trouvés: ${selector}`);
        } else {
          await this.log(`Éléments d'accessibilité manquants: ${selector}`, 'warning');
        }
      } catch (error) {
        await this.log(`Erreur lors de la vérification d'accessibilité: ${selector}`, 'warning');
      }
    }
    
    await this.takeScreenshot('18-accessibility');
  }

  async runAllTests() {
    await this.log('🚀 Début des tests du frontend communiConnect');
    
    // Créer le dossier screenshots
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    const tests = [
      { name: 'Accessibilité de l\'application', fn: () => this.testApplicationAccessibility() },
      { name: 'Page de connexion', fn: () => this.testLoginPage() },
      { name: 'Page d\'inscription', fn: () => this.testRegisterPage() },
      { name: 'Navigation', fn: () => this.testNavigation() },
      { name: 'Page Feed', fn: () => this.testFeedPage() },
      { name: 'Page Alertes', fn: () => this.testAlertsPage() },
      { name: 'Page Événements', fn: () => this.testEventsPage() },
      { name: 'Page Livestreams', fn: () => this.testLivestreamsPage() },
      { name: 'Page Carte', fn: () => this.testMapPage() },
      { name: 'Page Messages', fn: () => this.testMessagesPage() },
      { name: 'Page Amis', fn: () => this.testFriendsPage() },
      { name: 'Page Profil', fn: () => this.testProfilePage() },
      { name: 'Page Aide', fn: () => this.testHelpPage() },
      { name: 'Page Modération', fn: () => this.testModerationPage() },
      { name: 'Système de notifications', fn: () => this.testNotifications() },
      { name: 'Responsivité', fn: () => this.testResponsiveness() },
      { name: 'Performances', fn: () => this.testPerformance() },
      { name: 'Accessibilité', fn: () => this.testAccessibility() }
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
    const reportPath = path.join(__dirname, 'frontend-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE TEST DU FRONTEND');
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
    console.log(`📸 Screenshots sauvegardés dans: ${path.join(__dirname, 'screenshots')}`);
  }
}

// Fonction principale
async function runFrontendTests() {
  const testSuite = new FrontendTestSuite();
  
  try {
    const initialized = await testSuite.init();
    if (!initialized) {
      console.error('❌ Impossible d\'initialiser les tests');
      process.exit(1);
    }
    
    await testSuite.runAllTests();
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error.message);
  } finally {
    await testSuite.cleanup();
  }
}

// Vérifier que le serveur frontend est en cours d'exécution
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
    console.log('💡 Assurez-vous que le serveur frontend est démarré avec: npm start');
    process.exit(1);
  }
  
  console.log('✅ Serveur frontend détecté, lancement des tests...\n');
  
  await runFrontendTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FrontendTestSuite; 