const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/search - Recherche globale
router.get('/', auth, async (req, res) => {
  try {
    const { q: query, type, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Terme de recherche requis'
      });
    }

    // En mode développement, retourner des résultats fictifs
    const results = {
      posts: [],
      alerts: [],
      events: [],
      users: []
    };

    // Simuler des résultats de recherche
    if (!type || type === 'posts') {
      results.posts = [
        {
          _id: 'post-1',
          content: `Post contenant "${query}"`,
          author: {
            firstName: 'Utilisateur',
            lastName: 'Test'
          },
          createdAt: new Date()
        }
      ];
    }

    if (!type || type === 'alerts') {
      results.alerts = [
        {
          _id: 'alert-1',
          title: `Alerte contenant "${query}"`,
          type: 'accident',
          location: 'Centre, Kaloum'
        }
      ];
    }

    if (!type || type === 'events') {
      results.events = [
        {
          _id: 'event-1',
          title: `Événement contenant "${query}"`,
          type: 'reunion',
          date: new Date()
        }
      ];
    }

    res.json({
      success: true,
      query,
      type: type || 'all',
      results,
      total: Object.values(results).flat().length
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 