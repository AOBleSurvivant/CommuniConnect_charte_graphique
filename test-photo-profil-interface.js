const puppeteer = require('puppeteer');

async function testPhotoProfilInterface() {
  console.log('🔍 TEST PHOTO DE PROFIL DANS L\'INTERFACE');
  
  let browser;
  try {
    // Démarrer le navigateur
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Aller sur l'application
    console.log('\n1️⃣ Navigation vers l\'application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('✅ Application chargée');
    
    // Attendre que l'interface se charge
    await page.waitForTimeout(3000);
    
    // Test 1: Vérifier les avatars dans la navigation
    console.log('\n2️⃣ Test des avatars dans la navigation...');
    const navAvatars = await page.$$('img[src*="avatars"], .MuiAvatar-img');
    console.log(`✅ ${navAvatars.length} avatars trouvés dans la navigation`);
    
    // Test 2: Vérifier les avatars dans les posts (si disponibles)
    console.log('\n3️⃣ Test des avatars dans les posts...');
    const postAvatars = await page.$$('img[src*="avatars"], .MuiAvatar-img');
    console.log(`✅ ${postAvatars.length} avatars trouvés dans les posts`);
    
    // Test 3: Vérifier les URLs des images
    console.log('\n4️⃣ Vérification des URLs des images...');
    const images = await page.$$eval('img[src*="avatars"]', imgs => 
      imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }))
    );
    
    images.forEach((img, index) => {
      console.log(`Image ${index + 1}:`);
      console.log(`  URL: ${img.src}`);
      console.log(`  Dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
      console.log(`  Statut: ${img.naturalWidth > 0 ? '✅ Chargée' : '❌ Non chargée'}`);
    });
    
    // Test 4: Vérifier les erreurs de chargement
    console.log('\n5️⃣ Vérification des erreurs de chargement...');
    const failedImages = await page.$$eval('img[src*="avatars"]', imgs => 
      imgs.filter(img => img.naturalWidth === 0).map(img => img.src)
    );
    
    if (failedImages.length > 0) {
      console.log('❌ Images qui n\'ont pas pu être chargées:');
      failedImages.forEach(url => console.log(`  - ${url}`));
    } else {
      console.log('✅ Toutes les images se sont chargées correctement');
    }
    
    // Test 5: Prendre une capture d'écran
    console.log('\n6️⃣ Capture d\'écran...');
    await page.screenshot({ 
      path: 'test-photo-profil-result.png',
      fullPage: true 
    });
    console.log('✅ Capture d\'écran sauvegardée: test-photo-profil-result.png');
    
    // Attendre un peu pour voir le résultat
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Exécuter le test
testPhotoProfilInterface().then(() => {
  console.log('\n🎯 TEST TERMINÉ');
  console.log('\n💡 Vérifications:');
  console.log('1. Ouvrez test-photo-profil-result.png pour voir l\'interface');
  console.log('2. Vérifiez que les avatars s\'affichent correctement');
  console.log('3. Vérifiez les logs dans la console du navigateur');
}); 