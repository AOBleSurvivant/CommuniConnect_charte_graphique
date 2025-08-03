// Script de démarrage pour le mode développement
process.env.PORT = 5000;
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = 'communiconnect-dev-secret-key-2024';
process.env.JWT_EXPIRE = '7d';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/communiconnect';

console.log('🚀 Démarrage de CommuniConnect en mode développement...');
console.log('📋 Configuration:');
console.log('   - Port:', process.env.PORT);
console.log('   - Mode:', process.env.NODE_ENV);
console.log('   - JWT Secret:', process.env.JWT_SECRET ? '✅ Configuré' : '❌ Manquant');
console.log('   - CORS Origin:', process.env.CORS_ORIGIN);
console.log('');

// Démarrer le serveur
require('./index.js'); 