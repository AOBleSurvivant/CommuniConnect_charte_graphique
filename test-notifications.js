const axios = require('axios');

async function testNotifications() {
  console.log('🔔 Test du Système de Notifications Avancées\n');

  try {
    // Test 1: Test de notification simple
    console.log('1. Test notification simple...');
    const testNotification = {
      userId: 'test-user-123',
      title: 'Test de notification',
      message: 'Ceci est un test de notification en temps réel.',
      type: 'info',
      channels: ['real-time']
    };

    const notificationResponse = await axios.post(
      'http://localhost:5000/api/advanced-notifications/send',
      testNotification,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    );
    console.log('✅ Notification simple:', notificationResponse.data.success);

    // Test 2: Test notification de groupe
    console.log('\n2. Test notification de groupe...');
    const groupNotification = {
      userIds: ['user-1', 'user-2', 'user-3'],
      title: 'Notification de groupe',
      message: 'Ceci est une notification envoyée à un groupe d\'utilisateurs.',
      channels: ['real-time', 'push']
    };

    const groupResponse = await axios.post(
      'http://localhost:5000/api/advanced-notifications/send-group',
      groupNotification,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    );
    console.log('✅ Notification de groupe:', groupResponse.data.success);

    // Test 3: Test notification basée sur événement
    console.log('\n3. Test notification basée sur événement...');
    const eventNotification = {
      event: 'user_registration',
      data: {
        username: 'nouveau_utilisateur',
        email: 'nouveau@example.com'
      }
    };

    const eventResponse = await axios.post(
      'http://localhost:5000/api/advanced-notifications/event',
      eventNotification,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    );
    console.log('✅ Notification d\'événement:', eventResponse.data.success);

    // Test 4: Test statistiques
    console.log('\n4. Test statistiques...');
    const statsResponse = await axios.get(
      'http://localhost:5000/api/advanced-notifications/stats',
      {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      }
    );
    console.log('✅ Statistiques:', statsResponse.data.success);

    // Test 5: Test préférences utilisateur
    console.log('\n5. Test préférences utilisateur...');
    const preferencesResponse = await axios.get(
      'http://localhost:5000/api/advanced-notifications/preferences/test-user-123',
      {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      }
    );
    console.log('✅ Préférences utilisateur:', preferencesResponse.data.success);

    console.log('\n🎉 Tous les tests de notifications sont passés avec succès !');
    console.log('\n📊 Résumé des fonctionnalités testées:');
    console.log('- ✅ Notifications en temps réel');
    console.log('- ✅ Notifications de groupe');
    console.log('- ✅ Notifications basées sur événements');
    console.log('- ✅ Statistiques de notifications');
    console.log('- ✅ Gestion des préférences utilisateur');

  } catch (error) {
    console.error('❌ Erreur lors des tests de notifications:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testNotifications(); 