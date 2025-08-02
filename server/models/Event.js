const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Informations de base
  title: {
    type: String,
    required: [true, 'Le titre de l\'événement est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  
  description: {
    type: String,
    required: [true, 'La description de l\'événement est requise'],
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },

  // Type et catégorie d'événement
  type: {
    type: String,
    required: [true, 'Le type d\'événement est requis'],
    enum: {
      values: ['reunion', 'formation', 'nettoyage', 'festival', 'sport', 'culture', 'sante', 'education', 'autre'],
      message: 'Type d\'événement invalide'
    }
  },

  category: {
    type: String,
    required: [true, 'La catégorie d\'événement est requise'],
    enum: {
      values: ['communautaire', 'professionnel', 'educatif', 'culturel', 'sportif', 'sante', 'environnement', 'social', 'autre'],
      message: 'Catégorie d\'événement invalide'
    }
  },

  // Dates et horaires
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },

  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },

  startTime: {
    type: String,
    required: [true, 'L\'heure de début est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },

  endTime: {
    type: String,
    required: [true, 'L\'heure de fin est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },

  // Localisation
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
    venue: {
      type: String,
      required: [true, 'Le lieu de l\'événement est requis']
    }
  },

  // Organisateur
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'organisateur de l\'événement est requis']
  },

  // Co-organisateurs
  coOrganizers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['coordinateur', 'animateur', 'logistique', 'communication', 'autre'],
      default: 'coordinateur'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Capacité et participation
  capacity: {
    type: Number,
    min: [1, 'La capacité doit être d\'au moins 1 personne'],
    max: [10000, 'La capacité ne peut pas dépasser 10000 personnes']
  },

  isFree: {
    type: Boolean,
    default: true
  },

  price: {
    amount: {
      type: Number,
      min: [0, 'Le prix ne peut pas être négatif'],
      default: 0
    },
    currency: {
      type: String,
      enum: ['GNF', 'USD', 'EUR'],
      default: 'GNF'
    },
    description: String
  },

  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'declined', 'maybe'],
      default: 'pending'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],

  // Médias et documents
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
    }],
    documents: [{
      url: String,
      name: String,
      type: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Statut de l'événement
  status: {
    type: String,
    required: true,
    enum: {
      values: ['draft', 'published', 'cancelled', 'completed', 'postponed'],
      message: 'Statut invalide'
    },
    default: 'draft'
  },

  // Visibilité
  visibility: {
    type: String,
    enum: ['public', 'quartier', 'commune', 'prefecture', 'region', 'private'],
    default: 'public'
  },

  // Tags et mots-clés
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],

  // Informations supplémentaires
  requirements: {
    ageMin: {
      type: Number,
      min: [0, 'L\'âge minimum ne peut pas être négatif']
    },
    ageMax: {
      type: Number,
      min: [0, 'L\'âge maximum ne peut pas être négatif']
    },
    gender: {
      type: String,
      enum: ['all', 'male', 'female', 'other']
    },
    specialRequirements: [String]
  },

  // Contact et informations pratiques
  contact: {
    phone: String,
    email: String,
    whatsapp: String,
    website: String
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
        enum: ['inappropriate', 'spam', 'false_information', 'duplicate', 'other']
      },
      description: String,
      reportedAt: {
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

  // Statistiques
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    notificationsSent: {
      type: Number,
      default: 0
    },
    participantsCount: {
      type: Number,
      default: 0
    }
  },

  // Métadonnées
  metadata: {
    language: {
      type: String,
      default: 'fr'
    },
    timezone: {
      type: String,
      default: 'Africa/Conakry'
    },
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false
      },
      pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      },
      endDate: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ type: 1, category: 1 });

// Virtuals
eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

eventSchema.virtual('isPast').get(function() {
  return this.endDate < new Date();
});

eventSchema.virtual('participantsCount').get(function() {
  return this.participants.filter(p => p.status === 'confirmed').length;
});

eventSchema.virtual('availableSpots').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.participantsCount);
});

eventSchema.virtual('isFull').get(function() {
  if (!this.capacity) return false;
  return this.participantsCount >= this.capacity;
});

// Méthodes d'instance
eventSchema.methods.addParticipant = function(userId, status = 'pending') {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (existingParticipant) {
    existingParticipant.status = status;
  } else {
    this.participants.push({
      user: userId,
      status: status
    });
  }
  
  return this.save();
};

eventSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => p.user.toString() !== userId.toString());
  return this.save();
};

eventSchema.methods.updateParticipantStatus = function(userId, status) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.status = status;
  }
  return this.save();
};

eventSchema.methods.addCoOrganizer = function(userId, role = 'coordinateur') {
  const existingCoOrganizer = this.coOrganizers.find(co => co.user.toString() === userId.toString());
  
  if (!existingCoOrganizer) {
    this.coOrganizers.push({
      user: userId,
      role: role
    });
  }
  
  return this.save();
};

eventSchema.methods.removeCoOrganizer = function(userId) {
  this.coOrganizers = this.coOrganizers.filter(co => co.user.toString() !== userId.toString());
  return this.save();
};

eventSchema.methods.report = function(userId, reason, description) {
  this.moderation.isReported = true;
  this.moderation.reports.push({
    user: userId,
    reason: reason,
    description: description
  });
  
  return this.save();
};

eventSchema.methods.hide = function(moderatorId, reason) {
  this.moderation.isHidden = true;
  this.moderation.hiddenBy = moderatorId;
  this.moderation.hiddenAt = new Date();
  this.moderation.hiddenReason = reason;
  
  return this.save();
};

// Méthodes statiques
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    startDate: { $gt: new Date() },
    status: 'published',
    'moderation.isHidden': false
  })
  .populate('organizer', 'firstName lastName profilePicture')
  .populate('coOrganizers.user', 'firstName lastName profilePicture')
  .sort({ startDate: 1 })
  .limit(limit);
};

eventSchema.statics.findByLocation = function(latitude, longitude, maxDistance = 10) {
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
    status: 'published',
    'moderation.isHidden': false
  })
  .populate('organizer', 'firstName lastName profilePicture')
  .sort({ startDate: 1 });
};

eventSchema.statics.findByType = function(type) {
  return this.find({
    type: type,
    status: 'published',
    'moderation.isHidden': false
  })
  .populate('organizer', 'firstName lastName profilePicture')
  .sort({ startDate: 1 });
};

eventSchema.statics.findByOrganizer = function(organizerId) {
  return this.find({
    $or: [
      { organizer: organizerId },
      { 'coOrganizers.user': organizerId }
    ]
  })
  .populate('organizer', 'firstName lastName profilePicture')
  .populate('coOrganizers.user', 'firstName lastName profilePicture')
  .sort({ startDate: -1 });
};

// Middleware pre-save
eventSchema.pre('save', function(next) {
  // Validation des dates
  if (this.startDate >= this.endDate) {
    return next(new Error('La date de fin doit être postérieure à la date de début'));
  }
  
  // Ajouter des tags automatiques basés sur le type et la catégorie
  if (this.isModified('type') || this.isModified('category')) {
    const autoTags = [this.type, this.category];
    this.tags = [...new Set([...autoTags, ...(this.tags || [])])];
  }
  
  // Mettre à jour les statistiques
  if (this.participants) {
    this.statistics.participantsCount = this.participants.filter(p => p.status === 'confirmed').length;
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema); 