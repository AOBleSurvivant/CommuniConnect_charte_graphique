const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';

// Utilisateurs de test
const TEST_USERS = [
  {
    email: 'test1@guinee.gn',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User1',
    phone: '+224123456781',
    dateOfBirth: '1990-01-01',
    gender: 'Homme',
    quartier: 'Test Quartier',
    ville: 'Conakry',
    region: 'Conakry',
    coordinates: {
      latitude: 9.5370,
      longitude: -13.6785
    }
  },
  {
    email: 'test2@guinee.gn',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User2',
    phone: '+224123456782',
    dateOfBirth: '1990-01-01',
    gender: 'Homme',
    quartier: 'Test Quartier',
    ville: 'Conakry',
    region: 'Conakry',
    coordinates: {
      latitude: 9.5370,
      longitude: -13.6785
    }
  }
];

// Fonction pour créer un utilisateur
async function createUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    if (response.data.success) {
      console.log(`✅ Utilisateur créé: ${userData.email}`);
      return response.data;
    } else {
      console.log(`⚠️ Utilisateur déjà existant: ${userData.email}`);
      return null;
    }
  } catch (error) {
    if (error.response?.data?.message?.includes('déjà existant')) {
      console.log(`⚠️ Utilisateur déjà existant: ${userData.email}`);
      return null;
    } else {
      console.error(`❌ Erreur création utilisateur ${userData.email}:`, error.response?.data || error.message);
      return null;
    }
  }
}

// Fonction principale
async function createTestUsers() {
  console.log('👥 Création des utilisateurs de test...\n');
  
  for (const userData of TEST_USERS) {
    await createUser(userData);
  }
  
  console.log('\n✅ Création des utilisateurs terminée !');
  console.log('\nVous pouvez maintenant lancer le test complet avec:');
  console.log('node test-systeme-complet.js');
}

// Exécuter le script
createTestUsers().catch(console.error); 