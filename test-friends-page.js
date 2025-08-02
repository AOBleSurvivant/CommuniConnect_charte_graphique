const puppeteer = require('puppeteer');

async function testFriendsPage() {
  let browser;
  
  try {
    console.log('🧪 Test de la page d\'amis...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Aller à la page d'amis
    console.log('📱 Navigation vers la page d\'amis...');
    await page.goto('http://localhost:3000/friends', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Vérifier si la page se charge
    console.log('🔍 Vérification du contenu de la page...');
    
    // Vérifier s'il y a une erreur 404
    const error404 = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('*');
      return Array.from(errorElements).some(el => 
        el.textContent.includes('Route non trouvée') ||
        el.textContent.includes('404') ||
        el.textContent.includes('Page non trouvée')
      );
    });
    
    if (error404) {
      console.log('❌ Erreur 404 détectée');
    } else {
      console.log('✅ Pas d\'erreur 404');
    }
    
    // Vérifier le contenu de la page
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent,
        body: document.body.textContent.substring(0, 200)
      };
    });
    
    console.log('📄 Contenu de la page:');
    console.log('  Titre:', pageContent.title);
    console.log('  H1:', pageContent.h1);
    console.log('  Début du contenu:', pageContent.body);
    
    // Vérifier s'il y a des éléments de la page d'amis
    const friendsElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => 
        el.textContent.includes('Amis') ||
        el.textContent.includes('Mes Amis') ||
        el.textContent.includes('Demandes d\'amis')
      );
    });
    
    if (friendsElements) {
      console.log('✅ Éléments de la page d\'amis trouvés');
    } else {
      console.log('❌ Éléments de la page d\'amis non trouvés');
    }
    
    // Vérifier les erreurs dans la console
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('❌ Erreurs dans la console:', consoleErrors);
    } else {
      console.log('✅ Aucune erreur dans la console');
    }
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'friends-page-test.png', fullPage: true });
    console.log('📸 Capture d\'écran sauvegardée: friends-page-test.png');
    
    console.log('✅ Test terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Lancer le test
testFriendsPage();