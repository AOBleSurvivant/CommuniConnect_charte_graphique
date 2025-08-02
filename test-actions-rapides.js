const puppeteer = require('puppeteer');

async function testActionsRapides() {
  console.log('🧪 Test des actions rapides...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test 1: Actions rapides sur la page d'accueil
    console.log('📱 Test des actions rapides sur la page d\'accueil...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Vérifier que les boutons d'actions rapides sont présents
    const actionsRapides = await page.$$('button');
    let actionsRapidesTrouvees = 0;
    
    for (const button of actionsRapides) {
      const text = await button.evaluate(el => el.textContent);
      if (text && (text.includes('Créer une alerte') || text.includes('Créer un événement') || text.includes('Demander de l\'aide') || text.includes('Voir la carte'))) {
        actionsRapidesTrouvees++;
        console.log(`✅ Bouton trouvé: ${text}`);
      }
    }
    
    console.log(`📊 Actions rapides trouvées: ${actionsRapidesTrouvees}/4`);
    
    // Test 2: Navigation vers la page d'alertes
    console.log('🚨 Test de navigation vers les alertes...');
    const boutonAlerte = await page.$('button:has-text("Créer une alerte")');
    if (boutonAlerte) {
      await boutonAlerte.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/alerts')) {
        console.log('✅ Navigation vers les alertes réussie');
        
        // Vérifier la présence du bouton FAB
        const fab = await page.$('button[aria-label*="Créer"]');
        if (fab) {
          console.log('✅ Bouton FAB de création d\'alerte trouvé');
        } else {
          console.log('❌ Bouton FAB de création d\'alerte non trouvé');
        }
      } else {
        console.log('❌ Navigation vers les alertes échouée');
      }
    }
    
    // Test 3: Navigation vers la page d'événements
    console.log('📅 Test de navigation vers les événements...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    
    const boutonEvenement = await page.$('button:has-text("Créer un événement")');
    if (boutonEvenement) {
      await boutonEvenement.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/events')) {
        console.log('✅ Navigation vers les événements réussie');
        
        // Vérifier la présence du bouton FAB
        const fab = await page.$('button[aria-label*="Créer"]');
        if (fab) {
          console.log('✅ Bouton FAB de création d\'événement trouvé');
        } else {
          console.log('❌ Bouton FAB de création d\'événement non trouvé');
        }
      } else {
        console.log('❌ Navigation vers les événements échouée');
      }
    }
    
    // Test 4: Actions rapides sur la carte
    console.log('🗺️ Test des actions rapides sur la carte...');
    await page.goto('http://localhost:3000/map');
    await page.waitForTimeout(2000);
    
    // Vérifier la présence du SpeedDial
    const speedDial = await page.$('[aria-label="Actions rapides"]');
    if (speedDial) {
      console.log('✅ SpeedDial des actions rapides trouvé');
      
      // Cliquer sur le SpeedDial pour ouvrir les actions
      await speedDial.click();
      await page.waitForTimeout(1000);
      
      // Vérifier les actions disponibles
      const actions = await page.$$('[role="menuitem"]');
      console.log(`📊 Actions rapides sur la carte: ${actions.length} trouvées`);
      
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const tooltip = await action.getAttribute('aria-label');
        console.log(`  - ${tooltip}`);
      }
    } else {
      console.log('❌ SpeedDial des actions rapides non trouvé');
    }
    
    console.log('\n🎉 Test des actions rapides terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await browser.close();
  }
}

// Lancer le test
testActionsRapides().catch(console.error); 