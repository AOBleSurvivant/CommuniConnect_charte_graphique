const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/communiconseil - Récupérer toutes les publications (accès public)
router.get('/', async (req, res) => {
  try {
    const mockPublications = [
      {
        _id: 'pub-1',
        title: 'Comment obtenir un acte de naissance rapidement',
        category: 'Administration',
        description: 'Voici les étapes pour obtenir votre acte de naissance en moins de 48h...',
        author: {
          _id: 'contrib-1',
          name: 'Mamadou Diallo',
          region: 'Conakry',
          expertise: 'Administration publique',
          verified: true,
          reliabilityScore: 95
        },
        reactions: { thanks: 12, useful: 8 },
        createdAt: new Date(Date.now() - 86400000)
      }
    ];

    res.json({
      success: true,
      publications: mockPublications,
      total: mockPublications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des publications'
    });
  }
});

// GET /api/communiconseil/categories - Récupérer les catégories (accès public)
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'Santé', 'Droit', 'Administration', 'Agriculture', 'Sécurité',
      'Éducation', 'Transport', 'Commerce', 'Environnement', 'Technologie'
    ];
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
});

// POST /api/communiconseil/contributor/apply - Demande pour devenir contributeur
router.post('/contributor/apply', auth, [
  body('name').notEmpty().trim(),
  body('region').notEmpty().trim(),
  body('expertise').notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { name, region, expertise, phone, email } = req.body;
    const userId = req.user.id;

    // En mode développement, simuler une demande
    const mockApplication = {
      _id: `app-${Date.now()}`,
      userId,
      name,
      region,
      expertise,
      phone,
      email,
      status: 'pending',
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: 'Votre demande a été soumise avec succès',
      application: mockApplication
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de la demande'
    });
  }
});

// POST /api/communiconseil/publications - Créer une publication (réservé aux contributeurs)
router.post('/publications', auth, [
  body('title').notEmpty().trim().isLength({ min: 10, max: 200 }),
  body('category').notEmpty().trim(),
  body('description').notEmpty().trim().isLength({ min: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { title, category, description, media } = req.body;
    const userId = req.user.id;

    // Vérifier si l'utilisateur est un contributeur vérifié
    // En mode développement, simuler la vérification
    const isVerifiedContributor = true;

    if (!isVerifiedContributor) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les contributeurs vérifiés peuvent publier'
      });
    }

    // En mode développement, simuler une publication
    const mockPublication = {
      _id: `pub-${Date.now()}`,
      title,
      category,
      description,
      author: {
        _id: userId,
        name: 'Contributeur Vérifié',
        region: 'Conakry',
        expertise: 'Expertise locale',
        verified: true,
        reliabilityScore: 90
      },
      media: media || null,
      reactions: { thanks: 0, useful: 0 },
      comments: [],
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: 'Publication créée avec succès',
      publication: mockPublication
    });
  } catch (error) {
    console.error('Erreur lors de la création de la publication:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la publication'
    });
  }
});

// POST /api/communiconseil/publications/:id/react - Réagir à une publication
router.post('/publications/:id/react', auth, [
  body('reaction').isIn(['thanks', 'useful'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Réaction invalide'
      });
    }

    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user.id;

    res.json({
      success: true,
      message: 'Réaction enregistrée',
      reaction: {
        publicationId: id,
        userId,
        type: reaction,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la réaction:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la réaction'
    });
  }
});

// POST /api/communiconseil/publications/:id/report - Signaler une publication
router.post('/publications/:id/report', auth, [
  body('reason').notEmpty().trim().isLength({ min: 10, max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Raison invalide'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const mockReport = {
      _id: `report-${Date.now()}`,
      publicationId: id,
      userId,
      reason,
      status: 'pending',
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: 'Signalement enregistré',
      report: mockReport
    });
  } catch (error) {
    console.error('Erreur lors du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du signalement'
    });
  }
});

module.exports = router; 