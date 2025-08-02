const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/stats - Statistiques globales
router.get('/', auth, async (req, res) => {
  try {
    // En mode développement, retourner des statistiques fictives
    const stats = {
      users: {
        total: 1250,
        active: 890,
        newThisMonth: 45,
        verified: 1100
      },
      content: {
        posts: 3450,
        alerts: 156,
        events: 89,
        livestreams: 23
      },
      engagement: {
        reactions: 12500,
        comments: 8900,
        shares: 3400,
        participations: 1200
      },
      locations: {
        regions: 8,
        prefectures: 33,
        communes: 303,
        quartiers: 1500
      },
      moderation: {
        reports: 45,
        resolved: 38,
        pending: 7,
        blockedUsers: 3
      }
    };

    res.json({
      success: true,
      stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/stats/community - Statistiques de la communauté
router.get('/community', auth, async (req, res) => {
  try {
    const userLocation = req.user.location;
    
    const communityStats = {
      quartier: {
        users: 45,
        posts: 120,
        alerts: 8,
        events: 5
      },
      commune: {
        users: 230,
        posts: 580,
        alerts: 25,
        events: 18
      },
      prefecture: {
        users: 890,
        posts: 2100,
        alerts: 89,
        events: 45
      }
    };

    res.json({
      success: true,
      location: userLocation,
      stats: communityStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques communautaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 