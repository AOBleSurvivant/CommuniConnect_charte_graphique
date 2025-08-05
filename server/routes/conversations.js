const express = require('express');
const { body, validationResult } = require('express-validator');
const devAuth = require('../middleware/devAuth');
const router = express.Router();

// GET /api/conversations - Récupérer toutes les conversations de l'utilisateur
router.get('/', devAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // En mode développement, simuler des conversations
    const mockConversations = [
      {
        _id: 'conv-1',
        participants: [
          {
            _id: 'user-1',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: '/api/static/avatars/M.jpg'
          },
          {
            _id: 'user-2',
            firstName: 'Fatou',
            lastName: 'Camara',
            profilePicture: '/api/static/avatars/F.jpg'
          }
        ],
        lastMessage: {
          content: 'Ça va bien, merci ! Et toi ?',
          sender: 'user-2',
          createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
        },
        unreadCount: 0,
        isGroup: false,
        createdAt: new Date(Date.now() - 86400000), // 1 jour ago
        updatedAt: new Date(Date.now() - 1800000)
      },
      {
        _id: 'conv-2',
        participants: [
          {
            _id: 'user-1',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: '/api/static/avatars/M.jpg'
          },
          {
            _id: 'user-3',
            firstName: 'Ibrahima',
            lastName: 'Bah',
            profilePicture: '/api/static/avatars/I.jpg'
          }
        ],
        lastMessage: {
          content: 'Salut ! Tu viens à l\'événement ce soir ?',
          sender: 'user-3',
          createdAt: new Date(Date.now() - 900000) // 15 minutes ago
        },
        unreadCount: 1,
        isGroup: false,
        createdAt: new Date(Date.now() - 172800000), // 2 jours ago
        updatedAt: new Date(Date.now() - 900000)
      },
      {
        _id: 'conv-3',
        participants: [
          {
            _id: 'user-1',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: '/api/static/avatars/M.jpg'
          },
          {
            _id: 'user-4',
            firstName: 'Aissatou',
            lastName: 'Sow',
            profilePicture: '/api/static/avatars/A.jpg'
          },
          {
            _id: 'user-5',
            firstName: 'Ousmane',
            lastName: 'Barry',
            profilePicture: '/api/static/avatars/O.jpg'
          }
        ],
        lastMessage: {
          content: 'Super idée ! On se retrouve là-bas',
          sender: 'user-4',
          createdAt: new Date(Date.now() - 3600000) // 1 heure ago
        },
        unreadCount: 2,
        isGroup: true,
        groupName: 'Groupe Événements',
        createdAt: new Date(Date.now() - 259200000), // 3 jours ago
        updatedAt: new Date(Date.now() - 3600000)
      }
    ];

    res.json({
      success: true,
      conversations: mockConversations,
      total: mockConversations.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations'
    });
  }
});

// GET /api/conversations/:id - Récupérer une conversation spécifique
router.get('/:id', devAuth, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;
    
    // En mode développement, simuler une conversation
    const mockConversation = {
      _id: conversationId,
      participants: [
        {
          _id: 'user-1',
          firstName: 'Mamadou',
          lastName: 'Diallo',
          profilePicture: '/api/static/avatars/M.jpg'
        },
        {
          _id: 'user-2',
          firstName: 'Fatou',
          lastName: 'Camara',
          profilePicture: '/api/static/avatars/F.jpg'
        }
      ],
      messages: [
        {
          _id: 'msg-1',
          sender: {
            _id: 'user-1',
            firstName: 'Mamadou',
            lastName: 'Diallo',
            profilePicture: '/api/static/avatars/M.jpg'
          },
          content: 'Bonjour ! Comment ça va ?',
          type: 'text',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: 'msg-2',
          sender: {
            _id: 'user-2',
            firstName: 'Fatou',
            lastName: 'Camara',
            profilePicture: '/api/static/avatars/F.jpg'
          },
          content: 'Ça va bien, merci ! Et toi ?',
          type: 'text',
          isRead: true,
          createdAt: new Date(Date.now() - 1800000)
        }
      ],
      isGroup: false,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 1800000)
    };

    res.json({
      success: true,
      conversation: mockConversation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la conversation'
    });
  }
});

// POST /api/conversations - Créer une nouvelle conversation
router.post('/', [
  devAuth,
  body('participants').isArray().withMessage('Les participants doivent être un tableau'),
  body('participants').notEmpty().withMessage('Au moins un participant est requis'),
  body('isGroup').optional().isBoolean().withMessage('isGroup doit être un booléen'),
  body('groupName').optional().isString().withMessage('Le nom du groupe doit être une chaîne')
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

    const { participants, isGroup = false, groupName } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur actuel est dans les participants
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    // En mode développement, simuler la création
    const newConversation = {
      _id: `conv-${Date.now()}`,
      participants: participants.map(id => ({
        _id: id,
        firstName: `User-${id}`,
        lastName: 'Test',
        profilePicture: `/api/static/avatars/${id.charAt(0).toUpperCase()}.jpg`
      })),
      messages: [],
      isGroup,
      groupName: isGroup ? groupName : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💬 Nouvelle conversation créée:', newConversation._id);

    res.status(201).json({
      success: true,
      message: 'Conversation créée avec succès',
      conversation: newConversation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la conversation'
    });
  }
});

// PUT /api/conversations/:id - Mettre à jour une conversation
router.put('/:id', [
  devAuth,
  body('groupName').optional().isString().withMessage('Le nom du groupe doit être une chaîne')
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

    const conversationId = req.params.id;
    const { groupName } = req.body;

    // En mode développement, simuler la mise à jour
    const updatedConversation = {
      _id: conversationId,
      groupName: groupName || 'Groupe mis à jour',
      updatedAt: new Date()
    };

    console.log('💬 Conversation mise à jour:', conversationId);

    res.json({
      success: true,
      message: 'Conversation mise à jour avec succès',
      conversation: updatedConversation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la conversation'
    });
  }
});

// DELETE /api/conversations/:id - Supprimer une conversation
router.delete('/:id', devAuth, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    // En mode développement, simuler la suppression
    console.log('💬 Conversation supprimée:', conversationId);

    res.json({
      success: true,
      message: 'Conversation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la conversation'
    });
  }
});

// POST /api/conversations/:id/messages - Ajouter un message à une conversation
router.post('/:id/messages', [
  devAuth,
  body('content').notEmpty().withMessage('Le contenu du message est requis'),
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

    const conversationId = req.params.id;
    const { content, type = 'text' } = req.body;
    const userId = req.user.id;

    // En mode développement, simuler l'ajout du message
    const newMessage = {
      _id: `msg-${Date.now()}`,
      sender: {
        _id: userId,
        firstName: 'Mamadou',
        lastName: 'Diallo',
        profilePicture: '/api/static/avatars/M.jpg'
      },
      content,
      type,
      isRead: false,
      createdAt: new Date()
    };

    console.log('💬 Nouveau message ajouté à la conversation:', conversationId);

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      message: newMessage
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});

// PUT /api/conversations/:id/read - Marquer les messages comme lus
router.put('/:id/read', devAuth, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    // En mode développement, simuler la mise à jour
    console.log('💬 Messages marqués comme lus pour la conversation:', conversationId);

    res.json({
      success: true,
      message: 'Messages marqués comme lus'
    });
  } catch (error) {
    console.error('Erreur lors du marquage des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des messages'
    });
  }
});

module.exports = router; 