const express = require('express');
const { body, validationResult } = require('express-validator');
const devAuth = require('../middleware/devAuth');
const router = express.Router();

// GET /api/messages - Récupérer tous les messages
router.get('/', devAuth, async (req, res) => {
  try {
    // En mode développement, simuler des messages
    const mockMessages = [
      {
        _id: 'msg-1',
        sender: {
          _id: 'user-1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/M.jpg'
        },
        receiver: {
          _id: 'user-2',
          firstName: 'Fatou',
          lastName: 'Camara',
          profilePicture: '/api/static/avatars/F.jpg'
        },
        content: 'Bonjour ! Comment ça va ?',
        type: 'text',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000), // 1 heure ago
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        _id: 'msg-2',
        sender: {
          _id: 'user-2',
          firstName: 'Fatou',
          lastName: 'Camara',
          profilePicture: '/api/static/avatars/F.jpg'
        },
        receiver: {
          _id: 'user-1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/M.jpg'
        },
        content: 'Ça va bien, merci ! Et toi ?',
        type: 'text',
        isRead: true,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1800000)
      },
      {
        _id: 'msg-3',
        sender: {
          _id: 'user-3',
          firstName: 'Ibrahima',
          lastName: 'Bah',
          profilePicture: '/api/static/avatars/I.jpg'
        },
        receiver: {
          _id: 'user-1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/M.jpg'
        },
        content: 'Salut ! Tu viens à l\'événement ce soir ?',
        type: 'text',
        isRead: false,
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
        updatedAt: new Date(Date.now() - 900000)
      }
    ];

    res.json({
      success: true,
      messages: mockMessages,
      total: mockMessages.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
});

// GET /api/messages/:id - Récupérer un message spécifique
router.get('/:id', devAuth, async (req, res) => {
  try {
    const messageId = req.params.id;
    
    // En mode développement, simuler un message
    const mockMessage = {
      _id: messageId,
      sender: {
        _id: 'user-1',
        firstName: 'Mamadou',
        lastName: 'Diallo',
        profilePicture: '/api/static/avatars/M.jpg'
      },
      receiver: {
        _id: 'user-2',
        firstName: 'Fatou',
        lastName: 'Camara',
        profilePicture: '/api/static/avatars/F.jpg'
      },
      content: 'Message spécifique récupéré',
      type: 'text',
      isRead: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: mockMessage
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message'
    });
  }
});

// POST /api/messages - Créer un nouveau message
router.post('/', devAuth, [
  body('receiverId').notEmpty().withMessage('ID du destinataire requis'),
  body('content').notEmpty().withMessage('Contenu du message requis'),
  body('type').optional().isIn(['text', 'image', 'file']).withMessage('Type de message invalide')
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

    const { receiverId, content, type = 'text' } = req.body;
    const senderId = req.user.id;

    // En mode développement, simuler la création d'un message
    const newMessage = {
      _id: `msg-${Date.now()}`,
      sender: {
        _id: senderId,
        firstName: 'Utilisateur',
        lastName: 'Connecté',
        profilePicture: '/api/static/avatars/U.jpg'
      },
      receiver: {
        _id: receiverId,
        firstName: 'Destinataire',
        lastName: 'Test',
        profilePicture: '/api/static/avatars/D.jpg'
      },
      content: content,
      type: type,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💬 Nouveau message créé:', {
      sender: newMessage.sender.firstName,
      receiver: newMessage.receiver.firstName,
      content: content.substring(0, 50) + '...',
      type: type
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: newMessage
    });
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du message'
    });
  }
});

// PUT /api/messages/:id - Mettre à jour un message
router.put('/:id', devAuth, [
  body('content').optional().notEmpty().withMessage('Contenu du message requis'),
  body('isRead').optional().isBoolean().withMessage('Statut de lecture invalide')
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

    const messageId = req.params.id;
    const { content, isRead } = req.body;

    // En mode développement, simuler la mise à jour
    const updatedMessage = {
      _id: messageId,
      content: content || 'Message mis à jour',
      isRead: isRead !== undefined ? isRead : true,
      updatedAt: new Date()
    };

    console.log('✏️ Message mis à jour:', {
      id: messageId,
      content: content ? content.substring(0, 30) + '...' : 'N/A',
      isRead: isRead
    });

    res.json({
      success: true,
      message: 'Message mis à jour avec succès',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du message'
    });
  }
});

// DELETE /api/messages/:id - Supprimer un message
router.delete('/:id', devAuth, async (req, res) => {
  try {
    const messageId = req.params.id;

    console.log('🗑️ Message supprimé:', messageId);

    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message'
    });
  }
});

// GET /api/messages/conversation/:userId - Récupérer une conversation
router.get('/conversation/:userId', devAuth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    // En mode développement, simuler une conversation
    const mockConversation = [
      {
        _id: 'conv-1',
        sender: {
          _id: currentUserId,
          firstName: 'Utilisateur',
          lastName: 'Connecté',
          profilePicture: '/api/static/avatars/U.jpg'
        },
        receiver: {
          _id: otherUserId,
          firstName: 'Autre',
          lastName: 'Utilisateur',
          profilePicture: '/api/static/avatars/A.jpg'
        },
        content: 'Salut ! Comment ça va ?',
        type: 'text',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000), // 2 heures ago
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        _id: 'conv-2',
        sender: {
          _id: otherUserId,
          firstName: 'Autre',
          lastName: 'Utilisateur',
          profilePicture: '/api/static/avatars/A.jpg'
        },
        receiver: {
          _id: currentUserId,
          firstName: 'Utilisateur',
          lastName: 'Connecté',
          profilePicture: '/api/static/avatars/U.jpg'
        },
        content: 'Ça va bien, merci ! Et toi ?',
        type: 'text',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000), // 1 heure ago
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        _id: 'conv-3',
        sender: {
          _id: currentUserId,
          firstName: 'Utilisateur',
          lastName: 'Connecté',
          profilePicture: '/api/static/avatars/U.jpg'
        },
        receiver: {
          _id: otherUserId,
          firstName: 'Autre',
          lastName: 'Utilisateur',
          profilePicture: '/api/static/avatars/A.jpg'
        },
        content: 'Très bien aussi ! On se voit bientôt ?',
        type: 'text',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1800000)
      }
    ];

    res.json({
      success: true,
      conversation: mockConversation,
      total: mockConversation.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la conversation'
    });
  }
});

// GET /api/messages/unread - Récupérer les messages non lus
router.get('/unread/count', devAuth, async (req, res) => {
  try {
    // En mode développement, simuler le comptage
    const unreadCount = 3;

    res.json({
      success: true,
      unreadCount: unreadCount
    });
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des messages non lus'
    });
  }
});

module.exports = router; 