const express = require('express');
const { body, validationResult } = require('express-validator');
const devAuth = require('../middleware/devAuth');

const router = express.Router();

// GET /api/friends - Récupérer la liste des amis
router.get('/', devAuth, async (req, res) => {
  try {
    console.log('📋 Récupération de la liste des amis...');
    
    const friends = [
      {
        _id: 'friend-1',
        firstName: 'Mamadou',
        lastName: 'Diallo',
        email: 'mamadou.diallo@communiconnect.gn',
        status: 'accepted',
        friendshipId: 'friendship-1',
        profilePicture: '/api/static/avatars/M.jpg'
      },
      {
        _id: 'friend-2',
        firstName: 'Fatou',
        lastName: 'Camara',
        email: 'fatou.camara@communiconnect.gn',
        status: 'accepted',
        friendshipId: 'friendship-2',
        profilePicture: '/api/static/avatars/F.jpg'
      },
      {
        _id: 'friend-3',
        firstName: 'Ibrahima',
        lastName: 'Sow',
        email: 'ibrahima.sow@communiconnect.gn',
        status: 'accepted',
        friendshipId: 'friendship-3',
        profilePicture: '/api/static/avatars/I.jpg'
      }
    ];

    console.log(`✅ ${friends.length} amis trouvés`);
    res.json({
      success: true,
      friends
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la liste d\'amis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/friends/requests - Récupérer les demandes reçues
router.get('/requests', devAuth, async (req, res) => {
  try {
    console.log('📨 Récupération des demandes d\'amis...');
    
    const requests = [
      {
        _id: 'req-1',
        requester: {
          _id: 'user-4',
          firstName: 'Aissatou',
          lastName: 'Bah',
          email: 'aissatou.bah@communiconnect.gn',
          profilePicture: '/api/static/avatars/A.jpg'
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // Il y a 2 heures
      },
      {
        _id: 'req-2',
        requester: {
          _id: 'user-5',
          firstName: 'Ousmane',
          lastName: 'Barry',
          email: 'ousmane.barry@communiconnect.gn',
          profilePicture: '/api/static/avatars/O.jpg'
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // Il y a 1 heure
      }
    ];

    console.log(`✅ ${requests.length} demandes trouvées`);
    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des demandes d\'amis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/friends/request - Envoyer une demande d'ami
router.post('/request', devAuth, [
  body('recipientId').notEmpty().withMessage('ID du destinataire requis')
], async (req, res) => {
  try {
    console.log('📤 Envoi d\'une demande d\'ami...');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { recipientId } = req.body;
    const requesterId = req.user._id || req.user.id;

    console.log(`📧 Demande de ${requesterId} vers ${recipientId}`);

    // En mode développement, accepter email ou ID
    const recipientEmail = recipientId.includes('@') ? recipientId : null;
    const recipientIdFinal = recipientEmail ? `user-${Date.now()}` : recipientId;

    const friendRequest = {
      _id: `req-${Date.now()}`,
      requester: {
        _id: requesterId,
        firstName: req.user.firstName || 'Test',
        lastName: req.user.lastName || 'User',
        profilePicture: '/api/static/avatars/T.jpg'
      },
      recipient: {
        _id: recipientIdFinal,
        firstName: recipientEmail ? recipientEmail.split('@')[0] : 'Autre',
        lastName: 'Utilisateur',
        email: recipientEmail || recipientId,
        profilePicture: '/api/static/avatars/U.jpg'
      },
      status: 'pending',
      createdAt: new Date()
    };

    console.log('✅ Demande d\'ami créée avec succès');
    res.status(201).json({
      success: true,
      message: 'Demande d\'ami envoyée avec succès',
      friendRequest
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la demande d\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/friends/accept/:requestId - Accepter une demande d'ami
router.post('/accept/:requestId', devAuth, async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(`✅ Acceptation de la demande ${requestId}`);

    res.json({
      success: true,
      message: 'Demande d\'ami acceptée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'acceptation de la demande d\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/friends/reject/:requestId - Rejeter une demande d'ami
router.post('/reject/:requestId', devAuth, async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(`❌ Rejet de la demande ${requestId}`);

    res.json({
      success: true,
      message: 'Demande d\'ami rejetée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors du rejet de la demande d\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/friends/remove/:friendshipId - Supprimer un ami
router.delete('/remove/:friendshipId', devAuth, async (req, res) => {
  try {
    const { friendshipId } = req.params;
    console.log(`🗑️ Suppression de l\'ami ${friendshipId}`);

    res.json({
      success: true,
      message: 'Ami supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression d\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;