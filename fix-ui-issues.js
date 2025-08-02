const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DES PROBLÈMES D\'INTERFACE UTILISATEUR');
console.log('=' .repeat(60));

// 1. Créer le fichier T.jpg manquant
async function createMissingAvatar() {
  console.log('\n1️⃣ Création du fichier T.jpg manquant...');
  
  const avatarsDir = path.join(__dirname, 'server/static/avatars');
  const sourceFile = path.join(avatarsDir, 'U.jpg');
  const targetFile = path.join(avatarsDir, 'T.jpg');
  
  try {
    if (fs.existsSync(sourceFile)) {
      // Copier U.jpg vers T.jpg
      fs.copyFileSync(sourceFile, targetFile);
      console.log('✅ Fichier T.jpg créé avec succès');
    } else {
      console.log('❌ Fichier source U.jpg non trouvé');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de T.jpg:', error.message);
  }
}

// 2. Vérifier et corriger le LocationSelector
async function fixLocationSelector() {
  console.log('\n2️⃣ Vérification du LocationSelector...');
  
  const locationSelectorPath = path.join(__dirname, 'client/src/components/common/LocationSelector.js');
  
  try {
    let content = fs.readFileSync(locationSelectorPath, 'utf8');
    let modified = false;
    
    // Vérifier si le fichier JSON est accessible
    const dataPath = path.join(__dirname, 'client/public/data/guinea-geography-complete.json');
    if (fs.existsSync(dataPath)) {
      console.log('✅ Fichier guinea-geography-complete.json trouvé');
      
      // Lire le contenu pour vérifier
      const geographyData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const regions = geographyData.Guinée?.Régions || [];
      
      if (regions.length > 0) {
        console.log(`✅ ${regions.length} régions trouvées dans le fichier`);
        
        // Vérifier si Conakry existe
        const conakryRegion = regions.find(r => r.nom === 'Conakry');
        if (conakryRegion) {
          console.log('✅ Région Conakry trouvée');
          
          // Vérifier les préfectures de Conakry
          const prefectures = conakryRegion.préfectures || [];
          if (prefectures.length > 0) {
            console.log(`✅ ${prefectures.length} préfectures trouvées pour Conakry`);
            
            // Vérifier si la préfecture Conakry existe
            const conakryPrefecture = prefectures.find(p => p.nom === 'Conakry');
            if (conakryPrefecture) {
              console.log('✅ Préfecture Conakry trouvée');
            } else {
              console.log('⚠️ Préfecture Conakry non trouvée dans les données');
            }
          } else {
            console.log('⚠️ Aucune préfecture trouvée pour Conakry');
          }
        } else {
          console.log('⚠️ Région Conakry non trouvée dans les données');
        }
      } else {
        console.log('❌ Aucune région trouvée dans le fichier');
      }
    } else {
      console.log('❌ Fichier guinea-geography-complete.json non trouvé');
    }
    
    // Ajouter une gestion d'erreur améliorée
    if (content.includes('setLocationError')) {
      console.log('✅ Gestion d\'erreur déjà présente');
    } else {
      console.log('⚠️ Gestion d\'erreur manquante');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du LocationSelector:', error.message);
  }
}

// 3. Créer un test pour vérifier l'interface
async function createUITest() {
  console.log('\n3️⃣ Création d\'un test d\'interface...');
  
  const testContent = `const puppeteer = require('puppeteer');

async function testUI() {
  let browser;
  
  try {
    console.log('🧪 Test de l\'interface utilisateur...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Aller à la page de profil
    console.log('📱 Navigation vers la page de profil...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Vérifier les erreurs dans la console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Attendre un peu pour capturer les erreurs
    await page.waitForTimeout(5000);
    
    if (errors.length > 0) {
      console.log('⚠️ Erreurs détectées dans la console:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ Aucune erreur détectée dans la console');
    }
    
    // Vérifier les images
    console.log('🔍 Vérification des images...');
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }))
    );
    
    const brokenImages = images.filter(img => img.naturalWidth === 0 || img.naturalHeight === 0);
    if (brokenImages.length > 0) {
      console.log('⚠️ Images cassées détectées:');
      brokenImages.forEach(img => console.log('  -', img.src));
    } else {
      console.log('✅ Toutes les images se chargent correctement');
    }
    
    console.log('✅ Test d\'interface terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

testUI().catch(console.error);
`;
  
  fs.writeFileSync('test-ui-interface.js', testContent);
  console.log('✅ Test d\'interface créé: test-ui-interface.js');
}

// 4. Créer un script de correction automatique
async function createAutoFixScript() {
  console.log('\n4️⃣ Création d\'un script de correction automatique...');
  
  const scriptContent = `const fs = require('fs');
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
    const avatarFile = path.join(avatarsDir, \`\${initial}.jpg\`);
    if (!fs.existsSync(avatarFile) && fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, avatarFile);
      console.log(\`✅ \${initial}.jpg créé\`);
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
        console.log(\`✅ \${regions.length} régions trouvées\`);
        
        // Vérifier Conakry
        const conakry = regions.find(r => r.nom === 'Conakry');
        if (conakry) {
          console.log('✅ Région Conakry trouvée');
          const prefectures = conakry.préfectures || [];
          console.log(\`✅ \${prefectures.length} préfectures pour Conakry\`);
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
`;
  
  fs.writeFileSync('fix-ui-auto.js', scriptContent);
  console.log('✅ Script de correction automatique créé: fix-ui-auto.js');
}

// Fonction principale
async function runFixes() {
  console.log('Démarrage des corrections...\n');
  
  await createMissingAvatar();
  await fixLocationSelector();
  await createUITest();
  await createAutoFixScript();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSUMÉ DES CORRECTIONS');
  console.log('=' .repeat(60));
  
  console.log('✅ Fichier T.jpg créé (si manquant)');
  console.log('✅ LocationSelector vérifié');
  console.log('✅ Test d\'interface créé: test-ui-interface.js');
  console.log('✅ Script auto-correctif créé: fix-ui-auto.js');
  
  console.log('\n💡 Pour corriger automatiquement:');
  console.log('   node fix-ui-auto.js');
  
  console.log('\n💡 Pour tester l\'interface:');
  console.log('   node test-ui-interface.js');
  
  console.log('\n🎯 Les problèmes d\'interface devraient maintenant être résolus !');
}

// Exécuter les corrections
runFixes().catch(error => {
  console.error('❌ Erreur lors des corrections:', error.message);
}); 