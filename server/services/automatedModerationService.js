const ModerationLog = require('../models/ModerationLog');
const User = require('../models/User');
const Post = require('../models/Post');
const Report = require('../models/Report');

class AutomatedModerationService {
  constructor() {
    this.bannedWords = [
      // Mots interdits en français
      'merde', 'putain', 'salope', 'connard', 'enculé', 'fils de pute',
      'nique', 'bite', 'couille', 'chatte', 'cul', 'foutre',
      // Mots interdits en anglais
      'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cock',
      // Mots interdits en langues locales (à adapter)
      'walahi', 'wallahi', 'inshallah' // exemples, à adapter selon le contexte
    ];

    this.spamPatterns = [
      /\b(?:gagnez|gagner|argent|rapide|facile|million|dollars|euros)\b/gi,
      /\b(?:cliquez|ici|gratuit|offre|limitée|urgence)\b/gi,
      /\b(?:bitcoin|crypto|investissement|rendement|profit)\b/gi
    ];

    this.hateSpeechPatterns = [
      /\b(?:nazi|hitler|supremaciste|raciste|discrimination)\b/gi,
      /\b(?:mort|tuer|violence|agression|menace)\b/gi
    ];

    this.confidenceThresholds = {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
      critical: 0.9
    };
  }

  // Analyse automatique du contenu texte
  async analyzeTextContent(text, contentType = 'post', userId = null) {
    const analysis = {
      score: 0,
      flags: [],
      confidence: 0,
      actions: [],
      automated: true
    };

    if (!text || typeof text !== 'string') {
      return analysis;
    }

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    // Vérification des mots interdits
    const bannedWordMatches = this.bannedWords.filter(word => 
      lowerText.includes(word.toLowerCase())
    );

    if (bannedWordMatches.length > 0) {
      analysis.score += bannedWordMatches.length * 0.3;
      analysis.flags.push({
        type: 'banned_words',
        count: bannedWordMatches.length,
        words: bannedWordMatches
      });
    }

    // Détection de spam
    const spamMatches = this.spamPatterns.filter(pattern => 
      pattern.test(text)
    );

    if (spamMatches.length > 0) {
      analysis.score += spamMatches.length * 0.4;
      analysis.flags.push({
        type: 'spam_patterns',
        count: spamMatches.length
      });
    }

    // Détection de discours de haine
    const hateMatches = this.hateSpeechPatterns.filter(pattern => 
      pattern.test(text)
    );

    if (hateMatches.length > 0) {
      analysis.score += hateMatches.length * 0.8;
      analysis.flags.push({
        type: 'hate_speech',
        count: hateMatches.length
      });
    }

    // Détection de répétition excessive
    const wordFrequency = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    const repeatedWords = Object.entries(wordFrequency)
      .filter(([word, count]) => count > 3)
      .length;

    if (repeatedWords > 0) {
      analysis.score += repeatedWords * 0.2;
      analysis.flags.push({
        type: 'excessive_repetition',
        count: repeatedWords
      });
    }

    // Détection de majuscules excessives
    const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (upperCaseRatio > 0.7) {
      analysis.score += 0.3;
      analysis.flags.push({
        type: 'excessive_caps',
        ratio: upperCaseRatio
      });
    }

    // Calcul de la confiance
    analysis.confidence = Math.min(analysis.score, 1.0);

    // Détermination des actions automatiques
    if (analysis.confidence >= this.confidenceThresholds.critical) {
      analysis.actions.push('immediate_removal');
      analysis.actions.push('user_warning');
    } else if (analysis.confidence >= this.confidenceThresholds.high) {
      analysis.actions.push('content_review');
      analysis.actions.push('user_warning');
    } else if (analysis.confidence >= this.confidenceThresholds.medium) {
      analysis.actions.push('content_review');
    } else if (analysis.confidence >= this.confidenceThresholds.low) {
      analysis.actions.push('flag_for_review');
    }

    return analysis;
  }

  // Analyse automatique d'image (simulation)
  async analyzeImageContent(imageUrl) {
    // Simulation d'analyse d'image
    // En production, intégrer avec des services comme Google Vision API, AWS Rekognition, etc.
    
    const analysis = {
      score: 0,
      flags: [],
      confidence: 0,
      actions: [],
      automated: true
    };

    // Simulation basée sur l'URL (pour les tests)
    if (imageUrl.includes('inappropriate') || imageUrl.includes('spam')) {
      analysis.score = 0.8;
      analysis.confidence = 0.8;
      analysis.flags.push({
        type: 'inappropriate_image',
        confidence: 0.8
      });
      analysis.actions.push('content_review');
    }

    return analysis;
  }

  // Analyse complète d'un post
  async analyzePost(post) {
    const textAnalysis = await this.analyzeTextContent(post.content, 'post', post.author);
    
    let imageAnalysis = { score: 0, flags: [], confidence: 0, actions: [] };
    if (post.images && post.images.length > 0) {
      imageAnalysis = await this.analyzeImageContent(post.images[0]);
    }

    // Combinaison des analyses
    const combinedScore = (textAnalysis.score + imageAnalysis.score) / 2;
    const combinedConfidence = Math.max(textAnalysis.confidence, imageAnalysis.confidence);
    
    const analysis = {
      score: combinedScore,
      confidence: combinedConfidence,
      flags: [...textAnalysis.flags, ...imageAnalysis.flags],
      actions: [...new Set([...textAnalysis.actions, ...imageAnalysis.actions])],
      automated: true,
      textAnalysis,
      imageAnalysis
    };

    return analysis;
  }

  // Application automatique des actions
  async applyAutomatedActions(contentId, contentType, analysis, moderatorId = null) {
    const actions = [];

    try {
      // Création du log de modération
      const logEntry = new ModerationLog({
        moderator: moderatorId || 'system',
        action: 'automated_action',
        target: {
          type: contentType,
          id: contentId,
          contentType: this.getContentTypeName(contentType)
        },
        details: {
          reason: `Analyse automatique: score ${analysis.score.toFixed(2)}, confiance ${analysis.confidence.toFixed(2)}`,
          automated: true,
          confidence: analysis.confidence * 100,
          evidence: analysis.flags.map(flag => JSON.stringify(flag))
        },
        impact: {
          affectedUsers: [],
          contentRemoved: 0,
          usersNotified: 0
        }
      });

      await logEntry.save();

      // Application des actions selon le score
      if (analysis.actions.includes('immediate_removal')) {
        await this.removeContent(contentId, contentType);
        actions.push('content_removed');
      }

      if (analysis.actions.includes('user_warning')) {
        const userId = await this.getContentAuthor(contentId, contentType);
        if (userId) {
          await this.warnUser(userId, analysis);
          actions.push('user_warned');
        }
      }

      if (analysis.actions.includes('content_review')) {
        await this.flagForReview(contentId, contentType, analysis);
        actions.push('flagged_for_review');
      }

      return {
        success: true,
        actions,
        logId: logEntry._id
      };

    } catch (error) {
      console.error('Erreur lors de l\'application des actions automatiques:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Méthodes utilitaires
  async removeContent(contentId, contentType) {
    try {
      let Model;
      switch (contentType) {
        case 'post':
          Model = Post;
          break;
        // Ajouter d'autres types selon les besoins
        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`);
      }

      const result = await Model.findByIdAndUpdate(contentId, {
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason: 'Automated moderation'
      });

      return result;
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu:', error);
      throw error;
    }
  }

  async warnUser(userId, analysis) {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.warnings = user.warnings || [];
        user.warnings.push({
          reason: 'Contenu inapproprié détecté automatiquement',
          details: analysis.flags,
          timestamp: new Date(),
          automated: true
        });

        await user.save();
      }
    } catch (error) {
      console.error('Erreur lors de l\'avertissement utilisateur:', error);
    }
  }

  async flagForReview(contentId, contentType, analysis) {
    try {
      const report = new Report({
        reporter: 'system',
        reportedContent: {
          type: contentType,
          contentId: contentId,
          contentType: this.getContentTypeName(contentType)
        },
        reason: 'inappropriate_content',
        description: `Contenu signalé automatiquement. Score: ${analysis.score.toFixed(2)}`,
        status: 'pending',
        priority: analysis.confidence > 0.8 ? 'high' : 'medium'
      });

      await report.save();
    } catch (error) {
      console.error('Erreur lors du signalement automatique:', error);
    }
  }

  async getContentAuthor(contentId, contentType) {
    try {
      let Model;
      switch (contentType) {
        case 'post':
          Model = Post;
          break;
        default:
          return null;
      }

      const content = await Model.findById(contentId);
      return content ? content.author : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'auteur:', error);
      return null;
    }
  }

  getContentTypeName(contentType) {
    const typeMap = {
      'post': 'Post',
      'comment': 'Comment',
      'event': 'Event',
      'livestream': 'LiveStream',
      'user': 'User'
    };
    return typeMap[contentType] || 'Unknown';
  }

  // Mise à jour des listes de mots interdits
  updateBannedWords(newWords) {
    this.bannedWords = [...new Set([...this.bannedWords, ...newWords])];
  }

  // Statistiques de modération automatique
  async getAutomationStats(startDate, endDate) {
    try {
      const logs = await ModerationLog.findAutomatedActions(startDate, endDate);
      
      const stats = {
        totalActions: logs.length,
        byAction: {},
        byConfidence: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        },
        averageConfidence: 0
      };

      let totalConfidence = 0;

      logs.forEach(log => {
        // Comptage par action
        stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

        // Comptage par niveau de confiance
        const confidence = log.details.confidence || 0;
        totalConfidence += confidence;

        if (confidence < 30) stats.byConfidence.low++;
        else if (confidence < 60) stats.byConfidence.medium++;
        else if (confidence < 80) stats.byConfidence.high++;
        else stats.byConfidence.critical++;
      });

      stats.averageConfidence = logs.length > 0 ? totalConfidence / logs.length : 0;

      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }
}

module.exports = new AutomatedModerationService(); 