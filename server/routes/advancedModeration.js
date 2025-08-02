const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const advancedModerationService = require('../services/advancedModerationService');

const router = express.Router();

// Analyse automatique du contenu
router.post('/analyze', auth, [
  body('content').notEmpty().withMessage('Contenu requis'),
  body('contentType').isIn(['post', 'comment', 'event']).withMessage('Type de contenu invalide')
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

    const { content, contentType } = req.body;
    const analysis = await advancedModerationService.analyzeContent(content, contentType);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Traitement automatique des signalements
router.post('/process-report/:reportId', adminAuth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const result = await advancedModerationService.processReport(reportId);

    if (result.success) {
    res.json({
        success: true,
        message: 'Signalement traité avec succès',
        result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erreur lors du traitement',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Actions de modération
router.post('/moderate', adminAuth, [
  body('contentId').notEmpty().withMessage('ID du contenu requis'),
  body('contentType').isIn(['post', 'comment', 'event', 'user']).withMessage('Type de contenu invalide'),
  body('action').isIn(['warn', 'remove', 'suspend', 'ban']).withMessage('Action invalide'),
  body('reason').notEmpty().withMessage('Raison requise')
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

    const { contentId, contentType, action, reason } = req.body;
    const moderatorId = req.user._id || req.user.id;

    const result = await advancedModerationService.moderateContent(
      contentId,
      contentType,
      action,
      moderatorId,
      reason
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Action de modération appliquée',
        action: result.action
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la modération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors de la modération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Statistiques de modération
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await advancedModerationService.getModerationStats();

    if (stats) {
      res.json({
        success: true,
        stats
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Logs de modération
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, action, moderator } = req.query;
    
    // En mode développement, logs simulés
    const mockLogs = [
      {
        _id: 'log-1',
        action: 'content_review',
        target: {
          type: 'post',
          id: 'post-123',
          contentType: 'Post'
        },
        details: {
          reason: 'Contenu inapproprié détecté',
          automated: true,
          confidence: 85
        },
        moderator: 'system',
        createdAt: new Date(Date.now() - 3600000) // 1 heure ago
      },
      {
        _id: 'log-2',
        action: 'user_warning',
        target: {
          type: 'user',
          id: 'user-456',
          contentType: 'User'
        },
        details: {
          reason: 'Avertissement pour comportement inapproprié',
          automated: false
        },
        moderator: req.user._id,
        createdAt: new Date(Date.now() - 7200000) // 2 heures ago
      }
    ];

    res.json({
      success: true,
      logs: mockLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockLogs.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Configuration des seuils de modération
router.put('/thresholds', adminAuth, [
  body('warning').isFloat({ min: 0, max: 1 }).withMessage('Seuil d\'avertissement invalide'),
  body('review').isFloat({ min: 0, max: 1 }).withMessage('Seuil de révision invalide'),
  body('removal').isFloat({ min: 0, max: 1 }).withMessage('Seuil de suppression invalide'),
  body('ban').isFloat({ min: 0, max: 1 }).withMessage('Seuil de bannissement invalide')
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

    const { warning, review, removal, ban } = req.body;
    
    // Mise à jour des seuils
    advancedModerationService.thresholds = {
      warning: parseFloat(warning),
      review: parseFloat(review),
      removal: parseFloat(removal),
      ban: parseFloat(ban)
    };

    res.json({
      success: true,
      message: 'Seuils de modération mis à jour',
      thresholds: advancedModerationService.thresholds
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des seuils:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 