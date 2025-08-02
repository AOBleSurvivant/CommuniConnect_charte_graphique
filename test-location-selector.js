const axios = require('axios');

async function testLocationSelector() {
  try {
    console.log('🧪 Test du sélecteur de localisation...');
    
    // Tester l'accès au fichier de données géographiques
    const response = await axios.get('http://localhost:3000/data/guinea-geography-complete.json');
    
    if (response.status === 200) {
      console.log('✅ Fichier de données géographiques accessible');
      
      const data = response.data;
      const regions = data.Guinée?.Régions || [];
      
      console.log(`📊 ${regions.length} régions trouvées:`);
      regions.forEach(region => {
        console.log(`  - ${region.nom}`);
        const prefectures = region.préfectures || [];
        console.log(`    ${prefectures.length} préfectures:`);
        prefectures.forEach(prefecture => {
          console.log(`      - ${prefecture.nom}`);
          const communes = prefecture.communes || [];
          console.log(`        ${communes.length} communes:`);
          communes.forEach(commune => {
            console.log(`          - ${commune.nom}`);
            const quartiers = commune.quartiers || [];
            console.log(`            ${quartiers.length} quartiers:`);
            quartiers.forEach(quartier => {
              console.log(`              - ${quartier.nom}`);
            });
          });
        });
      });
      
      // Tester spécifiquement Labé
      const labeRegion = regions.find(r => r.nom === 'Labé');
      if (labeRegion) {
        console.log('\n🔍 Test spécifique pour Labé:');
        const labePrefecture = labeRegion.préfectures?.find(p => p.nom === 'Labé');
        if (labePrefecture) {
          const labeCentreCommune = labePrefecture.communes?.find(c => c.nom === 'Labé-Centre');
          if (labeCentreCommune) {
            const porelQuartier = labeCentreCommune.quartiers?.find(q => q.nom === 'Porel');
            if (porelQuartier) {
              console.log('✅ Labé > Labé > Labé-Centre > Porel trouvé');
            } else {
              console.log('❌ Quartier Porel non trouvé');
            }
          } else {
            console.log('❌ Commune Labé-Centre non trouvée');
          }
        } else {
          console.log('❌ Préfecture Labé non trouvée');
        }
      } else {
        console.log('❌ Région Labé non trouvée');
      }
      
    } else {
      console.log('❌ Erreur lors de l\'accès au fichier de données');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testLocationSelector(); 