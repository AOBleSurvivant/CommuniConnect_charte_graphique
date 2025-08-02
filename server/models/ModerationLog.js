const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'content_review',
      'content_removal',
      'user_warning',
      'user_suspension',
      'user_ban',
      'report_resolution',
      'automated_action',
      'appeal_review',
      'policy_update'
    ],
    required: true
  },
  target: {
    type: {
      type: String,
      enum: ['user', 'post', 'comment', 'event', 'livestream', 'report', 'system'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    contentType: {
      type: String,
      enum: ['User', 'Post', 'Comment', 'Event', 'LiveStream', 'Report', 'System'],
      required: true
    }
  },
  details: {
    reason: {
      type: String,
      required: true
    },
    duration: Number, // en jours pour les suspensions
    previousStatus: String,
    newStatus: String,
    automated: {
      type: Boolean,
      default: false
    },
    confidence: Number, // pour les actions automatisées (0-100)
    evidence: [{
      type: String,
      maxlength: 500
    }]
  },
  impact: {
    affectedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    contentRemoved: Number,
    usersNotified: Number
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    sessionId: String
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
moderationLogSchema.index({ moderator: 1, createdAt: -1 });
moderationLogSchema.index({ 'target.id': 1, 'target.type': 1 });
moderationLogSchema.index({ action: 1, createdAt: -1 });
moderationLogSchema.index({ 'details.automated': 1, createdAt: -1 });

// Méthodes statiques
moderationLogSchema.statics.findByModerator = function(moderatorId, limit = 50) {
  return this.find({ moderator: moderatorId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('moderator', 'username email');
};

moderationLogSchema.statics.findByTarget = function(targetId, targetType) {
  return this.find({
    'target.id': targetId,
    'target.type': targetType
  }).populate('moderator', 'username email');
};

moderationLogSchema.statics.findAutomatedActions = function(startDate, endDate) {
  const query = { 'details.automated': true };
  if (startDate && endDate) {
    query.createdAt = {
      $gte: startDate,
      $lte: endDate
    };
  }
  return this.find(query).populate('moderator', 'username email');
};

// Méthodes d'instance
moderationLogSchema.methods.addEvidence = function(evidenceUrl) {
  this.details.evidence.push(evidenceUrl);
  return this.save();
};

moderationLogSchema.methods.updateImpact = function(impactData) {
  this.impact = { ...this.impact, ...impactData };
  return this.save();
};

module.exports = mongoose.model('ModerationLog', moderationLogSchema); 