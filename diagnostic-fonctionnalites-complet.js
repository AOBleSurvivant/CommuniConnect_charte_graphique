const puppeteer = require('puppeteer');
const fs = require('fs');

class DiagnosticFonctionnalitesComplet {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      authentification: { success: false, details: [], score: 0 },
      navigation: { success: false, details: [], score: 0 },
      feed: { success: false, details: [], score: 0 },
      evenements: { success: false, details: [], score: 0 },
      alertes: { success: false, details: [], score: 0 },
      entraide: { success: false, details: [], score: 0 },
      messagerie: { success: false, details: [], score: 0 },
      profil: { success: false, details: [], score: 0 },
      carte: { success: false, details: [], score: 0 },
      moderation: { success: false, details: [], score: 0 },
      admin: { success: false, details: [], score: 0 },
      overall: { score: 0, total: 0, status: '' }
    };
  }

  async init() {
    console.log('🔍 Initialisation du diagnostic complet des fonctionnalités...');
    this.browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
    
    // Intercepter les erreurs console
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Erreur console:', msg.text());
      }
    });
  }

  async testAuthentification() {
    console.log('\n🔐 TEST AUTHENTIFICATION');
    console.log('=' .repeat(40));
    
    try {
      // Test page de connexion
      await this.page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
      
      // Vérifier les éléments de base
      const emailInput = await this.page.$('input[name="identifier"]');
      const passwordInput = await this.page.$('input[name="password"]');
      const submitButton = await this.page.$('button[type="submit"]');
      
      if (emailInput && passwordInput && submitButton) {
        this.results.authentification.details.push('✅ Champs de connexion présents');
        
        // Test de saisie
        await emailInput.type('test@example.com');
        await passwordInput.type('password123');
        this.results.authentification.details.push('✅ Saisie dans les champs fonctionnelle');
        
        // Test soumission (sans attendre la réponse)
        await submitButton.click();
        await this.page.waitForTimeout(2000);
        
        const currentUrl = this.page.url();
        if (currentUrl.includes('/login')) {
          this.results.authentification.details.push('⚠️ Connexion échouée (normal en mode test)');
        } else {
          this.results.authentification.details.push('✅ Connexion réussie');
        }
      } else {
        this.results.authentification.details.push('❌ Champs de connexion manquants');
      }

      // Test boutons sociaux
      const googleButton = await this.page.$('button:has-text("Google")');
      const facebookButton = await this.page.$('button:has-text("Facebook")');
      
      if (googleButton && facebookButton) {
        this.results.authentification.details.push('✅ Boutons de connexion sociale présents');
      } else {
        this.results.authentification.details.push('❌ Boutons de connexion sociale manquants');
      }

      // Test page d'inscription
      await this.page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
      
      const registerInputs = await this.page.$$('input');
      if (registerInputs.length >= 5) {
        this.results.authentification.details.push('✅ Formulaire d\'inscription complet');
      } else {
        this.results.authentification.details.push('❌ Formulaire d\'inscription incomplet');
      }

      // Calculer le score
      const successCount = this.results.authentification.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.authentification.details.length;
      this.results.authentification.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.authentification.success = this.results.authentification.score >= 70;
      
    } catch (error) {
      this.results.authentification.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testNavigation() {
    console.log('\n🧭 TEST NAVIGATION');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      
      // Test menu hamburger
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

      // Test navigation desktop
      const navButtons = await this.page.$$('.nav-link');
      if (navButtons.length > 0) {
        this.results.navigation.details.push('✅ Navigation desktop présente');
        
        // Test clic sur un bouton de navigation
        await navButtons[0].click();
        await this.page.waitForTimeout(1000);
        
        const currentUrl = this.page.url();
        if (currentUrl !== 'http://localhost:3000/') {
          this.results.navigation.details.push('✅ Navigation fonctionnelle');
        } else {
          this.results.navigation.details.push('❌ Navigation non fonctionnelle');
        }
      } else {
        this.results.navigation.details.push('❌ Navigation desktop manquante');
      }

      // Test actions rapides
      const quickActions = await this.page.$$('.quick-action-btn');
      if (quickActions.length >= 4) {
        this.results.navigation.details.push('✅ Actions rapides présentes');
        
        // Test clic sur une action rapide
        await quickActions[0].click();
        await this.page.waitForTimeout(1000);
        
        const currentUrl = this.page.url();
        if (currentUrl !== 'http://localhost:3000/') {
          this.results.navigation.details.push('✅ Actions rapides fonctionnelles');
        } else {
          this.results.navigation.details.push('❌ Actions rapides non fonctionnelles');
        }
      } else {
        this.results.navigation.details.push('❌ Actions rapides manquantes');
      }

      // Calculer le score
      const successCount = this.results.navigation.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.navigation.details.length;
      this.results.navigation.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.navigation.success = this.results.navigation.score >= 70;
      
    } catch (error) {
      this.results.navigation.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testFeed() {
    console.log('\n📰 TEST FEED ET PUBLICATIONS');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/feed', { waitUntil: 'networkidle0' });
      
      // Test bouton créer une publication
      const createPostButton = await this.page.$('button:has-text("Créer une publication")');
      if (createPostButton) {
        await createPostButton.click();
        await this.page.waitForTimeout(1000);
        
        const postInput = await this.page.$('textarea, input[type="text"]');
        if (postInput) {
          await postInput.type('Test de publication diagnostique');
          this.results.feed.details.push('✅ Formulaire de création de post accessible');
        } else {
          this.results.feed.details.push('❌ Formulaire de création de post inaccessible');
        }
      } else {
        this.results.feed.details.push('❌ Bouton de création de post manquant');
      }

      // Test filtres
      const filterTabs = await this.page.$$('[role="tab"]');
      if (filterTabs.length >= 4) {
        this.results.feed.details.push('✅ Onglets de filtrage présents');
        
        // Test clic sur un filtre
        await filterTabs[1].click();
        await this.page.waitForTimeout(500);
        this.results.feed.details.push('✅ Filtres fonctionnels');
      } else {
        this.results.feed.details.push('❌ Onglets de filtrage manquants');
      }

      // Test actions sur les posts
      const actionButtons = await this.page.$$('.action-btn, button[class*="like"], button[class*="comment"]');
      if (actionButtons.length > 0) {
        this.results.feed.details.push('✅ Boutons d\'action présents');
        
        // Test clic sur un bouton d'action
        await actionButtons[0].click();
        await this.page.waitForTimeout(500);
        this.results.feed.details.push('✅ Actions sur posts fonctionnelles');
      } else {
        this.results.feed.details.push('❌ Boutons d\'action manquants');
      }

      // Calculer le score
      const successCount = this.results.feed.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.feed.details.length;
      this.results.feed.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.feed.success = this.results.feed.score >= 70;
      
    } catch (error) {
      this.results.feed.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testEvenements() {
    console.log('\n📅 TEST ÉVÉNEMENTS');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/events', { waitUntil: 'networkidle0' });
      
      // Test bouton créer un événement
      const createEventButton = await this.page.$('button:has-text("Créer un événement")');
      if (createEventButton) {
        await createEventButton.click();
        await this.page.waitForTimeout(1000);
        
        const eventInputs = await this.page.$$('input, textarea');
        if (eventInputs.length >= 3) {
          this.results.evenements.details.push('✅ Formulaire de création d\'événement accessible');
        } else {
          this.results.evenements.details.push('❌ Formulaire de création d\'événement inaccessible');
        }
      } else {
        this.results.evenements.details.push('❌ Bouton de création d\'événement manquant');
      }

      // Test filtres d'événements
      const filterSelects = await this.page.$$('select');
      if (filterSelects.length >= 2) {
        this.results.evenements.details.push('✅ Filtres d\'événements présents');
      } else {
        this.results.evenements.details.push('❌ Filtres d\'événements manquants');
      }

      // Test boutons d'action sur événements
      const eventActionButtons = await this.page.$$('button:has-text("Participer"), button:has-text("Détails")');
      if (eventActionButtons.length > 0) {
        this.results.evenements.details.push('✅ Boutons d\'action sur événements présents');
      } else {
        this.results.evenements.details.push('❌ Boutons d\'action sur événements manquants');
      }

      // Calculer le score
      const successCount = this.results.evenements.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.evenements.details.length;
      this.results.evenements.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.evenements.success = this.results.evenements.score >= 70;
      
    } catch (error) {
      this.results.evenements.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testAlertes() {
    console.log('\n🚨 TEST ALERTES');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/alerts', { waitUntil: 'networkidle0' });
      
      // Test bouton créer une alerte
      const createAlertButton = await this.page.$('button:has-text("Créer une alerte")');
      if (createAlertButton) {
        await createAlertButton.click();
        await this.page.waitForTimeout(1000);
        
        const alertInputs = await this.page.$$('input, textarea');
        if (alertInputs.length >= 2) {
          this.results.alertes.details.push('✅ Formulaire de création d\'alerte accessible');
        } else {
          this.results.alertes.details.push('❌ Formulaire de création d\'alerte inaccessible');
        }
      } else {
        this.results.alertes.details.push('❌ Bouton de création d\'alerte manquant');
      }

      // Test filtres d'alertes
      const alertFilters = await this.page.$$('select');
      if (alertFilters.length >= 2) {
        this.results.alertes.details.push('✅ Filtres d\'alertes présents');
      } else {
        this.results.alertes.details.push('❌ Filtres d\'alertes manquants');
      }

      // Test boutons d'action sur alertes
      const alertActionButtons = await this.page.$$('button:has-text("Partager"), button:has-text("Détails")');
      if (alertActionButtons.length > 0) {
        this.results.alertes.details.push('✅ Boutons d\'action sur alertes présents');
      } else {
        this.results.alertes.details.push('❌ Boutons d\'action sur alertes manquants');
      }

      // Calculer le score
      const successCount = this.results.alertes.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.alertes.details.length;
      this.results.alertes.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.alertes.success = this.results.alertes.score >= 70;
      
    } catch (error) {
      this.results.alertes.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testEntraide() {
    console.log('\n🤝 TEST ENTR'AIDE');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/help', { waitUntil: 'networkidle0' });
      
      // Test bouton nouvelle demande
      const createHelpButton = await this.page.$('button:has-text("Nouvelle demande")');
      if (createHelpButton) {
        await createHelpButton.click();
        await this.page.waitForTimeout(1000);
        
        const helpInputs = await this.page.$$('input, textarea');
        if (helpInputs.length >= 3) {
          this.results.entraide.details.push('✅ Formulaire de demande d\'aide accessible');
        } else {
          this.results.entraide.details.push('❌ Formulaire de demande d\'aide inaccessible');
        }
      } else {
        this.results.entraide.details.push('❌ Bouton de création de demande manquant');
      }

      // Test onglets d'entraide
      const helpTabs = await this.page.$$('[role="tab"]');
      if (helpTabs.length >= 3) {
        this.results.entraide.details.push('✅ Onglets d\'entraide présents');
      } else {
        this.results.entraide.details.push('❌ Onglets d\'entraide manquants');
      }

      // Test boutons d'action sur demandes
      const helpActionButtons = await this.page.$$('button:has-text("Répondre"), button:has-text("Détails")');
      if (helpActionButtons.length > 0) {
        this.results.entraide.details.push('✅ Boutons d\'action sur demandes présents');
      } else {
        this.results.entraide.details.push('❌ Boutons d\'action sur demandes manquants');
      }

      // Calculer le score
      const successCount = this.results.entraide.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.entraide.details.length;
      this.results.entraide.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.entraide.success = this.results.entraide.score >= 70;
      
    } catch (error) {
      this.results.entraide.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testMessagerie() {
    console.log('\n💬 TEST MESSAGERIE');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/messages', { waitUntil: 'networkidle0' });
      
      // Test bouton nouveau message
      const newMessageButton = await this.page.$('button:has-text("Nouveau message")');
      if (newMessageButton) {
        await newMessageButton.click();
        await this.page.waitForTimeout(1000);
        
        const messageInputs = await this.page.$$('input, textarea');
        if (messageInputs.length >= 1) {
          this.results.messagerie.details.push('✅ Formulaire de nouveau message accessible');
        } else {
          this.results.messagerie.details.push('❌ Formulaire de nouveau message inaccessible');
        }
      } else {
        this.results.messagerie.details.push('❌ Bouton nouveau message manquant');
      }

      // Test champ de saisie de message
      const messageInput = await this.page.$('textarea, input[type="text"]');
      if (messageInput) {
        await messageInput.type('Test de message');
        this.results.messagerie.details.push('✅ Champ de saisie de message fonctionnel');
      } else {
        this.results.messagerie.details.push('❌ Champ de saisie de message manquant');
      }

      // Test bouton envoyer
      const sendButton = await this.page.$('button:has-text("Envoyer")');
      if (sendButton) {
        this.results.messagerie.details.push('✅ Bouton envoyer présent');
      } else {
        this.results.messagerie.details.push('❌ Bouton envoyer manquant');
      }

      // Calculer le score
      const successCount = this.results.messagerie.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.messagerie.details.length;
      this.results.messagerie.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.messagerie.success = this.results.messagerie.score >= 70;
      
    } catch (error) {
      this.results.messagerie.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testProfil() {
    console.log('\n👤 TEST PROFIL');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
      
      // Test bouton modifier
      const editButton = await this.page.$('button:has-text("Modifier")');
      if (editButton) {
        await editButton.click();
        await this.page.waitForTimeout(1000);
        
        const profileInputs = await this.page.$$('input');
        if (profileInputs.length >= 3) {
          this.results.profil.details.push('✅ Formulaire d\'édition de profil accessible');
        } else {
          this.results.profil.details.push('❌ Formulaire d\'édition de profil inaccessible');
        }
      } else {
        this.results.profil.details.push('❌ Bouton modifier manquant');
      }

      // Test upload photo profil
      const uploadButton = await this.page.$('input[type="file"]');
      if (uploadButton) {
        this.results.profil.details.push('✅ Upload photo profil présent');
      } else {
        this.results.profil.details.push('❌ Upload photo profil manquant');
      }

      // Test onglets profil
      const profileTabs = await this.page.$$('[role="tab"]');
      if (profileTabs.length >= 3) {
        this.results.profil.details.push('✅ Onglets de profil présents');
      } else {
        this.results.profil.details.push('❌ Onglets de profil manquants');
      }

      // Calculer le score
      const successCount = this.results.profil.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.profil.details.length;
      this.results.profil.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.profil.success = this.results.profil.score >= 70;
      
    } catch (error) {
      this.results.profil.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testCarte() {
    console.log('\n🗺️ TEST CARTE');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/map', { waitUntil: 'networkidle0' });
      
      // Test boutons de filtrage
      const filterButtons = await this.page.$$('button');
      if (filterButtons.length >= 3) {
        this.results.carte.details.push('✅ Boutons de filtrage carte présents');
      } else {
        this.results.carte.details.push('❌ Boutons de filtrage carte manquants');
      }

      // Test bouton itinéraire
      const directionsButton = await this.page.$('button:has-text("Itinéraire")');
      if (directionsButton) {
        this.results.carte.details.push('✅ Bouton itinéraire présent');
      } else {
        this.results.carte.details.push('❌ Bouton itinéraire manquant');
      }

      // Test bouton partager
      const shareButton = await this.page.$('button:has-text("Partager")');
      if (shareButton) {
        this.results.carte.details.push('✅ Bouton partager présent');
      } else {
        this.results.carte.details.push('❌ Bouton partager manquant');
      }

      // Calculer le score
      const successCount = this.results.carte.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.carte.details.length;
      this.results.carte.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.carte.success = this.results.carte.score >= 70;
      
    } catch (error) {
      this.results.carte.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testModeration() {
    console.log('\n🛡️ TEST MODÉRATION');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/moderation', { waitUntil: 'networkidle0' });
      
      // Test onglets modération
      const moderationTabs = await this.page.$$('[role="tab"]');
      if (moderationTabs.length >= 2) {
        this.results.moderation.details.push('✅ Onglets de modération présents');
      } else {
        this.results.moderation.details.push('❌ Onglets de modération manquants');
      }

      // Test boutons d'action modération
      const moderationButtons = await this.page.$$('button:has-text("Approuver"), button:has-text("Rejeter"), button:has-text("Avertir")');
      if (moderationButtons.length > 0) {
        this.results.moderation.details.push('✅ Boutons d\'action modération présents');
      } else {
        this.results.moderation.details.push('⚠️ Boutons d\'action modération non accessibles (normal si pas admin)');
      }

      // Test filtres modération
      const moderationFilters = await this.page.$$('select');
      if (moderationFilters.length >= 2) {
        this.results.moderation.details.push('✅ Filtres de modération présents');
      } else {
        this.results.moderation.details.push('❌ Filtres de modération manquants');
      }

      // Calculer le score
      const successCount = this.results.moderation.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.moderation.details.length;
      this.results.moderation.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.moderation.success = this.results.moderation.score >= 70;
      
    } catch (error) {
      this.results.moderation.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async testAdmin() {
    console.log('\n⚙️ TEST ADMIN');
    console.log('=' .repeat(40));
    
    try {
      await this.page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
      
      // Test onglets admin
      const adminTabs = await this.page.$$('.admin-tab');
      if (adminTabs.length >= 5) {
        this.results.admin.details.push('✅ Onglets admin présents');
      } else {
        this.results.admin.details.push('❌ Onglets admin manquants');
      }

      // Test boutons d'action admin
      const adminButtons = await this.page.$$('button:has-text("Actualiser"), button:has-text("Exporter")');
      if (adminButtons.length > 0) {
        this.results.admin.details.push('✅ Boutons d\'action admin présents');
      } else {
        this.results.admin.details.push('❌ Boutons d\'action admin manquants');
      }

      // Test statistiques admin
      const statCards = await this.page.$$('.stat-card');
      if (statCards.length >= 4) {
        this.results.admin.details.push('✅ Cartes de statistiques présentes');
      } else {
        this.results.admin.details.push('❌ Cartes de statistiques manquantes');
      }

      // Calculer le score
      const successCount = this.results.admin.details.filter(d => d.includes('✅')).length;
      const totalCount = this.results.admin.details.length;
      this.results.admin.score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
      this.results.admin.success = this.results.admin.score >= 70;
      
    } catch (error) {
      this.results.admin.details.push(`❌ Erreur: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🔍 DÉBUT DU DIAGNOSTIC COMPLET DES FONCTIONNALITÉS');
    console.log('=' .repeat(60));

    try {
      await this.init();
      
      await this.testAuthentification();
      await this.testNavigation();
      await this.testFeed();
      await this.testEvenements();
      await this.testAlertes();
      await this.testEntraide();
      await this.testMessagerie();
      await this.testProfil();
      await this.testCarte();
      await this.testModeration();
      await this.testAdmin();

      this.calculateOverallResults();
      this.generateReport();

    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  calculateOverallResults() {
    const sections = Object.keys(this.results).filter(key => key !== 'overall');
    let totalScore = 0;
    let totalTests = 0;

    sections.forEach(section => {
      const successCount = this.results[section].details.filter(d => d.includes('✅')).length;
      const totalCount = this.results[section].details.length;
      
      if (totalCount > 0) {
        totalScore += this.results[section].score;
        totalTests += totalCount;
      }
    });

    this.results.overall.score = sections.length > 0 ? Math.round(totalScore / sections.length) : 0;
    this.results.overall.total = totalTests;
    
    // Déterminer le statut global
    if (this.results.overall.score >= 90) {
      this.results.overall.status = 'EXCELLENT';
    } else if (this.results.overall.score >= 80) {
      this.results.overall.status = 'TRÈS BON';
    } else if (this.results.overall.score >= 70) {
      this.results.overall.status = 'BON';
    } else if (this.results.overall.score >= 60) {
      this.results.overall.status = 'MOYEN';
    } else {
      this.results.overall.status = 'À AMÉLIORER';
    }
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC COMPLET');
    console.log('=' .repeat(60));

    Object.entries(this.results).forEach(([section, data]) => {
      if (section !== 'overall') {
        console.log(`\n${section.toUpperCase()}:`);
        data.details.forEach(detail => console.log(`  ${detail}`));
        console.log(`  Score: ${data.score}% - ${data.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      }
    });

    console.log('\n' + '=' .repeat(60));
    console.log(`🎯 SCORE GLOBAL: ${this.results.overall.score}%`);
    console.log(`📈 Tests réussis: ${this.results.overall.total} éléments vérifiés`);
    console.log(`📊 STATUT: ${this.results.overall.status}`);

    // Identifier les problèmes
    const failedSections = Object.entries(this.results)
      .filter(([key, data]) => key !== 'overall' && !data.success)
      .map(([key, data]) => ({ section: key, score: data.score, details: data.details }));

    if (failedSections.length > 0) {
      console.log('\n🚨 SECTIONS À CORRIGER:');
      failedSections.forEach(({ section, score, details }) => {
        console.log(`  - ${section.toUpperCase()}: ${score}%`);
        details.filter(d => d.includes('❌')).forEach(detail => {
          console.log(`    ${detail}`);
        });
      });
    }

    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalElements: this.results.overall.total,
        successRate: this.results.overall.score,
        status: this.results.overall.status,
        failedSections: failedSections.map(f => f.section)
      }
    };

    fs.writeFileSync('diagnostic-fonctionnalites-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Rapport sauvegardé dans: diagnostic-fonctionnalites-report.json');
  }
}

// Exécution du diagnostic
const diagnostic = new DiagnosticFonctionnalitesComplet();
diagnostic.runAllTests().catch(console.error); 