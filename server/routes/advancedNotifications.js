const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const AdvancedNotificationService = require('../services/advancedNotificationService');

const router = express.Router();

// Initialiser le service de notifications
let notificationService;

// Middleware pour initialiser le service
router.use((req, res, next) => {
  if (!notificationService && req.app.get('io')) {
    notificationService = new AdvancedNotificationService(req.app.get('io'));
  }
  next();
});

// Envoyer une notification
router.post('/send', auth, [
  body('userId').notEmpty().withMessage('ID utilisateur requis'),
  body('title').notEmpty().withMessage('Titre requis'),
  body('message').notEmpty().withMessage('Message requis'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']),
  body('channels').optional().isArray()
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

    const { userId, title, message, type = 'info', channels = ['real-time'] } = req.body;

    const notification = {
      id: `notification-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      sender: req.user._id || req.user.id
    };

    const result = await notificationService.sendMultiChannelNotification(
      userId, 
      notification, 
      channels
    );

    res.json({
      success: true,
      message: 'Notification envoyée',
      notification,
      result
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Envoyer une notification de groupe
router.post('/send-group', auth, [
  body('userIds').isArray().withMessage('Liste d\'utilisateurs requise'),
  body('title').notEmpty().withMessage('Titre requis'),
  body('message').notEmpty().withMessage('Message requis'),
  body('channels').optional().isArray()
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

    const { userIds, title, message, channels = ['real-time'] } = req.body;

    const notification = {
      id: `group-notification-${Date.now()}`,
      title,
      message,
      type: 'group',
      timestamp: new Date().toISOString(),
      sender: req.user._id || req.user.id
    };

    const result = await notificationService.sendGroupNotification(
      userIds, 
      notification, 
      channels
    );

    res.json({
      success: true,
      message: 'Notifications de groupe envoyées',
      notification,
      result
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notifications de groupe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Notifications basées sur des événements
router.post('/event', auth, [
  body('event').notEmpty().withMessage('Événement requis'),
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

    const { event, data = {} } = req.body;

    const notification = await notificationService.sendEventBasedNotification(event, data);

    if (!notification) {
      return res.status(400).json({
        success: false,
        message: 'Événement non reconnu'
      });
    }

    res.json({
      success: true,
      message: 'Notification d\'événement créée',
      notification
    });
  } catch (error) {
    console.error('Erreur lors de la création de notification d\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Récupérer les notifications d'un utilisateur
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const notifications = notificationService.getUserNotifications(userId, parseInt(limit));

    res.json({
      success: true,
      notifications,
      count: notifications.length
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
router.patch('/read/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id || req.user.id;

    notificationService.markNotificationAsRead(userId, notificationId);

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

// Statistiques des notifications
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = notificationService.getNotificationStats();

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

// Préférences de notification
router.get('/preferences/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await notificationService.getUserNotificationPreferences(userId);

    res.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Mettre à jour les préférences de notification
router.put('/preferences/:userId', auth, [
  body('emailNotifications').optional().isBoolean(),
  body('smsNotifications').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean(),
  body('realTimeNotifications').optional().isBoolean()
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

    const { userId } = req.params;
    const preferences = req.body;

    // En mode développement, simulation de mise à jour
    console.log(`📝 Mise à jour des préférences pour ${userId}:`, preferences);

    res.json({
      success: true,
      message: 'Préférences mises à jour',
      preferences
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Test de notification
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const testNotification = {
      id: `test-${Date.now()}`,
      title: 'Test de notification',
      message: 'Ceci est un test de notification en temps réel.',
      type: 'test',
      timestamp: new Date().toISOString()
    };

    const result = await notificationService.sendMultiChannelNotification(
      userId, 
      testNotification, 
      ['real-time', 'push']
    );

    res.json({
      success: true,
      message: 'Test de notification envoyé',
      notification: testNotification,
      result
    });
  } catch (error) {
    console.error('Erreur lors du test de notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 