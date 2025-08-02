const puppeteer = require('puppeteer');

class TestValidationEvents {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      validation: {
        success: false,
        details: []
      },
      submission: {
        success: false,
        details: []
      },
      overall: {
        score: 0,
        total: 0
      }
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
  }

  async testValidation() {
    try {
      console.log('🧪 Test de validation du formulaire des événements...');
      
      // Aller à la page des événements
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle0' });
      await this.page.waitForTimeout(2000);

      // Chercher le bouton pour créer un événement
      const createButton = await this.page.$('button:has-text("Créer"), button:has-text("Nouvel événement"), button:has-text("Ajouter")');
      if (createButton) {
        await createButton.click();
        await this.page.waitForTimeout(1000);
        this.results.validation.details.push('✅ Formulaire ouvert');
      } else {
        this.results.validation.details.push('❌ Bouton de création non trouvé');
        return;
      }

      // Test 1: Soumission avec formulaire vide
      console.log('📝 Test 1: Soumission avec formulaire vide');
      const submitButton = await this.page.$('button[type="submit"], button:has-text("Publier")');
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForTimeout(1000);
        
        // Vérifier les messages d'erreur
        const errorMessages = await this.page.evaluate(() => {
          const errors = Array.from(document.querySelectorAll('.MuiFormHelperText-root.Mui-error, .MuiAlert-message'));
          return errors.map(el => el.textContent);
        });
        
        console.log('Messages d\'erreur trouvés:', errorMessages);
        
        if (errorMessages.length > 0) {
          this.results.validation.details.push('✅ Messages d\'erreur affichés pour formulaire vide');
        } else {
          this.results.validation.details.push('❌ Aucun message d\'erreur pour formulaire vide');
        }
      }

      // Test 2: Validation du titre trop court
      console.log('📝 Test 2: Titre trop court');
      await this.page.type('input[name="title"]', 'Test');
      await this.page.waitForTimeout(500);
      
      const titleError = await this.page.evaluate(() => {
        const titleField = document.querySelector('input[name="title"]');
        if (titleField) {
          const helperText = titleField.closest('.MuiFormControl-root')?.querySelector('.MuiFormHelperText-root');
          return helperText?.textContent;
        }
        return null;
      });
      
      if (titleError && titleError.includes('5 caractères')) {
        this.results.validation.details.push('✅ Validation titre trop court fonctionne');
      } else {
        this.results.validation.details.push('❌ Validation titre trop court échoue');
      }

      // Test 3: Validation de la description trop courte
      console.log('📝 Test 3: Description trop courte');
      await this.page.type('textarea[name="description"]', 'Court');
      await this.page.waitForTimeout(500);
      
      const descError = await this.page.evaluate(() => {
        const descField = document.querySelector('textarea[name="description"]');
        if (descField) {
          const helperText = descField.closest('.MuiFormControl-root')?.querySelector('.MuiFormHelperText-root');
          return helperText?.textContent;
        }
        return null;
      });
      
      if (descError && descError.includes('10 caractères')) {
        this.results.validation.details.push('✅ Validation description trop courte fonctionne');
      } else {
        this.results.validation.details.push('❌ Validation description trop courte échoue');
      }

      // Test 4: Validation de la date dans le passé
      console.log('📝 Test 4: Date dans le passé');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      await this.page.evaluate((date) => {
        const dateField = document.querySelector('input[name="date"]');
        if (dateField) {
          dateField.value = date;
          dateField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, yesterdayStr);
      
      await this.page.waitForTimeout(500);
      
      const dateError = await this.page.evaluate(() => {
        const dateField = document.querySelector('input[name="date"]');
        if (dateField) {
          const helperText = dateField.closest('.MuiFormControl-root')?.querySelector('.MuiFormHelperText-root');
          return helperText?.textContent;
        }
        return null;
      });
      
      if (dateError && dateError.includes('passé')) {
        this.results.validation.details.push('✅ Validation date passé fonctionne');
      } else {
        this.results.validation.details.push('❌ Validation date passé échoue');
      }

      // Test 5: Remplissage correct et soumission
      console.log('📝 Test 5: Remplissage correct');
      
      // Vider les champs
      await this.page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      
      await this.page.waitForTimeout(500);
      
      // Remplir correctement
      await this.page.type('input[name="title"]', 'Test Événement Validation');
      await this.page.type('textarea[name="description"]', 'Description de test pour valider le formulaire des événements avec une description suffisamment longue.');
      
      // Sélectionner un type
      const typeSelect = await this.page.$('select[name="type"]');
      if (typeSelect) {
        await typeSelect.click();
        await this.page.waitForTimeout(500);
        const option = await this.page.$('li[data-value="reunion"]');
        if (option) {
          await option.click();
        }
      }
      
      // Sélectionner une date future
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await this.page.evaluate((date) => {
        const dateField = document.querySelector('input[name="date"]');
        if (dateField) {
          dateField.value = date;
          dateField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, tomorrowStr);
      
      // Sélectionner une heure
      await this.page.evaluate(() => {
        const timeField = document.querySelector('input[name="time"]');
        if (timeField) {
          timeField.value = '14:00';
          timeField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      
      await this.page.waitForTimeout(1000);
      
      // Vérifier qu'il n'y a plus d'erreurs
      const remainingErrors = await this.page.evaluate(() => {
        const errors = Array.from(document.querySelectorAll('.MuiFormHelperText-root.Mui-error'));
        return errors.length;
      });
      
      if (remainingErrors === 0) {
        this.results.validation.details.push('✅ Formulaire correctement rempli sans erreurs');
      } else {
        this.results.validation.details.push(`❌ Encore ${remainingErrors} erreurs dans le formulaire`);
      }

      this.results.validation.success = this.results.validation.details.filter(d => d.includes('✅')).length >= 4;
      this.results.overall.total += 5;
      this.results.overall.score += this.results.validation.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test de validation:', error.message);
      this.results.validation.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testSubmission() {
    try {
      console.log('🚀 Test de soumission du formulaire...');
      
      // Cliquer sur le bouton de soumission
      const submitButton = await this.page.$('button[type="submit"], button:has-text("Publier")');
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForTimeout(3000);
        
        // Vérifier si la soumission a réussi
        const successMessage = await this.page.evaluate(() => {
          const alerts = Array.from(document.querySelectorAll('.MuiAlert-root'));
          return alerts.find(alert => 
            alert.textContent.includes('succès') || 
            alert.textContent.includes('créé') ||
            alert.textContent.includes('publié')
          );
        });
        
        if (successMessage) {
          this.results.submission.details.push('✅ Événement créé avec succès');
        } else {
          // Vérifier s'il y a des erreurs
          const errorMessage = await this.page.evaluate(() => {
            const alerts = Array.from(document.querySelectorAll('.MuiAlert-root'));
            return alerts.find(alert => 
              alert.textContent.includes('erreur') || 
              alert.textContent.includes('Erreur')
            );
          });
          
          if (errorMessage) {
            this.results.submission.details.push(`❌ Erreur lors de la création: ${errorMessage.textContent}`);
          } else {
            this.results.submission.details.push('❌ Pas de confirmation de création');
          }
        }
      } else {
        this.results.submission.details.push('❌ Bouton de soumission non trouvé');
      }

      this.results.submission.success = this.results.submission.details.filter(d => d.includes('✅')).length >= 1;
      this.results.overall.total += 1;
      this.results.overall.score += this.results.submission.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test de soumission:', error.message);
      this.results.submission.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async run() {
    try {
      await this.init();
      await this.testValidation();
      await this.testSubmission();
      
      console.log('\n📊 RÉSULTATS DU TEST DE VALIDATION DES ÉVÉNEMENTS');
      console.log('='.repeat(60));
      
      console.log('\n🔍 VALIDATION:');
      this.results.validation.details.forEach(detail => console.log(`  ${detail}`));
      console.log(`  Statut: ${this.results.validation.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      
      console.log('\n🚀 SOUMISSION:');
      this.results.submission.details.forEach(detail => console.log(`  ${detail}`));
      console.log(`  Statut: ${this.results.submission.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      
      console.log('\n📈 SCORE GLOBAL:');
      console.log(`  Score: ${this.results.overall.score}/${this.results.overall.total}`);
      console.log(`  Pourcentage: ${Math.round((this.results.overall.score / this.results.overall.total) * 100)}%`);
      
      const overallSuccess = (this.results.overall.score / this.results.overall.total) >= 0.8;
      console.log(`  Statut global: ${overallSuccess ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Lancer le test
const test = new TestValidationEvents();
test.run();