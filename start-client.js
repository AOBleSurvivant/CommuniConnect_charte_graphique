const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage du client CommuniConnect...');

const serveProcess = spawn('serve', ['-s', 'client/build', '-l', '3000'], {
  stdio: 'inherit',
  shell: true
});

serveProcess.on('error', (error) => {
  console.error('❌ Erreur lors du démarrage du client:', error.message);
  process.exit(1);
});

serveProcess.on('exit', (code) => {
  console.log(`📤 Client arrêté avec le code: ${code}`);
  process.exit(code);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('🛑 Arrêt du client...');
  serveProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du client...');
  serveProcess.kill('SIGTERM');
}); 