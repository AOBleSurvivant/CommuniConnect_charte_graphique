// Test de configuration CommuniConnect
const testConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

console.log('✅ Configuration de test chargée');
module.exports = testConfig;
