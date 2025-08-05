const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement Automatique CommuniConnect');
console.log('==========================================');

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} terminé`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur lors de ${description}: ${error.message}`, 'red');
    return false;
  }
}

// Étapes de déploiement
const steps = [
  {
    name: 'Vérification de Node.js',
    command: 'node --version',
    description: 'Vérification de Node.js'
  },
  {
    name: 'Vérification de npm',
    command: 'npm --version',
    description: 'Vérification de npm'
  },
  {
    name: 'Installation des dépendances',
    command: 'npm run install-all',
    description: 'Installation des dépendances'
  },
  {
    name: 'Test de préparation',
    command: 'node test-deploiement.js',
    description: 'Test de préparation au déploiement'
  },
  {
    name: 'Build du client',
    command: 'cd client && npm run build && cd ..',
    description: 'Build du client React'
  },
  {
    name: 'Vérification du build',
    check: () => {
      if (!fs.existsSync('client/build')) {
        throw new Error('Le build n\'a pas été créé');
      }
      log('✅ Build vérifié', 'green');
      return true;
    },
    description: 'Vérification du build'
  }
];

// Vérification de Vercel CLI
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log('✅ Vercel CLI installé', 'green');
    return true;
  } catch (error) {
    log('📦 Installation de Vercel CLI...', 'yellow');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      log('✅ Vercel CLI installé', 'green');
      return true;
    } catch (installError) {
      log('❌ Impossible d\'installer Vercel CLI', 'red');
      return false;
    }
  }
}

// Fonction principale
async function deploy() {
  log('🚀 Démarrage du déploiement automatique...', 'blue');
  
  // Vérification de Vercel CLI
  if (!checkVercelCLI()) {
    log('❌ Impossible de continuer sans Vercel CLI', 'red');
    process.exit(1);
  }
  
  // Exécution des étapes
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    log(`\n📋 Étape ${i + 1}/${steps.length}: ${step.name}`, 'blue');
    
    let success = false;
    
    if (step.command) {
      success = runCommand(step.command, step.description);
    } else if (step.check) {
      try {
        success = step.check();
      } catch (error) {
        log(`❌ ${error.message}`, 'red');
        success = false;
      }
    }
    
    if (!success) {
      log(`\n❌ Déploiement arrêté à l'étape: ${step.name}`, 'red');
      log('💡 Vérifiez les erreurs et relancez le script', 'yellow');
      process.exit(1);
    }
  }
  
  // Déploiement sur Vercel
  log('\n🌐 Déploiement sur Vercel...', 'blue');
  
  try {
    // Vérification de la connexion Vercel
    log('🔐 Vérification de la connexion Vercel...', 'blue');
    execSync('vercel whoami', { stdio: 'pipe' });
    
    // Déploiement
    log('🚀 Lancement du déploiement...', 'blue');
    execSync('vercel --prod', { stdio: 'inherit' });
    
    log('\n🎉 Déploiement terminé avec succès!', 'green');
    log('🌍 Votre application est maintenant en ligne!', 'green');
    
    // Instructions post-déploiement
    log('\n📋 Prochaines étapes:', 'blue');
    log('1. Configurez les variables d\'environnement sur Vercel Dashboard', 'yellow');
    log('2. Configurez votre base de données MongoDB Atlas', 'yellow');
    log('3. Testez votre application en ligne', 'yellow');
    log('\n📖 Consultez GUIDE_DEPLOIEMENT_ETAPE_PAR_ETAPE.md pour plus de détails', 'blue');
    
  } catch (error) {
    log('❌ Erreur lors du déploiement Vercel', 'red');
    log('💡 Assurez-vous d\'être connecté avec: vercel login', 'yellow');
    log('💡 Vérifiez votre configuration Vercel', 'yellow');
    process.exit(1);
  }
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  log(`❌ Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Promesse rejetée: ${reason}`, 'red');
  process.exit(1);
});

// Lancement du déploiement
if (require.main === module) {
  deploy();
}

module.exports = { deploy }; 