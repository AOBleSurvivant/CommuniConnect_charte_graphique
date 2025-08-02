const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Signaler du contenu
router.post('/report', auth, [
  body('type').isIn(['post', 'message', 'livestream', 'event', 'user']).withMessage('Type de contenu invalide'),
  body('contentId').notEmpty().withMessage('ID du contenu requis'),
  body('reason').notEmpty().trim().withMessage('Raison du signalement requise'),
  body('description').optional().trim()
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

    const { type, contentId, reason, description } = req.body;
    const reporterId = req.user._id || req.user.id;

    // En mode développement, créer un signalement fictif
    const report = {
      _id: `report-${Date.now()}`,
      type,
      contentId,
      reason,
      description: description || '',
      reporter: {
        _id: reporterId,
        firstName: req.user.firstName || 'Test',
        lastName: req.user.lastName || 'User'
      },
      status: 'pending',
      severity: 'medium',
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Signalement créé avec succès',
      report
    });
  } catch (error) {
    console.error('Erreur lors de la création du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Récupérer les signalements
router.get('/reports', auth, async (req, res) => {
  try {
    // En mode développement, retourner des signalements fictifs
    const reports = [
      {
        _id: 'report-1',
        type: 'post',
        contentId: 'post-1',
        reason: 'Contenu inapproprié',
        description: 'Ce post contient du contenu offensant',
        reporter: {
          _id: 'user-1',
          firstName: 'Signaleur',
          lastName: 'Test'
        },
        status: 'pending',
        severity: 'high',
        createdAt: new Date()
      },
      {
        _id: 'report-2',
        type: 'message',
        contentId: 'message-1',
        reason: 'Harcèlement',
        description: 'Messages répétés et harcelants',
        reporter: {
          _id: 'user-2',
          firstName: 'Autre',
          lastName: 'Utilisateur'
        },
        status: 'investigating',
        severity: 'medium',
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des signalements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Agir sur un signalement
router.post('/reports/:reportId/action', auth, [
  body('action').isIn(['approve', 'reject', 'delete', 'warn', 'ban']).withMessage('Action invalide'),
  body('reason').notEmpty().trim().withMessage('Raison de l\'action requise')
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

    const { reportId } = req.params;
    const { action, reason } = req.body;
    const moderatorId = req.user._id || req.user.id;

    // En mode développement, créer une action de modération fictive
    const moderationAction = {
      _id: `action-${Date.now()}`,
      reportId,
      action,
      reason,
      moderator: {
        _id: moderatorId,
        firstName: req.user.firstName || 'Modérateur',
        lastName: req.user.lastName || 'Test'
      },
      timestamp: new Date()
    };

    res.json({
      success: true,
      message: 'Action de modération effectuée avec succès',
      moderationAction
    });
  } catch (error) {
    console.error('Erreur lors de l\'action de modération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Récupérer l'historique de modération
router.get('/history', auth, async (req, res) => {
  try {
    // En mode développement, retourner un historique fictif
    const history = [
      {
        _id: 'action-1',
        action: 'delete',
        type: 'post',
        moderator: 'Admin',
        target: 'Post supprimé',
        reason: 'Contenu inapproprié',
        timestamp: new Date()
      },
      {
        _id: 'action-2',
        action: 'warn',
        type: 'user',
        moderator: 'Modérateur',
        target: 'Utilisateur averti',
        reason: 'Comportement inapproprié',
        timestamp: new Date()
      }
    ];

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 