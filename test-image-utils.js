// Test simple pour vérifier l'utilitaire imageUtils
const { buildProfilePictureUrl } = require('./client/src/utils/imageUtils.js');

console.log('🧪 TEST DE L\'UTILITAIRE IMAGEUTILS');

// Test 1: URL relative
const relativeUrl = '/api/static/avatars/U.jpg';
const fullUrl = buildProfilePictureUrl(relativeUrl);
console.log('URL relative:', relativeUrl);
console.log('URL complète:', fullUrl);
console.log('✅ URL correcte:', fullUrl === 'http://localhost:5000/api/static/avatars/U.jpg');

// Test 2: URL complète
const absoluteUrl = 'https://example.com/image.jpg';
const absoluteResult = buildProfilePictureUrl(absoluteUrl);
console.log('\nURL absolue:', absoluteUrl);
console.log('Résultat:', absoluteResult);
console.log('✅ URL absolue préservée:', absoluteResult === absoluteUrl);

// Test 3: URL null
const nullResult = buildProfilePictureUrl(null);
console.log('\nURL null:', null);
console.log('Résultat:', nullResult);
console.log('✅ URL null gérée:', nullResult === null);

console.log('\n🎯 TEST TERMINÉ'); 