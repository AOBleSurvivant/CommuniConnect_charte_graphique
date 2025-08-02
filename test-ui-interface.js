const puppeteer = require('puppeteer');

async function testUI() {
  let browser;
  
  try {
    console.log('🧪 Test de l\'interface utilisateur...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Aller à la page de profil
    console.log('📱 Navigation vers la page de profil...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Vérifier les erreurs dans la console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Attendre un peu pour capturer les erreurs
    await page.waitForTimeout(5000);
    
    if (errors.length > 0) {
      console.log('⚠️ Erreurs détectées dans la console:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ Aucune erreur détectée dans la console');
    }
    
    // Vérifier les images
    console.log('🔍 Vérification des images...');
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }))
    );
    
    const brokenImages = images.filter(img => img.naturalWidth === 0 || img.naturalHeight === 0);
    if (brokenImages.length > 0) {
      console.log('⚠️ Images cassées détectées:');
      brokenImages.forEach(img => console.log('  -', img.src));
    } else {
      console.log('✅ Toutes les images se chargent correctement');
    }
    
    console.log('✅ Test d\'interface terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

testUI().catch(console.error);
