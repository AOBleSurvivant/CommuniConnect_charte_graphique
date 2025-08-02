const puppeteer = require('puppeteer');

async function testSharingSystem() {
  let browser;
  
  try {
    console.log('🧪 Test du système de partage amélioré...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Aller à la page d'accueil
    console.log('📱 Navigation vers la page d\'accueil...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Vérifier s'il y a des posts
    console.log('🔍 Vérification des posts...');
    const posts = await page.$$('.MuiCard-root');
    
    if (posts.length === 0) {
      console.log('❌ Aucun post trouvé');
      return;
    }
    
    console.log(`✅ ${posts.length} posts trouvés`);
    
    // Cliquer sur le bouton partager du premier post
    console.log('📤 Test du bouton partager...');
    const shareButtons = await page.$$('button:has-text("Partager")');
    
    if (shareButtons.length === 0) {
      console.log('❌ Bouton partager non trouvé');
      return;
    }
    
    console.log('✅ Bouton partager trouvé');
    await shareButtons[0].click();
    await page.waitForTimeout(2000);
    
    // Vérifier que le dialogue de partage s'ouvre
    console.log('🔍 Vérification du dialogue de partage...');
    const shareDialog = await page.$('.MuiDialog-root');
    
    if (shareDialog) {
      console.log('✅ Dialogue de partage ouvert');
      
      // Vérifier les options de partage interne
      console.log('🔍 Vérification des options de partage interne...');
      const repostButton = await page.$('button:has-text("Reposter")');
      
      if (repostButton) {
        console.log('✅ Bouton reposter trouvé');
      } else {
        console.log('❌ Bouton reposter non trouvé');
      }
      
      // Vérifier les options de partage externe
      console.log('🔍 Vérification des options de partage externe...');
      const externalOptions = await page.$$('li');
      const hasWhatsApp = await page.$('li:has-text("WhatsApp")');
      const hasFacebook = await page.$('li:has-text("Facebook")');
      const hasTwitter = await page.$('li:has-text("Twitter")');
      const hasEmail = await page.$('li:has-text("Email")');
      const hasCopyLink = await page.$('li:has-text("Copier le lien")');
      
      console.log('📱 Options de partage externe:');
      console.log(`  WhatsApp: ${hasWhatsApp ? '✅' : '❌'}`);
      console.log(`  Facebook: ${hasFacebook ? '✅' : '❌'}`);
      console.log(`  Twitter: ${hasTwitter ? '✅' : '❌'}`);
      console.log(`  Email: ${hasEmail ? '✅' : '❌'}`);
      console.log(`  Copier lien: ${hasCopyLink ? '✅' : '❌'}`);
      
      // Test du repost
      console.log('📝 Test du repost...');
      if (repostButton) {
        // Remplir le champ de commentaire
        const commentField = await page.$('textarea, input[type="text"]');
        if (commentField) {
          await commentField.type('Test de repost avec commentaire');
          await page.waitForTimeout(1000);
        }
        
        // Cliquer sur reposter
        await repostButton.click();
        await page.waitForTimeout(3000);
        
        // Vérifier si un message de succès apparaît
        const successMessage = await page.evaluate(() => {
          const alerts = Array.from(document.querySelectorAll('.MuiAlert-root, .MuiSnackbar-root'));
          return alerts.find(alert => 
            alert.textContent.includes('succès') || 
            alert.textContent.includes('reposté')
          );
        });
        
        if (successMessage) {
          console.log('✅ Repost créé avec succès');
        } else {
          console.log('❌ Repost échoué');
        }
      }
      
      // Fermer le dialogue
      const closeButton = await page.$('button:has-text("Fermer")');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
      
    } else {
      console.log('❌ Dialogue de partage non ouvert');
    }
    
    // Vérifier s'il y a des reposts dans le flux
    console.log('🔍 Vérification des reposts dans le flux...');
    const repostElements = await page.$$('[data-testid="RepostIcon"], .MuiSvgIcon-root:has-text("Repost")');
    
    if (repostElements.length > 0) {
      console.log(`✅ ${repostElements.length} reposts trouvés dans le flux`);
    } else {
      console.log('ℹ️ Aucun repost trouvé dans le flux (normal si aucun repost n\'a été créé)');
    }
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'sharing-system-test.png', fullPage: true });
    console.log('📸 Capture d\'écran sauvegardée: sharing-system-test.png');
    
    console.log('✅ Test du système de partage terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Lancer le test
testSharingSystem();