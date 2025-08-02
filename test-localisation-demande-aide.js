const puppeteer = require('puppeteer');

class TestLocalisationDemandeAide {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initialisation du test de localisation demande d\'aide...');
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
  }

  async testLocalisationHierarchique() {
    console.log('\n📍 Test de la localisation hiérarchique...');
    
    try {
      // Navigation vers la page d'aide
      await this.page.goto('http://localhost:3000/help', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Navigation vers la page d\'aide réussie');

      // Vérifier que le bouton FAB existe
      const fabButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent.includes('Créer') || 
          button.querySelector('.MuiFab-root')
        );
      });
      
      if (fabButton) {
        console.log('✅ Bouton FAB trouvé');
        await this.page.evaluate((button) => button.click(), fabButton);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('❌ Bouton FAB non trouvé');
        return;
      }

      // Vérifier que le formulaire est ouvert
      const form = await this.page.$('form, .MuiDialog-root');
      if (!form) {
        console.log('❌ Formulaire non trouvé');
        return;
      }
      console.log('✅ Formulaire ouvert');

      // Test de la hiérarchie des champs de localisation
      console.log('\n🔍 Test de la hiérarchie des champs...');

      // 1. Vérifier que la région est un Select
      const regionSelect = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Région') ||
          select.getAttribute('aria-label')?.includes('Région')
        );
      });
      
      if (regionSelect) {
        console.log('✅ Champ Région est un Select');
      } else {
        console.log('❌ Champ Région n\'est pas un Select');
      }

      // 2. Vérifier que la préfecture est un Select
      const prefectureSelect = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Préfecture') ||
          select.getAttribute('aria-label')?.includes('Préfecture')
        );
      });
      
      if (prefectureSelect) {
        console.log('✅ Champ Préfecture est un Select');
      } else {
        console.log('❌ Champ Préfecture n\'est pas un Select');
      }

      // 3. Vérifier que la commune est un Select
      const communeSelect = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Commune') ||
          select.getAttribute('aria-label')?.includes('Commune')
        );
      });
      
      if (communeSelect) {
        console.log('✅ Champ Commune est un Select');
      } else {
        console.log('❌ Champ Commune n\'est pas un Select');
      }

      // 4. Vérifier que le quartier est un Select
      const quartierSelect = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Quartier') ||
          select.getAttribute('aria-label')?.includes('Quartier')
        );
      });
      
      if (quartierSelect) {
        console.log('✅ Champ Quartier est un Select');
      } else {
        console.log('❌ Champ Quartier n\'est pas un Select');
      }

      // 5. Test de la sélection hiérarchique
      console.log('\n🔄 Test de la sélection hiérarchique...');
      
      // Sélectionner une région
      await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const regionSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Région')
        );
        if (regionSelect) {
          regionSelect.value = 'Conakry';
          regionSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Région Conakry sélectionnée');

      // Vérifier que la préfecture est maintenant activée
      const prefectureEnabled = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const prefectureSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Préfecture')
        );
        return prefectureSelect && !prefectureSelect.disabled;
      });
      
      if (prefectureEnabled) {
        console.log('✅ Préfecture activée après sélection de région');
      } else {
        console.log('❌ Préfecture non activée après sélection de région');
      }

      // Sélectionner une préfecture
      await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const prefectureSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Préfecture')
        );
        if (prefectureSelect) {
          prefectureSelect.value = 'Conakry';
          prefectureSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Préfecture Conakry sélectionnée');

      // Vérifier que la commune est maintenant activée
      const communeEnabled = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const communeSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Commune')
        );
        return communeSelect && !communeSelect.disabled;
      });
      
      if (communeEnabled) {
        console.log('✅ Commune activée après sélection de préfecture');
      } else {
        console.log('❌ Commune non activée après sélection de préfecture');
      }

      // Sélectionner une commune
      await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const communeSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Commune')
        );
        if (communeSelect) {
          communeSelect.value = 'Kaloum';
          communeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Commune Kaloum sélectionnée');

      // Vérifier que le quartier est maintenant activé
      const quartierEnabled = await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const quartierSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Quartier')
        );
        return quartierSelect && !quartierSelect.disabled;
      });
      
      if (quartierEnabled) {
        console.log('✅ Quartier activé après sélection de commune');
      } else {
        console.log('❌ Quartier non activé après sélection de commune');
      }

      // Sélectionner un quartier
      await this.page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const quartierSelect = selects.find(select => 
          select.previousElementSibling?.textContent?.includes('Quartier')
        );
        if (quartierSelect) {
          quartierSelect.value = 'Centre';
          quartierSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Quartier Centre sélectionné');

      console.log('\n✅ Test de localisation hiérarchique terminé avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors du test de localisation:', error.message);
    }
  }

  async runTest() {
    try {
      await this.init();
      await this.testLocalisationHierarchique();
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Exécution du test
async function main() {
  const tester = new TestLocalisationDemandeAide();
  await tester.runTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestLocalisationDemandeAide; 