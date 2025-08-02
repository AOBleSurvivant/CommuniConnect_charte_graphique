const express = require('express');
const { body, validationResult, query } = require('express-validator');
const auth = require('../middleware/auth');
const { validateGuineanLocation } = require('../middleware/geographicValidation');
const Alert = require('../models/Alert');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/alerts
// @desc    Obtenir toutes les alertes actives avec filtres
// @access  Public
router.get('/', [
  query('priority').optional().isIn(['urgent', 'important', 'information']),
  query('type').optional().isIn(['accident', 'securite', 'sante', 'meteo', 'infrastructure', 'autre']),
  query('category').optional().isIn(['circulation', 'incendie', 'inondation', 'coupure_eau', 'coupure_electricite', 'agression', 'accident_medical', 'intemperie', 'manifestation', 'autre']),
  query('region').optional().isString(),
  query('prefecture').optional().isString(),
  query('commune').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('latitude').optional().isFloat(),
  query('longitude').optional().isFloat(),
  query('radius').optional().isFloat({ min: 0.1, max: 50 })
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
      priority,
      type,
      category,
      region,
      prefecture,
      commune,
      limit = 20,
      page = 1,
      latitude,
      longitude,
      radius = 10
    } = req.query;

    // Construire la requête
    let query = {
      status: 'active',
      expiresAt: { $gt: new Date() }
    };

    // Filtres
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if (category) query.category = category;
    if (region) query['location.region'] = region;
    if (prefecture) query['location.prefecture'] = prefecture;
    if (commune) query['location.commune'] = commune;

    // Recherche géographique si coordonnées fournies
    if (latitude && longitude) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convertir en mètres
        }
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // En mode développement, retourner des données fictives
    if (process.env.NODE_ENV === 'development') {
      const mockAlerts = [
        {
          _id: '1',
          title: 'Accident de circulation sur la route de Donka',
          description: 'Accident grave impliquant deux véhicules sur la route principale de Donka.',
          type: 'accident',
          category: 'circulation',
          priority: 'urgent',
          status: 'active',
          location: {
            coordinates: { latitude: 9.5370, longitude: -13.6785 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Donka',
            address: 'Route de Donka, près du marché central'
          },
          author: {
            _id: 'user1',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: null,
            isVerified: true
          },
          interactions: { views: 15, shares: 3, confirmations: 8, denials: 1 },
          userInteractions: { confirmed: [], denied: [] },
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          title: 'Coupure d\'électricité dans le quartier Almamya',
          description: 'Coupure d\'électricité généralisée dans tout le quartier Almamya.',
          type: 'infrastructure',
          category: 'coupure_electricite',
          priority: 'important',
          status: 'active',
          location: {
            coordinates: { latitude: 9.5470, longitude: -13.6885 },
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Ratoma',
            quartier: 'Almamya',
            address: 'Quartier Almamya, zone résidentielle'
          },
          author: {
            _id: 'user2',
            firstName: 'Fatou',
            lastName: 'Camara',
            profilePicture: null,
            isVerified: true
          },
          interactions: { views: 8, shares: 1, confirmations: 5, denials: 0 },
          userInteractions: { confirmed: [], denied: [] },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 168 * 60 * 60 * 1000)
        }
      ];

      const alerts = mockAlerts.filter(alert => {
        if (priority && alert.priority !== priority) return false;
        if (type && alert.type !== type) return false;
        if (category && alert.category !== category) return false;
        return true;
      });

      const total = alerts.length;
      const startIndex = skip;
      const endIndex = startIndex + parseInt(limit);
      const paginatedAlerts = alerts.slice(startIndex, endIndex);

      return res.json({
        success: true,
        data: {
          alerts: paginatedAlerts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    }

    // En mode production, utiliser MongoDB
    const alerts = await Alert.find(query)
      .populate('author', 'firstName lastName profilePicture isVerified')
      .populate('userInteractions.confirmed.user', 'firstName lastName')
      .populate('userInteractions.denied.user', 'firstName lastName')
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Compter le total
    const total = await Alert.countDocuments(query);

    // Ajouter les vues si utilisateur connecté
    if (req.user) {
      for (const alert of alerts) {
        await alert.addView(req.user._id);
      }
    }

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des alertes'
    });
  }
});

// @route   GET /api/alerts/urgent
// @desc    Obtenir les alertes urgentes
// @access  Public
router.get('/urgent', async (req, res) => {
  try {
    // Vérifier si MongoDB est disponible
    if (process.env.NODE_ENV === 'development' && global.mongoConnected === false) {
      // Mode développement sans MongoDB - alertes urgentes fictives
      const mockUrgentAlerts = [
        {
          _id: '507f1f77bcf86cd799439021',
          title: 'Incendie dans le quartier Centre',
          description: 'Incendie signalé rue principale, pompiers en route',
          type: 'securite',
          category: 'incendie',
          priority: 'urgent',
          urgency: 'critical',
          location: {
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            coordinates: {
              latitude: 9.5370,
              longitude: -13.6785
            }
          },
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expire dans 2h
          status: 'active',
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
          updatedAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439022',
          title: 'Accident de circulation - Route bloquée',
          description: 'Accident de circulation sur la route principale, circulation perturbée',
          type: 'infrastructure',
          category: 'circulation',
          priority: 'urgent',
          urgency: 'high',
          location: {
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            coordinates: {
              latitude: 9.5370,
              longitude: -13.6785
            }
          },
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // Expire dans 4h
          status: 'active',
          createdAt: new Date(Date.now() - 15 * 60 * 1000), // Il y a 15 minutes
          updatedAt: new Date()
        }
      ];

      res.json({
        success: true,
        data: {
          alerts: mockUrgentAlerts,
          count: mockUrgentAlerts.length
        }
      });
      return;
    }

    const urgentAlerts = await Alert.find({
      priority: 'urgent',
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
    .populate('author', 'firstName lastName profilePicture isVerified')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        alerts: urgentAlerts,
        count: urgentAlerts.length
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes urgentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des alertes urgentes'
    });
  }
});

// @route   GET /api/alerts/nearby
// @desc    Obtenir les alertes à proximité
// @access  Public
router.get('/nearby', [
  query('latitude').isFloat().withMessage('Latitude requise'),
  query('longitude').isFloat().withMessage('Longitude requise'),
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
      // Mode développement sans MongoDB - alertes à proximité fictives
      const mockNearbyAlerts = [
        {
          _id: '507f1f77bcf86cd799439023',
          title: 'Coupure d\'électricité prévue',
          description: 'Coupure d\'électricité prévue dans le quartier Centre de 14h à 16h pour maintenance',
          type: 'infrastructure',
          category: 'coupure_electricite',
          priority: 'important',
          urgency: 'medium',
          location: {
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            coordinates: {
              latitude: parseFloat(latitude) + 0.001,
              longitude: parseFloat(longitude) + 0.001
            }
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dans 24h
          status: 'active',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
          updatedAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439024',
          title: 'Travaux de voirie',
          description: 'Travaux de réparation de la chaussée rue principale',
          type: 'infrastructure',
          category: 'circulation',
          priority: 'important',
          urgency: 'medium',
          location: {
            region: 'Conakry',
            prefecture: 'Conakry',
            commune: 'Kaloum',
            quartier: 'Centre',
            coordinates: {
              latitude: parseFloat(latitude) - 0.001,
              longitude: parseFloat(longitude) - 0.001
            }
          },
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // Expire dans 12h
          status: 'active',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Il y a 1h
          updatedAt: new Date()
        }
      ];

      res.json({
        success: true,
        data: {
          alerts: mockNearbyAlerts,
          count: mockNearbyAlerts.length
        }
      });
      return;
    }

    const nearbyAlerts = await Alert.find({
      status: 'active',
      expiresAt: { $gt: new Date() },
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convertir en mètres
        }
      }
    })
    .populate('author', 'firstName lastName profilePicture isVerified')
    .sort({ priority: -1, createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      data: {
        alerts: nearbyAlerts,
        count: nearbyAlerts.length
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes à proximité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des alertes à proximité'
    });
  }
});

// @route   GET /api/alerts/:id
// @desc    Obtenir une alerte spécifique
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('author', 'firstName lastName profilePicture isVerified')
      .populate('userInteractions.confirmed.user', 'firstName lastName')
      .populate('userInteractions.denied.user', 'firstName lastName')
      .populate('updates.author', 'firstName lastName');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // Ajouter une vue si utilisateur connecté
    if (req.user) {
      await alert.addView(req.user._id);
    }

    res.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'alerte'
    });
  }
});

// @route   POST /api/alerts
// @desc    Créer une nouvelle alerte
// @access  Private
router.post('/', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  
  body('type')
    .isIn(['accident', 'securite', 'sante', 'meteo', 'infrastructure', 'autre'])
    .withMessage('Type d\'alerte invalide'),
  
  body('category')
    .isIn(['circulation', 'incendie', 'inondation', 'coupure_eau', 'coupure_electricite', 'agression', 'accident_medical', 'intemperie', 'manifestation', 'autre'])
    .withMessage('Catégorie d\'alerte invalide'),
  
  body('priority')
    .isIn(['urgent', 'important', 'information'])
    .withMessage('Priorité invalide'),
  
  body('latitude')
    .optional()
    .isFloat({ min: 7.1935, max: 12.6769 })
    .withMessage('La latitude doit être dans les limites de la Guinée'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -15.0820, max: -7.6411 })
    .withMessage('La longitude doit être dans les limites de la Guinée'),
  
  body('quartier')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le quartier doit contenir entre 2 et 50 caractères'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  
  body('impactRadius')
    .optional()
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Le rayon d\'impact doit être entre 0.1 et 50 km')
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
      title,
      description,
      type,
      category,
      priority,
      quartier = 'Centre',
      address = 'Conakry, Guinée',
      impactRadius = 5,
      latitude = 9.5370,
      longitude = -13.6785
    } = req.body;

    // En mode développement, utiliser des données par défaut
    const defaultLocation = {
      coordinates: { latitude, longitude },
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier,
      address,
      impactRadius
    };

    // En mode développement, créer une alerte fictive
    const alert = {
      _id: require('crypto').randomBytes(16).toString('hex'),
      title,
      description,
      type,
      category,
      priority,
      status: 'active',
      location: defaultLocation,
      author: {
        _id: req.user._id || req.user.id,
        firstName: req.user.firstName || 'Test',
        lastName: req.user.lastName || 'User'
      },
      emergencyContacts: {
        police: '117',
        pompiers: '18',
        samu: '442'
      },
      interactions: {
        views: 0,
        shares: 0,
        confirmations: 0,
        denials: 0
      },
      userInteractions: {
        viewed: [],
        shared: [],
        confirmed: [],
        denied: []
      },
      updates: [],
      moderation: {
        isModerated: false,
        reports: []
      },
      tags: [type, category, priority],
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + (priority === 'urgent' ? 24 : 168) * 60 * 60 * 1000),
      statistics: {
        notificationsSent: 0,
        usersNotified: 0
      }
    };

    res.status(201).json({
      success: true,
      message: 'Alerte créée avec succès',
      data: alert
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'alerte'
    });
  }
});

// @route   PUT /api/alerts/:id
// @desc    Mettre à jour une alerte
// @access  Private (auteur ou modérateur)
router.put('/:id', [
  auth,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  
  body('priority')
    .optional()
    .isIn(['urgent', 'important', 'information'])
    .withMessage('Priorité invalide'),
  
  body('status')
    .optional()
    .isIn(['active', 'resolue', 'annulee', 'en_cours'])
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

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // Vérifier les permissions (auteur ou modérateur)
    if (alert.author.toString() !== req.user._id.toString() && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette alerte'
      });
    }

    // Mettre à jour les champs autorisés
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.priority) updateFields.priority = req.body.priority;
    if (req.body.status) updateFields.status = req.body.status;

    // En mode développement, simuler la mise à jour
    const updatedAlert = {
      ...alert.toObject(),
      ...updateFields,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Alerte mise à jour avec succès',
      data: updatedAlert
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'alerte'
    });
  }
});

// @route   POST /api/alerts/:id/confirm
// @desc    Confirmer une alerte
// @access  Private
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    // En mode développement, simuler la confirmation
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        message: 'Alerte confirmée avec succès',
        data: {
          id: req.params.id,
          confirmations: 1,
          denials: 0
        }
      });
    }

    // En mode production, utiliser MongoDB
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    const hasConfirmed = alert.userInteractions.confirmed.some(
      conf => conf.user.toString() === req.user._id.toString()
    );

    if (hasConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà confirmé cette alerte'
      });
    }

    // Ajouter la confirmation
    await alert.addConfirmation(req.user._id);

    res.json({
      success: true,
      message: 'Alerte confirmée avec succès',
      data: {
        id: alert._id,
        confirmations: alert.interactions.confirmations,
        denials: alert.interactions.denials
      }
    });

  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation de l\'alerte'
    });
  }
});

// @route   POST /api/alerts/:id/deny
// @desc    Dénier une alerte
// @access  Private
router.post('/:id/deny', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // En mode développement, simuler la dénégation
    const hasDenied = alert.userInteractions.denied.some(
      den => den.user.toString() === req.user._id.toString()
    );

    if (hasDenied) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà dénié cette alerte'
      });
    }

    // Simuler l'ajout de la dénégation
    alert.userInteractions.denied.push({ user: req.user._id });
    alert.interactions.denials += 1;

    res.json({
      success: true,
      message: 'Alerte déniée avec succès',
      data: {
        confirmations: alert.interactions.confirmations,
        denials: alert.interactions.denials
      }
    });

  } catch (error) {
    console.error('Erreur lors de la dénégation de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la dénégation de l\'alerte'
    });
  }
});

// @route   POST /api/alerts/:id/update
// @desc    Ajouter une mise à jour à une alerte
// @access  Private
router.post('/:id/update', [
  auth,
  body('content')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Le contenu doit contenir entre 5 et 500 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // En mode développement, simuler l'ajout de la mise à jour
    if (process.env.NODE_ENV === 'development') {
      const update = {
        content: req.body.content,
        author: req.user._id,
        createdAt: new Date(),
        isOfficial: false
      };

      return res.json({
        success: true,
        message: 'Mise à jour ajoutée avec succès',
        data: update
      });
    }

    // En mode production, utiliser MongoDB
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // Vérifier les permissions (auteur, modérateur ou admin)
    const canUpdate = alert.author.toString() === req.user._id.toString() || 
                     req.user.role === 'moderator' || 
                     req.user.role === 'admin';

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à mettre à jour cette alerte'
      });
    }

    const isOfficial = req.user.role === 'moderator' || req.user.role === 'admin';

    // Ajouter la mise à jour
    const update = {
      content: req.body.content,
      author: req.user._id,
      createdAt: new Date(),
      isOfficial
    };

    alert.updates.push(update);

    res.json({
      success: true,
      message: 'Mise à jour ajoutée avec succès',
      data: update
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la mise à jour'
    });
  }
});

// @route   POST /api/alerts/:id/report
// @desc    Signaler une alerte
// @access  Private
router.post('/:id/report', [
  auth,
  body('reason')
    .isIn(['fausse_alerte', 'contenu_inapproprié', 'localisation_incorrecte', 'autre'])
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

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // Vérifier si l'utilisateur a déjà signalé cette alerte
    const hasReported = alert.moderation.reports.some(
      report => report.reporter.toString() === req.user._id.toString()
    );

    if (hasReported) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà signalé cette alerte'
      });
    }

    // En mode développement, simuler l'ajout du signalement
    const report = {
      reporter: req.user._id,
      reason: req.body.reason,
      description: req.body.description || '',
      reportedAt: new Date(),
      status: 'en_attente'
    };

    alert.moderation.reports.push(report);

    res.json({
      success: true,
      message: 'Alerte signalée avec succès',
      data: report
    });

  } catch (error) {
    console.error('Erreur lors du signalement de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du signalement de l\'alerte'
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Supprimer une alerte
// @access  Private (auteur ou admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerte non trouvée'
      });
    }

    // Vérifier les permissions (auteur ou admin)
    if (alert.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette alerte'
      });
    }

    // En mode développement, simuler la suppression
    res.json({
      success: true,
      message: 'Alerte supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'alerte'
    });
  }
});

module.exports = router; 