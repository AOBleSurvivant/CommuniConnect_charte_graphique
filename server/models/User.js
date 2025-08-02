const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Informations de base
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom de famille est requis'],
    trim: true,
    maxlength: [50, 'Le nom de famille ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    unique: true,
    trim: true,
    match: [/^(\+224|224)?[0-9]{8,9}$/, 'Veuillez entrer un numéro de téléphone guinéen valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },

  // Informations de localisation
  region: {
    type: String,
    required: [true, 'La région est requise'],
    enum: ['Conakry', 'Boké', 'Kindia', 'Mamou', 'Labé', 'Faranah', 'Kankan', 'N\'Zérékoré']
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
    required: [true, 'Le quartier est requis'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
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

  // Informations du profil
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères'],
    default: ''
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La date de naissance est requise']
  },
  gender: {
    type: String,
    enum: ['Homme', 'Femme', 'Autre'],
    required: [true, 'Le genre est requis']
  },

  // Rôles et permissions
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Informations de sécurité
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Préférences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      locationVisible: { type: Boolean, default: true },
      contactVisible: { type: Boolean, default: false }
    },
    language: {
      type: String,
      enum: ['fr', 'en', 'susu', 'malinke', 'peul'],
      default: 'fr'
    }
  },

  // Statistiques
  stats: {
    postsCount: { type: Number, default: 0 },
    alertsCount: { type: Number, default: 0 },
    helpRequestsCount: { type: Number, default: 0 },
    eventsCount: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 }
  },

  // Informations de connexion
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },

  // Token Firebase Cloud Messaging
  fcmToken: {
    type: String
  },

  // Dernière mise à jour du token FCM
  lastTokenUpdate: {
    type: Date
  },

  // Paramètres de notification
  notificationSettings: {
    messages: {
      type: Boolean,
      default: true
    },
    alerts: {
      type: Boolean,
      default: true
    },
    events: {
      type: Boolean,
      default: true
    },
    helpRequests: {
      type: Boolean,
      default: true
    }
  },

  // Informations pour l'aide aux voisins
  canHelpOthers: {
    type: Boolean,
    default: true
  },
  helpCategories: [{
    type: String,
    enum: ['alimentaire', 'soins', 'securite', 'logement', 'transport', 'education', 'technique', 'autre']
  }],

  // Système de modération
  warnings: [{
    reason: {
      type: String,
      required: true
    },
    details: [{
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    automated: {
      type: Boolean,
      default: false
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  moderationStatus: {
    type: String,
    enum: ['active', 'warned', 'suspended', 'banned'],
    default: 'active'
  },
  suspensionEndDate: {
    type: Date
  },
  moderationNotes: [{
    note: String,
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Compte créé pour un voisin
  createdForNeighbor: {
    type: Boolean,
    default: false
  },
  neighborInfo: {
    name: String,
    relationship: String,
    reason: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ region: 1, prefecture: 1, commune: 1 });
userSchema.index({ coordinates: '2dsphere' });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour l'âge
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token de réinitialisation
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Méthode pour vérifier si l'utilisateur peut modérer
userSchema.methods.canModerate = function() {
  return this.role === 'moderator' || this.role === 'admin';
};

// Méthode pour vérifier si l'utilisateur est admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Méthode pour obtenir les informations publiques
userSchema.methods.getPublicProfile = function() {
  const publicProfile = {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    profilePicture: this.profilePicture,
    bio: this.bio,
    region: this.region,
    prefecture: this.prefecture,
    commune: this.commune,
    quartier: this.quartier,
    role: this.role,
    isVerified: this.isVerified,
    stats: this.stats,
    canHelpOthers: this.canHelpOthers,
    helpCategories: this.helpCategories,
    createdAt: this.createdAt
  };

  // Ajouter l'âge si la date de naissance est disponible
  if (this.dateOfBirth) {
    publicProfile.age = this.age;
  }

  return publicProfile;
};

module.exports = mongoose.model('User', userSchema); 