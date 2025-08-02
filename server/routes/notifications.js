const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Envoyer une notification
router.post('/send', auth, [
  body('title').notEmpty().trim().withMessage('Titre requis'),
  body('body').notEmpty().trim().withMessage('Corps du message requis'),
  body('type').optional().isIn(['message', 'alert', 'livestream', 'event', 'friend_request', 'general']),
  body('data').optional().isObject()
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

    const { title, body, type, data } = req.body;
    const senderId = req.user._id || req.user.id;

    // En mode développement, créer une notification fictive
    const notification = {
      _id: `notif-${Date.now()}`,
      title,
      body,
      type: type || 'general',
      data: data || {},
      sender: {
        _id: senderId,
        firstName: req.user.firstName || 'Test',
        lastName: req.user.lastName || 'User'
      },
      timestamp: new Date(),
      isRead: false
    };

    res.status(201).json({
      success: true,
      message: 'Notification envoyée avec succès',
      notification
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Récupérer les paramètres de notification
router.get('/settings', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // En mode développement, retourner des paramètres fictifs
    const settings = {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      types: {
        message: true,
        alert: true,
        livestream: true,
        event: true,
        friend_request: true,
        general: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Mettre à jour les paramètres de notification
router.put('/settings', auth, [
  body('pushEnabled').optional().isBoolean(),
  body('emailEnabled').optional().isBoolean(),
  body('smsEnabled').optional().isBoolean(),
  body('types').optional().isObject(),
  body('quietHours').optional().isObject()
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

    const userId = req.user._id || req.user.id;
    const settings = req.body;

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès',
      settings
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Récupérer les notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // En mode développement, retourner des notifications fictives
    const notifications = [
      {
        _id: 'notif-1',
        title: 'Nouveau message',
        body: 'Vous avez reçu un nouveau message',
        type: 'message',
        data: {
          conversationId: 'conv-1',
          senderName: 'Test User'
        },
        timestamp: new Date(),
        isRead: false
      },
      {
        _id: 'notif-2',
        title: 'Nouvelle alerte',
        body: 'Une nouvelle alerte a été publiée dans votre région',
        type: 'alert',
        data: {
          alertId: 'alert-1',
          urgency: 'high'
        },
        timestamp: new Date(),
        isRead: true
      }
    ];

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Marquer une notification comme lue
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;

    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 