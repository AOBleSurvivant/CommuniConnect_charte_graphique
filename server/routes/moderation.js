const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/moderation/report - Signaler du contenu
router.post('/report', auth, [
  body('targetType').isIn(['user', 'post', 'comment', 'event', 'livestream']),
  body('targetId').notEmpty(),
  body('reason').isIn(['inappropriate', 'spam', 'false_information', 'duplicate', 'harassment', 'violence', 'other']),
  body('description').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données de signalement invalides',
        errors: errors.array()
      });
    }

    const { targetType, targetId, reason, description } = req.body;
    const reporterId = req.user._id || req.user.id;

    // En mode développement, simuler le signalement
    const report = {
      _id: `report_${Date.now()}`,
      targetType,
      targetId,
      reason,
      description: description || '',
      reporter: {
        _id: reporterId,
        firstName: req.user.firstName || 'Utilisateur',
        lastName: req.user.lastName || 'Anonyme'
      },
      status: 'pending',
      priority: reason === 'violence' || reason === 'harassment' ? 'high' : 'normal',
      createdAt: new Date(),
      automatedAnalysis: {
        confidence: 85,
        riskLevel: 'medium',
        automatedAction: null
      }
    };

    res.json({
      success: true,
      message: 'Signalement enregistré avec succès',
      report
    });
  } catch (error) {
    console.error('Erreur lors du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/moderation/reports - Liste des signalements (admin)
router.get('/reports', auth, [
  query('status').optional().isIn(['pending', 'reviewed', 'resolved', 'dismissed']),
  query('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres de filtrage invalides',
        errors: errors.array()
      });
    }

    const { status, priority, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // En mode développement, retourner des signalements fictifs
    const reports = [
      {
        _id: '1',
        targetType: 'post',
        targetId: 'post123',
        reason: 'inappropriate',
        description: 'Contenu inapproprié dans ce post',
        reporter: {
          _id: 'user1',
          firstName: 'Mamadou',
          lastName: 'Diallo'
        },
        status: 'pending',
        priority: 'normal',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        automatedAnalysis: {
          confidence: 75,
          riskLevel: 'medium',
          automatedAction: null
        }
      },
      {
        _id: '2',
        targetType: 'user',
        targetId: 'user456',
        reason: 'harassment',
        description: 'Harcèlement répété envers d\'autres utilisateurs',
        reporter: {
          _id: 'user2',
          firstName: 'Fatoumata',
          lastName: 'Camara'
        },
        status: 'pending',
        priority: 'high',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        automatedAnalysis: {
          confidence: 90,
          riskLevel: 'high',
          automatedAction: 'temporary_suspension'
        }
      }
    ];

    // Filtrer selon les critères
    let filteredReports = reports;
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    if (priority) {
      filteredReports = filteredReports.filter(report => report.priority === priority);
    }

    const total = filteredReports.length;
    const paginatedReports = filteredReports.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      reports: paginatedReports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des signalements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/moderation/reports/:reportId - Traiter un signalement
router.put('/reports/:reportId', auth, [
  body('action').isIn(['dismiss', 'warn', 'suspend', 'ban', 'remove_content']),
  body('reason').trim().isLength({ min: 10, max: 500 }),
  body('duration').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Action de modération invalide',
        errors: errors.array()
      });
    }

    const { reportId } = req.params;
    const { action, reason, duration } = req.body;
    const moderatorId = req.user._id || req.user.id;

    // En mode développement, simuler le traitement
    const moderationAction = {
      _id: `action_${Date.now()}`,
      reportId,
      action,
      reason,
      duration: duration || null,
      moderator: {
        _id: moderatorId,
        firstName: req.user.firstName || 'Modérateur',
        lastName: req.user.lastName || 'Système'
      },
      timestamp: new Date(),
      automated: false
    };

    res.json({
      success: true,
      message: 'Action de modération appliquée avec succès',
      action: moderationAction
    });
  } catch (error) {
    console.error('Erreur lors du traitement du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/moderation/scan - Scanner automatique du contenu
router.post('/scan', auth, [
  body('content').trim().isLength({ min: 1, max: 10000 }),
  body('contentType').isIn(['post', 'comment', 'message', 'event_description']),
  body('userId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Contenu invalide',
        errors: errors.array()
      });
    }

    const { content, contentType, userId } = req.body;

    // En mode développement, simuler l'analyse automatique
    const scanResult = {
      isFlagged: false,
      riskLevel: 'low',
      confidence: 95,
      detectedIssues: [],
      recommendations: ['Contenu approuvé automatiquement'],
      automatedActions: []
    };

    // Détecter les mots-clés problématiques
    const problematicKeywords = [
      'spam', 'arnaque', 'escroquerie', 'violence', 'harcèlement',
      'discrimination', 'racisme', 'sexisme', 'haine'
    ];

    const detectedKeywords = problematicKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (detectedKeywords.length > 0) {
      scanResult.isFlagged = true;
      scanResult.riskLevel = 'medium';
      scanResult.confidence = 80;
      scanResult.detectedIssues = detectedKeywords.map(keyword => ({
        type: 'keyword',
        keyword,
        severity: 'medium'
      }));
      scanResult.recommendations = ['Contenu nécessite une revue manuelle'];
      scanResult.automatedActions = ['flag_for_review'];
    }

    res.json({
      success: true,
      scanResult
    });
  } catch (error) {
    console.error('Erreur lors du scan automatique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/moderation/stats - Statistiques de modération
router.get('/stats', auth, async (req, res) => {
  try {
    // En mode développement, retourner des statistiques fictives
    const stats = {
      totalReports: 45,
      pendingReports: 12,
      resolvedReports: 28,
      dismissedReports: 5,
      averageResponseTime: 2.5, // heures
      automatedActions: 15,
      manualReviews: 30,
      topReasons: [
        { reason: 'inappropriate', count: 20 },
        { reason: 'spam', count: 12 },
        { reason: 'harassment', count: 8 },
        { reason: 'false_information', count: 5 }
      ],
      riskLevels: {
        low: 25,
        medium: 15,
        high: 5
      },
      recentActivity: [
        {
          action: 'report_created',
          count: 5,
          period: 'last_24h'
        },
        {
          action: 'content_removed',
          count: 3,
          period: 'last_24h'
        },
        {
          action: 'user_suspended',
          count: 1,
          period: 'last_24h'
        }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/moderation/filters - Filtres de contenu automatiques
router.get('/filters', auth, async (req, res) => {
  try {
    // En mode développement, retourner des filtres fictifs
    const filters = {
      keywords: [
        'spam', 'arnaque', 'escroquerie', 'violence', 'harcèlement',
        'discrimination', 'racisme', 'sexisme', 'haine', 'menace'
      ],
      patterns: [
        {
          name: 'spam_pattern',
          pattern: '\\b(?:gagnez|gratuit|argent facile|richesse rapide)\\b',
          action: 'flag_for_review'
        },
        {
          name: 'phone_pattern',
          pattern: '\\b(?:\\+224|00224)?[0-9]{8,9}\\b',
          action: 'allow_with_warning'
        },
        {
          name: 'url_pattern',
          pattern: 'https?://[^\\s]+',
          action: 'flag_for_review'
        }
      ],
      settings: {
        autoFlag: true,
        autoRemove: false,
        requireReview: true,
        sensitivityLevel: 'medium'
      }
    };

    res.json({
      success: true,
      filters
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des filtres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 