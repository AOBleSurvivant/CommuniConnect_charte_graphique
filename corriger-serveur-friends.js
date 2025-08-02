const fs = require('fs');

console.log('🔧 CORRECTION SERVEUR - ROUTE FRIENDS');
console.log('======================================');

const serverPath = 'server/server.js';

if (fs.existsSync(serverPath)) {
  let content = fs.readFileSync(serverPath, 'utf8');
  
  console.log('📄 Ajout de la route friends dans server.js...');
  
  // Vérifier si la route friends est déjà présente
  if (!content.includes('friends')) {
    // Ajouter l'import de la route friends
    if (content.includes('const express = require(\'express\')')) {
      content = content.replace(
        'const express = require(\'express\')',
        'const express = require(\'express\');\nconst friendsRoutes = require(\'./routes/friends\');'
      );
    }
    
    // Ajouter l'utilisation de la route friends
    if (content.includes('app.use(\'/api/')) {
      content = content.replace(
        'app.use(\'/api/',
        'app.use(\'/api/friends\', friendsRoutes);\napp.use(\'/api/'
      );
    }
    
    fs.writeFileSync(serverPath, content);
    console.log('✅ Route friends ajoutée au serveur');
  } else {
    console.log('✅ Route friends déjà présente');
  }
  
  // Vérifier le résultat
  const newContent = fs.readFileSync(serverPath, 'utf8');
  console.log(`   Route friends dans server.js: ${newContent.includes('friends') ? '✅' : '❌'}`);
  
} else {
  console.log('❌ server.js non trouvé');
}

console.log('\n🎯 CORRECTION TERMINÉE');
console.log('=======================');
console.log('💡 Prochaines étapes:');
console.log('1. Redémarrez le serveur: cd server && npm start');
console.log('2. Redémarrez le client: cd client && npm start');
console.log('3. Testez la navigation vers /friends'); 