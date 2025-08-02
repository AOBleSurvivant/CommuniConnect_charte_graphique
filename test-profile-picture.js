const puppeteer = require('puppeteer');

async function testProfilePicture() {
  let browser;
  
  try {
    console.log('🧪 Test du chargement de la photo de profil...');
    
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
    
    // Vérifier si l'avatar est affiché
    console.log('🔍 Vérification de l\'avatar...');
    const avatar = await page.$('img[src*="placeholder"], .MuiAvatar-img');
    
    if (avatar) {
      console.log('✅ Avatar trouvé');
      
      // Vérifier si l'image se charge correctement
      const imageLoaded = await page.evaluate(() => {
        const img = document.querySelector('img[src*="placeholder"], .MuiAvatar-img');
        if (img) {
          return img.complete && img.naturalHeight !== 0;
        }
        return false;
      });
      
      if (imageLoaded) {
        console.log('✅ Image de profil chargée correctement');
      } else {
        console.log('❌ Image de profil ne se charge pas');
      }
    } else {
      console.log('❌ Avatar non trouvé');
    }
    
    // Vérifier le bouton d'upload
    console.log('🔍 Vérification du bouton d\'upload...');
    const uploadButton = await page.$('button[aria-label*="photo"], .MuiBadge-badge button');
    
    if (uploadButton) {
      console.log('✅ Bouton d\'upload trouvé');
      
      // Cliquer sur le bouton d'upload
      await uploadButton.click();
      await page.waitForTimeout(1000);
      
      // Vérifier si l'input file est présent
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        console.log('✅ Input file trouvé');
      } else {
        console.log('❌ Input file non trouvé');
      }
    } else {
      console.log('❌ Bouton d\'upload non trouvé');
    }
    
    // Test d'upload d'image
    console.log('📝 Test d\'upload d\'image...');
    
    // Créer un fichier de test
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]');
      if (input) {
        // Créer un fichier de test
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Vérifier si un message de succès apparaît
    const successMessage = await page.evaluate(() => {
      const alerts = Array.from(document.querySelectorAll('.MuiAlert-root'));
      return alerts.find(alert => 
        alert.textContent.includes('succès') || 
        alert.textContent.includes('mise à jour')
      );
    });
    
    if (successMessage) {
      console.log('✅ Message de succès affiché');
    } else {
      console.log('❌ Aucun message de succès');
    }
    
    console.log('✅ Test terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Lancer le test
testProfilePicture();