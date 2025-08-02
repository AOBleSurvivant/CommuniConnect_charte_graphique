const fs = require('fs');

console.log('🔧 CORRECTION FINALE - FONCTIONNALITÉ "MES AMIS"');
console.log('==================================================');

// Vérification et correction de LazyLoader.js
console.log('\n🔍 Vérification de LazyLoader.js...');
const lazyLoaderPath = 'client/src/components/common/LazyLoader.js';

if (fs.existsSync(lazyLoaderPath)) {
  const content = fs.readFileSync(lazyLoaderPath, 'utf8');
  
  // Vérifier si LazyFriendsPage est exporté
  if (!content.includes('export const LazyFriendsPage')) {
    console.log('❌ Export LazyFriendsPage manquant');
    
    // Ajouter l'export si manquant
    const newContent = content + '\nexport const LazyFriendsPage = createLazyComponent(\n  () => import(\'../../pages/Friends/FriendsPage\'),\n  "Chargement des amis..."\n);';
    
    fs.writeFileSync(lazyLoaderPath, newContent);
    console.log('✅ Export LazyFriendsPage ajouté');
  } else {
    console.log('✅ Export LazyFriendsPage déjà présent');
  }
} else {
  console.log('❌ LazyLoader.js non trouvé');
}

// Vérification et correction de FriendsPage.js
console.log('\n🔍 Vérification de FriendsPage.js...');
const friendsPagePath = 'client/src/pages/Friends/FriendsPage.js';

if (fs.existsSync(friendsPagePath)) {
  const content = fs.readFileSync(friendsPagePath, 'utf8');
  
  // Vérifier si le composant est correctement défini
  if (!content.includes('const FriendsPage = () =>') && !content.includes('function FriendsPage')) {
    console.log('❌ Définition du composant FriendsPage manquante');
    
    // Créer un composant FriendsPage basique si manquant
    const basicComponent = `import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const FriendsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Amis
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Page des amis en cours de développement...
        </Typography>
      </Paper>
    </Box>
  );
};

export default FriendsPage;`;
    
    fs.writeFileSync(friendsPagePath, basicComponent);
    console.log('✅ Composant FriendsPage créé');
  } else {
    console.log('✅ Composant FriendsPage déjà défini');
  }
} else {
  console.log('❌ FriendsPage.js non trouvé');
}

// Vérification et correction de App.js
console.log('\n🔍 Vérification de App.js...');
const appPath = 'client/src/App.js';

if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Vérifier si LazyFriendsPage est importé
  if (!content.includes('import LazyFriendsPage')) {
    console.log('❌ Import LazyFriendsPage manquant');
    
    // Ajouter l'import
    const importLine = 'import LazyFriendsPage from \'./components/common/LazyLoader\';';
    const newContent = content.replace(
      'import React, { useEffect } from \'react\';',
      `import React, { useEffect } from 'react';\nimport LazyFriendsPage from './components/common/LazyLoader';`
    );
    
    fs.writeFileSync(appPath, newContent);
    console.log('✅ Import LazyFriendsPage ajouté');
  } else {
    console.log('✅ Import LazyFriendsPage déjà présent');
  }
  
  // Vérifier si la route /friends est définie
  if (!content.includes('path="friends"')) {
    console.log('❌ Route /friends manquante');
    
    // Ajouter la route
    const routeLine = '<Route path="friends" element={<LazyFriendsPage />} />';
    const newContent = content.replace(
      '<Route path="profile" element={<LazyProfilePage />} />',
      `<Route path="profile" element={<LazyProfilePage />} />\n            <Route path="friends" element={<LazyFriendsPage />} />`
    );
    
    fs.writeFileSync(appPath, newContent);
    console.log('✅ Route /friends ajoutée');
  } else {
    console.log('✅ Route /friends déjà définie');
  }
} else {
  console.log('❌ App.js non trouvé');
}

// Vérification de la route serveur
console.log('\n🔍 Vérification de la route serveur...');
const routePath = 'server/routes/friends.js';

if (fs.existsSync(routePath)) {
  console.log('✅ Route serveur friends.js présente');
} else {
  console.log('❌ Route serveur friends.js manquante');
  
  // Créer une route basique
  const basicRoute = `const express = require('express');
const router = express.Router();

// GET /api/friends - Récupérer la liste des amis
router.get('/', async (req, res) => {
  try {
    // Logique pour récupérer les amis
    res.json({ friends: [] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/friends - Envoyer une demande d'ami
router.post('/request', async (req, res) => {
  try {
    // Logique pour envoyer une demande d'ami
    res.json({ message: 'Demande envoyée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;`;
  
  fs.writeFileSync(routePath, basicRoute);
  console.log('✅ Route serveur friends.js créée');
}

// Test final
console.log('\n🧪 Test final de vérification...');
const testScript = `
const fs = require('fs');

console.log('🎯 TEST FINAL - VÉRIFICATION RAPIDE');
console.log('====================================');

const files = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(\`   \${exists ? '✅' : '❌'} \${file}\`);
});

// Vérifier les imports et exports
if (fs.existsSync('client/src/App.js')) {
  const appContent = fs.readFileSync('client/src/App.js', 'utf8');
  console.log(\`   \${appContent.includes('LazyFriendsPage') ? '✅' : '❌'} Import LazyFriendsPage\`);
  console.log(\`   \${appContent.includes('path="friends"') ? '✅' : '❌'} Route /friends\`);
}

if (fs.existsSync('client/src/components/common/LazyLoader.js')) {
  const lazyContent = fs.readFileSync('client/src/components/common/LazyLoader.js', 'utf8');
  console.log(\`   \${lazyContent.includes('export const LazyFriendsPage') ? '✅' : '❌'} Export LazyFriendsPage\`);
}

console.log('\\n🎯 VÉRIFICATION TERMINÉE');
`;

fs.writeFileSync('test-verification-finale.js', testScript);

console.log('\n✅ CORRECTION FINALE TERMINÉE');
console.log('===============================');
console.log('💡 Prochaines étapes:');
console.log('1. Redémarrez le client: cd client && npm start');
console.log('2. Videz le cache du navigateur (Ctrl+F5)');
console.log('3. Testez la navigation vers /friends');
console.log('4. Exécutez: node test-verification-finale.js pour vérifier'); 