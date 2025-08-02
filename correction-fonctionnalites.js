const fs = require('fs');
const path = require('path');

class CorrectionFonctionnalites {
  constructor() {
    this.corrections = [];
  }

  // Correction 1: Vérifier et corriger les routes de lives
  async corrigerLives() {
    console.log('\n📺 Correction des fonctionnalités Lives...');
    
    const livestreamsRoute = path.join(__dirname, 'server', 'routes', 'livestreams.js');
    
    if (fs.existsSync(livestreamsRoute)) {
      const content = fs.readFileSync(livestreamsRoute, 'utf8');
      
      // Vérifier si la route POST existe
      if (content.includes('router.post(\'/\', auth')) {
        this.corrections.push('✅ Route POST /livestreams existe');
      } else {
        this.corrections.push('❌ Route POST /livestreams manquante');
      }
      
      // Vérifier la gestion des erreurs
      if (content.includes('catch (error)')) {
        this.corrections.push('✅ Gestion d\'erreurs présente');
      } else {
        this.corrections.push('❌ Gestion d\'erreurs manquante');
      }
    } else {
      this.corrections.push('❌ Fichier livestreams.js non trouvé');
    }
  }

  // Correction 2: Vérifier et corriger les routes d'événements
  async corrigerEvents() {
    console.log('\n📅 Correction des fonctionnalités Événements...');
    
    const eventsRoute = path.join(__dirname, 'server', 'routes', 'events.js');
    
    if (fs.existsSync(eventsRoute)) {
      const content = fs.readFileSync(eventsRoute, 'utf8');
      
      // Vérifier si la route POST existe
      if (content.includes('router.post(\'/\', [')) {
        this.corrections.push('✅ Route POST /events existe');
      } else {
        this.corrections.push('❌ Route POST /events manquante');
      }
      
      // Vérifier la validation
      if (content.includes('body(\'title\')')) {
        this.corrections.push('✅ Validation des données présente');
      } else {
        this.corrections.push('❌ Validation des données manquante');
      }
    } else {
      this.corrections.push('❌ Fichier events.js non trouvé');
    }
  }

  // Correction 3: Vérifier et corriger les routes de messages
  async corrigerMessages() {
    console.log('\n💬 Correction des fonctionnalités Messages...');
    
    const messagesRoute = path.join(__dirname, 'server', 'routes', 'messages.js');
    
    if (fs.existsSync(messagesRoute)) {
      const content = fs.readFileSync(messagesRoute, 'utf8');
      
      // Vérifier si la route POST pour les conversations existe
      if (content.includes('router.post(\'/conversations\', auth')) {
        this.corrections.push('✅ Route POST /messages/conversations existe');
      } else {
        this.corrections.push('❌ Route POST /messages/conversations manquante');
      }
      
      // Vérifier si la route POST pour l'envoi de messages existe
      if (content.includes('router.post(\'/send\', auth')) {
        this.corrections.push('✅ Route POST /messages/send existe');
      } else {
        this.corrections.push('❌ Route POST /messages/send manquante');
      }
    } else {
      this.corrections.push('❌ Fichier messages.js non trouvé');
    }
  }

  // Correction 4: Vérifier et corriger les routes d'amis
  async corrigerFriends() {
    console.log('\n👥 Correction des fonctionnalités Amis...');
    
    const friendsRoute = path.join(__dirname, 'server', 'routes', 'friends.js');
    
    if (fs.existsSync(friendsRoute)) {
      const content = fs.readFileSync(friendsRoute, 'utf8');
      
      // Vérifier si la route POST pour les demandes d'amis existe
      if (content.includes('router.post(\'/request\', auth')) {
        this.corrections.push('✅ Route POST /friends/request existe');
      } else {
        this.corrections.push('❌ Route POST /friends/request manquante');
      }
      
      // Vérifier la gestion des emails
      if (content.includes('recipientId.includes(\'@\')')) {
        this.corrections.push('✅ Gestion des emails présente');
      } else {
        this.corrections.push('❌ Gestion des emails manquante');
      }
    } else {
      this.corrections.push('❌ Fichier friends.js non trouvé');
    }
  }

  // Correction 5: Vérifier et corriger les routes de profil
  async corrigerProfile() {
    console.log('\n👤 Correction des fonctionnalités Photo de Profil...');
    
    const usersRoute = path.join(__dirname, 'server', 'routes', 'users.js');
    
    if (fs.existsSync(usersRoute)) {
      const content = fs.readFileSync(usersRoute, 'utf8');
      
      // Vérifier si la route PUT pour le profil existe
      if (content.includes('router.put(\'/profile\', auth') || content.includes('router.put(\'/profile\'')) {
        this.corrections.push('✅ Route PUT /users/profile existe');
      } else {
        this.corrections.push('❌ Route PUT /users/profile manquante');
      }
    } else {
      this.corrections.push('❌ Fichier users.js non trouvé');
    }
  }

  // Correction 6: Vérifier les services côté client
  async corrigerServicesClient() {
    console.log('\n🔧 Correction des services côté client...');
    
    const servicesDir = path.join(__dirname, 'client', 'src', 'services');
    
    if (fs.existsSync(servicesDir)) {
      const services = ['livestreamsService.js', 'eventsService.js', 'messagesService.js', 'friendsService.js'];
      
      services.forEach(service => {
        const servicePath = path.join(servicesDir, service);
        if (fs.existsSync(servicePath)) {
          this.corrections.push(`✅ Service ${service} existe`);
        } else {
          this.corrections.push(`❌ Service ${service} manquant`);
        }
      });
    } else {
      this.corrections.push('❌ Dossier services non trouvé');
    }
  }

  // Correction 7: Vérifier les composants côté client
  async corrigerComposantsClient() {
    console.log('\n🎨 Correction des composants côté client...');
    
    const componentsDir = path.join(__dirname, 'client', 'src', 'components');
    
    if (fs.existsSync(componentsDir)) {
      const composants = [
        'Livestreams/CreateLivestreamForm.js',
        'Events/CreateEventForm.js',
        'Messages/MessageComposer.js',
        'Friends/FriendsPage.js',
        'Profile/ProfileEdit.js'
      ];
      
      composants.forEach(composant => {
        const composantPath = path.join(componentsDir, composant);
        if (fs.existsSync(composantPath)) {
          this.corrections.push(`✅ Composant ${composant} existe`);
        } else {
          this.corrections.push(`❌ Composant ${composant} manquant`);
        }
      });
    } else {
      this.corrections.push('❌ Dossier components non trouvé');
    }
  }

  // Correction 8: Vérifier la configuration du serveur
  async corrigerConfigurationServeur() {
    console.log('\n⚙️ Correction de la configuration serveur...');
    
    const serverIndex = path.join(__dirname, 'server', 'index.js');
    
    if (fs.existsSync(serverIndex)) {
      const content = fs.readFileSync(serverIndex, 'utf8');
      
      // Vérifier les routes
      if (content.includes('app.use(\'/api/livestreams\', require(\'./routes/livestreams\')')) {
        this.corrections.push('✅ Route livestreams configurée');
      } else {
        this.corrections.push('❌ Route livestreams non configurée');
      }
      
      if (content.includes('app.use(\'/api/events\', require(\'./routes/events\')')) {
        this.corrections.push('✅ Route events configurée');
      } else {
        this.corrections.push('❌ Route events non configurée');
      }
      
      if (content.includes('app.use(\'/api/messages\', require(\'./routes/messages\')')) {
        this.corrections.push('✅ Route messages configurée');
      } else {
        this.corrections.push('❌ Route messages non configurée');
      }
      
      if (content.includes('app.use(\'/api/friends\', require(\'./routes/friends\')')) {
        this.corrections.push('✅ Route friends configurée');
      } else {
        this.corrections.push('❌ Route friends non configurée');
      }
    } else {
      this.corrections.push('❌ Fichier index.js serveur non trouvé');
    }
  }

  async executerCorrections() {
    console.log('🚀 Démarrage des corrections CommuniConnect...\n');
    
    try {
      await this.corrigerLives();
      await this.corrigerEvents();
      await this.corrigerMessages();
      await this.corrigerFriends();
      await this.corrigerProfile();
      await this.corrigerServicesClient();
      await this.corrigerComposantsClient();
      await this.corrigerConfigurationServeur();
      
      this.genererRapport();
      
    } catch (error) {
      console.error('Erreur lors des corrections:', error);
    }
  }

  genererRapport() {
    console.log('\n📊 RAPPORT DE CORRECTION');
    console.log('=' .repeat(50));
    
    const correctionsReussies = this.corrections.filter(c => c.includes('✅')).length;
    const correctionsEchouees = this.corrections.filter(c => c.includes('❌')).length;
    
    console.log(`\n✅ Corrections réussies: ${correctionsReussies}`);
    console.log(`❌ Corrections échouées: ${correctionsEchouees}`);
    console.log(`📈 Taux de succès: ${Math.round((correctionsReussies / (correctionsReussies + correctionsEchouees)) * 100)}%`);
    
    console.log('\n📋 DÉTAIL DES CORRECTIONS:');
    this.corrections.forEach(correction => {
      console.log(`  ${correction}`);
    });
    
    if (correctionsEchouees === 0) {
      console.log('\n🎉 TOUTES LES FONCTIONNALITÉS SONT CORRECTEMENT CONFIGURÉES !');
    } else {
      console.log('\n⚠️ DES PROBLÈMES ONT ÉTÉ IDENTIFIÉS');
      console.log('\n🔧 ACTIONS RECOMMANDÉES:');
      console.log('1. Vérifier que tous les fichiers de routes existent');
      console.log('2. Vérifier la configuration dans server/index.js');
      console.log('3. Vérifier les services côté client');
      console.log('4. Vérifier les composants côté client');
      console.log('5. Redémarrer le serveur après corrections');
    }
  }
}

async function main() {
  const correcteur = new CorrectionFonctionnalites();
  await correcteur.executerCorrections();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CorrectionFonctionnalites; 