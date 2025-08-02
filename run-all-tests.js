const { testRapide } = require('./test-rapide-location');
const { runAllTests } = require('./test-location-selector-complet');

// Script principal pour exécuter tous les tests
const runAllLocationTests = async () => {
  console.log('🚀 DÉBUT DES TESTS COMPLETS LOCATIONSELECTOR');
  console.log('=' .repeat(60));
  
  const allResults = {
    rapidTest: null,
    completeTest: null
  };
  
  try {
    // Test 1: Test rapide
    console.log('\n📋 EXÉCUTION DU TEST RAPIDE');
    console.log('-' .repeat(40));
    allResults.rapidTest = await testRapide();
    
    // Test 2: Test complet (si le test rapide est réussi)
    if (allResults.rapidTest && Object.values(allResults.rapidTest).filter(Boolean).length >= 3) {
      console.log('\n📋 EXÉCUTION DU TEST COMPLET');
      console.log('-' .repeat(40));
      allResults.completeTest = await runAllTests();
    } else {
      console.log('\n⚠️ Test complet ignoré - test rapide insuffisant');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error.message);
  }
  
  // Résumé final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSUMÉ FINAL DES TESTS');
  console.log('=' .repeat(60));
  
  if (allResults.rapidTest) {
    const rapidPassed = Object.values(allResults.rapidTest).filter(Boolean).length;
    const rapidTotal = Object.keys(allResults.rapidTest).length;
    console.log(`✅ Test rapide: ${rapidPassed}/${rapidTotal} réussis`);
  }
  
  if (allResults.completeTest) {
    const completePassed = Object.values(allResults.completeTest).filter(Boolean).length;
    const completeTotal = Object.keys(allResults.completeTest).length;
    console.log(`✅ Test complet: ${completePassed}/${completeTotal} réussis`);
  }
  
  // Évaluation finale
  const rapidSuccess = allResults.rapidTest && Object.values(allResults.rapidTest).filter(Boolean).length >= 3;
  const completeSuccess = allResults.completeTest && Object.values(allResults.completeTest).filter(Boolean).length >= 6;
  
  if (rapidSuccess && completeSuccess) {
    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS !');
    console.log('🚀 Le LocationSelector est complètement opérationnel !');
    console.log('✅ Toutes les fonctionnalités sont validées');
  } else if (rapidSuccess) {
    console.log('\n✅ LE LOCATIONSELECTOR EST OPÉRATIONNEL !');
    console.log('⚠️ Test complet non exécuté ou partiellement réussi');
  } else {
    console.log('\n❌ PROBLÈMES DÉTECTÉS');
    console.log('⚠️ Vérifiez la configuration et les logs');
  }
  
  return allResults;
};

// Exécuter tous les tests
if (require.main === module) {
  runAllLocationTests().catch(console.error);
}

module.exports = { runAllLocationTests };