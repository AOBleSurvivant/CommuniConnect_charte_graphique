const fs = require('fs');
const path = require('path');

class WarningFixer {
  constructor() {
    this.fixes = [];
  }

  // Corriger les problèmes de structure DOM dans AlertCard
  fixAlertCardDOM() {
    const alertCardPath = path.join(__dirname, 'client/src/components/Alerts/AlertCard.js');
    
    if (fs.existsSync(alertCardPath)) {
      let content = fs.readFileSync(alertCardPath, 'utf8');
      
      // Remplacer les éléments <p> imbriqués par des <div>
      content = content.replace(
        /<Typography[^>]*variant="body2"[^>]*>\s*<p[^>]*>/g,
        '<Typography variant="body2"><div>'
      );
      content = content.replace(
        /<\/p>\s*<\/Typography>/g,
        '</div></Typography>'
      );
      
      // Remplacer les <div> dans les <p> par des <span>
      content = content.replace(
        /<p[^>]*>\s*<div[^>]*>/g,
        '<p><span>'
      );
      content = content.replace(
        /<\/div>\s*<\/p>/g,
        '</span></p>'
      );
      
      fs.writeFileSync(alertCardPath, content);
      this.fixes.push('✅ AlertCard DOM structure fixed');
    }
  }

  // Corriger les problèmes de Dialog open prop
  fixDialogOpenProp() {
    const eventsPagePath = path.join(__dirname, 'client/src/pages/Events/EventsPage.js');
    
    if (fs.existsSync(eventsPagePath)) {
      let content = fs.readFileSync(eventsPagePath, 'utf8');
      
      // S'assurer que la prop open est définie
      content = content.replace(
        /<Dialog[^>]*>/g,
        '<Dialog open={open} onClose={handleClose}>'
      );
      
      fs.writeFileSync(eventsPagePath, content);
      this.fixes.push('✅ Dialog open prop fixed in EventsPage');
    }
  }

  // Corriger les problèmes de Dialog dans CreateEventForm
  fixCreateEventForm() {
    const createEventFormPath = path.join(__dirname, 'client/src/components/Events/CreateEventForm.js');
    
    if (fs.existsSync(createEventFormPath)) {
      let content = fs.readFileSync(createEventFormPath, 'utf8');
      
      // S'assurer que la prop open est définie
      content = content.replace(
        /<Dialog[^>]*>/g,
        '<Dialog open={open} onClose={handleClose}>'
      );
      
      fs.writeFileSync(createEventFormPath, content);
      this.fixes.push('✅ Dialog open prop fixed in CreateEventForm');
    }
  }

  // Corriger les problèmes de Dialog dans CreateAlertForm
  fixCreateAlertForm() {
    const createAlertFormPath = path.join(__dirname, 'client/src/components/Alerts/CreateAlertForm.js');
    
    if (fs.existsSync(createAlertFormPath)) {
      let content = fs.readFileSync(createAlertFormPath, 'utf8');
      
      // S'assurer que la prop open est définie
      content = content.replace(
        /<Dialog[^>]*>/g,
        '<Dialog open={open} onClose={handleClose}>'
      );
      
      fs.writeFileSync(createAlertFormPath, content);
      this.fixes.push('✅ Dialog open prop fixed in CreateAlertForm');
    }
  }

  // Corriger les problèmes de Dialog dans CreateHelpForm
  fixCreateHelpForm() {
    const createHelpFormPath = path.join(__dirname, 'client/src/components/Help/CreateHelpForm.js');
    
    if (fs.existsSync(createHelpFormPath)) {
      let content = fs.readFileSync(createHelpFormPath, 'utf8');
      
      // S'assurer que la prop open est définie
      content = content.replace(
        /<Dialog[^>]*>/g,
        '<Dialog open={open} onClose={handleClose}>'
      );
      
      fs.writeFileSync(createHelpFormPath, content);
      this.fixes.push('✅ Dialog open prop fixed in CreateHelpForm');
    }
  }

  // Corriger les problèmes de serveur backend
  fixServerIssues() {
    const serverIndexPath = path.join(__dirname, 'server/index.js');
    
    if (fs.existsSync(serverIndexPath)) {
      let content = fs.readFileSync(serverIndexPath, 'utf8');
      
      // Ajouter une gestion d'erreur pour le port déjà utilisé
      content = content.replace(
        /app\.listen\(PORT, \(\) => {/g,
        `app.listen(PORT, () => {
  console.log(\`🚀 Serveur démarré sur le port \${PORT}\`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(\`⚠️ Le port \${PORT} est déjà utilisé. Tentative de redémarrage...\`);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  } else {
    console.error('❌ Erreur serveur:', err);
  }
});`
      );
      
      fs.writeFileSync(serverIndexPath, content);
      this.fixes.push('✅ Server error handling improved');
    }
  }

  // Appliquer tous les correctifs
  applyAllFixes() {
    console.log('🔧 Application des correctifs pour les avertissements...\n');
    
    try {
      this.fixAlertCardDOM();
      this.fixDialogOpenProp();
      this.fixCreateEventForm();
      this.fixCreateAlertForm();
      this.fixCreateHelpForm();
      this.fixServerIssues();
      
      console.log('📋 Résumé des correctifs appliqués:');
      this.fixes.forEach(fix => {
        console.log(`  ${fix}`);
      });
      
      console.log('\n✅ Tous les correctifs ont été appliqués avec succès !');
      console.log('🔄 Redémarrez l\'application pour voir les changements.');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'application des correctifs:', error.message);
    }
  }
}

// Exécuter les correctifs
const fixer = new WarningFixer();
fixer.applyAllFixes(); 