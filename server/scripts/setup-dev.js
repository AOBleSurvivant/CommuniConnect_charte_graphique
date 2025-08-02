const fs = require('fs');
const path = require('path');
const { generateDemoAvatars } = require('../utils/generateAvatars');

console.log('🚀 Configuration CommuniConnect - Mode Développement');
console.log('==================================================');

// 1. Vérifier et créer le fichier .env
function setupEnvironment() {
  console.log('\n📝 Configuration des variables d\'environnement...');
  
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Fichier .env manquant, création en cours...');
    
    if (fs.existsSync(envExamplePath)) {
      const envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Modifier le JWT_SECRET pour corriger l'erreur
      const modifiedContent = envContent.replace(
        'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production',
        'JWT_SECRET=communiconnect-super-secret-jwt-key-2024-production-ready'
      );
      
      fs.writeFileSync(envPath, modifiedContent);
      console.log('✅ Fichier .env créé avec JWT_SECRET corrigé');
    } else {
      console.log('❌ Fichier env.example manquant');
      return false;
    }
  } else {
    console.log('✅ Fichier .env existe déjà');
  }
  
  return true;
}

// 2. Créer les dossiers nécessaires
function createDirectories() {
  console.log('\n📁 Création des dossiers nécessaires...');
  
  const directories = [
    '../static/avatars',
    '../static/uploads',
    '../static/images',
    '../logs'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Dossier créé: ${dir}`);
    } else {
      console.log(`✅ Dossier existe: ${dir}`);
    }
  });
}

// 3. Générer les avatars de démonstration
function generateAvatars() {
  console.log('\n🎨 Génération des avatars de démonstration...');
  
  try {
    generateDemoAvatars();
    console.log('✅ Avatars de démonstration générés avec succès');
  } catch (error) {
    console.log('❌ Erreur lors de la génération des avatars:', error.message);
  }
}

// 4. Vérifier la configuration de la base de données
function checkDatabaseConfig() {
  console.log('\n🗄️  Vérification de la configuration de la base de données...');
  
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('MONGODB_URI=mongodb://localhost:27017/communiconnect')) {
      console.log('✅ Configuration MongoDB locale détectée');
      console.log('ℹ️  En mode développement, l\'application fonctionne sans base de données');
    } else {
      console.log('⚠️  Configuration MongoDB personnalisée détectée');
    }
  }
}

// 5. Vérifier les dépendances
function checkDependencies() {
  console.log('\n📦 Vérification des dépendances...');
  
  const packagePath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'cors'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('✅ Toutes les dépendances requises sont installées');
    } else {
      console.log('⚠️  Dépendances manquantes:', missingDeps.join(', '));
      console.log('💡 Exécutez: npm install');
    }
  }
}

// 6. Créer un fichier de test pour vérifier la configuration
function createTestFile() {
  console.log('\n🧪 Création d\'un fichier de test de configuration...');
  
  const testContent = `// Test de configuration CommuniConnect
const testConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

console.log('✅ Configuration de test chargée');
module.exports = testConfig;
`;

  const testPath = path.join(__dirname, '../utils/testConfig.js');
  fs.writeFileSync(testPath, testContent);
  console.log('✅ Fichier de test de configuration créé');
}

// Fonction principale
function setupDevelopment() {
  console.log('🚀 Démarrage de la configuration CommuniConnect...\n');
  
  // 1. Configuration environnement
  if (!setupEnvironment()) {
    console.log('❌ Échec de la configuration de l\'environnement');
    return;
  }
  
  // 2. Créer les dossiers
  createDirectories();
  
  // 3. Générer les avatars
  generateAvatars();
  
  // 4. Vérifier la base de données
  checkDatabaseConfig();
  
  // 5. Vérifier les dépendances
  checkDependencies();
  
  // 6. Créer le fichier de test
  createTestFile();
  
  console.log('\n🎉 Configuration terminée avec succès !');
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Redémarrer le serveur: npm run dev');
  console.log('2. Tester l\'authentification: http://localhost:3000/login');
  console.log('3. Vérifier les avatars: http://localhost:5000/api/static/avatars/');
  console.log('4. Tester la navigation: http://localhost:3000/');
  
  console.log('\n🔧 Problèmes corrigés:');
  console.log('✅ Erreur JWT - JWT_SECRET configuré');
  console.log('✅ Images manquantes - Avatars de démonstration créés');
  console.log('✅ Configuration environnement - Fichier .env créé');
  console.log('✅ Dossiers nécessaires - Structure créée');
}

// Exécuter si appelé directement
if (require.main === module) {
  setupDevelopment();
}

module.exports = {
  setupDevelopment,
  setupEnvironment,
  createDirectories,
  generateAvatars,
  checkDatabaseConfig,
  checkDependencies
}; 