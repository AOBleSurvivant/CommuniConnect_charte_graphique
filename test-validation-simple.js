const puppeteer = require('puppeteer');

async function testEventValidation() {
  let browser;
  
  try {
    console.log('🧪 Test de validation du formulaire des événements...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Aller à la page des événements
    console.log('📱 Navigation vers la page des événements...');
    await page.goto('http://localhost:3000/events', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Chercher le bouton pour créer un événement
    console.log('🔍 Recherche du bouton de création...');
    const createButton = await page.$('button:has-text("Créer"), button:has-text("Nouvel événement"), button:has-text("Ajouter")');
    
    if (!createButton) {
      console.log('❌ Bouton de création non trouvé');
      console.log('🔍 Recherche de tous les boutons disponibles...');
      const allButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.map(btn => btn.textContent);
      });
      console.log('Boutons trouvés:', allButtons);
      return;
    }
    
    console.log('✅ Bouton de création trouvé');
    await createButton.click();
    await page.waitForTimeout(2000);
    
    // Test de validation avec formulaire vide
    console.log('📝 Test de soumission avec formulaire vide...');
    const submitButton = await page.$('button[type="submit"], button:has-text("Publier")');
    
    if (submitButton) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Vérifier les messages d'erreur
      const errorMessages = await page.evaluate(() => {
        const errors = Array.from(document.querySelectorAll('.MuiFormHelperText-root.Mui-error, .MuiAlert-message'));
        return errors.map(el => el.textContent);
      });
      
      console.log('Messages d\'erreur trouvés:', errorMessages);
      
      if (errorMessages.length > 0) {
        console.log('✅ Validation fonctionne - Messages d\'erreur affichés');
      } else {
        console.log('❌ Aucun message d\'erreur pour formulaire vide');
      }
    } else {
      console.log('❌ Bouton de soumission non trouvé');
    }
    
    // Test de remplissage correct
    console.log('📝 Test de remplissage correct...');
    
    // Remplir le titre
    await page.type('input[name="title"]', 'Test Événement Validation');
    await page.waitForTimeout(500);
    
    // Remplir la description
    await page.type('textarea[name="description"]', 'Description de test pour valider le formulaire des événements avec une description suffisamment longue pour passer la validation.');
    await page.waitForTimeout(500);
    
    // Sélectionner un type
    const typeSelect = await page.$('select[name="type"]');
    if (typeSelect) {
      await typeSelect.click();
      await page.waitForTimeout(500);
      const option = await page.$('li[data-value="reunion"]');
      if (option) {
        await option.click();
        console.log('✅ Type sélectionné');
      }
    }
    
    // Sélectionner une date future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await page.evaluate((date) => {
      const dateField = document.querySelector('input[name="date"]');
      if (dateField) {
        dateField.value = date;
        dateField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, tomorrowStr);
    
    // Sélectionner une heure
    await page.evaluate(() => {
      const timeField = document.querySelector('input[name="time"]');
      if (timeField) {
        timeField.value = '14:00';
        timeField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    console.log('✅ Formulaire rempli correctement');
    
    // Vérifier qu'il n'y a plus d'erreurs
    const remainingErrors = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('.MuiFormHelperText-root.Mui-error'));
      return errors.length;
    });
    
    console.log(`Erreurs restantes: ${remainingErrors}`);
    
    if (remainingErrors === 0) {
      console.log('✅ Formulaire valide sans erreurs');
    } else {
      console.log('❌ Encore des erreurs dans le formulaire');
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
testEventValidation();