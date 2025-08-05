const express = require('express');
const { body, validationResult, query } = require('express-validator');
const devAuth = require('../middleware/devAuth');
const { validateGuineanLocation } = require('../middleware/geographicValidation');
const Event = require('../models/Event');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/events
// @desc    Obtenir tous les événements avec filtres
// @access  Public
router.get('/', devAuth, [
  query('type').optional().isIn(['reunion', 'formation', 'nettoyage', 'festival', 'sport', 'culture', 'sante', 'education', 'autre']),
  query('category').optional().isIn(['communautaire', 'professionnel', 'educatif', 'culturel', 'sportif', 'sante', 'environnement', 'social', 'autre']),
  query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed', 'postponed']),
  query('region').optional().isString(),
  query('prefecture').optional().isString(),
  query('commune').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('latitude').optional().isFloat(),
  query('longitude').optional().isFloat(),
  query('radius').optional().isFloat({ min: 0.1, max: 50 }),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      type,
      category,
      status = 'published',
      region,
      prefecture,
      commune,
      limit = 20,
      page = 1,
      latitude,
      longitude,
      radius = 10,
      startDate,
      endDate,
      search
    } = req.query;

    // En mode développement, utiliser des données fictives
    if (process.env.NODE_ENV === 'development') {
      // Initialiser le tableau global des événements si nécessaire
      if (!global.mockEvents) {
        global.mockEvents = [
          {
            _id: 'fake-event-1',
            title: 'Nettoyage communautaire du quartier',
            description: 'Grande opération de nettoyage du quartier avec tous les habitants.',
            type: 'nettoyage',
            category: 'communautaire',
            startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +4h
            startTime: '08:00',
            endTime: '12:00',
            location: {
              coordinates: { latitude: 9.537, longitude: -13.6785 },
              region: 'Conakry',
              prefecture: 'Conakry',
              commune: 'Kaloum',
              quartier: 'Centre',
              address: 'Quartier Centre, Conakry',
              venue: 'Place du marché'
            },
            organizer: {
              _id: '507f1f77bcf86cd799439012',
              firstName: 'Mamadou',
              lastName: 'Diallo',
              profilePicture: null,
              isVerified: true
            },
            status: 'published',
            visibility: 'public',
            participants: [],
            media: { images: [], videos: [], documents: [] },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: 'fake-event-2',
            title: 'Formation informatique gratuite',
            description: 'Formation en informatique pour les jeunes du quartier.',
            type: 'formation',
            category: 'educatif',
            startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3h
            startTime: '14:00',
            endTime: '17:00',
            location: {
              coordinates: { latitude: 9.538, longitude: -13.680 },
              region: 'Conakry',
              prefecture: 'Conakry',
              commune: 'Matam',
              quartier: 'Donka',
              address: 'Centre culturel, Conakry',
              venue: 'Salle informatique'
            },
            organizer: {
              _id: '507f1f77bcf86cd799439013',
              firstName: 'Fatou',
              lastName: 'Camara',
              profilePicture: null,
              isVerified: true
            },
            status: 'published',
            visibility: 'public',
            participants: [],
            media: { images: [], videos: [], documents: [] },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
      
      // Appliquer les filtres sur les événements fictifs
      let filteredEvents = global.mockEvents.filter(event => {
        // Filtre par type
        if (type && event.type !== type) return false;
        
        // Filtre par catégorie
        if (category && event.category !== category) return false;
        
        // Filtre par statut
        if (status && event.status !== status) return false;
        
        // Filtre par recherche
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch = 
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.location?.address?.toLowerCase().includes(searchLower) ||
            event.location?.venue?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        // Filtre par date
        if (startDate && new Date(event.startDate) < new Date(startDate)) return false;
        if (endDate && new Date(event.startDate) > new Date(endDate)) return false;
        
        return true;
      });
      
      // Tri par date de création (plus récent en premier)
      filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedEvents = filteredEvents.slice(skip, skip + parseInt(limit));
      
      console.log('📅 Événements récupérés (mode développement):', paginatedEvents.length);
      
      return res.json({
        success: true,
        message: 'Événements récupérés avec succès',
        data: {
          events: paginatedEvents,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredEvents.length / parseInt(limit)),
            totalEvents: filteredEvents.length,
            eventsPerPage: parseInt(limit)
          }
        }
      });
    }
    
    // En production, utiliser MongoDB (non implémenté pour l'instant)
    res.status(501).json({
      success: false,
      message: 'Mode production non implémenté'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
});

// @route   GET /api/events/upcoming
// @desc    Obtenir les événements à venir
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Vérifier si MongoDB est disponible
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      // Mode développement sans MongoDB - utiliser des données fictives
      const mockEvents = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'Réunion de quartier - Propreté et sécurité',
          description: 'Réunion mensuelle pour discuter de la propreté et de la sécurité du quartier',
          type: 'reunion',
          category: 'communautaire',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2h
          startTime: '18:00',
          endTime: '20:00',
          location: {
            coordinates: { latitude: 9.5370, longitude: -13.6785 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            address: 'Salle communale du quartier',
            venue: 'Salle communale'
          },
          organizer: {
            _id: '507f1f77bcf86cd799439012',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: null,
            isVerified: true
          },
          status: 'published',
          visibility: 'public',
          participants: [],
          media: { images: [], videos: [], documents: [] },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439013',
          title: 'Formation en informatique pour débutants',
          description: 'Formation gratuite pour apprendre les bases de l\'informatique',
          type: 'formation',
          category: 'educatif',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Dans 14 jours
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3h
          startTime: '14:00',
          endTime: '17:00',
          location: {
            coordinates: { latitude: 9.5370, longitude: -13.6785 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            address: 'Centre de formation informatique',
            venue: 'Centre de formation'
          },
          organizer: {
            _id: '507f1f77bcf86cd799439014',
            firstName: 'Fatou',
            lastName: 'Camara',
            profilePicture: null,
            isVerified: true
          },
          status: 'published',
          visibility: 'public',
          participants: [],
          media: { images: [], videos: [], documents: [] },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Filtrer les événements à venir (date de début > maintenant)
      const upcomingEvents = mockEvents
        .filter(event => event.startDate > new Date())
        .sort((a, b) => a.startDate - b.startDate)
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        data: upcomingEvents
      });
      return;
    }

    const events = await Event.findUpcoming(parseInt(limit));

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des événements à venir:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements à venir'
    });
  }
});

// @route   GET /api/events/nearby
// @desc    Obtenir les événements à proximité
// @access  Public
router.get('/nearby', [
  query('latitude').isFloat().withMessage('Latitude invalide'),
  query('longitude').isFloat().withMessage('Longitude invalide'),
  query('radius').optional().isFloat({ min: 0.1, max: 50 }).withMessage('Rayon invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { latitude, longitude, radius = 10 } = req.query;

    // Vérifier si MongoDB est disponible
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      // Mode développement sans MongoDB - utiliser des données fictives
      const mockEvents = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'Réunion de quartier - Propreté et sécurité',
          description: 'Réunion mensuelle pour discuter de la propreté et de la sécurité du quartier',
          type: 'reunion',
          category: 'communautaire',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2h
          startTime: '18:00',
          endTime: '20:00',
          location: {
            coordinates: { latitude: 9.5370, longitude: -13.6785 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            address: 'Salle communale du quartier',
            venue: 'Salle communale'
          },
          organizer: {
            _id: '507f1f77bcf86cd799439012',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: null,
            isVerified: true
          },
          status: 'published',
          visibility: 'public',
          participants: [],
          media: { images: [], videos: [], documents: [] },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439013',
          title: 'Formation en informatique pour débutants',
          description: 'Formation gratuite pour apprendre les bases de l\'informatique',
          type: 'formation',
          category: 'educatif',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Dans 14 jours
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3h
          startTime: '14:00',
          endTime: '17:00',
          location: {
            coordinates: { latitude: 9.5370, longitude: -13.6785 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            address: 'Centre de formation informatique',
            venue: 'Centre de formation'
          },
          organizer: {
            _id: '507f1f77bcf86cd799439014',
            firstName: 'Fatou',
            lastName: 'Camara',
            profilePicture: null,
            isVerified: true
          },
          status: 'published',
          visibility: 'public',
          participants: [],
          media: { images: [], videos: [], documents: [] },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Calculer la distance et filtrer les événements à proximité
      const nearbyEvents = mockEvents.filter(event => {
        const eventLat = event.location.coordinates.latitude;
        const eventLng = event.location.coordinates.longitude;
        
        // Calcul simple de distance (formule de Haversine simplifiée)
        const latDiff = Math.abs(parseFloat(latitude) - eventLat);
        const lngDiff = Math.abs(parseFloat(longitude) - eventLng);
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Approximation en km
        
        return distance <= parseFloat(radius);
      });

      res.json({
        success: true,
        data: nearbyEvents
      });
      return;
    }

    const events = await Event.findByLocation(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius)
    );

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des événements à proximité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements à proximité'
    });
  }
});

// GET /api/events/calendar - Calendrier d'événements
router.get('/calendar', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('region').optional().trim(),
  query('type').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres de calendrier invalides',
        errors: errors.array()
      });
    }

    const { startDate, endDate, region, type } = req.query;
    const userId = req.user?._id || req.user?.id || 'anonymous';

    // En mode développement, retourner un calendrier fictif
    const calendarEvents = [
      {
        _id: '1',
        title: 'Meetup Tech Conakry',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        type: 'meetup',
        region: 'Conakry',
        location: 'Centre de Formation Tech',
        organizer: {
          firstName: 'Mamadou',
          lastName: 'Diallo'
        },
        isParticipating: true,
        participantsCount: 15
      },
      {
        _id: '2',
        title: 'Conférence Innovation',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        type: 'conference',
        region: 'Conakry',
        location: 'Palais du Peuple',
        organizer: {
          firstName: 'Fatoumata',
          lastName: 'Camara'
        },
        isParticipating: false,
        participantsCount: 120
      },
      {
        _id: '3',
        title: 'Formation Développement Web',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        type: 'formation',
        region: 'Kindia',
        location: 'Institut de Formation',
        organizer: {
          firstName: 'Ibrahima',
          lastName: 'Bah'
        },
        isParticipating: true,
        participantsCount: 8
      }
    ];

    res.json({
      success: true,
      events: calendarEvents,
      filters: {
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        region,
        type
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du calendrier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/events/recommendations - Événements recommandés
router.get('/recommendations', [
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user?._id || req.user?.id || 'anonymous';

    // En mode développement, retourner des recommandations fictives
    const recommendations = [
      {
        _id: '1',
        title: 'Hackathon Guinée 2024',
        description: '48h de développement intensif pour créer des solutions innovantes',
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        type: 'hackathon',
        region: 'Conakry',
        matchScore: 95,
        reason: 'Basé sur vos intérêts en développement'
      },
      {
        _id: '2',
        title: 'Forum Entrepreneuriat',
        description: 'Rencontrez des entrepreneurs et investisseurs',
        startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        type: 'forum',
        region: 'Conakry',
        matchScore: 87,
        reason: 'Similaire aux événements auxquels vous avez participé'
      },
      {
        _id: '3',
        title: 'Workshop IA & Machine Learning',
        description: 'Introduction aux technologies d\'intelligence artificielle',
        startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        type: 'workshop',
        region: 'Kindia',
        matchScore: 82,
        reason: 'Basé sur vos compétences techniques'
      }
    ];

    res.json({
      success: true,
      recommendations: recommendations.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Obtenir un événement spécifique
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName profilePicture isVerified')
      .populate('coOrganizers.user', 'firstName lastName profilePicture')
      .populate('participants.user', 'firstName lastName profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'événement est caché
    if (event.moderation.isHidden) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement'
    });
  }
});

// @route   POST /api/events
// @desc    Créer un nouvel événement
// @access  Private (Public en développement)
router.post('/', [
  devAuth, // Ajout du middleware devAuth
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La description doit contenir entre 10 et 2000 caractères'),
  
  body('type')
    .isIn(['reunion', 'formation', 'nettoyage', 'festival', 'sport', 'culture', 'sante', 'education', 'autre'])
    .withMessage('Type d\'événement invalide'),
  
  body('category')
    .isIn(['communautaire', 'professionnel', 'educatif', 'culturel', 'sportif', 'sante', 'environnement', 'social', 'autre'])
    .withMessage('Catégorie d\'événement invalide'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Date de début invalide'),
  
  body('endDate')
    .isISO8601()
    .withMessage('Date de fin invalide'),
  
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de début invalide (format HH:MM)'),
  
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide (format HH:MM)'),
  
  body('latitude')
    .isFloat({ min: 7.1935, max: 12.6769 })
    .withMessage('La latitude doit être dans les limites de la Guinée'),
  
  body('longitude')
    .isFloat({ min: -15.0820, max: -7.6411 })
    .withMessage('La longitude doit être dans les limites de la Guinée'),
  
  body('venue')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le lieu doit contenir entre 2 et 100 caractères'),
  
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('La capacité doit être entre 1 et 10000'),
  
  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('isFree doit être un booléen'),
  
  body('price.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix ne peut pas être négatif')
], async (req, res) => {
  try {
    console.log('🔍 Données reçues:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      type,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      address,
      capacity,
      isFree = true,
      price = { amount: 0, currency: 'GNF' },
      tags = []
    } = req.body;

    console.log('✅ Validation réussie');

    // En mode développement, utiliser des coordonnées par défaut
    const validatedLocation = {
      coordinates: { latitude: req.body.latitude, longitude: req.body.longitude },
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre'
    };

    console.log('📍 Localisation validée:', validatedLocation);

    // Vérifier que la date de fin n'est pas antérieure à la date de début
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin ne peut pas être antérieure à la date de début'
      });
    }

    console.log('📅 Dates validées');

    // En mode développement, créer un événement fictif
    const event = {
      _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title,
      description,
      type,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      location: {
        coordinates: validatedLocation.coordinates,
        region: validatedLocation.region,
        prefecture: validatedLocation.prefecture,
        commune: validatedLocation.commune,
        quartier: validatedLocation.quartier,
        address,
        venue
      },
      organizer: req.user?._id || 'fake-user-id',
      coOrganizers: [],
      capacity: capacity || null,
      isFree,
      price,
      participants: [],
      media: {
        images: [],
        videos: [],
        documents: []
      },
      status: 'published',
      visibility: 'public',
      tags: [type, category, ...tags],
      requirements: {
        ageMin: null,
        ageMax: null,
        gender: 'all',
        specialRequirements: []
      },
      contact: {
        phone: req.user?.phone || '22412345678',
        email: req.user?.email || 'test@example.com',
        whatsapp: '',
        website: ''
      },
      moderation: {
        isReported: false,
        reports: [],
        isHidden: false
      },
      statistics: {
        views: 0,
        shares: 0,
        notificationsSent: 0,
        participantsCount: 0
      },
      metadata: {
        language: 'fr',
        timezone: 'Africa/Conakry',
        recurring: {
          isRecurring: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // En mode développement sans MongoDB, ajouter l'événement au tableau global
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      if (!global.mockEvents) {
        global.mockEvents = [];
      }
      global.mockEvents.unshift(event); // Ajouter au début pour qu'il apparaisse en premier
      console.log('✅ Événement ajouté au tableau global. Total:', global.mockEvents.length);
    }

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      data: event
    });

  } catch (error) {
    console.error('❌ ERREUR DÉTAILLÉE lors de la création de l\'événement:');
    console.error('📝 Message:', error.message);
    console.error('📊 Type:', error.constructor.name);
    console.error('🔍 Stack:', error.stack);
    console.error('📋 Données reçues:', JSON.stringify(req.body, null, 2));
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement',
      error: error.message,
      details: {
        type: error.constructor.name,
        stack: error.stack
      }
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Mettre à jour un événement
// @access  Private (organisateur ou co-organisateur)
router.put('/:id', [
  devAuth,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La description doit contenir entre 10 et 2000 caractères'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'cancelled', 'completed', 'postponed'])
    .withMessage('Statut invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'organisateur ou un co-organisateur
    const isOrganizer = event.organizer.toString() === req.user._id.toString();
    const isCoOrganizer = event.coOrganizers.some(co => co.user.toString() === req.user._id.toString());
    
    if (!isOrganizer && !isCoOrganizer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet événement'
      });
    }

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    event.updatedAt = new Date();
    await event.save();

    res.json({
      success: true,
      message: 'Événement mis à jour avec succès',
      data: event
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
});

// POST /api/events/:eventId/participate - Participer à un événement
router.post('/:eventId/participate', devAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id || req.user.id;
    const { role = 'participant', notes } = req.body;

    // En mode développement, simuler la participation
    const participation = {
      _id: `participation_${Date.now()}`,
      eventId,
      userId,
      role,
      notes: notes || '',
      status: 'confirmed',
      joinedAt: new Date(),
      user: {
        _id: userId,
        firstName: req.user.firstName || 'Utilisateur',
        lastName: req.user.lastName || 'Participant',
        profilePicture: req.user.profilePicture || '/api/static/avatars/default.jpg'
      }
    };

    res.json({
      success: true,
      message: 'Participation enregistrée avec succès',
      participation
    });
  } catch (error) {
    console.error('Erreur lors de la participation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/events/:eventId/participate - Se désinscrire d'un événement
router.delete('/:eventId/participate', devAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id || req.user.id;

    res.json({
      success: true,
      message: 'Désinscription effectuée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la désinscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/events/:eventId/participants - Liste des participants
router.get('/:eventId/participants', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { role, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // En mode développement, retourner des participants fictifs
    const participants = [
      {
        _id: '1',
        userId: 'user1',
        role: 'participant',
        status: 'confirmed',
        joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: {
          _id: 'user1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/user1.jpg',
          isVerified: true
        }
      },
      {
        _id: '2',
        userId: 'user2',
        role: 'co-organizer',
        status: 'confirmed',
        joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: {
          _id: 'user2',
          firstName: 'Fatoumata',
          lastName: 'Camara',
          profilePicture: '/api/static/avatars/user2.jpg',
          isVerified: true
        }
      },
      {
        _id: '3',
        userId: 'user3',
        role: 'participant',
        status: 'pending',
        joinedAt: new Date(),
        user: {
          _id: 'user3',
          firstName: 'Ibrahima',
          lastName: 'Bah',
          profilePicture: '/api/static/avatars/user3.jpg',
          isVerified: false
        }
      }
    ];

    // Filtrer par rôle si spécifié
    let filteredParticipants = participants;
    if (role) {
      filteredParticipants = participants.filter(p => p.role === role);
    }

    const total = filteredParticipants.length;
    const paginatedParticipants = filteredParticipants.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      participants: paginatedParticipants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/events/:eventId/invite - Inviter des utilisateurs
router.post('/:eventId/invite', devAuth, [
  body('userIds').isArray({ min: 1 }),
  body('message').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données d\'invitation invalides',
        errors: errors.array()
      });
    }

    const { eventId } = req.params;
    const { userIds, message } = req.body;
    const inviterId = req.user._id || req.user.id;

    // En mode développement, simuler les invitations
    const invitations = userIds.map((userId, index) => ({
      _id: `invitation_${Date.now()}_${index}`,
      eventId,
      userId,
      inviterId,
      message: message || 'Vous êtes invité à participer à cet événement',
      status: 'pending',
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    }));

    res.json({
      success: true,
      message: `${invitations.length} invitation(s) envoyée(s) avec succès`,
      invitations
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});



// @route   POST /api/events/:id/report
// @desc    Signaler un événement
// @access  Private
router.post('/:id/report', [
  devAuth,
  body('reason')
    .isIn(['inappropriate', 'spam', 'false_information', 'duplicate', 'other'])
    .withMessage('Raison de signalement invalide'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reason, description } = req.body;

    // Vérifier si MongoDB est disponible
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      // Mode développement sans MongoDB - simulation de signalement
      const mockEvent = {
        _id: req.params.id,
        title: 'Réunion de quartier - Propreté et sécurité',
        description: 'Réunion mensuelle pour discuter de la propreté et de la sécurité du quartier',
        type: 'reunion',
        category: 'communautaire',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        startTime: '18:00',
        endTime: '20:00',
        location: {
          coordinates: { latitude: 9.5370, longitude: -13.6785 },
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: 'Kaloum',
          quartier: 'Centre',
          address: 'Salle communale du quartier',
          venue: 'Salle communale'
        },
        organizer: {
          _id: '507f1f77bcf86cd799439012',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: null,
          isVerified: true
        },
        status: 'published',
        visibility: 'public',
        moderation: {
          isReported: true,
          reports: [
            {
              user: {
                _id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName
              },
              reason: reason,
              description: description,
              reportedAt: new Date()
            }
          ],
          isHidden: false
        },
        media: { images: [], videos: [], documents: [] },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.json({
        success: true,
        message: 'Événement signalé avec succès'
      });
      return;
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    await event.report(req.user._id, reason, description);

    res.json({
      success: true,
      message: 'Événement signalé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du signalement'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Supprimer un événement
// @access  Private (organisateur uniquement)
router.delete('/:id', devAuth, async (req, res) => {
  try {
    // En mode développement sans MongoDB, supprimer du tableau global
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      if (global.mockEvents) {
        const eventIndex = global.mockEvents.findIndex(e => e._id === req.params.id);
        if (eventIndex !== -1) {
          global.mockEvents.splice(eventIndex, 1);
          console.log('✅ Événement supprimé du tableau global. Restant:', global.mockEvents.length);
          return res.json({
            success: true,
            message: 'Événement supprimé avec succès'
          });
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'organisateur
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet événement'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement'
    });
  }
});

module.exports = router; 