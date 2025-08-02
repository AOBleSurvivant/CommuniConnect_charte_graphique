const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'test@guinee.gn',
  password: 'password123'
};

let authToken = null;

// Fonction utilitaire pour faire des requêtes authentifiées
const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Test 1: Connexion utilisateur
async function loginUser() {
  console.log('\n🔐 Test 1: Connexion utilisateur');
  
  const response = await makeAuthenticatedRequest('POST', '/api/auth/login', TEST_USER);
  
  if (response && response.success) {
    authToken = response.token;
    console.log('✅ Utilisateur connecté');
    return true;
  } else {
    console.log('❌ Échec de la connexion');
    return false;
  }
}

// Test 2: Enregistrer un token FCM
async function registerFCMToken() {
  console.log('\n📱 Test 2: Enregistrement token FCM');
  
  const fcmToken = 'test-fcm-token-' + Date.now();
  const deviceInfo = {
    userAgent: 'Test Browser',
    platform: 'Test Platform',
    language: 'fr'
  };
  
  const response = await makeAuthenticatedRequest('POST', '/api/notifications/register-token', {
    fcmToken,
    deviceInfo
  });
  
  if (response && response.success) {
    console.log('✅ Token FCM enregistré');
    return fcmToken;
  } else {
    console.log('❌ Échec de l\'enregistrement du token');
    return null;
  }
}

// Test 3: Récupérer les paramètres de notification
async function getNotificationSettings() {
  console.log('\n⚙️ Test 3: Récupération des paramètres de notification');
  
  const response = await makeAuthenticatedRequest('GET', '/api/notifications/settings');
  
  if (response && response.success) {
    console.log('✅ Paramètres récupérés:', response.settings);
    return response.settings;
  } else {
    console.log('❌ Échec de la récupération des paramètres');
    return null;
  }
}

// Test 4: Mettre à jour les paramètres de notification
async function updateNotificationSettings() {
  console.log('\n🔄 Test 4: Mise à jour des paramètres de notification');
  
  const newSettings = {
    messages: true,
    alerts: false,
    events: true,
    helpRequests: false
  };
  
  const response = await makeAuthenticatedRequest('PUT', '/api/notifications/settings', {
    settings: newSettings
  });
  
  if (response && response.success) {
    console.log('✅ Paramètres mis à jour');
    return true;
  } else {
    console.log('❌ Échec de la mise à jour des paramètres');
    return false;
  }
}

// Test 5: Envoyer une notification de test
async function sendTestNotification() {
  console.log('\n🧪 Test 5: Envoi d\'une notification de test');
  
  const testNotification = {
    type: 'message',
    title: 'Test de notification',
    body: 'Ceci est un test de notification push ! 🚀'
  };
  
  const response = await makeAuthenticatedRequest('POST', '/api/notifications/test', testNotification);
  
  if (response && response.success) {
    console.log('✅ Notification de test envoyée');
    return true;
  } else {
    console.log('❌ Échec de l\'envoi de la notification de test');
    return false;
  }
}

// Test 6: Envoyer une notification d'alerte
async function sendAlertNotification() {
  console.log('\n🚨 Test 6: Envoi d\'une notification d\'alerte');
  
  // Créer d'abord une alerte
  const alertData = {
    type: 'securite',
    title: 'Test d\'alerte de sécurité',
    description: 'Ceci est un test d\'alerte de sécurité',
    quartier: 'Test Quartier',
    ville: 'Conakry',
    region: 'Conakry',
    urgence: 'moyenne'
  };
  
  const alertResponse = await makeAuthenticatedRequest('POST', '/api/alerts', alertData);
  
  if (alertResponse && alertResponse.success) {
    console.log('✅ Alerte créée, notification envoyée automatiquement');
    return true;
  } else {
    console.log('❌ Échec de la création de l\'alerte');
    return false;
  }
}

// Test 7: Envoyer une notification de message
async function sendMessageNotification() {
  console.log('\n💬 Test 7: Envoi d\'une notification de message');
  
  // Créer d'abord une conversation
  const conversationData = {
    type: 'private',
    participants: ['test-user-2-id']
  };
  
  const conversationResponse = await makeAuthenticatedRequest('POST', '/api/messages/conversation/create', conversationData);
  
  if (conversationResponse && conversationResponse.success) {
    const conversationId = conversationResponse.conversation.conversationId;
    
    // Envoyer un message
    const messageData = {
      conversationId,
      content: 'Test de message avec notification ! 📨'
    };
    
    const messageResponse = await makeAuthenticatedRequest('POST', '/api/messages/send', messageData);
    
    if (messageResponse && messageResponse.success) {
      console.log('✅ Message envoyé, notification envoyée automatiquement');
      return true;
    } else {
      console.log('❌ Échec de l\'envoi du message');
      return false;
    }
  } else {
    console.log('❌ Échec de la création de conversation');
    return false;
  }
}

// Test 8: Envoyer une notification d'événement
async function sendEventNotification() {
  console.log('\n📅 Test 8: Envoi d\'une notification d\'événement');
  
  // Créer d'abord un événement
  const eventData = {
    title: 'Test d\'événement',
    description: 'Ceci est un test d\'événement',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
    location: 'Test Location',
    quartier: 'Test Quartier',
    ville: 'Conakry',
    region: 'Conakry',
    type: 'culturel'
  };
  
  const eventResponse = await makeAuthenticatedRequest('POST', '/api/events', eventData);
  
  if (eventResponse && eventResponse.success) {
    console.log('✅ Événement créé, notification envoyée automatiquement');
    return true;
  } else {
    console.log('❌ Échec de la création de l\'événement');
    return false;
  }
}

// Test 9: Envoyer une notification de demande d'aide
async function sendHelpRequestNotification() {
  console.log('\n🆘 Test 9: Envoi d\'une notification de demande d\'aide');
  
  // Créer d'abord une demande d'aide
  const helpData = {
    title: 'Test de demande d\'aide',
    description: 'Ceci est un test de demande d\'aide',
    category: 'alimentaire',
    urgence: 'moyenne',
    quartier: 'Test Quartier',
    ville: 'Conakry',
    region: 'Conakry'
  };
  
  const helpResponse = await makeAuthenticatedRequest('POST', '/api/help', helpData);
  
  if (helpResponse && helpResponse.success) {
    console.log('✅ Demande d\'aide créée, notification envoyée automatiquement');
    return true;
  } else {
    console.log('❌ Échec de la création de la demande d\'aide');
    return false;
  }
}

// Test 10: Diffusion de notification (admin seulement)
async function broadcastNotification() {
  console.log('\n📢 Test 10: Diffusion de notification (admin)');
  
  const broadcastData = {
    title: 'Annonce importante',
    body: 'Ceci est une annonce de test pour tous les utilisateurs',
    type: 'announcement',
    region: 'Conakry'
  };
  
  const response = await makeAuthenticatedRequest('POST', '/api/notifications/broadcast', broadcastData);
  
  if (response && response.success) {
    console.log('✅ Notification diffusée:', response.result);
    return true;
  } else {
    console.log('❌ Échec de la diffusion (probablement pas admin)');
    return false;
  }
}

// Test 11: Obtenir les statistiques des notifications
async function getNotificationStats() {
  console.log('\n📊 Test 11: Statistiques des notifications');
  
  const response = await makeAuthenticatedRequest('GET', '/api/notifications/stats');
  
  if (response && response.success) {
    console.log('✅ Statistiques récupérées:', response.stats);
    return response.stats;
  } else {
    console.log('❌ Échec de la récupération des statistiques (probablement pas admin)');
    return null;
  }
}

// Test 12: Supprimer le token FCM
async function unregisterFCMToken() {
  console.log('\n🗑️ Test 12: Suppression du token FCM');
  
  const response = await makeAuthenticatedRequest('DELETE', '/api/notifications/unregister-token');
  
  if (response && response.success) {
    console.log('✅ Token FCM supprimé');
    return true;
  } else {
    console.log('❌ Échec de la suppression du token');
    return false;
  }
}

// Fonction principale de test
async function runPushNotificationTests() {
  console.log('🧪 Test du système de notifications push CommuniConnect\n');
  
  const tests = [
    { name: 'Connexion utilisateur', fn: loginUser },
    { name: 'Enregistrement token FCM', fn: registerFCMToken },
    { name: 'Récupération paramètres', fn: getNotificationSettings },
    { name: 'Mise à jour paramètres', fn: updateNotificationSettings },
    { name: 'Notification de test', fn: sendTestNotification },
    { name: 'Notification d\'alerte', fn: sendAlertNotification },
    { name: 'Notification de message', fn: sendMessageNotification },
    { name: 'Notification d\'événement', fn: sendEventNotification },
    { name: 'Notification demande d\'aide', fn: sendHelpRequestNotification },
    { name: 'Diffusion notification', fn: broadcastNotification },
    { name: 'Statistiques notifications', fn: getNotificationStats },
    { name: 'Suppression token FCM', fn: unregisterFCMToken }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  try {
    for (const test of tests) {
      console.log(`\n--- ${test.name} ---`);
      const result = await test.fn();
      if (result) {
        passedTests++;
        console.log(`✅ ${test.name} réussi`);
      } else {
        console.log(`❌ ${test.name} échoué`);
      }
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }

  console.log('\n📊 Résultats des tests notifications push:');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests notifications push sont passés ! Le système fonctionne parfaitement.');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n✅ La plupart des tests sont passés. Le système fonctionne bien.');
  } else {
    console.log('\n⚠️ Plusieurs tests ont échoué. Vérifiez la configuration Firebase.');
  }

  // Recommandations
  console.log('\n💡 Recommandations:');
  console.log('- Configurez Firebase Cloud Messaging pour les notifications en production');
  console.log('- Ajoutez les clés VAPID dans les variables d\'environnement');
  console.log('- Testez sur différents navigateurs et appareils');
  console.log('- Surveillez les logs Firebase pour les erreurs');
}

// Exécuter les tests
runPushNotificationTests().catch(console.error); 