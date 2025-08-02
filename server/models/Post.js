const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Auteur de la publication
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Contenu de la publication
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    maxlength: [2000, 'Le contenu ne peut pas dépasser 2000 caractères'],
    trim: true
  },

  // Type de publication
  type: {
    type: String,
    enum: ['general', 'entraide', 'vente', 'alerte', 'besoin', 'evenement', 'information', 'repost'],
    default: 'general'
  },

  // Champs pour les reposts
  isRepost: {
    type: Boolean,
    default: false
  },
  
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: function() {
      return this.isRepost === true;
    }
  },
  
  repostContent: {
    type: String,
    maxlength: [500, 'Le contenu du repost ne peut pas dépasser 500 caractères'],
    trim: true
  },

  // Icône contextuelle
  icon: {
    type: String,
    enum: ['🤝', '💰', '🚨', '❓', '📅', 'ℹ️', '🏠', '🚗', '🏥', '🍽️', '🎓', '🔧', '📱', '🌱', '🎉', '📢'],
    default: '📢'
  },

  // Images et médias
  media: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    },
    caption: String,
    order: {
      type: Number,
      default: 0
    }
  }],

  // Localisation
  location: {
    region: {
      type: String,
      required: true,
      enum: ['Conakry', 'Boké', 'Kindia', 'Mamou', 'Labé', 'Faranah', 'Kankan', 'N\'Zérékoré']
    },
    prefecture: {
      type: String,
      required: true
    },
    commune: {
      type: String,
      required: true
    },
    quartier: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Visibilité et audience
  visibility: {
    type: String,
    enum: ['public', 'quartier', 'commune', 'prefecture', 'region'],
    default: 'quartier'
  },

  // Tags et catégories
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],

  // Réactions
  reactions: {
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    participates: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    supports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Commentaires
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères'],
      trim: true
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [300, 'La réponse ne peut pas dépasser 300 caractères'],
        trim: true
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Partages
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    platform: {
      type: String,
      enum: ['internal', 'facebook', 'twitter', 'whatsapp'],
      default: 'internal'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Statistiques
  stats: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Modération
  moderation: {
    isReported: {
      type: Boolean,
      default: false
    },
    reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'false_information', 'harassment', 'other'],
        required: true
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    isHidden: {
      type: Boolean,
      default: false
    },
    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hiddenAt: Date,
    hiddenReason: String
  },

  // Métadonnées
  metadata: {
    language: {
      type: String,
      default: 'fr'
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ 'location.region': 1, 'location.prefecture': 1, 'location.commune': 1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'moderation.isHidden': 1 });
postSchema.index({ createdAt: -1 });

// Virtual pour le nombre total de réactions
postSchema.virtual('totalReactions').get(function() {
  return this.reactions.likes.length + this.reactions.participates.length + this.reactions.supports.length;
});

// Virtual pour le nombre de commentaires
postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Virtual pour le nombre de partages
postSchema.virtual('sharesCount').get(function() {
  return this.shares.length;
});

// Méthode pour ajouter une réaction
postSchema.methods.addReaction = function(userId, reactionType) {
  const reactionArray = this.reactions[reactionType];
  const existingReaction = reactionArray.find(r => r.user.toString() === userId.toString());
  
  if (existingReaction) {
    // Retirer la réaction si elle existe déjà
    this.reactions[reactionType] = reactionArray.filter(r => r.user.toString() !== userId.toString());
  } else {
    // Ajouter la réaction
    this.reactions[reactionType].push({
      user: userId,
      createdAt: new Date()
    });
  }
  
  return this.save();
};

// Méthode pour ajouter un commentaire
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    author: userId,
    content: content,
    createdAt: new Date()
  });
  
  return this.save();
};

// Méthode pour signaler une publication
postSchema.methods.report = function(userId, reason, description) {
  this.moderation.isReported = true;
  this.moderation.reports.push({
    user: userId,
    reason: reason,
    description: description,
    createdAt: new Date()
  });
  
  return this.save();
};

// Méthode pour masquer une publication
postSchema.methods.hide = function(moderatorId, reason) {
  this.moderation.isHidden = true;
  this.moderation.hiddenBy = moderatorId;
  this.moderation.hiddenAt = new Date();
  this.moderation.hiddenReason = reason;
  
  return this.save();
};

// Méthode pour obtenir les publications publiques
postSchema.statics.getPublicPosts = function(filters = {}) {
  const query = {
    'moderation.isHidden': false,
    ...filters
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName profilePicture isVerified')
    .populate('comments.author', 'firstName lastName profilePicture')
    .populate('comments.replies.author', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Post', postSchema); 