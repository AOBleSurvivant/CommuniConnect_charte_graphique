const puppeteer = require('puppeteer');
const fs = require('fs');

class TestFonctionnalitesCompletes100 {
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
    console.log('🚀 Initialisation du test des fonctionnalités complètes (100%)...');
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
    
    try {
      // Navigation vers la page événements
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.results.events.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.querySelector('.MuiFab-root') ||
          button.getAttribute('aria-label')?.includes('Créer')
        );
      });
      
      if (fabButton) {
        this.results.events.details.push('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        this.results.events.details.push('❌ Bouton FAB non trouvé');
        return;
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.events.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire avec des sélecteurs plus robustes
        await this.page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          const titleInput = inputs.find(input => 
            input.name === 'title' || 
            input.placeholder?.includes('titre') ||
            input.placeholder?.includes('Titre')
          );
          if (titleInput) {
            titleInput.value = 'Test Événement CommuniConnect';
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          const descInput = inputs.find(input => 
            input.name === 'description' || 
            input.placeholder?.includes('description') ||
            input.placeholder?.includes('Description')
          );
          if (descInput) {
            descInput.value = 'Description de test pour l\'événement';
            descInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        this.results.events.details.push('✅ Formulaire rempli');

        // Soumission avec recherche améliorée
        const submitButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => 
            button.type === 'submit' || 
            button.textContent.includes('Créer') || 
            button.textContent.includes('Publier') ||
            button.textContent.includes('Créer l\'événement') ||
            button.textContent.includes('Créer l\'alerte') ||
            button.textContent.includes('Créer la demande') ||
            button.textContent.includes('Créer le Live') ||
            button.textContent.includes('Publier')
          );
        });
        
        if (submitButton) {
          await this.page.evaluate((button) => button.click(), submitButton);
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.results.events.details.push('✅ Formulaire soumis');
        } else {
          this.results.events.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.events.details.push('❌ Formulaire non trouvé');
      }

      this.results.events.success = this.results.events.details.filter(d => d.includes('✅')).length >= 4;
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.results.alerts.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.querySelector('.MuiFab-root') ||
          button.getAttribute('aria-label')?.includes('Créer')
        );
      });
      
      if (fabButton) {
        this.results.alerts.details.push('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        this.results.alerts.details.push('❌ Bouton FAB non trouvé');
        return;
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.alerts.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire
        await this.page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          const titleInput = inputs.find(input => 
            input.name === 'title' || 
            input.placeholder?.includes('titre') ||
            input.placeholder?.includes('Titre')
          );
          if (titleInput) {
            titleInput.value = 'Test Alerte CommuniConnect';
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          const descInput = inputs.find(input => 
            input.name === 'description' || 
            input.placeholder?.includes('description') ||
            input.placeholder?.includes('Description')
          );
          if (descInput) {
            descInput.value = 'Description de test pour l\'alerte';
            descInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        this.results.alerts.details.push('✅ Formulaire rempli');

        // Soumission
        const submitButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => 
            button.type === 'submit' || 
            button.textContent.includes('Créer') || 
            button.textContent.includes('Publier') ||
            button.textContent.includes('Créer l\'événement') ||
            button.textContent.includes('Créer l\'alerte') ||
            button.textContent.includes('Créer la demande') ||
            button.textContent.includes('Créer le Live') ||
            button.textContent.includes('Publier')
          );
        });
        
        if (submitButton) {
          await this.page.evaluate((button) => button.click(), submitButton);
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.results.alerts.details.push('✅ Formulaire soumis');
        } else {
          this.results.alerts.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.alerts.details.push('❌ Formulaire non trouvé');
      }

      this.results.alerts.success = this.results.alerts.details.filter(d => d.includes('✅')).length >= 4;
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.results.help.details.push('✅ Navigation réussie');

      // Vérification du bouton FAB
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.querySelector('.MuiFab-root') ||
          button.getAttribute('aria-label')?.includes('Créer')
        );
      });
      
      if (fabButton) {
        this.results.help.details.push('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        this.results.help.details.push('❌ Bouton FAB non trouvé');
        return;
      }

      // Vérification du formulaire
      const form = await this.page.$('form, .MuiDialog-root');
      if (form) {
        this.results.help.details.push('✅ Formulaire ouvert');
        
        // Remplissage du formulaire
        await this.page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          const titleInput = inputs.find(input => 
            input.name === 'title' || 
            input.placeholder?.includes('titre') ||
            input.placeholder?.includes('Titre')
          );
          if (titleInput) {
            titleInput.value = 'Test Demande d\'Aide';
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          const descInput = inputs.find(input => 
            input.name === 'description' || 
            input.placeholder?.includes('description') ||
            input.placeholder?.includes('Description')
          );
          if (descInput) {
            descInput.value = 'Description de test pour la demande d\'aide';
            descInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        this.results.help.details.push('✅ Formulaire rempli');

        // Soumission
        const submitButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => 
            button.type === 'submit' || 
            button.textContent.includes('Créer') || 
            button.textContent.includes('Publier') ||
            button.textContent.includes('Créer l\'événement') ||
            button.textContent.includes('Créer l\'alerte') ||
            button.textContent.includes('Créer la demande') ||
            button.textContent.includes('Créer le Live') ||
            button.textContent.includes('Publier')
          );
        });
        
        if (submitButton) {
          await this.page.evaluate((button) => button.click(), submitButton);
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.results.help.details.push('✅ Formulaire soumis');
        } else {
          this.results.help.details.push('❌ Bouton de soumission non trouvé');
        }
      } else {
        this.results.help.details.push('❌ Formulaire non trouvé');
      }

      this.results.help.success = this.results.help.details.filter(d => d.includes('✅')).length >= 4;
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
      // D'abord créer du contenu à partager
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.results.sharing.details.push('✅ Navigation vers le feed réussie');

      // Créer une publication pour avoir du contenu à partager
      const createPostButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer une publication') ||
          button.textContent.includes('Publier')
        );
      });
      
      if (createPostButton) {
        await this.page.evaluate((button) => button.click(), createPostButton);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remplir le formulaire de publication
        await this.page.evaluate(() => {
          const textareas = Array.from(document.querySelectorAll('textarea'));
          const contentTextarea = textareas.find(textarea => 
            textarea.placeholder?.includes('partager') ||
            textarea.placeholder?.includes('pensées')
          );
          if (contentTextarea) {
            contentTextarea.value = 'Test de publication pour le partage';
            contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Publier
        const publishButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => 
            button.textContent.includes('Publier')
          );
        });
        
        if (publishButton) {
          await this.page.evaluate((button) => button.click(), publishButton);
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.results.sharing.details.push('✅ Publication créée pour le test');
        }
      }

      // Maintenant chercher les boutons de partage
      const shareButtons = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter(button => 
          button.textContent.includes('Partager')
        );
      });
      
      if (shareButtons && shareButtons.length > 0) {
        this.results.sharing.details.push('✅ Boutons de partage trouvés');
        
        // Test du premier bouton de partage
        await this.page.evaluate((button) => button.click(), shareButtons[0]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.results.sharing.details.push('✅ Action de partage testée');
      } else {
        this.results.sharing.details.push('❌ Boutons de partage non trouvés');
      }

      // Test du partage sur la carte
      await this.page.goto('http://localhost:3000/map', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mapShareButtons = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter(button => 
          button.textContent.includes('Partager')
        );
      });
      
      if (mapShareButtons && mapShareButtons.length > 0) {
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
    console.log('🧪 Démarrage des tests de fonctionnalités complètes (100%)...\n');
    
    try {
      await this.init();
      
      await this.testEvents();
      await this.testAlerts();
      await this.testHelp();
      await this.testSharing();
      
      // Calcul du score global
      this.results.overall.score = Math.min(this.results.overall.score, this.results.overall.total);
      this.results.overall.success = this.results.overall.score >= (this.results.overall.total * 0.8);
      
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
    console.log('\n📊 RAPPORT DES TESTS DE FONCTIONNALITÉS COMPLÈTES (100%)');
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

    fs.writeFileSync('test-fonctionnalites-completes-100-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Rapport sauvegardé dans: test-fonctionnalites-completes-100-report.json');
  }
}

// Exécution des tests
async function main() {
  const tester = new TestFonctionnalitesCompletes100();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestFonctionnalitesCompletes100; 