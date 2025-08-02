const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION RAPIDE DES PROBLÈMES UI');

// 1. Créer le fichier T.jpg
const avatarsDir = path.join(__dirname, 'server/static/avatars');
const sourceFile = path.join(avatarsDir, 'U.jpg');
const targetFile = path.join(avatarsDir, 'T.jpg');

if (fs.existsSync(sourceFile) && !fs.existsSync(targetFile)) {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ T.jpg créé');
} else {
  console.log('ℹ️ T.jpg existe déjà ou U.jpg manquant');
}

// 2. Vérifier les données géographiques
const dataPath = path.join(__dirname, 'client/public/data/guinea-geography-complete.json');

if (fs.existsSync(dataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const regions = data.Guinée?.Régions || [];
    
    if (regions.length > 0) {
      console.log(`✅ ${regions.length} régions trouvées`);
      
      const conakry = regions.find(r => r.nom === 'Conakry');
      if (conakry) {
        console.log('✅ Région Conakry trouvée');
        const prefectures = conakry.préfectures || [];
        console.log(`✅ ${prefectures.length} préfectures pour Conakry`);
        
        const conakryPrefecture = prefectures.find(p => p.nom === 'Conakry');
        if (conakryPrefecture) {
          console.log('✅ Préfecture Conakry trouvée');
        } else {
          console.log('⚠️ Préfecture Conakry manquante');
        }
      } else {
        console.log('⚠️ Région Conakry manquante');
      }
    } else {
      console.log('❌ Aucune région trouvée');
    }
  } catch (error) {
    console.error('❌ Erreur lecture données:', error.message);
  }
} else {
  console.log('❌ Fichier données géographiques non trouvé');
}

console.log('✅ Corrections terminées'); 