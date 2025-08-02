const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  // Informations de base
  title: {
    type: String,
    required: [true, 'Le titre de l\'alerte est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  
  description: {
    type: String,
    required: [true, 'La description de l\'alerte est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },

  // Type et catégorie
  type: {
    type: String,
    required: [true, 'Le type d\'alerte est requis'],
    enum: {
      values: ['accident', 'securite', 'sante', 'meteo', 'infrastructure', 'autre'],
      message: 'Type d\'alerte invalide'
    }
  },

  category: {
    type: String,
    required: [true, 'La catégorie d\'alerte est requise'],
    enum: {
      values: ['circulation', 'incendie', 'inondation', 'coupure_eau', 'coupure_electricite', 'agression', 'accident_medical', 'intemperie', 'manifestation', 'autre'],
      message: 'Catégorie d\'alerte invalide'
    }
  },

  // Niveau de priorité
  priority: {
    type: String,
    required: [true, 'La priorité de l\'alerte est requise'],
    enum: {
      values: ['urgent', 'important', 'information'],
      message: 'Priorité invalide'
    },
    default: 'important'
  },

  // Statut de l'alerte
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'resolue', 'annulee', 'en_cours'],
      message: 'Statut invalide'
    },
    default: 'active'
  },

  // Géolocalisation
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'La latitude est requise']
      },
      longitude: {
        type: Number,
        required: [true, 'La longitude est requise']
      }
    },
    // Hiérarchie géographique guinéenne
    region: {
      type: String,
      required: [true, 'La région est requise']
    },
    prefecture: {
      type: String,
      required: [true, 'La préfecture est requise']
    },
    commune: {
      type: String,
      required: [true, 'La commune est requise']
    },
    quartier: {
      type: String,
      required: [true, 'Le quartier est requis']
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    // Rayon d'impact en km
    impactRadius: {
      type: Number,
      default: 5,
      min: [0.1, 'Le rayon d\'impact doit être au moins de 0.1 km'],
      max: [50, 'Le rayon d\'impact ne peut pas dépasser 50 km']
    }
  },

  // Auteur de l'alerte
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur de l\'alerte est requis']
  },

  // Informations de contact d'urgence
  emergencyContacts: {
    police: {
      type: String,
      default: '117'
    },
    pompiers: {
      type: String,
      default: '18'
    },
    samu: {
      type: String,
      default: '442'
    },
    contactLocal: {
      type: String,
      trim: true
    }
  },

  // Médias et preuves
  media: {
    images: [{
      url: String,
      caption: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    videos: [{
      url: String,
      caption: String,
      duration: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Interactions et engagement
  interactions: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    confirmations: {
      type: Number,
      default: 0
    },
    denials: {
      type: Number,
      default: 0
    }
  },

  // Utilisateurs qui ont interagi
  userInteractions: {
    viewed: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    shared: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }],
    confirmed: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      confirmedAt: {
        type: Date,
        default: Date.now
      }
    }],
    denied: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      deniedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Commentaires et mises à jour
  updates: [{
    content: {
      type: String,
      required: true,
      maxlength: [500, 'La mise à jour ne peut pas dépasser 500 caractères']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isOfficial: {
      type: Boolean,
      default: false
    }
  }],

  // Modération et signalements
  moderation: {
    isModerated: {
      type: Boolean,
      default: false
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationReason: String,
    reports: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['fausse_alerte', 'contenu_inapproprié', 'localisation_incorrecte', 'autre']
      },
      description: String,
      reportedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['en_attente', 'traité', 'rejeté'],
        default: 'en_attente'
      }
    }]
  },

  // Métadonnées
  tags: [{
    type: String,
    trim: true
  }],

  // Dates importantes
  expiresAt: {
    type: Date,
    default: function() {
      // Par défaut, expire dans 24h pour les alertes urgentes, 7 jours pour les autres
      const hours = this.priority === 'urgent' ? 24 : 168;
      return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
  },

  resolvedAt: Date,
  cancelledAt: Date,

  // Statistiques de diffusion
  statistics: {
    notificationsSent: {
      type: Number,
      default: 0
    },
    usersNotified: {
      type: Number,
      default: 0
    },
    responseTime: Number, // Temps de réponse moyen en minutes
    resolutionTime: Number // Temps de résolution en minutes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
alertSchema.index({ 'location.coordinates': '2dsphere' });
alertSchema.index({ status: 1, priority: 1, createdAt: -1 });
alertSchema.index({ author: 1, createdAt: -1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthodes virtuelles
alertSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

alertSchema.virtual('isActive').get(function() {
  return this.status === 'active' && !this.isExpired;
});

alertSchema.virtual('urgencyScore').get(function() {
  let score = 0;
  
  // Score basé sur la priorité
  switch (this.priority) {
    case 'urgent': score += 100; break;
    case 'important': score += 50; break;
    case 'information': score += 10; break;
  }
  
  // Score basé sur les interactions
  score += this.interactions.confirmations * 5;
  score += this.interactions.views * 0.1;
  score -= this.interactions.denials * 10;
  
  // Score basé sur l'âge (plus récent = plus urgent)
  const ageInHours = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  score += Math.max(0, 24 - ageInHours);
  
  return Math.round(score);
});

// Méthodes d'instance
alertSchema.methods.addView = function(userId) {
  if (!this.userInteractions.viewed.some(view => view.user.toString() === userId.toString())) {
    this.userInteractions.viewed.push({ user: userId });
    this.interactions.views += 1;
  }
  return this.save();
};

alertSchema.methods.addConfirmation = function(userId) {
  if (!this.userInteractions.confirmed.some(conf => conf.user.toString() === userId.toString())) {
    this.userInteractions.confirmed.push({ user: userId });
    this.interactions.confirmations += 1;
  }
  return this.save();
};

alertSchema.methods.addDenial = function(userId) {
  if (!this.userInteractions.denied.some(den => den.user.toString() === userId.toString())) {
    this.userInteractions.denied.push({ user: userId });
    this.interactions.denials += 1;
  }
  return this.save();
};

alertSchema.methods.addUpdate = function(content, authorId, isOfficial = false) {
  this.updates.push({
    content,
    author: authorId,
    isOfficial
  });
  return this.save();
};

alertSchema.methods.resolve = function() {
  this.status = 'resolue';
  this.resolvedAt = new Date();
  return this.save();
};

alertSchema.methods.cancel = function() {
  this.status = 'annulee';
  this.cancelledAt = new Date();
  return this.save();
};

// Méthodes statiques
alertSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convertir en mètres
      }
    },
    status: 'active'
  }).populate('author', 'firstName lastName');
};

alertSchema.statics.findByPriority = function(priority) {
  return this.find({ priority, status: 'active' })
    .populate('author', 'firstName lastName')
    .sort({ createdAt: -1 });
};

alertSchema.statics.getActiveAlerts = function() {
  return this.find({ 
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
  .populate('author', 'firstName lastName')
  .sort({ priority: -1, createdAt: -1 });
};

// Middleware pre-save
alertSchema.pre('save', function(next) {
  // Mettre à jour expiresAt si la priorité change
  if (this.isModified('priority')) {
    const hours = this.priority === 'urgent' ? 24 : 168;
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  
  // Ajouter des tags automatiques basés sur le type et la catégorie
  if (this.isModified('type') || this.isModified('category')) {
    this.tags = [this.type, this.category, this.priority];
  }
  
  next();
});

module.exports = mongoose.model('Alert', alertSchema); 