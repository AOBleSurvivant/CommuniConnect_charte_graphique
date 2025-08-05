const express = require('express');
const { body, validationResult, query } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // En mode développement, retourner un profil fictif
    const profile = {
      _id: userId,
      firstName: req.user.firstName || 'Test',
      lastName: req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: req.user.phone || '+224123456789',
      address: req.user.address || 'Conakry, Guinée',
      profilePicture: req.user.profilePicture || null,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/users/profile - Modifier le profil utilisateur
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim().isMobilePhone('any'),
  body('address').optional().trim().isLength({ min: 5, max: 200 }),
  body('profilePicture').optional().isURL()
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
    const { firstName, lastName, phone, address, profilePicture } = req.body;

    // En mode développement, simuler la mise à jour
    const updatedProfile = {
      _id: userId,
      firstName: firstName || req.user.firstName || 'Test',
      lastName: lastName || req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: phone || req.user.phone || '+224123456789',
      address: address || req.user.address || 'Conakry, Guinée',
      profilePicture: profilePicture || req.user.profilePicture || null,
      isVerified: true,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/users/profile/picture - Upload photo de profil
router.post('/profile/picture', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { profilePicture } = req.body;

    // En mode développement, simuler l'upload
    const updatedProfile = {
      _id: userId,
      firstName: req.user.firstName || 'Test',
      lastName: req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: req.user.phone || '+224123456789',
      address: req.user.address || 'Conakry, Guinée',
      profilePicture: profilePicture || 'https://via.placeholder.com/150',
      isVerified: true,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Photo de profil mise à jour avec succès',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/users/:userId - Récupérer les informations d'un utilisateur public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // En mode développement, retourner un profil fictif
    const userProfile = {
      _id: userId,
      firstName: 'Utilisateur',
      lastName: 'Public',
      email: 'user@communiconnect.gn',
      phone: '+224123456789',
      address: 'Conakry, Guinée',
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre-ville',
      profilePicture: '/api/static/avatars/default.jpg',
      isVerified: true,
      bio: 'Utilisateur CommuniConnect passionné par la technologie et l\'innovation.',
      interests: ['Technologie', 'Innovation', 'Développement'],
      skills: ['JavaScript', 'React', 'Node.js'],
      socialLinks: {
        facebook: 'https://facebook.com/user',
        twitter: 'https://twitter.com/user',
        linkedin: 'https://linkedin.com/in/user'
      },
      statistics: {
        postsCount: 25,
        followersCount: 150,
        followingCount: 120,
        eventsCreated: 5,
        eventsAttended: 12
      },
      createdAt: new Date(),
      lastSeen: new Date()
    };

    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/users/search - Rechercher des utilisateurs
router.get('/search', [
  query('q').optional().trim().isLength({ min: 2 }),
  query('region').optional().trim(),
  query('prefecture').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres de recherche invalides',
        errors: errors.array()
      });
    }

    const { q, region, prefecture, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // En mode développement, retourner des résultats fictifs
    const users = [
      {
        _id: '1',
        firstName: 'Mamadou',
        lastName: 'Diallo',
        email: 'mamadou@communiconnect.gn',
        region: 'Conakry',
        prefecture: 'Conakry',
        profilePicture: '/api/static/avatars/user1.jpg',
        isVerified: true,
        bio: 'Développeur passionné'
      },
      {
        _id: '2',
        firstName: 'Fatoumata',
        lastName: 'Camara',
        email: 'fatoumata@communiconnect.gn',
        region: 'Kindia',
        prefecture: 'Kindia',
        profilePicture: '/api/static/avatars/user2.jpg',
        isVerified: true,
        bio: 'Entrepreneure innovante'
      },
      {
        _id: '3',
        firstName: 'Ibrahima',
        lastName: 'Bah',
        email: 'ibrahima@communiconnect.gn',
        region: 'Kankan',
        prefecture: 'Kankan',
        profilePicture: '/api/static/avatars/user3.jpg',
        isVerified: false,
        bio: 'Étudiant en informatique'
      }
    ];

    // Filtrer selon les critères
    let filteredUsers = users;
    if (q) {
      filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(q.toLowerCase()) ||
        user.lastName.toLowerCase().includes(q.toLowerCase()) ||
        user.bio.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (region) {
      filteredUsers = filteredUsers.filter(user => user.region === region);
    }
    if (prefecture) {
      filteredUsers = filteredUsers.filter(user => user.prefecture === prefecture);
    }

    // Pagination
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/users/:userId/stats - Statistiques utilisateur
router.get('/:userId/stats', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // En mode développement, retourner des statistiques fictives
    const stats = {
      _id: userId,
      activity: {
        postsCreated: 25,
        commentsPosted: 45,
        eventsCreated: 5,
        eventsAttended: 12,
        livestreamsHosted: 3,
        messagesSent: 150
      },
      engagement: {
        totalLikes: 320,
        totalShares: 45,
        totalViews: 1200,
        averageRating: 4.5
      },
      social: {
        followersCount: 150,
        followingCount: 120,
        mutualFriends: 85,
        newFollowersThisMonth: 12
      },
      performance: {
        responseTime: 2.5,
        onlineHours: 45,
        lastActive: new Date(),
        streakDays: 7
      },
      achievements: [
        'Premier post',
        '10 followers',
        '50 posts',
        'Organisateur d\'événement'
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

// GET /api/users/:userId/activity - Activité récente
router.get('/:userId/activity', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // En mode développement, retourner une activité fictive
    const activities = [
      {
        _id: '1',
        type: 'post_created',
        title: 'Nouveau post créé',
        description: 'A partagé une publication sur l\'innovation technologique',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        metadata: {
          postId: 'post123',
          likes: 15,
          comments: 3
        }
      },
      {
        _id: '2',
        type: 'event_attended',
        title: 'Événement participé',
        description: 'A participé à l\'événement "Innovation Guinée 2024"',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1j ago
        metadata: {
          eventId: 'event456',
          eventTitle: 'Innovation Guinée 2024'
        }
      },
      {
        _id: '3',
        type: 'friend_added',
        title: 'Nouvel ami',
        description: 'A ajouté Fatoumata Camara comme ami',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2j ago
        metadata: {
          friendId: 'friend789',
          friendName: 'Fatoumata Camara'
        }
      }
    ];

    const total = activities.length;
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      activities: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 