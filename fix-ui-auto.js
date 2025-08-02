const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION AUTOMATIQUE DES PROBLÈMES UI');

// 1. Créer les avatars manquants
function createMissingAvatars() {
  const avatarsDir = path.join(__dirname, 'server/static/avatars');
  const sourceFile = path.join(avatarsDir, 'U.jpg');
  
  // Créer T.jpg
  const tFile = path.join(avatarsDir, 'T.jpg');
  if (!fs.existsSync(tFile) && fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, tFile);
    console.log('✅ T.jpg créé');
  }
  
  // Créer d'autres avatars courants
  const commonInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  commonInitials.forEach(initial => {
    const avatarFile = path.join(avatarsDir, `${initial}.jpg`);
    if (!fs.existsSync(avatarFile) && fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, avatarFile);
      console.log(`✅ ${initial}.jpg créé`);
    }
  });
}

// 2. Vérifier les données géographiques
function checkGeographyData() {
  const dataPath = path.join(__dirname, 'client/public/data/guinea-geography-complete.json');
  
  if (fs.existsSync(dataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const regions = data.Guinée?.Régions || [];
      
      if (regions.length > 0) {
        console.log(`✅ ${regions.length} régions trouvées`);
        
        // Vérifier Conakry
        const conakry = regions.find(r => r.nom === 'Conakry');
        if (conakry) {
          console.log('✅ Région Conakry trouvée');
          const prefectures = conakry.préfectures || [];
          console.log(`✅ ${prefectures.length} préfectures pour Conakry`);
        } else {
          console.log('⚠️ Région Conakry manquante');
        }
      } else {
        console.log('❌ Aucune région trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur lecture données géographiques:', error.message);
    }
  } else {
    console.log('❌ Fichier données géographiques non trouvé');
  }
}

// Exécuter les corrections
createMissingAvatars();
checkGeographyData();

console.log('✅ Corrections automatiques terminées');
