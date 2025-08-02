const ModerationLog = require('../models/ModerationLog');
const Report = require('../models/Report');
const User = require('../models/User');
const Post = require('../models/Post');

class AdvancedModerationService {
  constructor() {
    this.thresholds = {
      warning: 0.3,
      review: 0.6,
      removal: 0.8,
      ban: 0.9
    };
    
    this.contentFilters = {
      spam: [
        /\b(?:buy|sell|earn|money|profit|investment|opportunity)\b/gi,
        /\b(?:click|visit|subscribe|join|register)\b/gi,
        /\b(?:limited|offer|discount|free|guaranteed)\b/gi
      ],
      hate: [
        /\b(?:hate|kill|destroy|attack|violence)\b/gi,
        /\b(?:racist|discrimination|prejudice)\b/gi
      ],
      inappropriate: [
        /\b(?:porn|sex|adult|explicit)\b/gi,
        /\b(?:drugs|alcohol|illegal)\b/gi
      ]
    };
  }

  // Analyse automatique du contenu
  async analyzeContent(content, contentType = 'post') {
    const analysis = {
      score: 0,
      flags: [],
      confidence: 0.8,
      risk: 'low',
      recommendations: []
    };

    if (!content || typeof content !== 'string') {
      return analysis;
    }

    const text = content.toLowerCase();
    let totalFlags = 0;

    // Vérification des filtres
    Object.entries(this.contentFilters).forEach(([category, patterns]) => {
      const matches = patterns.filter(pattern => pattern.test(text));
      if (matches.length > 0) {
        analysis.flags.push({
          category,
          count: matches.length,
          severity: category === 'hate' ? 'high' : 'medium'
        });
        totalFlags += matches.length;
      }
    });

    // Calcul du score de risque
    analysis.score = Math.min(totalFlags * 0.2, 1.0);
    
    if (analysis.score >= this.thresholds.ban) {
      analysis.risk = 'critical';
      analysis.recommendations.push('immediate_removal', 'user_ban');
    } else if (analysis.score >= this.thresholds.removal) {
      analysis.risk = 'high';
      analysis.recommendations.push('content_removal', 'user_warning');
    } else if (analysis.score >= this.thresholds.review) {
      analysis.risk = 'medium';
      analysis.recommendations.push('manual_review');
    } else if (analysis.score >= this.thresholds.warning) {
      analysis.risk = 'low';
      analysis.recommendations.push('user_notification');
    }

    return analysis;
  }

  // Traitement automatique des signalements
  async processReport(reportId) {
    try {
      // En mode développement, simulation du traitement
      const mockReport = {
        _id: reportId,
        status: 'under_review',
        priority: 'medium',
        processedAt: new Date()
      };

      // Log de modération
      await this.createModerationLog({
        action: 'report_processing',
        target: {
          type: 'report',
          id: reportId,
          contentType: 'Report'
        },
        details: {
          reason: 'Traitement automatique du signalement',
          automated: true
        }
      });

      return {
        success: true,
        report: mockReport,
        actions: ['flagged_for_review']
      };
    } catch (error) {
      console.error('Erreur lors du traitement du signalement:', error);
      return { success: false, error: error.message };
    }
  }

  // Création de log de modération
  async createModerationLog(logData) {
    try {
      const log = new ModerationLog({
        moderator: logData.moderator || 'system',
        action: logData.action,
        target: logData.target,
        details: logData.details,
        impact: logData.impact || {
          affectedUsers: [],
          contentRemoved: 0,
          usersNotified: 0
        }
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Erreur lors de la création du log de modération:', error);
      throw error;
    }
  }

  // Actions de modération
  async moderateContent(contentId, contentType, action, moderatorId, reason) {
    try {
      const moderationActions = {
        warn: async () => {
          // Envoi d'un avertissement à l'utilisateur
          console.log(`Avertissement envoyé pour le contenu ${contentId}`);
        },
        remove: async () => {
          // Suppression du contenu
          console.log(`Contenu ${contentId} supprimé`);
        },
        suspend: async (duration = 7) => {
          // Suspension temporaire de l'utilisateur
          console.log(`Utilisateur suspendu pour ${duration} jours`);
        },
        ban: async () => {
          // Bannissement permanent
          console.log(`Utilisateur banni définitivement`);
        }
      };

      if (moderationActions[action]) {
        await moderationActions[action]();
      }

      // Log de l'action
      await this.createModerationLog({
        moderator: moderatorId,
        action: `content_${action}`,
        target: {
          type: contentType,
          id: contentId,
          contentType: this.getContentTypeName(contentType)
        },
        details: {
          reason,
          automated: false
        }
      });

      return { success: true, action };
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistiques de modération
  async getModerationStats() {
    try {
      const stats = {
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        automatedActions: 0,
        manualActions: 0,
        averageResolutionTime: 0
      };

      // En mode développement, données simulées
      stats.totalReports = 25;
      stats.pendingReports = 8;
      stats.resolvedReports = 17;
      stats.automatedActions = 12;
      stats.manualActions = 5;
      stats.averageResolutionTime = 2.5; // heures

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  // Utilitaires
  getContentTypeName(type) {
    const typeMap = {
      'post': 'Post',
      'comment': 'Comment',
      'event': 'Event',
      'user': 'User',
      'report': 'Report'
    };
    return typeMap[type] || 'Unknown';
  }
}

module.exports = new AdvancedModerationService(); 