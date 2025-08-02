const puppeteer = require('puppeteer');

async function testFriendsRoute() {
  let browser;
  
  try {
    console.log('🧪 Test de la route /friends...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Intercepter les erreurs de console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Erreur console:', msg.text());
      }
    });
    
    // Intercepter les erreurs de page
    page.on('pageerror', error => {
      console.log('❌ Erreur page:', error.message);
    });
    
    // Aller à la page d'amis
    console.log('📱 Navigation vers /friends...');
    await page.goto('http://localhost:3000/friends', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Vérifier l'URL finale
    const currentUrl = page.url();
    console.log('📍 URL actuelle:', currentUrl);
    
    // Vérifier le contenu de la page
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasError: document.body.textContent.includes('Route non trouvée') || 
                  document.body.textContent.includes('404') ||
                  document.body.textContent.includes('Page non trouvée'),
        hasFriendsContent: document.body.textContent.includes('Amis') ||
                          document.body.textContent.includes('Mes Amis'),
        bodyText: document.body.textContent.substring(0, 300)
      };
    });
    
    console.log('📄 Analyse de la page:');
    console.log('  Titre:', pageContent.title);
    console.log('  URL:', pageContent.url);
    console.log('  A une erreur:', pageContent.hasError);
    console.log('  A du contenu amis:', pageContent.hasFriendsContent);
    console.log('  Contenu:', pageContent.bodyText);
    
    if (pageContent.hasError) {
      console.log('❌ ERREUR DÉTECTÉE: La page affiche une erreur');
    } else if (pageContent.hasFriendsContent) {
      console.log('✅ SUCCÈS: La page d\'amis se charge correctement');
    } else {
      console.log('⚠️ ATTENTION: La page se charge mais sans contenu d\'amis');
    }
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'friends-route-test.png', fullPage: true });
    console.log('📸 Capture d\'écran sauvegardée: friends-route-test.png');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Lancer le test
testFriendsRoute();