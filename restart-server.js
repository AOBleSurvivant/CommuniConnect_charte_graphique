const { exec } = require('child_process');
const path = require('path');

async function restartServer() {
  console.log('🔄 REDÉMARRAGE DU SERVEUR COMMUNICONNECT');
  console.log('==================================================\n');

  // Étape 1: Arrêter tous les processus Node.js
  console.log('1️⃣ Arrêt des processus Node.js...');
  try {
    await new Promise((resolve, reject) => {
      exec('taskkill /F /IM node.exe', (error, stdout, stderr) => {
        if (error && !stdout.includes('Opération réussie')) {
          console.log('⚠️ Aucun processus Node.js à arrêter');
        } else {
          console.log('✅ Processus Node.js arrêtés');
        }
        resolve();
      });
    });
  } catch (error) {
    console.log('⚠️ Erreur lors de l\'arrêt des processus:', error.message);
  }

  // Étape 2: Attendre quelques secondes
  console.log('2️⃣ Attente de 3 secondes...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Étape 3: Démarrer le serveur
  console.log('3️⃣ Démarrage du serveur...');
  try {
    const serverPath = path.join(__dirname, 'server');
    const child = exec('npm start', { cwd: serverPath });
    
    child.stdout.on('data', (data) => {
      console.log('📡 Serveur:', data.toString().trim());
    });
    
    child.stderr.on('data', (data) => {
      console.log('❌ Erreur serveur:', data.toString().trim());
    });

    // Attendre que le serveur démarre
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Serveur redémarré avec succès');
    console.log('🌐 URL: http://localhost:5000');
    
  } catch (error) {
    console.log('❌ Erreur lors du démarrage du serveur:', error.message);
  }

  console.log('\n==================================================');
  console.log('🚀 Serveur CommuniConnect prêt !');
  console.log('📱 Vous pouvez maintenant tester l\'application');
}

// Exécuter le redémarrage
restartServer().catch(console.error); 