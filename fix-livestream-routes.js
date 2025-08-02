const fs = require('fs');
const path = require('path');

// Fonction pour ajouter les routes manquantes
function addMissingLivestreamRoutes() {
  console.log('🔧 Ajout des routes livestreams manquantes...');
  
  const livestreamsFile = path.join(__dirname, 'server', 'routes', 'livestreams.js');
  
  if (!fs.existsSync(livestreamsFile)) {
    console.log('❌ Fichier livestreams.js non trouvé');
    return;
  }
  
  let content = fs.readFileSync(livestreamsFile, 'utf8');
  
  // Vérifier si les routes existent déjà
  const hasLiveRoute = content.includes("router.get('/live'");
  const hasScheduledRoute = content.includes("router.get('/scheduled'");
  const hasAlertsRoute = content.includes("router.get('/alerts'");
  
  // Ajouter les routes manquantes
  let newRoutes = '';
  
  if (!hasLiveRoute) {
    newRoutes += `
// @route   GET /api/livestreams/live
// @desc    Obtenir les livestreams en direct
// @access  Public
router.get('/live', async (req, res) => {
  try {
    // En mode développement, retourner des données fictives
    const liveStreams = [
      {
        _id: 'live1',
        type: 'alert',
        title: 'Incendie dans le quartier Centre',
        description: 'Incendie signalé rue principale, pompiers en route',
        status: 'live',
        urgency: 'critical',
        startedAt: new Date(Date.now() - 10 * 60 * 1000),
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre'
        },
        author: {
          _id: 'user1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/M.jpg'
        },
        stats: {
          currentViewers: 23,
          totalViewers: 45
        }
      }
    ];
    
    res.json({
      success: true,
      data: liveStreams,
      message: 'Livestreams en direct récupérés'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livestreams en direct:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
`;
  }
  
  if (!hasScheduledRoute) {
    newRoutes += `
// @route   GET /api/livestreams/scheduled
// @desc    Obtenir les livestreams programmés
// @access  Public
router.get('/scheduled', async (req, res) => {
  try {
    // En mode développement, retourner des données fictives
    const scheduledStreams = [
      {
        _id: 'scheduled1',
        type: 'meeting',
        title: 'Réunion de quartier - Sécurité',
        description: 'Réunion mensuelle pour discuter de la sécurité',
        status: 'scheduled',
        urgency: 'medium',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre'
        },
        author: {
          _id: 'user2',
          firstName: 'Fatou',
          lastName: 'Camara',
          profilePicture: '/api/static/avatars/F.jpg'
        }
      }
    ];
    
    res.json({
      success: true,
      data: scheduledStreams,
      message: 'Livestreams programmés récupérés'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livestreams programmés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
`;
  }
  
  if (!hasAlertsRoute) {
    newRoutes += `
// @route   GET /api/livestreams/alerts
// @desc    Obtenir les alertes en livestream
// @access  Public
router.get('/alerts', async (req, res) => {
  try {
    // En mode développement, retourner des données fictives
    const alertStreams = [
      {
        _id: 'alert1',
        type: 'alert',
        title: 'Alerte météo - Pluies intenses',
        description: 'Pluies intenses prévues dans les prochaines heures',
        status: 'live',
        urgency: 'high',
        startedAt: new Date(Date.now() - 5 * 60 * 1000),
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre'
        },
        author: {
          _id: 'user3',
          firstName: 'Ibrahima',
          lastName: 'Sow',
          profilePicture: '/api/static/avatars/I.jpg'
        },
        stats: {
          currentViewers: 15,
          totalViewers: 28
        }
      }
    ];
    
    res.json({
      success: true,
      data: alertStreams,
      message: 'Alertes en livestream récupérées'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes en livestream:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});
`;
  }
  
  if (newRoutes) {
    // Ajouter les nouvelles routes avant la fin du fichier
    const lastExportIndex = content.lastIndexOf('module.exports');
    if (lastExportIndex !== -1) {
      content = content.slice(0, lastExportIndex) + newRoutes + '\n\n' + content.slice(lastExportIndex);
    } else {
      content += newRoutes;
    }
    
    fs.writeFileSync(livestreamsFile, content, 'utf8');
    console.log('✅ Routes livestreams ajoutées !');
  } else {
    console.log('✅ Toutes les routes livestreams existent déjà');
  }
}

// Exécuter la correction
addMissingLivestreamRoutes();