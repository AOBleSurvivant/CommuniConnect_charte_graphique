const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  // ID unique de la conversation
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Nom de la conversation
  name: {
    type: String,
    maxlength: 100
  },
  
  // Type de conversation
  type: {
    type: String,
    enum: ['private', 'group', 'quartier', 'system'],
    default: 'private'
  },
  
  // Participants de la conversation
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'moderator'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Dernier message de la conversation
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  
  // Métadonnées géographiques
  quartier: {
    type: String
  },
  
  ville: {
    type: String
  },
  
  region: {
    type: String
  },
  
  // Image de profil de la conversation (pour les groupes)
  avatar: {
    type: String
  },
  
  // Description de la conversation
  description: {
    type: String,
    maxlength: 500
  },
  
  // Paramètres de la conversation
  settings: {
    allowNewMembers: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    maxParticipants: {
      type: Number,
      default: 100
    }
  },
  
  // Statistiques
  stats: {
    messageCount: {
      type: Number,
      default: 0
    },
    memberCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Conversation archivée
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Conversation supprimée
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
conversationSchema.index({ 'participants.user': 1, updatedAt: -1 });
conversationSchema.index({ type: 1, quartier: 1, ville: 1 });
conversationSchema.index({ isArchived: 1, isDeleted: 1 });

// Méthode pour ajouter un participant
conversationSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      role,
      joinedAt: new Date(),
      lastSeen: new Date(),
      isActive: true
    });
    
    this.stats.memberCount = this.participants.length;
  }
  
  return this.save();
};

// Méthode pour retirer un participant
conversationSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(
    p => p.user.toString() !== userId.toString()
  );
  
  this.stats.memberCount = this.participants.length;
  return this.save();
};

// Méthode pour mettre à jour le dernier message
conversationSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt
  };
  
  this.stats.messageCount += 1;
  return this.save();
};

// Méthode pour marquer comme vu par un utilisateur
conversationSchema.methods.markAsSeen = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastSeen = new Date();
  }
  
  return this.save();
};

// Méthode statique pour créer une conversation privée
conversationSchema.statics.createPrivateConversation = function(user1Id, user2Id) {
  const sortedIds = [user1Id, user2Id].sort();
  const conversationId = `private_${sortedIds.join('_')}`;
  
  return this.findOneAndUpdate(
    { conversationId },
    {
      conversationId,
      type: 'private',
      participants: [
        { user: user1Id, role: 'member' },
        { user: user2Id, role: 'member' }
      ],
      stats: {
        memberCount: 2,
        messageCount: 0
      }
    },
    { upsert: true, new: true }
  );
};

// Méthode statique pour créer une conversation de groupe
conversationSchema.statics.createGroupConversation = function(name, creatorId, participants = []) {
  const conversationId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const allParticipants = [
    { user: creatorId, role: 'admin' },
    ...participants.map(p => ({ user: p, role: 'member' }))
  ];
  
  return this.create({
    conversationId,
    name,
    type: 'group',
    participants: allParticipants,
    stats: {
      memberCount: allParticipants.length,
      messageCount: 0
    }
  });
};

module.exports = mongoose.model('Conversation', conversationSchema); 