const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();
const crypto = require('crypto'); // Added for generating unique IDs

// Données fictives pour le développement
let posts = [
  {
    _id: '1',
    author: {
      _id: 'user1',
      firstName: 'Mamadou',
      lastName: 'Diallo',
      avatar: null
    },
    content: 'Bonjour à tous ! J\'organise une réunion de quartier ce samedi à 16h pour discuter de la propreté de notre quartier. Tout le monde est invité !',
    media: [],
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      coordinates: { latitude: 9.5144, longitude: -13.6783 }
    },
    type: 'community',
    reactions: {
      like: ['user2', 'user3'],
      love: ['user4'],
      helpful: ['user5']
    },
    comments: [
      {
        _id: 'comment1',
        author: {
          _id: 'user2',
          firstName: 'Fatou',
          lastName: 'Camara'
        },
        content: 'Excellente initiative ! Je serai là.',
        createdAt: new Date(Date.now() - 86400000)
      }
    ],
    shares: 2,
    isPublic: true,
    isActive: true,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    _id: '2',
    author: {
      _id: 'user3',
      firstName: 'Ibrahima',
      lastName: 'Sow',
      avatar: null
    },
    content: 'Attention ! Il y a des travaux sur la route principale demain. Prévoyez un itinéraire alternatif.',
    media: [],
    location: {
      region: 'Conakry',
      prefecture: 'Conakry',
      commune: 'Kaloum',
      quartier: 'Centre',
      coordinates: { latitude: 9.5144, longitude: -13.6783 }
    },
    type: 'alert',
    reactions: {
      like: ['user1', 'user4'],
      helpful: ['user2', 'user5']
    },
    comments: [],
    shares: 5,
    isPublic: true,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000)
  }
];

// GET /api/posts - Récupérer tous les posts (avec pagination et filtres)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      region, 
      commune, 
      quartier,
      author,
      search 
    } = req.query;

    let filteredPosts = [...posts];

    // Filtres
    if (type) {
      filteredPosts = filteredPosts.filter(post => post.type === type);
    }
    if (region) {
      filteredPosts = filteredPosts.filter(post => post.location.region === region);
    }
    if (commune) {
      filteredPosts = filteredPosts.filter(post => post.location.commune === commune);
    }
    if (quartier) {
      filteredPosts = filteredPosts.filter(post => post.location.quartier === quartier);
    }
    if (author) {
      filteredPosts = filteredPosts.filter(post => post.author._id === author);
    }
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Tri par date de création (plus récent en premier)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Calculer les statistiques
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: endIndex < totalPosts,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/posts/:id - Récupérer un post spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const post = posts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/posts - Créer un nouveau post
router.post('/', auth, [
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Le contenu doit contenir entre 1 et 2000 caractères'),
  body('type').optional().isIn(['general', 'entraide', 'vente', 'alerte', 'besoin', 'evenement', 'information', 'repost']).withMessage('Type de post invalide'),
  body('visibility').optional().isIn(['public', 'quartier', 'commune', 'prefecture', 'region']).withMessage('Visibilité invalide'),
  body('location.region').optional().isIn(['Conakry', 'Boké', 'Kindia', 'Mamou', 'Labé', 'Faranah', 'Kankan', 'N\'Zérékoré']).withMessage('Région invalide'),
  body('tags').optional().isArray().withMessage('Les tags doivent être un tableau'),
  body('isRepost').optional().isBoolean().withMessage('isRepost doit être un booléen'),
  body('originalPost').optional().isMongoId().withMessage('ID de post original invalide'),
  body('repostContent').optional().isLength({ max: 500 }).withMessage('Le contenu du repost ne peut pas dépasser 500 caractères')
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

    const {
      content,
      type = 'general',
      visibility = 'quartier',
      location,
      tags = [],
      media = [],
      isRepost = false,
      originalPost,
      repostContent
    } = req.body;

    // Validation spécifique pour les reposts
    if (isRepost) {
      if (!originalPost) {
        return res.status(400).json({
          success: false,
          message: 'Le post original est requis pour un repost'
        });
      }

      // Vérifier que le post original existe
      const originalPostExists = posts.find(p => p._id === originalPost);
      if (!originalPostExists) {
        return res.status(404).json({
          success: false,
          message: 'Le post original n\'existe pas'
        });
      }
    }

    const newPost = {
      _id: crypto.randomBytes(16).toString('hex'),
      author: {
        _id: req.user.id,
        firstName: req.user.firstName || 'Utilisateur',
        lastName: req.user.lastName || 'Connecté',
        name: `${req.user.firstName || 'Utilisateur'} ${req.user.lastName || 'Connecté'}`,
        profilePicture: req.user.profilePicture
      },
      content: isRepost ? (repostContent || content) : content,
      type: isRepost ? 'repost' : type,
      isRepost,
      originalPost: isRepost ? originalPost : undefined,
      repostContent: isRepost ? repostContent : undefined,
      visibility,
      location: location || {
        region: req.user.region || 'Conakry',
        prefecture: req.user.prefecture || 'Conakry',
        commune: req.user.commune || '',
        quartier: req.user.quartier || ''
      },
      tags,
      media,
      reactions: {
        likes: [],
        shares: [],
        comments: []
      },
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    posts.unshift(newPost);

    res.status(201).json({
      success: true,
      message: isRepost ? 'Repost créé avec succès' : 'Post créé avec succès',
      data: newPost
    });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/posts/:id - Mettre à jour un post
router.put('/:id', [
  auth,
  body('content').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Le contenu doit contenir entre 1 et 2000 caractères'),
  body('type').optional().isIn(['community', 'alert', 'event', 'help', 'announcement']).withMessage('Type de post invalide'),
  body('isPublic').optional().isBoolean().withMessage('isPublic doit être un booléen')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const postIndex = posts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    const post = posts[postIndex];

    // Vérifier que l'utilisateur est l'auteur ou un modérateur
    if (post.author._id !== req.user.id && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé à modifier ce post' });
    }

    // Mettre à jour les champs
    if (req.body.content !== undefined) post.content = req.body.content;
    if (req.body.media !== undefined) post.media = req.body.media;
    if (req.body.type !== undefined) post.type = req.body.type;
    if (req.body.isPublic !== undefined) post.isPublic = req.body.isPublic;
    if (req.body.location !== undefined) post.location = { ...post.location, ...req.body.location };
    
    post.updatedAt = new Date();

    posts[postIndex] = post;

    res.json({
      success: true,
      message: 'Post mis à jour avec succès',
      data: post
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/posts/:id - Supprimer un post
router.delete('/:id', auth, async (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    const post = posts[postIndex];

    // Vérifier que l'utilisateur est l'auteur ou un modérateur/admin
    if (post.author._id !== req.user.id && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé à supprimer ce post' });
    }

    posts.splice(postIndex, 1);

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/posts/:id/reactions - Ajouter/retirer une réaction
router.post('/:id/reactions', [
  auth,
  body('type').isIn(['like', 'love', 'helpful', 'sad', 'angry']).withMessage('Type de réaction invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const post = posts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    const { type } = req.body;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a déjà réagi
    const hasReacted = post.reactions[type].includes(userId);

    if (hasReacted) {
      // Retirer la réaction
      post.reactions[type] = post.reactions[type].filter(id => id !== userId);
    } else {
      // Retirer des autres types de réactions et ajouter au nouveau type
      Object.keys(post.reactions).forEach(reactionType => {
        post.reactions[reactionType] = post.reactions[reactionType].filter(id => id !== userId);
      });
      post.reactions[type].push(userId);
    }

    post.updatedAt = new Date();

    res.json({
      success: true,
      message: hasReacted ? 'Réaction retirée' : 'Réaction ajoutée',
      data: {
        reactions: post.reactions,
        userReaction: hasReacted ? null : type
      }
    });
  } catch (error) {
    console.error('Erreur lors de la gestion de la réaction:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/posts/:id/comments - Ajouter un commentaire
router.post('/:id/comments', [
  auth,
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Le commentaire doit contenir entre 1 et 500 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const post = posts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    const newComment = {
      _id: Date.now().toString(),
      author: {
        _id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      },
      content: req.body.content,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    post.updatedAt = new Date();

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      data: newComment
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/posts/:postId/comments/:commentId - Supprimer un commentaire
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = posts.find(p => p._id === req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    const commentIndex = post.comments.findIndex(c => c._id === req.params.commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
    }

    const comment = post.comments[commentIndex];

    // Vérifier que l'utilisateur est l'auteur du commentaire ou un modérateur
    if (comment.author._id !== req.user.id && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé à supprimer ce commentaire' });
    }

    post.comments.splice(commentIndex, 1);
    post.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/posts/:id/share - Partager un post
router.post('/:id/share', auth, async (req, res) => {
  try {
    const post = posts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post non trouvé' });
    }

    post.shares += 1;
    post.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Post partagé avec succès',
      data: { shares: post.shares }
    });
  } catch (error) {
    console.error('Erreur lors du partage du post:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/posts/user/:userId - Posts d'un utilisateur spécifique
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    const userPosts = posts.filter(post => post.author._id === userId);
    
    // Tri par date de création (plus récent en premier)
    userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = userPosts.slice(startIndex, endIndex);

    const totalPosts = userPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalPosts,
          hasNextPage: endIndex < totalPosts,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts utilisateur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router; 