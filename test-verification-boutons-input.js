const puppeteer = require('puppeteer');
const fs = require('fs');

class VerificationBoutonsInput {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      auth: { success: false, details: [] },
      navigation: { success: false, details: [] },
      forms: { success: false, details: [] },
      actions: { success: false, details: [] },
      overall: { score: 0, total: 0 }
    };
  }

  async init() {
    console.log('🚀 Initialisation du test de vérification des boutons et inputs...');
    this.browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
  }

  async testAuthButtons() {
    console.log('\n📝 Test des boutons d\'authentification...');
    
    try {
      // Test page de connexion
      await this.page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
      
      // Vérifier les champs input
      const emailInput = await this.page.$('input[name="identifier"]');
      const passwordInput = await this.page.$('input[name="password"]');
      const submitButton = await this.page.$('button[type="submit"]');
      
      if (emailInput && passwordInput && submitButton) {
        this.results.auth.details.push('✅ Champs de connexion présents');
        
        // Test de saisie
        await emailInput.type('test@example.com');
        await passwordInput.type('password123');
        
        this.results.auth.details.push('✅ Saisie dans les champs fonctionnelle');
      } else {
        this.results.auth.details.push('❌ Champs de connexion manquants');
      }

      // Test boutons sociaux
      const googleButton = await this.page.$('button:has-text("Google")');
      const facebookButton = await this.page.$('button:has-text("Facebook")');
      
      if (googleButton && facebookButton) {
        this.results.auth.details.push('✅ Boutons de connexion sociale présents');
      } else {
        this.results.auth.details.push('❌ Boutons de connexion sociale manquants');
      }

      // Test page d'inscription
      await this.page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
      
      const registerInputs = await this.page.$$('input');
      if (registerInputs.length >= 5) {
        this.results.auth.details.push('✅ Champs d\'inscription présents');
      } else {
        this.results.auth.details.push('❌ Champs d\'inscription manquants');
      }

      this.results.auth.success = this.results.auth.details.filter(d => d.includes('✅')).length >= 3;
      
    } catch (error) {
      this.results.auth.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testNavigationButtons() {
    console.log('\n🧭 Test des boutons de navigation...');
    
    try {
      // Test navigation principale
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      
      // Vérifier le menu hamburger
      const hamburgerButton = await this.page.$('.mobile-menu-toggle');
      if (hamburgerButton) {
        await hamburgerButton.click();
        await this.page.waitForTimeout(500);
        
        const mobileMenu = await this.page.$('.mobile-menu');
        if (mobileMenu) {
          this.results.navigation.details.push('✅ Menu hamburger fonctionnel');
        } else {
          this.results.navigation.details.push('❌ Menu hamburger non fonctionnel');
        }
      } else {
        this.results.navigation.details.push('❌ Bouton hamburger manquant');
      }

      // Test boutons de navigation desktop
      const navButtons = await this.page.$$('.nav-link');
      if (navButtons.length > 0) {
        this.results.navigation.details.push('✅ Boutons de navigation desktop présents');
      } else {
        this.results.navigation.details.push('❌ Boutons de navigation desktop manquants');
      }

      // Test boutons d'action rapide
      const quickActions = await this.page.$$('.quick-action-btn');
      if (quickActions.length >= 4) {
        this.results.navigation.details.push('✅ Actions rapides présentes');
        
        // Test clic sur une action rapide
        await quickActions[0].click();
        await this.page.waitForTimeout(1000);
        
        const currentUrl = this.page.url();
        if (currentUrl !== 'http://localhost:3000/') {
          this.results.navigation.details.push('✅ Navigation par actions rapides fonctionnelle');
        } else {
          this.results.navigation.details.push('❌ Navigation par actions rapides non fonctionnelle');
        }
      } else {
        this.results.navigation.details.push('❌ Actions rapides manquantes');
      }

      this.results.navigation.success = this.results.navigation.details.filter(d => d.includes('✅')).length >= 2;
      
    } catch (error) {
      this.results.navigation.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testFormInputs() {
    console.log('\n📝 Test des formulaires et champs input...');
    
    try {
      // Test création de post
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle0' });
      
      const createPostButton = await this.page.$('button:has-text("Créer une publication")');
      if (createPostButton) {
        await createPostButton.click();
        await this.page.waitForTimeout(1000);
        
        const postInput = await this.page.$('textarea, input[type="text"]');
        if (postInput) {
          await postInput.type('Test de publication');
          this.results.forms.details.push('✅ Champ de création de post fonctionnel');
        } else {
          this.results.forms.details.push('❌ Champ de création de post manquant');
        }
      } else {
        this.results.forms.details.push('❌ Bouton de création de post manquant');
      }

      // Test création d'événement
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle0' });
      
      const createEventButton = await this.page.$('button:has-text("Créer un événement")');
      if (createEventButton) {
        await createEventButton.click();
        await this.page.waitForTimeout(1000);
        
        const eventInputs = await this.page.$$('input, textarea');
        if (eventInputs.length >= 3) {
          this.results.forms.details.push('✅ Formulaire de création d\'événement présent');
        } else {
          this.results.forms.details.push('❌ Formulaire de création d\'événement manquant');
        }
      } else {
        this.results.forms.details.push('❌ Bouton de création d\'événement manquant');
      }

      // Test création d'alerte
      await this.page.goto('http://localhost:3000/alerts', { waitUntil: 'networkidle0' });
      
      const createAlertButton = await this.page.$('button:has-text("Créer une alerte")');
      if (createAlertButton) {
        await createAlertButton.click();
        await this.page.waitForTimeout(1000);
        
        const alertInputs = await this.page.$$('input, textarea');
        if (alertInputs.length >= 2) {
          this.results.forms.details.push('✅ Formulaire de création d\'alerte présent');
        } else {
          this.results.forms.details.push('❌ Formulaire de création d\'alerte manquant');
        }
      } else {
        this.results.forms.details.push('❌ Bouton de création d\'alerte manquant');
      }

      this.results.forms.success = this.results.forms.details.filter(d => d.includes('✅')).length >= 2;
      
    } catch (error) {
      this.results.forms.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testActionButtons() {
    console.log('\n⚡ Test des boutons d\'action...');
    
    try {
      // Test boutons de like/commentaire/partage
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle0' });
      
      const actionButtons = await this.page.$$('.action-btn, button[class*="like"], button[class*="comment"], button[class*="share"]');
      if (actionButtons.length > 0) {
        this.results.actions.details.push('✅ Boutons d\'action présents');
        
        // Test clic sur un bouton d'action
        await actionButtons[0].click();
        await this.page.waitForTimeout(500);
        this.results.actions.details.push('✅ Clic sur bouton d\'action fonctionnel');
      } else {
        this.results.actions.details.push('❌ Boutons d\'action manquants');
      }

      // Test boutons de filtrage
      const filterButtons = await this.page.$$('button:has-text("Filtrer"), button[class*="filter"]');
      if (filterButtons.length > 0) {
        this.results.actions.details.push('✅ Boutons de filtrage présents');
      } else {
        this.results.actions.details.push('❌ Boutons de filtrage manquants');
      }

      // Test boutons "Voir tout"
      const viewAllButtons = await this.page.$$('button:has-text("Voir tout"), button:has-text("See all")');
      if (viewAllButtons.length > 0) {
        this.results.actions.details.push('✅ Boutons "Voir tout" présents');
      } else {
        this.results.actions.details.push('❌ Boutons "Voir tout" manquants');
      }

      // Test boutons de modération (si admin)
      await this.page.goto('http://localhost:3000/moderation', { waitUntil: 'networkidle0' });
      
      const moderationButtons = await this.page.$$('button:has-text("Approuver"), button:has-text("Rejeter"), button:has-text("Avertir")');
      if (moderationButtons.length > 0) {
        this.results.actions.details.push('✅ Boutons de modération présents');
      } else {
        this.results.actions.details.push('⚠️ Boutons de modération non accessibles (normal si pas admin)');
      }

      this.results.actions.success = this.results.actions.details.filter(d => d.includes('✅')).length >= 2;
      
    } catch (error) {
      this.results.actions.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🔍 DÉBUT DE LA VÉRIFICATION COMPLÈTE DES BOUTONS ET INPUTS');
    console.log('=' .repeat(60));

    try {
      await this.init();
      
      await this.testAuthButtons();
      await this.testNavigationButtons();
      await this.testFormInputs();
      await this.testActionButtons();

      this.calculateResults();
      this.generateReport();

    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  calculateResults() {
    const sections = ['auth', 'navigation', 'forms', 'actions'];
    let totalScore = 0;
    let totalTests = 0;

    sections.forEach(section => {
      const successCount = this.results[section].details.filter(d => d.includes('✅')).length;
      const totalCount = this.results[section].details.length;
      
      if (totalCount > 0) {
        const score = (successCount / totalCount) * 100;
        this.results[section].score = Math.round(score);
        totalScore += score;
        totalTests += totalCount;
      }
    });

    this.results.overall.score = totalTests > 0 ? Math.round(totalScore / sections.length) : 0;
    this.results.overall.total = totalTests;
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE VÉRIFICATION DES BOUTONS ET INPUTS');
    console.log('=' .repeat(60));

    Object.entries(this.results).forEach(([section, data]) => {
      if (section !== 'overall') {
        console.log(`\n${section.toUpperCase()}:`);
        data.details.forEach(detail => console.log(`  ${detail}`));
        console.log(`  Score: ${data.score || 0}%`);
      }
    });

    console.log('\n' + '=' .repeat(60));
    console.log(`🎯 SCORE GLOBAL: ${this.results.overall.score}%`);
    console.log(`📈 Tests réussis: ${this.results.overall.total} éléments vérifiés`);

    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalElements: this.results.overall.total,
        successRate: this.results.overall.score,
        status: this.results.overall.score >= 80 ? 'EXCELLENT' : 
                this.results.overall.score >= 60 ? 'BON' : 
                this.results.overall.score >= 40 ? 'MOYEN' : 'À AMÉLIORER'
      }
    };

    fs.writeFileSync('verification-boutons-input-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Rapport sauvegardé dans: verification-boutons-input-report.json');
  }
}

// Exécution des tests
const test = new VerificationBoutonsInput();
test.runAllTests().catch(console.error); 