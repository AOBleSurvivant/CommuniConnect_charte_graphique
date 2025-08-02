const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION BOUTON NOTIFICATIONS');
console.log('===================================');

// Vérifier si le composant NotificationCenter existe
const notificationCenterPath = 'client/src/components/common/NotificationCenter.js';
const navigationPath = 'client/src/components/Layout/Navigation.js';

console.log('\n📁 Vérification des fichiers:');
console.log(`   ${fs.existsSync(notificationCenterPath) ? '✅' : '❌'} NotificationCenter.js`);
console.log(`   ${fs.existsSync(navigationPath) ? '✅' : '❌'} Navigation.js`);

if (fs.existsSync(navigationPath)) {
  const navigationContent = fs.readFileSync(navigationPath, 'utf8');
  
  console.log('\n🔍 Analyse de la navigation:');
  
  // Vérifier l'import du NotificationCenter
  const hasImport = navigationContent.includes('import NotificationCenter');
  console.log(`   ${hasImport ? '✅' : '❌'} Import NotificationCenter`);
  
  // Vérifier l'utilisation du NotificationCenter
  const hasUsage = navigationContent.includes('<NotificationCenter />');
  console.log(`   ${hasUsage ? '✅' : '❌'} Utilisation NotificationCenter`);
  
  // Vérifier la position dans le JSX
  const hasNotificationInToolbar = navigationContent.includes('NotificationCenter') && 
                                 navigationContent.includes('Toolbar') &&
                                 navigationContent.includes('Actions utilisateur');
  console.log(`   ${hasNotificationInToolbar ? '✅' : '❌'} Position dans la toolbar`);
}

if (fs.existsSync(notificationCenterPath)) {
  const notificationContent = fs.readFileSync(notificationCenterPath, 'utf8');
  
  console.log('\n🔍 Analyse du NotificationCenter:');
  
  // Vérifier l'export du composant
  const hasExport = notificationContent.includes('export default NotificationCenter');
  console.log(`   ${hasExport ? '✅' : '❌'} Export du composant`);
  
  // Vérifier le rendu du bouton
  const hasIconButton = notificationContent.includes('<IconButton');
  console.log(`   ${hasIconButton ? '✅' : '❌'} Bouton IconButton`);
  
  // Vérifier le badge
  const hasBadge = notificationContent.includes('<Badge');
  console.log(`   ${hasBadge ? '✅' : '❌'} Badge de notifications`);
  
  // Vérifier l'icône
  const hasNotificationsIcon = notificationContent.includes('Notifications') || 
                              notificationContent.includes('NotificationsActive');
  console.log(`   ${hasNotificationsIcon ? '✅' : '❌'} Icône de notifications`);
}

// Créer un composant de test simple pour le bouton de notifications
const createSimpleNotificationButton = () => {
  const simpleButton = `import React from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const SimpleNotificationButton = () => {
  return (
    <Tooltip title="Notifications">
      <IconButton
        color="inherit"
        sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Badge badgeContent={0} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default SimpleNotificationButton;
`;

  fs.writeFileSync('client/src/components/common/SimpleNotificationButton.js', simpleButton);
  console.log('\n✅ Composant SimpleNotificationButton créé');
};

// Corriger le NotificationCenter si nécessaire
const fixNotificationCenter = () => {
  if (!fs.existsSync(notificationCenterPath)) {
    console.log('\n❌ NotificationCenter.js non trouvé');
    return;
  }

  let content = fs.readFileSync(notificationCenterPath, 'utf8');
  let modified = false;

  // Vérifier si le bouton est bien visible
  if (!content.includes('sx={{ position: \'relative\' }}')) {
    console.log('\n🔧 Correction de la visibilité du bouton...');
    
    // Remplacer le style du bouton pour le rendre plus visible
    content = content.replace(
      /<IconButton[^>]*>/,
      `<IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 40,
            minHeight: 40,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}`
    );
    modified = true;
  }

  // Vérifier si le badge est bien configuré
  if (!content.includes('max={99}')) {
    console.log('\n🔧 Correction du badge...');
    content = content.replace(
      /<Badge[^>]*>/,
      `<Badge badgeContent={unreadCount} color="error" max={99} showZero={false}>`
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(notificationCenterPath, content);
    console.log('✅ NotificationCenter corrigé');
  } else {
    console.log('✅ NotificationCenter déjà correct');
  }
};

// Corriger la navigation si nécessaire
const fixNavigation = () => {
  if (!fs.existsSync(navigationPath)) {
    console.log('\n❌ Navigation.js non trouvé');
    return;
  }

  let content = fs.readFileSync(navigationPath, 'utf8');
  let modified = false;

  // Vérifier si le NotificationCenter est bien positionné
  if (!content.includes('NotificationCenter')) {
    console.log('\n🔧 Ajout du NotificationCenter dans la navigation...');
    
    // Ajouter l'import si manquant
    if (!content.includes('import NotificationCenter')) {
      content = content.replace(
        /import.*NotificationCenter.*from.*;/,
        `import NotificationCenter from '../common/NotificationCenter';`
      );
    }
    
    // Ajouter le composant dans la toolbar
    const toolbarSection = content.indexOf('{/* Actions utilisateur */}');
    if (toolbarSection !== -1) {
      const insertPosition = content.indexOf('<Box sx={{ display: \'flex\', alignItems: \'center\', gap: 1 }}>');
      if (insertPosition !== -1) {
        const beforeActions = content.substring(0, insertPosition);
        const afterActions = content.substring(insertPosition);
        
        content = beforeActions + 
          '<Box sx={{ display: \'flex\', alignItems: \'center\', gap: 1 }}>\n' +
          '              {/* Centre de notifications */}\n' +
          '              <NotificationCenter />\n' +
          '\n' +
          afterActions.substring(afterActions.indexOf('{/* Menu utilisateur */}'));
        
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(navigationPath, content);
    console.log('✅ Navigation corrigée');
  } else {
    console.log('✅ Navigation déjà correcte');
  }
};

// Créer un composant de test pour vérifier la visibilité
const createTestComponent = () => {
  const testComponent = `import React from 'react';
import { Box, IconButton, Badge, Tooltip, Typography } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const NotificationTest = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      p: 2, 
      border: '1px solid #ccc',
      backgroundColor: '#f5f5f5'
    }}>
      <Typography variant="h6">Test Bouton Notifications:</Typography>
      
      <Tooltip title="Notifications">
        <IconButton
          color="primary"
          sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 40,
            minHeight: 40,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            '&:hover': {
              backgroundColor: '#f0f0f0'
            }
          }}
        >
          <Badge badgeContent={3} color="error" max={99}>
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Typography variant="body2" color="text.secondary">
        Le bouton devrait être visible ci-dessus
      </Typography>
    </Box>
  );
};

export default NotificationTest;
`;

  fs.writeFileSync('client/src/components/common/NotificationTest.js', testComponent);
  console.log('\n✅ Composant de test NotificationTest créé');
};

// Exécution des corrections
console.log('\n🔧 Application des corrections...');

fixNotificationCenter();
fixNavigation();
createSimpleNotificationButton();
createTestComponent();

console.log('\n🎯 CORRECTIONS APPLIQUÉES');
console.log('==========================');
console.log('✅ NotificationCenter vérifié et corrigé');
console.log('✅ Navigation mise à jour');
console.log('✅ Composants de test créés');
console.log('\n💡 Prochaines étapes:');
console.log('1. Redémarrez le client: cd client && npm start');
console.log('2. Vérifiez que le bouton de notifications est visible');
console.log('3. Testez le composant NotificationTest si nécessaire'); 