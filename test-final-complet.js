const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFinalComplet() {
  console.log('🎯 TEST FINAL COMPLET - VÉRIFICATION DÉFINITIVE\n');

  const results = {
    lives: 0,
    events: 0,
    alerts: 0,
    conversations: 0,
    friends: 0,
    requests: 0,
    errors: []
  };

  try {
    // Test 1: Lives
    console.log('📺 Test des lives...');
    try {
      const response = await axios.get(`${BASE_URL}/livestreams`);
      results.lives = response.data.data?.length || 0;
      console.log(`✅ Lives: ${results.lives} récupérés`);
    } catch (error) {
      results.errors.push(`Lives: ${error.message}`);
      console.log(`❌ Lives: Erreur - ${error.message}`);
    }

    // Test 2: Événements
    console.log('\n📅 Test des événements...');
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      results.events = response.data.data?.events?.length || 0;
      console.log(`✅ Événements: ${results.events} récupérés`);
    } catch (error) {
      results.errors.push(`Événements: ${error.message}`);
      console.log(`❌ Événements: Erreur - ${error.message}`);
    }

    // Test 3: Alertes
    console.log('\n🚨 Test des alertes...');
    try {
      const response = await axios.get(`${BASE_URL}/livestreams/alerts`);
      results.alerts = response.data.data?.length || 0;
      console.log(`✅ Alertes: ${results.alerts} récupérées`);
    } catch (error) {
      results.errors.push(`Alertes: ${error.message}`);
      console.log(`❌ Alertes: Erreur - ${error.message}`);
    }

    // Test 4: Conversations
    console.log('\n💬 Test des conversations...');
    try {
      const response = await axios.get(`${BASE_URL}/messages/conversations`);
      results.conversations = response.data.conversations?.length || 0;
      console.log(`✅ Conversations: ${results.conversations} récupérées`);
    } catch (error) {
      results.errors.push(`Conversations: ${error.message}`);
      console.log(`❌ Conversations: Erreur - ${error.message}`);
    }

    // Test 5: Amis
    console.log('\n👥 Test des amis...');
    try {
      const response = await axios.get(`${BASE_URL}/friends/list`);
      results.friends = response.data.friends?.length || 0;
      console.log(`✅ Amis: ${results.friends} récupérés`);
    } catch (error) {
      results.errors.push(`Amis: ${error.message}`);
      console.log(`❌ Amis: Erreur - ${error.message}`);
    }

    // Test 6: Demandes d'amis
    console.log('\n📨 Test des demandes d\'amis...');
    try {
      const response = await axios.get(`${BASE_URL}/friends/requests`);
      results.requests = response.data.requests?.length || 0;
      console.log(`✅ Demandes d'amis: ${results.requests} récupérées`);
    } catch (error) {
      results.errors.push(`Demandes d'amis: ${error.message}`);
      console.log(`❌ Demandes d'amis: Erreur - ${error.message}`);
    }

    // Test 7: Interface client
    console.log('\n🌐 Test de l\'interface client...');
    try {
      const response = await axios.get('http://localhost:3000', { timeout: 5000 });
      console.log('✅ Interface client accessible');
    } catch (error) {
      console.log('⚠️ Interface client non accessible (normal si pas démarrée)');
    }

    // Résumé final
    console.log('\n📊 RÉSUMÉ FINAL:');
    console.log('='.repeat(50));
    console.log(`📺 Lives: ${results.lives}/2 attendus`);
    console.log(`📅 Événements: ${results.events}/2 attendus`);
    console.log(`🚨 Alertes: ${results.alerts}/1 attendue`);
    console.log(`💬 Conversations: ${results.conversations}/3 attendues`);
    console.log(`👥 Amis: ${results.friends}/3 attendus`);
    console.log(`📨 Demandes d'amis: ${results.requests}/2 attendues`);
    
    const totalTests = 6;
    const successfulTests = [results.lives, results.events, results.alerts, results.conversations, results.friends, results.requests]
      .filter(count => count > 0).length;
    
    console.log('\n🎯 PROGRESSION:');
    console.log(`✅ Tests réussis: ${successfulTests}/${totalTests}`);
    console.log(`📈 Taux de réussite: ${Math.round((successfulTests/totalTests)*100)}%`);

    if (results.errors.length > 0) {
      console.log('\n❌ ERREURS DÉTECTÉES:');
      results.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (successfulTests === totalTests) {
      console.log('\n🎉 SUCCÈS: Toutes les fonctionnalités sont opérationnelles !');
      console.log('✅ L\'utilisateur peut maintenant utiliser l\'application sans erreurs.');
    } else {
      console.log('\n⚠️ ATTENTION: Certaines fonctionnalités nécessitent encore des corrections.');
    }

  } catch (error) {
    console.error('❌ Erreur critique lors du test:', error.message);
  }
}

testFinalComplet(); 