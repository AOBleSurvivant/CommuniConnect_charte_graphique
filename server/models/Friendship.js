const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Méthodes statiques
friendshipSchema.statics.findFriendship = function(user1Id, user2Id) {
  return this.findOne({
    $or: [
      { requester: user1Id, recipient: user2Id },
      { requester: user2Id, recipient: user1Id }
    ]
  });
};

friendshipSchema.statics.findFriends = function(userId) {
  return this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester', 'firstName lastName avatar quartier commune')
    .populate('recipient', 'firstName lastName avatar quartier commune');
};

friendshipSchema.statics.findPendingRequests = function(userId) {
  return this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'firstName lastName avatar quartier commune');
};

friendshipSchema.statics.findSentRequests = function(userId) {
  return this.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'firstName lastName avatar quartier commune');
};

// Méthodes d'instance
friendshipSchema.methods.accept = function() {
  this.status = 'accepted';
  this.updatedAt = new Date();
  return this.save();
};

friendshipSchema.methods.reject = function() {
  this.status = 'rejected';
  this.updatedAt = new Date();
  return this.save();
};

friendshipSchema.methods.block = function() {
  this.status = 'blocked';
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Friendship', friendshipSchema); 