const fs = require('fs');
const path = require('path');

// Fonction pour créer un avatar SVG simple
function createAvatarSVG(initials, color) {
  return `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="${color}" rx="50"/>
    <text x="50" y="60" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
          text-anchor="middle" fill="white">${initials}</text>
  </svg>`;
}

// Fonction pour convertir SVG en base64
function svgToBase64(svg) {
  return Buffer.from(svg).toString('base64');
}

// Fonction pour créer un fichier avatar
function createAvatarFile(filename, initials, color) {
  const svg = createAvatarSVG(initials, color);
  const base64 = svgToBase64(svg);
  const dataUrl = `data:image/svg+xml;base64,${base64}`;
  
  // Créer un fichier simple avec les données
  const filePath = path.join(__dirname, '../static/avatars', filename);
  fs.writeFileSync(filePath, dataUrl);
  
  console.log(`✅ Avatar créé: ${filename}`);
}

// Couleurs pour les avatars
const colors = [
  '#007ACC', // Bleu CommuniConnect
  '#F4B400', // Jaune orangé
  '#3BAF75', // Vert
  '#DC3545', // Rouge
  '#6F42C1', // Violet
  '#FD7E14', // Orange
  '#20C997', // Teal
  '#E83E8C'  // Rose
];

// Créer les avatars de démonstration
function generateDemoAvatars() {
  const avatars = [
    { filename: 'marie.jpg', initials: 'MD', name: 'Marie Dubois' },
    { filename: 'ahmed.jpg', initials: 'AD', name: 'Ahmed Diallo' },
    { filename: 'fatoumata.jpg', initials: 'FB', name: 'Fatoumata Bah' },
    { filename: 'jean.jpg', initials: 'JM', name: 'Jean Martin' },
    { filename: 'sophie.jpg', initials: 'SL', name: 'Sophie Laurent' },
    { filename: 'moussa.jpg', initials: 'MK', name: 'Moussa Keita' },
    { filename: 'aissatou.jpg', initials: 'AB', name: 'Aissatou Barry' },
    { filename: 'pierre.jpg', initials: 'PD', name: 'Pierre Dubois' }
  ];

  console.log('🎨 Génération des avatars de démonstration...');
  
  avatars.forEach((avatar, index) => {
    const color = colors[index % colors.length];
    createAvatarFile(avatar.filename, avatar.initials, color);
  });
  
  console.log('✅ Tous les avatars de démonstration ont été créés !');
}

// Exporter les fonctions
module.exports = {
  generateDemoAvatars,
  createAvatarSVG,
  svgToBase64
};

// Exécuter si appelé directement
if (require.main === module) {
  generateDemoAvatars();
} 