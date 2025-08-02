const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedContent: {
    type: {
      type: String,
      enum: ['post', 'comment', 'event', 'livestream', 'user'],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    contentType: {
      type: String,
      enum: ['Post', 'Comment', 'Event', 'LiveStream', 'User'],
      required: true
    }
  },
  reason: {
    type: String,
    enum: [
      'spam',
      'inappropriate_content',
      'harassment',
      'fake_news',
      'violence',
      'hate_speech',
      'copyright_violation',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  evidence: [{
    type: String, // URLs d'images ou liens
    maxlength: 500
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedModerator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationActions: [{
    action: {
      type: String,
      enum: ['warning', 'content_removal', 'temporary_ban', 'permanent_ban', 'feature_removal']
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    duration: Number, // en jours pour les suspensions temporaires
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    type: String,
    enum: ['content_removed', 'user_warned', 'user_suspended', 'user_banned', 'no_action', 'false_report'],
    default: null
  },
  resolutionNotes: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ 'reportedContent.contentId': 1, 'reportedContent.type': 1 });
reportSchema.index({ reporter: 1, createdAt: -1 });

// Méthodes statiques
reportSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('reporter', 'username email');
};

reportSchema.statics.findByPriority = function(priority) {
  return this.find({ priority }).populate('reporter', 'username email');
};

reportSchema.statics.findByContentType = function(contentType) {
  return this.find({ 'reportedContent.type': contentType }).populate('reporter', 'username email');
};

// Méthodes d'instance
reportSchema.methods.assignModerator = function(moderatorId) {
  this.assignedModerator = moderatorId;
  this.status = 'under_review';
  return this.save();
};

reportSchema.methods.addModerationAction = function(action, moderatorId, reason, duration = null) {
  this.moderationActions.push({
    action,
    moderator: moderatorId,
    reason,
    duration
  });
  return this.save();
};

reportSchema.methods.resolve = function(resolution, moderatorId, notes = '') {
  this.status = 'resolved';
  this.resolution = resolution;
  this.resolutionNotes = notes;
  this.resolvedAt = new Date();
  this.resolvedBy = moderatorId;
  return this.save();
};

module.exports = mongoose.model('Report', reportSchema); 