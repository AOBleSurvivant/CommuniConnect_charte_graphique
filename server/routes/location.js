const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/location/nearby - Trouver des utilisateurs/événements à proximité
router.get('/nearby', [
  query('latitude').isFloat({ min: -90, max: 90 }),
  query('longitude').isFloat({ min: -180, max: 180 }),
  query('radius').optional().isFloat({ min: 0.1, max: 100 }),
  query('type').optional().isIn(['users', 'events', 'all']),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres de géolocalisation invalides',
        errors: errors.array()
      });
    }

    const { latitude, longitude, radius = 10, type = 'all', limit = 20 } = req.query;

    // En mode développement, retourner des résultats fictifs
    const nearbyResults = {
      users: [
        {
          _id: '1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          distance: 0.5,
          coordinates: {
            latitude: parseFloat(latitude) + 0.001,
            longitude: parseFloat(longitude) + 0.001
          },
          profilePicture: '/api/static/avatars/user1.jpg',
          isOnline: true,
          lastSeen: new Date()
        },
        {
          _id: '2',
          firstName: 'Fatoumata',
          lastName: 'Camara',
          distance: 1.2,
          coordinates: {
            latitude: parseFloat(latitude) + 0.002,
            longitude: parseFloat(longitude) - 0.001
          },
          profilePicture: '/api/static/avatars/user2.jpg',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000)
        }
      ],
      events: [
        {
          _id: '1',
          title: 'Meetup Tech Conakry',
          distance: 0.8,
          coordinates: {
            latitude: parseFloat(latitude) + 0.0015,
            longitude: parseFloat(longitude) + 0.0005
          },
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          organizer: {
            firstName: 'Ibrahima',
            lastName: 'Bah',
            profilePicture: '/api/static/avatars/user3.jpg'
          },
          participantsCount: 15,
          maxParticipants: 30
        }
      ]
    };

    let results = {};
    if (type === 'users' || type === 'all') {
      results.users = nearbyResults.users.filter(user => user.distance <= radius);
    }
    if (type === 'events' || type === 'all') {
      results.events = nearbyResults.events.filter(event => event.distance <= radius);
    }

    res.json({
      success: true,
      results,
      searchParams: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseFloat(radius),
        type
      }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche géographique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/location/update - Mettre à jour la position de l'utilisateur
router.post('/update', auth, [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('accuracy').optional().isFloat({ min: 0, max: 1000 }),
  body('timestamp').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées invalides',
        errors: errors.array()
      });
    }

    const { latitude, longitude, accuracy, timestamp } = req.body;
    const userId = req.user._id || req.user.id;

    // En mode développement, simuler la mise à jour
    const locationUpdate = {
      userId,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      accuracy: accuracy || 10,
      timestamp: timestamp || new Date().toISOString(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Position mise à jour avec succès',
      location: locationUpdate
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la position:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/location/geocode - Géocodage d'adresse
router.get('/geocode', [
  query('address').trim().isLength({ min: 5 }),
  query('region').optional().trim(),
  query('prefecture').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Adresse invalide',
        errors: errors.array()
      });
    }

    const { address, region, prefecture } = req.query;

    // En mode développement, retourner des coordonnées fictives
    const geocodeResult = {
      address: address,
      coordinates: {
        latitude: 9.5370,
        longitude: -13.6785
      },
      region: region || 'Conakry',
      prefecture: prefecture || 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre-ville',
      accuracy: 50,
      formattedAddress: `${address}, ${region || 'Conakry'}, Guinée`
    };

    res.json({
      success: true,
      geocode: geocodeResult
    });
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/location/reverse-geocode - Géocodage inverse
router.get('/reverse-geocode', [
  query('latitude').isFloat({ min: -90, max: 90 }),
  query('longitude').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées invalides',
        errors: errors.array()
      });
    }

    const { latitude, longitude } = req.query;

    // En mode développement, retourner une adresse fictive
    const reverseGeocodeResult = {
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      address: {
        street: 'Rue du Commerce',
        number: '123',
        commune: 'Kaloum',
        quartier: 'Centre-ville',
        prefecture: 'Conakry',
        region: 'Conakry',
        country: 'Guinée',
        postalCode: '001'
      },
      formattedAddress: '123 Rue du Commerce, Kaloum, Conakry, Guinée',
      accuracy: 25
    };

    res.json({
      success: true,
      reverseGeocode: reverseGeocodeResult
    });
  } catch (error) {
    console.error('Erreur lors du géocodage inverse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/location/regions - Liste des régions de Guinée
router.get('/regions', async (req, res) => {
  try {
    const regions = [
      {
        id: 'conakry',
        name: 'Conakry',
        prefectures: ['Conakry'],
        coordinates: { latitude: 9.5370, longitude: -13.6785 }
      },
      {
        id: 'kindia',
        name: 'Kindia',
        prefectures: ['Kindia', 'Coyah', 'Dubréka', 'Forecariah'],
        coordinates: { latitude: 10.0559, longitude: -12.8658 }
      },
      {
        id: 'kankan',
        name: 'Kankan',
        prefectures: ['Kankan', 'Kérouané', 'Kouroussa', 'Mandiana', 'Siguiri'],
        coordinates: { latitude: 10.3846, longitude: -9.3056 }
      },
      {
        id: 'faranah',
        name: 'Faranah',
        prefectures: ['Faranah', 'Dabola', 'Dinguiraye', 'Kissidougou'],
        coordinates: { latitude: 10.0404, longitude: -10.7434 }
      },
      {
        id: 'mamou',
        name: 'Mamou',
        prefectures: ['Mamou', 'Dalaba', 'Pita'],
        coordinates: { latitude: 10.3755, longitude: -12.0916 }
      },
      {
        id: 'labé',
        name: 'Labé',
        prefectures: ['Labé', 'Koubia', 'Lélouma', 'Mali', 'Tougué'],
        coordinates: { latitude: 11.3162, longitude: -12.2833 }
      },
      {
        id: 'boké',
        name: 'Boké',
        prefectures: ['Boké', 'Boffa', 'Fria', 'Gaoual', 'Koundara'],
        coordinates: { latitude: 10.9402, longitude: -14.2906 }
      }
    ];

    res.json({
      success: true,
      regions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des régions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 