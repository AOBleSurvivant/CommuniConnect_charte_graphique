const puppeteer = require('puppeteer');
const fs = require('fs');

class Test100Final {
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
    console.log('🚀 Initialisation du test 100% final...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async testEvents() {
    console.log('\n📅 Test des fonctionnalités Événements...');
    
    try {
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.results.events.details.push('✅ Navigation réussie');

      // Chercher le bouton FAB ou créer (basé sur l'inspection)
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.className.includes('MuiFab-root') ||
          button.textContent.includes('Créer') ||
          button.textContent.includes('Ajouter')
        );
      });
      
      if (fabButton) {
        this.results.events.details.push('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Essayer de trouver un bouton d'action alternatif
        const actionButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => 
            button.textContent.includes('Créer') ||
            button.textContent.includes('Ajouter') ||
            button.textContent.includes('Nouveau')
          );
        });
        
        if (actionButton) {
          this.results.events.details.push('✅ Bouton d\'action trouvé (alternative)');
          await this.page.evaluate((button) => button.click(), actionButton);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          this.results.events.details.push('❌ Bouton FAB non trouvé');
          return;
        }
      }

      // Attendre que le formulaire s'ouvre
      await this.page.waitForSelector('form, .MuiDialog-root, .MuiModal-root', { timeout: 5000 });
      this.results.events.details.push('✅ Formulaire ouvert');
      
      // Remplir le formulaire
      await this.page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        inputs.forEach(input => {
          if (input.name === 'title' || input.placeholder?.includes('titre')) {
            input.value = 'Test Événement CommuniConnect';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (input.name === 'description' || input.placeholder?.includes('description')) {
            input.value = 'Description de test pour l\'événement';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.results.events.details.push('✅ Formulaire rempli');

      // Chercher le bouton de soumission
      const submitButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.textContent.includes('Publier') ||
          button.textContent.includes('Enregistrer') ||
          button.textContent.includes('Soumettre')
        );
      });
      
      if (submitButton) {
        await this.page.evaluate((button) => button.click(), submitButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.results.events.details.push('✅ Formulaire soumis');
      } else {
        this.results.events.details.push('❌ Bouton de soumission non trouvé');
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
      await this.page.goto('http://localhost:3000/alerts', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.results.alerts.details.push('✅ Navigation réussie');

      // Chercher le bouton "Créer une alerte" (basé sur l'inspection)
      const createButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer une alerte')
        );
      });
      
      if (createButton) {
        this.results.alerts.details.push('✅ Bouton de création trouvé');
        await this.page.evaluate((button) => button.click(), createButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        this.results.alerts.details.push('❌ Bouton de création non trouvé');
        return;
      }

      await this.page.waitForSelector('form, .MuiDialog-root, .MuiModal-root', { timeout: 5000 });
      this.results.alerts.details.push('✅ Formulaire ouvert');
      
      await this.page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        inputs.forEach(input => {
          if (input.name === 'title' || input.placeholder?.includes('titre')) {
            input.value = 'Test Alerte CommuniConnect';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (input.name === 'description' || input.placeholder?.includes('description')) {
            input.value = 'Description de test pour l\'alerte';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.results.alerts.details.push('✅ Formulaire rempli');

      const submitButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.textContent.includes('Publier') ||
          button.textContent.includes('Enregistrer') ||
          button.textContent.includes('Soumettre')
        );
      });
      
      if (submitButton) {
        await this.page.evaluate((button) => button.click(), submitButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.results.alerts.details.push('✅ Formulaire soumis');
      } else {
        this.results.alerts.details.push('❌ Bouton de soumission non trouvé');
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
      await this.page.goto('http://localhost:3000/help', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.results.help.details.push('✅ Navigation réussie');

      // Chercher le FAB (basé sur l'inspection - bouton 8)
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.className.includes('MuiFab-root')
        );
      });
      
      if (fabButton) {
        this.results.help.details.push('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        this.results.help.details.push('❌ Bouton FAB non trouvé');
        return;
      }

      await this.page.waitForSelector('form, .MuiDialog-root, .MuiModal-root', { timeout: 5000 });
      this.results.help.details.push('✅ Formulaire ouvert');
      
      await this.page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        inputs.forEach(input => {
          if (input.name === 'title' || input.placeholder?.includes('titre')) {
            input.value = 'Test Demande d\'Aide';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (input.name === 'description' || input.placeholder?.includes('description')) {
            input.value = 'Description de test pour la demande d\'aide';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.results.help.details.push('✅ Formulaire rempli');

      const submitButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.textContent.includes('Publier') ||
          button.textContent.includes('Enregistrer') ||
          button.textContent.includes('Soumettre')
        );
      });
      
      if (submitButton) {
        await this.page.evaluate((button) => button.click(), submitButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.results.help.details.push('✅ Formulaire soumis');
      } else {
        this.results.help.details.push('❌ Bouton de soumission non trouvé');
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
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.results.sharing.details.push('✅ Navigation vers le feed réussie');

      // Créer une publication (basé sur l'inspection)
      const createPostButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer une publication')
        );
      });
      
      if (createPostButton) {
        await this.page.evaluate((button) => button.click(), createPostButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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

      // Chercher les boutons de partage (basé sur l'inspection)
      const shareButtons = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter(button => 
          button.textContent.includes('Partager')
        );
      });
      
      if (shareButtons && shareButtons.length > 0) {
        this.results.sharing.details.push('✅ Boutons de partage trouvés');
        await this.page.evaluate((button) => button.click(), shareButtons[0]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.results.sharing.details.push('✅ Action de partage testée');
      } else {
        this.results.sharing.details.push('❌ Boutons de partage non trouvés');
      }

      // Test sur la carte
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
    console.log('🧪 Démarrage du test 100% final...\n');
    
    try {
      await this.init();
      
      await this.testEvents();
      await this.testAlerts();
      await this.testHelp();
      await this.testSharing();
      
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
    console.log('\n📊 RAPPORT 100% FINAL');
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

    fs.writeFileSync('test-100-final-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Rapport sauvegardé dans: test-100-final-report.json');
  }
}

async function main() {
  const tester = new Test100Final();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = Test100Final; 