@echo off
echo ========================================
echo VERIFICATION DE L'ETAT DE COMMUNICONNECT
echo ========================================
echo.

echo 1. Verification du serveur...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Serveur accessible
) else (
    echo ❌ Serveur inaccessible - Demarrez le serveur d'abord
    echo.
    echo Pour demarrer le serveur:
    echo cd server
    echo npm start
    pause
    exit /b 1
)

echo.
echo 2. Test d'authentification...
node -e "
const axios = require('axios');
axios.post('http://localhost:5000/api/auth/login', {
  identifier: 'test@communiconnect.gn',
  password: 'test123'
}).then(response => {
  console.log('✅ Authentification reussie');
  return response.data.token;
}).then(token => {
  console.log('3. Test invitation d\'amis...');
  return axios.post('http://localhost:5000/api/friends/request', {
    recipientId: 'ami@test.com'
  }, {
    headers: { Authorization: 'Bearer ' + token }
  });
}).then(response => {
  console.log('✅ Invitation d\'ami reussie');
  console.log('4. Test creation conversation...');
  return axios.post('http://localhost:5000/api/messages/conversations', {
    participants: ['user-123'],
    name: 'Test Conversation',
    type: 'private'
  }, {
    headers: { Authorization: 'Bearer ' + token }
  });
}).then(response => {
  console.log('✅ Creation conversation reussie');
  console.log('5. Test envoi message...');
  return axios.post('http://localhost:5000/api/messages/send', {
    conversationId: response.data.conversation._id,
    content: 'Test message'
  }, {
    headers: { Authorization: 'Bearer ' + token }
  });
}).then(response => {
  console.log('✅ Envoi message reussi');
  console.log('6. Test creation evenement...');
  return axios.post('http://localhost:5000/api/events', {
    title: 'Test Event',
    description: 'Test Description',
    type: 'reunion',
    category: 'communautaire',
    startDate: '2024-12-25',
    endDate: '2024-12-26',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Test Venue',
    address: 'Test Address',
    latitude: 9.5370,
    longitude: -13.6785,
    capacity: 50,
    isFree: true,
    price: { amount: 0, currency: 'GNF' }
  }, {
    headers: { 
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
}).then(response => {
  console.log('✅ Creation evenement reussie');
  console.log('');
  console.log('🎉 TOUTES LES FONCTIONNALITES FONCTIONNENT !');
}).catch(error => {
  console.log('❌ Erreur:', error.response?.data || error.message);
});
"

echo.
echo ========================================
echo VERIFICATION TERMINEE
echo ========================================
pause 