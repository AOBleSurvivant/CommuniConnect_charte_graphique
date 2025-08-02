const puppeteer = require('puppeteer');

// Configuration
const FRONTEND_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:5000/api';

// Données de test
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test-ui@example.com',
  phone: '+22412345679',
  password: 'password123',
  region: 'Conakry',
  prefecture: 'Conakry',
  commune: 'Kaloum',
  quartier: 'Centre',
  address: 'Centre, Kaloum, Conakry, Guinée',
  latitude: 9.5370,
  longitude: -13.6785
};

let browser = null;
let page = null;

// Initialiser le navigateur
const initBrowser = async () => {
  console.log('🌐 Initialisation du navigateur...');
  browser = await puppeteer.launch({
    headless: false, // Pour voir ce qui se passe
    slowMo: 100, // Ralentir les actions pour mieux voir
    defaultViewport: { width: 1280, height: 720 }
  });
  page = await browser.newPage();
  
  // Intercepter les erreurs de console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Erreur navigateur:', msg.text());
    }
  });
  
  console.log('✅ Navigateur initialisé');
};

// Fermer le navigateur
const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    console.log('✅ Navigateur fermé');
  }
};

// Test 1: Vérifier que la page se charge
const testPageLoad = async () => {
  console.log('\n🔍 Test 1: Chargement de la page');
  
  try {
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    console.log('✅ Page chargée avec succès');
    
    // Vérifier que le titre est présent
    const title = await page.title();
    console.log('📄 Titre de la page:', title);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du chargement de la page:', error.message);
    return false;
  }
};

// Test 2: Test de la page d'inscription avec LocationSelector
const testRegistrationPage = async () => {
  console.log('\n🔍 Test 2: Page d\'inscription avec LocationSelector');
  
  try {
    // Aller à la page d'inscription
    await page.goto(`${FRONTEND_URL}/register`, { waitUntil: 'networkidle2' });
    console.log('✅ Page d\'inscription chargée');
    
    // Attendre que le LocationSelector soit chargé
    await page.waitForSelector('[data-testid="location-selector"]', { timeout: 10000 });
    console.log('✅ LocationSelector détecté');
    
    // Vérifier que les données géographiques sont chargées
    const regionSelect = await page.$('select[name="region"]');
    if (regionSelect) {
      console.log('✅ Sélecteur de région présent');
      
      // Vérifier les options disponibles
      const regionOptions = await page.$$eval('select[name="region"] option', options => 
        options.map(option => option.textContent)
      );
      console.log('📍 Régions disponibles:', regionOptions.slice(0, 5)); // Afficher les 5 premières
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test de la page d\'inscription:', error.message);
    return false;
  }
};

// Test 3: Test de la sélection en cascade
const testCascadeSelection = async () => {
  console.log('\n🔍 Test 3: Test de la sélection en cascade');
  
  try {
    // Sélectionner une région
    await page.select('select[name="region"]', 'Conakry');
    console.log('✅ Région sélectionnée: Conakry');
    
    // Attendre que les préfectures se chargent
    await page.waitForFunction(() => {
      const prefectureSelect = document.querySelector('select[name="prefecture"]');
      return prefectureSelect && prefectureSelect.options.length > 1;
    }, { timeout: 5000 });
    
    // Sélectionner une préfecture
    await page.select('select[name="prefecture"]', 'Conakry');
    console.log('✅ Préfecture sélectionnée: Conakry');
    
    // Attendre que les communes se chargent
    await page.waitForFunction(() => {
      const communeSelect = document.querySelector('select[name="commune"]');
      return communeSelect && communeSelect.options.length > 1;
    }, { timeout: 5000 });
    
    // Sélectionner une commune
    await page.select('select[name="commune"]', 'Kaloum');
    console.log('✅ Commune sélectionnée: Kaloum');
    
    // Attendre que les quartiers se chargent
    await page.waitForFunction(() => {
      const quartierSelect = document.querySelector('select[name="quartier"]');
      return quartierSelect && quartierSelect.options.length > 1;
    }, { timeout: 5000 });
    
    // Sélectionner un quartier
    await page.select('select[name="quartier"]', 'Centre');
    console.log('✅ Quartier sélectionné: Centre');
    
    // Vérifier que l'adresse est générée automatiquement
    await page.waitForFunction(() => {
      const addressField = document.querySelector('textarea[name="address"]');
      return addressField && addressField.value.length > 0;
    }, { timeout: 5000 });
    
    const addressValue = await page.$eval('textarea[name="address"]', el => el.value);
    console.log('📍 Adresse générée:', addressValue);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test de sélection en cascade:', error.message);
    return false;
  }
};

// Test 4: Test du bouton GPS
const testGPSButton = async () => {
  console.log('\n🔍 Test 4: Test du bouton GPS');
  
  try {
    // Vérifier que le bouton GPS est présent
    const gpsButton = await page.$('button[aria-label*="Détecter"]');
    if (gpsButton) {
      console.log('✅ Bouton GPS détecté');
      
      // Cliquer sur le bouton GPS
      await gpsButton.click();
      console.log('✅ Bouton GPS cliqué');
      
      // Attendre un peu pour voir la réaction
      await page.waitForTimeout(2000);
      
      // Vérifier s'il y a un message (succès ou erreur)
      const alertElement = await page.$('.MuiAlert-root');
      if (alertElement) {
        const alertText = await page.$eval('.MuiAlert-root', el => el.textContent);
        console.log('📍 Message GPS:', alertText);
      }
      
      return true;
    } else {
      console.log('⚠️ Bouton GPS non trouvé');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test du bouton GPS:', error.message);
    return false;
  }
};

// Test 5: Test de la page de création d'événement
const testEventCreationPage = async () => {
  console.log('\n🔍 Test 5: Page de création d\'événement');
  
  try {
    // Aller à la page des événements
    await page.goto(`${FRONTEND_URL}/events`, { waitUntil: 'networkidle2' });
    console.log('✅ Page des événements chargée');
    
    // Cliquer sur le bouton de création d'événement
    const createButton = await page.$('button[aria-label*="Créer"]');
    if (createButton) {
      await createButton.click();
      console.log('✅ Bouton de création cliqué');
      
      // Attendre que le formulaire s'ouvre
      await page.waitForSelector('form', { timeout: 5000 });
      console.log('✅ Formulaire de création ouvert');
      
      // Vérifier que le LocationSelector est présent
      const locationSelector = await page.$('[data-testid="location-selector"]');
      if (locationSelector) {
        console.log('✅ LocationSelector présent dans le formulaire d\'événement');
        return true;
      } else {
        console.log('⚠️ LocationSelector non trouvé dans le formulaire');
        return false;
      }
    } else {
      console.log('⚠️ Bouton de création non trouvé');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test de la page de création d\'événement:', error.message);
    return false;
  }
};

// Test 6: Test de la page de création d'alerte
const testAlertCreationPage = async () => {
  console.log('\n🔍 Test 6: Page de création d\'alerte');
  
  try {
    // Aller à la page des alertes
    await page.goto(`${FRONTEND_URL}/alerts`, { waitUntil: 'networkidle2' });
    console.log('✅ Page des alertes chargée');
    
    // Cliquer sur le bouton de création d'alerte
    const createButton = await page.$('button[aria-label*="Créer"]');
    if (createButton) {
      await createButton.click();
      console.log('✅ Bouton de création d\'alerte cliqué');
      
      // Attendre que le formulaire s'ouvre
      await page.waitForSelector('form', { timeout: 5000 });
      console.log('✅ Formulaire de création d\'alerte ouvert');
      
      // Vérifier que le LocationSelector est présent
      const locationSelector = await page.$('[data-testid="location-selector"]');
      if (locationSelector) {
        console.log('✅ LocationSelector présent dans le formulaire d\'alerte');
        return true;
      } else {
        console.log('⚠️ LocationSelector non trouvé dans le formulaire d\'alerte');
        return false;
      }
    } else {
      console.log('⚠️ Bouton de création d\'alerte non trouvé');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test de la page de création d\'alerte:', error.message);
    return false;
  }
};

// Test principal
const runUITests = async () => {
  console.log('🚀 DÉBUT DES TESTS UI LOCATIONSELECTOR');
  console.log('=' .repeat(50));
  
  const results = {
    pageLoad: false,
    registration: false,
    cascadeSelection: false,
    gpsButton: false,
    eventCreation: false,
    alertCreation: false
  };
  
  try {
    await initBrowser();
    
    // Test 1: Chargement de la page
    results.pageLoad = await testPageLoad();
    
    // Test 2: Page d'inscription
    results.registration = await testRegistrationPage();
    
    // Test 3: Sélection en cascade
    results.cascadeSelection = await testCascadeSelection();
    
    // Test 4: Bouton GPS
    results.gpsButton = await testGPSButton();
    
    // Test 5: Création d'événement
    results.eventCreation = await testEventCreationPage();
    
    // Test 6: Création d'alerte
    results.alertCreation = await testAlertCreationPage();
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await closeBrowser();
  }
  
  // Résumé des résultats
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RÉSUMÉ DES TESTS UI');
  console.log('=' .repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`📈 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Détail des tests:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'RÉUSSI' : 'ÉCHOUÉ'}`);
  });
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS UI SONT RÉUSSIS !');
    console.log('🚀 L\'interface utilisateur du LocationSelector fonctionne parfaitement !');
  } else {
    console.log('\n⚠️ Certains tests UI ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  return results;
};

// Exécuter les tests
if (require.main === module) {
  runUITests().catch(console.error);
}

module.exports = { runUITests };