const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Fonction pour tester la création d'événement avec des données valides
async function testEventCreation() {
  try {
    const eventData = {
      title: 'Test Event - Réunion de quartier',
      description: 'Test de création d\'événement avec validation corrigée',
      type: 'reunion',
      category: 'communautaire',
      startDate: '2024-12-15',
      endDate: '2024-12-15',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Salle communale',
      address: 'Quartier Kaloum, Conakry, Guinée',
      capacity: 50,
      isFree: true,
      price: {
        amount: 0,
        currency: 'GNF'
      },
      location: {
        region: 'Conakry',
        prefecture: 'Conakry',
        commune: 'Kaloum',
        quartier: 'Kaloum-Centre',
        address: 'Quartier Kaloum, Conakry, Guinée',
        coordinates: {
          latitude: 9.5370,
          longitude: -13.6785
        }
      },
      contactPhone: '+224 123 456 789',
      contactEmail: 'test@example.com'
    };

    console.log('📤 Envoi des données d\'événement:', eventData);

    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });

    console.log('✅ Événement créé avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour corriger les problèmes de validation
async function fixValidationIssues() {
  console.log('🔧 Correction des problèmes de validation...');
  
  // Test de création d'événement
  const result = await testEventCreation();
  
  if (result) {
    console.log('✅ Problèmes de validation corrigés');
  } else {
    console.log('❌ Échec de la correction des problèmes de validation');
  }
}

// Exécution
if (require.main === module) {
  fixValidationIssues();
}

module.exports = { testEventCreation, fixValidationIssues }; 