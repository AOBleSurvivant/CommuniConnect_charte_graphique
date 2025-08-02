// Composant de test pour les boutons
const ButtonTest = () => {
  const testCreatePost = () => {
    console.log('🧪 Test: Bouton Nouvelle publication cliqué');
    localStorage.setItem('showCreatePost', 'true');
    window.location.href = '/feed';
  };

  const testSearch = () => {
    console.log('🧪 Test: Bouton Rechercher cliqué');
    localStorage.setItem('showSearch', 'true');
    window.location.href = '/feed';
  };

  return `
    <div style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 12px;">
      <h4>🧪 Test Boutons</h4>
      <button onclick="testCreatePost()" style="background: #1976d2; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
        Test Nouvelle publication
      </button>
      <br>
      <button onclick="testSearch()" style="background: transparent; color: white; border: 1px solid white; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
        Test Rechercher
      </button>
    </div>
  `;
};

// Fonctions globales pour le test
window.testCreatePost = () => {
  console.log('🧪 Test: Bouton Nouvelle publication cliqué');
  localStorage.setItem('showCreatePost', 'true');
  window.location.href = '/feed';
};

window.testSearch = () => {
  console.log('🧪 Test: Bouton Rechercher cliqué');
  localStorage.setItem('showSearch', 'true');
  window.location.href = '/feed';
}; 