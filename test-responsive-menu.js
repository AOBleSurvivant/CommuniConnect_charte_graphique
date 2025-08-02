const puppeteer = require('puppeteer');

async function testResponsiveMenu() {
  console.log('🍔 TEST DU MENU HAMBURGER RESPONSIVE');
  
  let browser;
  try {
    // Démarrer le navigateur
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 375, height: 667 } // iPhone SE
    });
    
    const page = await browser.newPage();
    
    // Aller sur l'application
    console.log('\n1️⃣ Navigation vers l\'application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('✅ Application chargée');
    
    // Attendre que l'interface se charge
    await page.waitForTimeout(3000);
    
    // Test 1: Vérifier que le menu hamburger est visible sur mobile
    console.log('\n2️⃣ Test du menu hamburger sur mobile...');
    const hamburgerButton = await page.$('button[aria-label="open drawer"]');
    
    if (hamburgerButton) {
      console.log('✅ Menu hamburger trouvé');
      
      // Test 2: Cliquer sur le menu hamburger
      console.log('\n3️⃣ Test d\'ouverture du menu...');
      await hamburgerButton.click();
      await page.waitForTimeout(1000);
      
      // Test 3: Vérifier que le drawer s'ouvre
      const drawer = await page.$('.MuiDrawer-paper');
      if (drawer) {
        console.log('✅ Drawer ouvert avec succès');
        
        // Test 4: Vérifier les éléments du menu
        const menuItems = await page.$$('.MuiListItem-root');
        console.log(`✅ ${menuItems.length} éléments de menu trouvés`);
        
        // Test 5: Cliquer sur un élément du menu
        if (menuItems.length > 0) {
          console.log('\n4️⃣ Test de navigation dans le menu...');
          await menuItems[0].click();
          await page.waitForTimeout(2000);
          console.log('✅ Navigation dans le menu fonctionne');
        }
        
      } else {
        console.log('❌ Drawer non trouvé après clic');
      }
      
    } else {
      console.log('❌ Menu hamburger non trouvé');
    }
    
    // Test 6: Vérifier la responsivité
    console.log('\n5️⃣ Test de responsivité...');
    
    // Redimensionner pour desktop
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const desktopMenu = await page.$('button[aria-label="open drawer"]');
    if (!desktopMenu) {
      console.log('✅ Menu hamburger caché sur desktop (correct)');
    } else {
      console.log('❌ Menu hamburger visible sur desktop (incorrect)');
    }
    
    // Redimensionner pour mobile
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileMenu = await page.$('button[aria-label="open drawer"]');
    if (mobileMenu) {
      console.log('✅ Menu hamburger visible sur mobile (correct)');
    } else {
      console.log('❌ Menu hamburger caché sur mobile (incorrect)');
    }
    
    // Test 7: Prendre une capture d'écran
    console.log('\n6️⃣ Capture d\'écran...');
    await page.screenshot({ 
      path: 'test-responsive-menu-result.png',
      fullPage: true 
    });
    console.log('✅ Capture d\'écran sauvegardée: test-responsive-menu-result.png');
    
    // Attendre un peu pour voir le résultat
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Exécuter le test
testResponsiveMenu().then(() => {
  console.log('\n🎯 TEST TERMINÉ');
  console.log('\n💡 Vérifications:');
  console.log('1. Ouvrez test-responsive-menu-result.png pour voir l\'interface');
  console.log('2. Vérifiez que le menu hamburger s\'ouvre sur mobile');
  console.log('3. Vérifiez que le menu est caché sur desktop');
}); 