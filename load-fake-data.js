const fs = require('fs');
const path = require('path');

console.log('📊 Chargement des données fictives CommuniConnect...\n');

// Charger les données fictives
const livestreams = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/data/livestreams.json'), 'utf8'));
const events = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/data/events.json'), 'utf8'));
const messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/data/messages.json'), 'utf8'));
const friends = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/data/friends.json'), 'utf8'));

console.log('✅ Données fictives chargées avec succès !');
console.log('\n📋 RÉSUMÉ DES DONNÉES CRÉÉES:');
console.log(`📺 Lives: ${livestreams.length} lives d'alerte et communautaires`);
console.log(`📅 Événements: ${events.length} événements (nettoyage, formation, sport, culture, santé)`);
console.log(`💬 Messages: ${messages.length} conversations avec ${messages.reduce((total, conv) => total + conv.messages.length, 0)} messages`);
console.log(`👥 Invitations d'amis: ${friends.length} invitations en attente`);

console.log('\n🎯 DÉTAIL DES DONNÉES:');

console.log('\n📺 LIVES CRÉÉS:');
livestreams.forEach((live, index) => {
  console.log(`${index + 1}. ${live.title} (${live.type}, ${live.urgency})`);
});

console.log('\n📅 ÉVÉNEMENTS CRÉÉS:');
events.forEach((event, index) => {
  console.log(`${index + 1}. ${event.title} (${event.type}, ${event.category})`);
});

console.log('\n💬 CONVERSATIONS CRÉÉES:');
messages.forEach((conv, index) => {
  console.log(`${index + 1}. ${conv.name} (${conv.messages.length} messages)`);
});

console.log('\n👥 INVITATIONS D\'AMIS:');
friends.forEach((friend, index) => {
  console.log(`${index + 1}. Invitation à ${friend.recipient} (${friend.status})`);
});

console.log('\n🔗 URLs POUR TESTER:');
console.log('- Lives: http://localhost:3000/livestreams');
console.log('- Événements: http://localhost:3000/events');
console.log('- Messages: http://localhost:3000/messages');
console.log('- Amis: http://localhost:3000/friends');

console.log('\n🎉 DONNÉES FICTIVES PRÊTES À L\'UTILISATION !');
console.log('\n💡 INSTRUCTIONS:');
console.log('1. Assurez-vous que le serveur fonctionne (npm start dans server/)');
console.log('2. Assurez-vous que le client fonctionne (npm start dans client/)');
console.log('3. Connectez-vous avec test@communiconnect.gn / test123');
console.log('4. Naviguez vers les différentes pages pour voir les données fictives'); 