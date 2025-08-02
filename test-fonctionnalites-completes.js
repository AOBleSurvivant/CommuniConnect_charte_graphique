const puppeteer = require('puppeteer');
const fs = require('fs');

class TestFonctionnalitesCompletes {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      events: { success: false, details: [] },
      alerts: { success: false, details: [] },
      help: { success: false, details: [] },
      sharing: { success: false, details: [] },
      overall: { success: false, score: 0, total: 0 }
    };
  }

  async init() {
    console.log('🚀 Initialisation du test des fonctionnalités complètes...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Intercepter les erreurs de console
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Erreur console:', msg.text());
      }
    });

    // Intercepter les erreurs de réseau
    this.page.on('pageerror', error => {
      console.log('❌ Erreur page:', error.message);
    });
  }

  async testEvents() {
    console.log('\n📅 Test des fonctionnalités Événements...');
    const testSteps = [
      'Navigation vers la page événements',
      'Vérification du bouton FAB de création',
      'Ouverture du formulaire de création',
      'Remplissage du formulaire',
      'Soumission du formulaire',
      'Vérification de la création'
    ];

    try {
      // Navigation vers la page événements
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      this.results.events.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.$('[data-testid="fab-create-event"]');
      if (fabButton) {
        this.results.events.details.push('✅ Bouton FAB trouvé');
        await fabButton.click();
        await this.page.waitForTimeout(1000);
      } else {
        // Recherche alternative du bouton FAB
        const fabButtons = await this.page.$$('button[aria-label*="Créer"], .MuiFab-root');
        if (fabButtons.length > 0) {
          this.results.events.details.push('✅ Bouton FAB trouvé (alternative)');
          await fabButtons[0].click();
          await this.page.waitForTimeout(1000);
        } else {
          this.results.events.details.push('❌ Bouton FAB non trouvé');
        }
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.events.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire
        await this.page.type('input[name="title"], input[placeholder*="titre"]', 'Test Événement CommuniConnect');
        await this.page.type('textarea[name="description"], textarea[placeholder*="description"]', 'Description de test pour l\'événement');
        
        // Sélection du type d'événement
        const typeSelect = await this.page.$('select[name="type"], .MuiSelect-select');
        if (typeSelect) {
          await typeSelect.click();
          await this.page.waitForTimeout(500);
          const option = await this.page.$('li[data-value="celebration"], .MuiMenuItem-root');
          if (option) {
            await option.click();
          }
        }

        this.results.events.details.push('✅ Formulaire rempli');

        // Soumission
        const submitButton = await this.page.$('button[type="submit"], button:has-text("Créer"), button:has-text("Publier")');
        if (submitButton) {
          await submitButton.click();
          await this.page.waitForTimeout(2000);
          this.results.events.details.push('✅ Formulaire soumis');
        } else {
          this.results.events.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.events.details.push('❌ Formulaire non trouvé');
      }

      this.results.events.success = this.results.events.details.filter(d => d.includes('✅')).length >= 3;
      this.results.overall.total += 6;
      this.results.overall.score += this.results.events.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test des événements:', error.message);
      this.results.events.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testAlerts() {
    console.log('\n🚨 Test des fonctionnalités Alertes...');
    
    try {
      // Navigation vers la page alertes
      await this.page.goto('http://localhost:3000/alerts', { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      this.results.alerts.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.$('[data-testid="fab-create-alert"]');
      if (fabButton) {
        this.results.alerts.details.push('✅ Bouton FAB trouvé');
        await fabButton.click();
        await this.page.waitForTimeout(1000);
      } else {
        // Recherche alternative
        const fabButtons = await this.page.$$('button[aria-label*="alerte"], .MuiFab-root');
        if (fabButtons.length > 0) {
          this.results.alerts.details.push('✅ Bouton FAB trouvé (alternative)');
          await fabButtons[0].click();
          await this.page.waitForTimeout(1000);
        } else {
          this.results.alerts.details.push('❌ Bouton FAB non trouvé');
        }
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.alerts.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire
        await this.page.type('input[name="title"], input[placeholder*="titre"]', 'Test Alerte CommuniConnect');
        await this.page.type('textarea[name="description"], textarea[placeholder*="description"]', 'Description de test pour l\'alerte');
        
        // Sélection du type d'alerte
        const typeSelect = await this.page.$('select[name="type"], .MuiSelect-select');
        if (typeSelect) {
          await typeSelect.click();
          await this.page.waitForTimeout(500);
          const option = await this.page.$('li[data-value="incendie"], .MuiMenuItem-root');
          if (option) {
            await option.click();
          }
        }

        this.results.alerts.details.push('✅ Formulaire rempli');

        // Soumission
        const submitButton = await this.page.$('button[type="submit"], button:has-text("Créer"), button:has-text("Publier")');
        if (submitButton) {
          await submitButton.click();
          await this.page.waitForTimeout(2000);
          this.results.alerts.details.push('✅ Formulaire soumis');
        } else {
          this.results.alerts.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.alerts.details.push('❌ Formulaire non trouvé');
      }

      this.results.alerts.success = this.results.alerts.details.filter(d => d.includes('✅')).length >= 3;
      this.results.overall.total += 6;
      this.results.overall.score += this.results.alerts.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test des alertes:', error.message);
      this.results.alerts.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testHelp() {
    console.log('\n🤝 Test des fonctionnalités Demandes d\'aide...');
    
    try {
      // Navigation vers la page d'aide
      await this.page.goto('http://localhost:3000/help', { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      this.results.help.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.$('[data-testid="fab-create-help"]');
      if (fabButton) {
        this.results.help.details.push('✅ Bouton FAB trouvé');
        await fabButton.click();
        await this.page.waitForTimeout(1000);
      } else {
        // Recherche alternative
        const fabButtons = await this.page.$$('button[aria-label*="aide"], .MuiFab-root');
        if (fabButtons.length > 0) {
          this.results.help.details.push('✅ Bouton FAB trouvé (alternative)');
          await fabButtons[0].click();
          await this.page.waitForTimeout(1000);
        } else {
          this.results.help.details.push('❌ Bouton FAB non trouvé');
        }
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.help.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire
        await this.page.type('input[name="title"], input[placeholder*="titre"]', 'Test Demande d\'Aide');
        await this.page.type('textarea[name="description"], textarea[placeholder*="description"]', 'Description de test pour la demande d\'aide');
        
        // Sélection de la catégorie
        const categorySelect = await this.page.$('select[name="category"], .MuiSelect-select');
        if (categorySelect) {
          await categorySelect.click();
          await this.page.waitForTimeout(500);
          const option = await this.page.$('li[data-value="alimentaire"], .MuiMenuItem-root');
          if (option) {
            await option.click();
          }
        }

        this.results.help.details.push('✅ Formulaire rempli');

        // Soumission
        const submitButton = await this.page.$('button[type="submit"], button:has-text("Créer"), button:has-text("Publier")');
        if (submitButton) {
          await submitButton.click();
          await this.page.waitForTimeout(2000);
          this.results.help.details.push('✅ Formulaire soumis');
        } else {
          this.results.help.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.help.details.push('❌ Formulaire non trouvé');
      }

      this.results.help.success = this.results.help.details.filter(d => d.includes('✅')).length >= 3;
      this.results.overall.total += 6;
      this.results.overall.score += this.results.help.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test des demandes d\'aide:', error.message);
      this.results.help.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testSharing() {
    console.log('\n📤 Test des fonctionnalités de Partage...');
    
    try {
      // Navigation vers le feed
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      this.results.sharing.details.push('✅ Navigation vers le feed réussie');

      // Vérification des boutons de partage
      const shareButtons = await this.page.$$('button:has-text("Partager"), .MuiIconButton-root:has(.MuiSvgIcon-root)');
      if (shareButtons.length > 0) {
        this.results.sharing.details.push('✅ Boutons de partage trouvés');
        
        // Test du premier bouton de partage
        await shareButtons[0].click();
        await this.page.waitForTimeout(1000);
        
        // Vérification du menu de partage
        const shareMenu = await this.page.$('.MuiMenu-root, .MuiPopover-root');
        if (shareMenu) {
          this.results.sharing.details.push('✅ Menu de partage ouvert');
          
          // Test du partage interne
          const internalShare = await this.page.$('li:has-text("Partager"), .MuiMenuItem-root');
          if (internalShare) {
            await internalShare.click();
            await this.page.waitForTimeout(1000);
            this.results.sharing.details.push('✅ Partage interne testé');
          }
        } else {
          this.results.sharing.details.push('❌ Menu de partage non trouvé');
        }
      } else {
        this.results.sharing.details.push('❌ Boutons de partage non trouvés');
      }

      // Test du partage sur la carte
      await this.page.goto('http://localhost:3000/map', { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      const mapShareButtons = await this.page.$$('button:has-text("Partager"), .MuiIconButton-root:has(.MuiSvgIcon-root)');
      if (mapShareButtons.length > 0) {
        this.results.sharing.details.push('✅ Boutons de partage sur la carte trouvés');
      } else {
        this.results.sharing.details.push('❌ Boutons de partage sur la carte non trouvés');
      }

      this.results.sharing.success = this.results.sharing.details.filter(d => d.includes('✅')).length >= 2;
      this.results.overall.total += 4;
      this.results.overall.score += this.results.sharing.details.filter(d => d.includes('✅')).length;

    } catch (error) {
      console.error('❌ Erreur lors du test du partage:', error.message);
      this.results.sharing.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🧪 Démarrage des tests de fonctionnalités complètes...\n');
    
    try {
      await this.init();
      
      await this.testEvents();
      await this.testAlerts();
      await this.testHelp();
      await this.testSharing();
      
      // Calcul du score global
      this.results.overall.score = Math.min(this.results.overall.score, this.results.overall.total);
      this.results.overall.success = this.results.overall.score >= (this.results.overall.total * 0.7);
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async generateReport() {
    console.log('\n📊 RAPPORT DES TESTS DE FONCTIONNALITÉS COMPLÈTES');
    console.log('=' .repeat(60));
    
    const sections = [
      { name: 'Événements', result: this.results.events },
      { name: 'Alertes', result: this.results.alerts },
      { name: 'Demandes d\'Aide', result: this.results.help },
      { name: 'Partage', result: this.results.sharing }
    ];

    sections.forEach(section => {
      console.log(`\n${section.name.toUpperCase()}:`);
      console.log(`Statut: ${section.result.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      section.result.details.forEach(detail => {
        console.log(`  ${detail}`);
      });
    });

    console.log('\n' + '='.repeat(60));
    console.log(`SCORE GLOBAL: ${this.results.overall.score}/${this.results.overall.total}`);
    console.log(`POURCENTAGE: ${Math.round((this.results.overall.score / this.results.overall.total) * 100)}%`);
    console.log(`STATUT GLOBAL: ${this.results.overall.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    
    // Sauvegarde du rapport
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalTests: this.results.overall.total,
        passedTests: this.results.overall.score,
        percentage: Math.round((this.results.overall.score / this.results.overall.total) * 100),
        success: this.results.overall.success
      }
    };

    fs.writeFileSync('test-fonctionnalites-completes-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Rapport sauvegardé dans: test-fonctionnalites-completes-report.json');
  }
}

// Exécution des tests
async function main() {
  const tester = new TestFonctionnalitesCompletes();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestFonctionnalitesCompletes; 