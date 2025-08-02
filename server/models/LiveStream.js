const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  // Auteur de la diffusion (membre de la communauté)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Type de diffusion communautaire
  type: {
    type: String,
    enum: ['alert', 'event', 'meeting', 'sensitization', 'community'],
    required: true
  },

  // Titre simple et descriptif
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    maxlength: [80, 'Le titre ne peut pas dépasser 80 caractères'],
    trim: true
  },

  // Description courte
  description: {
    type: String,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères'],
    trim: true
  },

  // Statut de la diffusion
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled'
  },

  // Planification (optionnelle pour les alertes urgentes)
  scheduledAt: {
    type: Date
  },

  // Horodatage de début/fin
  startedAt: Date,
  endedAt: Date,

  // Géolocalisation RESTREINTE (quartier, commune)
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
    }
  },

  // Visibilité géographique (QUARTIER uniquement par défaut)
  visibility: {
    type: String,
    enum: ['quartier', 'commune', 'prefecture'],
    default: 'quartier'
  },

  // Urgence pour les alertes
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Spectateurs actuels (membres de la communauté)
  viewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Chat simple en temps réel
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [150, 'Le message ne peut pas dépasser 150 caractères'],
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Réactions simples (👍, ❤️, ⚠️)
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'love', 'alert'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Statistiques simples
  stats: {
    currentViewers: {
      type: Number,
      default: 0
    },
    totalViewers: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    }
  },

  // Configuration simple
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowReactions: {
      type: Boolean,
      default: true
    }
  },

  // Modération communautaire
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
        enum: ['inappropriate', 'spam', 'false_alert', 'other'],
        required: true
      },
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
liveStreamSchema.index({ author: 1, createdAt: -1 });
liveStreamSchema.index({ type: 1, status: 1 });
liveStreamSchema.index({ 'location.quartier': 1, 'location.commune': 1 });
liveStreamSchema.index({ visibility: 1, status: 1 });
liveStreamSchema.index({ urgency: 1, type: 1 });

// Virtual pour la durée de diffusion
liveStreamSchema.virtual('duration').get(function() {
  if (!this.startedAt) return 0;
  const endTime = this.endedAt || new Date();
  return Math.floor((endTime - this.startedAt) / 1000);
});

// Virtual pour vérifier si c'est une alerte urgente
liveStreamSchema.virtual('isUrgentAlert').get(function() {
  return this.type === 'alert' && this.urgency === 'critical';
});

// Méthode pour démarrer la diffusion
liveStreamSchema.methods.startStream = function() {
  this.status = 'live';
  this.startedAt = new Date();
  return this.save();
};

// Méthode pour arrêter la diffusion
liveStreamSchema.methods.endStream = function() {
  this.status = 'ended';
  this.endedAt = new Date();
  return this.save();
};

// Méthode pour ajouter un spectateur
liveStreamSchema.methods.addViewer = function(userId) {
  const existingViewer = this.viewers.find(v => v.user.toString() === userId.toString());
  
  if (!existingViewer) {
    this.viewers.push({
      user: userId,
      joinedAt: new Date()
    });
    this.stats.currentViewers = this.viewers.length;
    this.stats.totalViewers += 1;
  }
  
  return this.save();
};

// Méthode pour retirer un spectateur
liveStreamSchema.methods.removeViewer = function(userId) {
  const viewerIndex = this.viewers.findIndex(v => v.user.toString() === userId.toString());
  
  if (viewerIndex !== -1) {
    this.viewers.splice(viewerIndex, 1);
    this.stats.currentViewers = this.viewers.length;
  }
  
  return this.save();
};

// Méthode pour ajouter un message
liveStreamSchema.methods.addMessage = function(userId, message) {
  this.messages.push({
    user: userId,
    message: message,
    timestamp: new Date()
  });
  
  // Limiter à 100 messages (garder les plus récents)
  if (this.messages.length > 100) {
    this.messages = this.messages.slice(-100);
  }
  
  this.stats.totalMessages = this.messages.length;
  return this.save();
};

// Méthode pour ajouter une réaction
liveStreamSchema.methods.addReaction = function(userId, reactionType) {
  // Retirer l'ancienne réaction si elle existe
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  
  // Ajouter la nouvelle réaction
  this.reactions.push({
    user: userId,
    type: reactionType,
    timestamp: new Date()
  });
  
  return this.save();
};

// Méthode pour signaler
liveStreamSchema.methods.report = function(userId, reason) {
  this.moderation.isReported = true;
  this.moderation.reports.push({
    user: userId,
    reason: reason,
    reportedAt: new Date()
  });
  
  return this.save();
};

// Méthodes statiques
liveStreamSchema.statics.getLiveStreams = function(filters = {}) {
  const query = {
    status: 'live',
    'moderation.isReported': false,
    ...filters
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName profilePicture isVerified')
    .populate('viewers.user', 'firstName lastName profilePicture')
    .populate('messages.user', 'firstName lastName profilePicture')
    .sort({ startedAt: -1 });
};

liveStreamSchema.statics.getAlerts = function(filters = {}) {
  const query = {
    type: 'alert',
    status: 'live',
    'moderation.isReported': false,
    ...filters
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName profilePicture isVerified')
    .sort({ urgency: -1, startedAt: -1 });
};

liveStreamSchema.statics.getCommunityStreams = function(quartier, commune) {
  const query = {
    status: 'live',
    'moderation.isReported': false,
    $or: [
      { 'location.quartier': quartier },
      { 'location.commune': commune }
    ]
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName profilePicture isVerified')
    .populate('viewers.user', 'firstName lastName profilePicture')
    .sort({ urgency: -1, startedAt: -1 });
};

module.exports = mongoose.model('LiveStream', liveStreamSchema); 