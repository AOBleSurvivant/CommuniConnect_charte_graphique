const fs = require('fs');
const path = require('path');

// Fonction pour remplacer les références à via.placeholder.com
function fixPlaceholderReferences() {
  console.log('🔧 Correction des références placeholder...');
  
  const clientDir = path.join(__dirname, 'client', 'src');
  
  // Parcourir tous les fichiers JS/JSX
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Remplacer les références à via.placeholder.com
        if (content.includes('via.placeholder.com')) {
          console.log(`📝 Correction de ${filePath}`);
          
          // Remplacer les URLs placeholder par des avatars par défaut
          content = content.replace(
            /https:\/\/via\.placeholder\.com\/\d+x\d+\/[A-F0-9]+\/[A-F0-9]+\?text=([A-Z])/g,
            (match, initial) => {
              return `"/api/static/avatars/${initial}.jpg"`;
            }
          );
          
          // Remplacer les références dans les objets utilisateur
          content = content.replace(
            /profilePicture:\s*`https:\/\/via\.placeholder\.com\/\d+x\d+\/[A-F0-9]+\/[A-F0-9]+\?text=([A-Z])`/g,
            (match, initial) => {
              return `profilePicture: "/api/static/avatars/${initial}.jpg"`;
            }
          );
          
          // Remplacer les références dans les chaînes
          content = content.replace(
            /"https:\/\/via\.placeholder\.com\/\d+x\d+\/[A-F0-9]+\/[A-F0-9]+\?text=([A-Z])"/g,
            (match, initial) => {
              return `"/api/static/avatars/${initial}.jpg"`;
            }
          );
          
          modified = true;
        }
        
        // Ajouter l'import de DefaultAvatar si nécessaire
        if (content.includes('Avatar') && !content.includes('DefaultAvatar')) {
          const importMatch = content.match(/import.*Avatar.*from.*@mui\/material/);
          if (importMatch) {
            content = content.replace(
              /import.*Avatar.*from.*@mui\/material/,
              `import { Avatar } from '@mui/material';\nimport DefaultAvatar from './common/DefaultAvatar';`
            );
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ ${filePath} corrigé`);
        }
      }
    });
  }
  
  processDirectory(clientDir);
  console.log('✅ Toutes les références placeholder corrigées !');
}

// Exécuter la correction
fixPlaceholderReferences();