const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Expéditeur du message
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Destinataires (peut être un utilisateur ou plusieurs pour les groupes)
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  // Contenu du message
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Type de message (privé, groupe, système)
  messageType: {
    type: String,
    enum: ['private', 'group', 'system'],
    default: 'private'
  },
  
  // ID de la conversation (pour grouper les messages)
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Nom de la conversation (pour les groupes)
  conversationName: {
    type: String,
    maxlength: 100
  },
  
  // Quartier associé (pour les conversations de quartier)
  quartier: {
    type: String
  },
  
  // Ville associée
  ville: {
    type: String
  },
  
  // Fichiers joints (images, documents)
  attachments: [{
    filename: String,
    url: String,
    type: String, // image, document, audio, video
    size: Number
  }],
  
  // Statut du message
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  
  // Utilisateurs qui ont lu le message
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Message de réponse (pour les réponses)
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Message supprimé (soft delete)
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Utilisateurs qui ont supprimé le message
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipients: 1, createdAt: -1 });

// Méthode pour marquer un message comme lu
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    this.status = 'read';
  }
  
  return this.save();
};

// Méthode pour supprimer un message (soft delete)
messageSchema.methods.softDelete = function(userId) {
  if (!this.deletedBy.includes(userId)) {
    this.deletedBy.push(userId);
  }
  
  // Si tous les participants ont supprimé le message, le marquer comme supprimé
  const allParticipants = [this.sender, ...this.recipients];
  if (this.deletedBy.length === allParticipants.length) {
    this.isDeleted = true;
  }
  
  return this.save();
};

// Méthode statique pour créer une conversation
messageSchema.statics.createConversation = function(participants, name = null, type = 'private') {
  const sortedParticipants = participants.sort();
  const conversationId = `conv_${sortedParticipants.join('_')}_${Date.now()}`;
  
  return {
    conversationId,
    conversationName: name,
    messageType: type,
    participants: sortedParticipants
  };
};

module.exports = mongoose.model('Message', messageSchema); 