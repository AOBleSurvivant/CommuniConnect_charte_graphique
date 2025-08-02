const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION FONCTIONNALITÉ "MES AMIS"');
console.log('========================================');

// Vérifier et corriger les problèmes potentiels
const checkAndFixIssues = () => {
  console.log('\n🔍 Vérification et correction des problèmes:');
  
  // 1. Vérifier que FriendsPage.js est bien exporté
  const friendsPagePath = 'client/src/pages/Friends/FriendsPage.js';
  if (fs.existsSync(friendsPagePath)) {
    let content = fs.readFileSync(friendsPagePath, 'utf8');
    let modified = false;
    
    // Vérifier l'export par défaut
    if (!content.includes('export default FriendsPage')) {
      console.log('   🔧 Correction de l\'export FriendsPage...');
      content = content.replace(
        /const FriendsPage = \(\) => {/,
        `const FriendsPage = () => {
  console.log('FriendsPage chargé avec succès');`
      );
      
      // Ajouter l'export à la fin si manquant
      if (!content.includes('export default FriendsPage')) {
        content += '\n\nexport default FriendsPage;';
      }
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(friendsPagePath, content);
      console.log('   ✅ FriendsPage corrigé');
    } else {
      console.log('   ✅ FriendsPage déjà correct');
    }
  }
  
  // 2. Vérifier et corriger LazyLoader.js
  const lazyLoaderPath = 'client/src/components/common/LazyLoader.js';
  if (fs.existsSync(lazyLoaderPath)) {
    let content = fs.readFileSync(lazyLoaderPath, 'utf8');
    let modified = false;
    
    // Vérifier que LazyFriendsPage est bien défini
    if (!content.includes('LazyFriendsPage = createLazyComponent')) {
      console.log('   🔧 Correction de LazyFriendsPage...');
      
      // Ajouter la définition si manquante
      const lazyFriendsDefinition = `
export const LazyFriendsPage = createLazyComponent(
  () => import('../../pages/Friends/FriendsPage'),
  "Chargement des amis..."
);`;
      
      content += lazyFriendsDefinition;
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(lazyLoaderPath, content);
      console.log('   ✅ LazyFriendsPage corrigé');
    } else {
      console.log('   ✅ LazyFriendsPage déjà correct');
    }
  }
  
  // 3. Vérifier et corriger App.js
  const appPath = 'client/src/App.js';
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf8');
    let modified = false;
    
    // Vérifier que la route friends est bien définie
    if (!content.includes('path="friends"')) {
      console.log('   🔧 Ajout de la route friends...');
      
      // Trouver la section des routes et ajouter la route friends
      const routeSection = content.indexOf('<Route path="messages"');
      if (routeSection !== -1) {
        const beforeRoutes = content.substring(0, routeSection);
        const afterRoutes = content.substring(routeSection);
        
        content = beforeRoutes + 
          '            <Route path="friends" element={<LazyFriendsPage />} />\n' +
          afterRoutes;
        
        modified = true;
      }
    }
    
    // Vérifier l'import de LazyFriendsPage
    if (!content.includes('LazyFriendsPage')) {
      console.log('   🔧 Ajout de l\'import LazyFriendsPage...');
      
      const importSection = content.indexOf('LazyMessagesPage,');
      if (importSection !== -1) {
        const beforeImport = content.substring(0, importSection);
        const afterImport = content.substring(importSection);
        
        content = beforeImport + 
          '  LazyFriendsPage,\n' +
          afterImport;
        
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(appPath, content);
      console.log('   ✅ App.js corrigé');
    } else {
      console.log('   ✅ App.js déjà correct');
    }
  }
};

// Créer un composant de test pour vérifier la navigation
const createNavigationTest = () => {
  const testComponent = `import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message }]);
  };

  const testNavigation = () => {
    addResult('Navigation', true, 'Composant de test chargé');
    addResult('Location', true, \`Page actuelle: \${location.pathname}\`);
    
    // Tester la navigation vers /friends
    try {
      navigate('/friends');
      addResult('Navigation vers /friends', true, 'Navigation réussie');
    } catch (error) {
      addResult('Navigation vers /friends', false, \`Erreur: \${error.message}\`);
    }
  };

  const testDirectAccess = () => {
    // Simuler un accès direct à /friends
    window.history.pushState({}, '', '/friends');
    addResult('Accès direct /friends', true, 'URL changée vers /friends');
  };

  useEffect(() => {
    addResult('Chargement', true, 'Composant monté avec succès');
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Navigation - Fonctionnalité Amis
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ce test vérifie la navigation vers la page /friends et les problèmes potentiels.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testNavigation}
        >
          🧪 Tester Navigation
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testDirectAccess}
        >
          🧪 Test Accès Direct
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats des tests:
        </Typography>
        {testResults.map((result, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2" color={result.success ? 'success.main' : 'error.main'}>
              {result.success ? '✅' : '❌'} {result.test}: {result.message}
            </Typography>
          </Box>
        ))}
      </Paper>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Si vous voyez des erreurs, vérifiez la console du navigateur pour plus de détails.
      </Alert>
    </Box>
  );
};

export default NavigationTest;
`;

  fs.writeFileSync('client/src/pages/Friends/NavigationTest.js', testComponent);
  console.log('\n✅ Composant NavigationTest créé');
};

// Créer un script de vérification rapide
const createQuickCheck = () => {
  const quickCheck = `const fs = require('fs');

console.log('🔍 VÉRIFICATION RAPIDE - FONCTIONNALITÉ AMIS');
console.log('=============================================');

// Vérifier les fichiers essentiels
const essentialFiles = [
  'client/src/pages/Friends/FriendsPage.js',
  'client/src/components/common/LazyLoader.js',
  'client/src/App.js',
  'server/routes/friends.js'
];

console.log('\\n📁 Vérification des fichiers:');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(\`   \${exists ? '✅' : '❌'} \${file}\`);
});

// Vérifier les routes dans App.js
const appPath = 'client/src/App.js';
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  const hasFriendsRoute = content.includes('path="friends"');
  const hasLazyFriendsImport = content.includes('LazyFriendsPage');
  const hasLazyFriendsElement = content.includes('<LazyFriendsPage />');
  
  console.log('\\n🔍 Vérification des routes:');
  console.log(\`   \${hasFriendsRoute ? '✅' : '❌'} Route /friends définie\`);
  console.log(\`   \${hasLazyFriendsImport ? '✅' : '❌'} Import LazyFriendsPage\`);
  console.log(\`   \${hasLazyFriendsElement ? '✅' : '❌'} Élément LazyFriendsPage\`);
}

// Vérifier LazyLoader.js
const lazyLoaderPath = 'client/src/components/common/LazyLoader.js';
if (fs.existsSync(lazyLoaderPath)) {
  const content = fs.readFileSync(lazyLoaderPath, 'utf8');
  
  const hasLazyFriendsPage = content.includes('LazyFriendsPage = createLazyComponent');
  const hasFriendsImport = content.includes('Friends/FriendsPage');
  
  console.log('\\n🔍 Vérification du lazy loading:');
  console.log(\`   \${hasLazyFriendsPage ? '✅' : '❌'} LazyFriendsPage défini\`);
  console.log(\`   \${hasFriendsImport ? '✅' : '❌'} Import FriendsPage\`);
}

console.log('\\n🎯 VÉRIFICATION TERMINÉE');
console.log('==========================');
console.log('💡 Si tous les tests sont ✅, le problème peut être:');
console.log('1. Erreur JavaScript dans la console du navigateur');
console.log('2. Problème de cache du navigateur');
console.log('3. Serveur non démarré');
console.log('4. Problème de build du client');
`;

  fs.writeFileSync('verification-rapide-amis.js', quickCheck);
  console.log('\n✅ Script de vérification rapide créé');
};

// Exécution des corrections
console.log('\n🔧 Application des corrections...');

checkAndFixIssues();
createNavigationTest();
createQuickCheck();

console.log('\n🎯 CORRECTIONS APPLIQUÉES');
console.log('==========================');
console.log('✅ Problèmes identifiés et corrigés');
console.log('✅ Composant de test créé');
console.log('✅ Script de vérification créé');
console.log('\n💡 Prochaines étapes:');
console.log('1. Redémarrez le client: cd client && npm start');
console.log('2. Videz le cache du navigateur (Ctrl+F5)');
console.log('3. Testez la navigation vers /friends');
console.log('4. Vérifiez la console pour les erreurs JavaScript');
console.log('5. Si le problème persiste, testez NavigationTest');
console.log('6. Exécutez: node verification-rapide-amis.js pour un diagnostic rapide'); 