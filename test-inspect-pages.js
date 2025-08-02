const puppeteer = require('puppeteer');

class PageInspector {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🔍 Initialisation de l\'inspecteur de pages...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async inspectPage(url, pageName) {
    console.log(`\n🔍 Inspection de ${pageName} (${url})...`);
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Inspecter tous les boutons
      const buttons = await this.page.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        return allButtons.map(button => ({
          text: button.textContent.trim(),
          className: button.className,
          id: button.id,
          'aria-label': button.getAttribute('aria-label'),
          'data-testid': button.getAttribute('data-testid'),
          style: button.style.cssText,
          isVisible: button.offsetParent !== null
        }));
      });
      
      console.log(`\n📋 Boutons trouvés sur ${pageName}:`);
      buttons.forEach((button, index) => {
        console.log(`${index + 1}. "${button.text}" (classe: ${button.className}, visible: ${button.isVisible})`);
      });
      
      // Chercher les boutons de création
      const createButtons = buttons.filter(btn => 
        btn.text.includes('Créer') || 
        btn.text.includes('Ajouter') || 
        btn.text.includes('Nouveau') ||
        btn.text.includes('+')
      );
      
      console.log(`\n🎯 Boutons de création trouvés: ${createButtons.length}`);
      createButtons.forEach((btn, index) => {
        console.log(`${index + 1}. "${btn.text}"`);
      });
      
      // Inspecter les éléments avec des icônes
      const iconElements = await this.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('[data-testid*="Icon"], .MuiSvgIcon-root, .MuiFab-root'));
        return elements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          'data-testid': el.getAttribute('data-testid'),
          text: el.textContent.trim(),
          parentText: el.parentElement?.textContent?.trim() || ''
        }));
      });
      
      console.log(`\n🎨 Éléments avec icônes trouvés: ${iconElements.length}`);
      iconElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} (${el.className}) - "${el.parentText}"`);
      });
      
      return { buttons, createButtons, iconElements };
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'inspection de ${pageName}:`, error.message);
      return null;
    }
  }

  async runInspection() {
    console.log('🧪 Démarrage de l\'inspection des pages...\n');
    
    try {
      await this.init();
      
      const pages = [
        { url: 'http://localhost:3000/events', name: 'EventsPage' },
        { url: 'http://localhost:3000/alerts', name: 'AlertsPage' },
        { url: 'http://localhost:3000/help', name: 'HelpPage' },
        { url: 'http://localhost:3000/feed', name: 'FeedPage' }
      ];
      
      for (const page of pages) {
        await this.inspectPage(page.url, page.name);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'inspection:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

async function main() {
  const inspector = new PageInspector();
  await inspector.runInspection();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PageInspector; 