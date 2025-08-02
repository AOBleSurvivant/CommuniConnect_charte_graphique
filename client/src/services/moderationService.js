import api from './api';

// === GESTION DES SIGNALEMENTS ===

// Créer un nouveau signalement
export const createReport = async (reportData) => {
  try {
    const response = await api.post('/moderation/reports', reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir tous les signalements (pour les modérateurs)
export const getReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const response = await api.get(`/moderation/reports?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir un signalement spécifique
export const getReport = async (reportId) => {
  try {
    const response = await api.get(`/moderation/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Assigner un modérateur à un signalement
export const assignModerator = async (reportId) => {
  try {
    const response = await api.patch(`/moderation/reports/${reportId}/assign`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Résoudre un signalement
export const resolveReport = async (reportId, resolutionData) => {
  try {
    const response = await api.patch(`/moderation/reports/${reportId}/resolve`, resolutionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// === MODÉRATION AUTOMATIQUE ===

// Analyser du contenu automatiquement
export const analyzeContent = async (content, contentType = 'post', userId = null) => {
  try {
    const response = await api.post('/moderation/analyze', {
      content,
      contentType,
      userId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Analyser un post existant
export const analyzePost = async (postId) => {
  try {
    const response = await api.post(`/moderation/analyze/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Appliquer des actions automatiques
export const applyAutomatedActions = async (contentId, contentType, analysis) => {
  try {
    const response = await api.post('/moderation/apply-automated-actions', {
      contentId,
      contentType,
      analysis
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// === LOGS DE MODÉRATION ===

// Obtenir les logs de modération
export const getModerationLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const response = await api.get(`/moderation/logs?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir les statistiques de modération automatique
export const getAutomationStats = async (startDate = null, endDate = null) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/moderation/stats/automation?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// === GESTION DES MOTS INTERDITS ===

// Obtenir la liste des mots interdits
export const getBannedWords = async () => {
  try {
    const response = await api.get('/moderation/banned-words');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Ajouter des mots interdits
export const addBannedWords = async (words) => {
  try {
    const response = await api.post('/moderation/banned-words', { words });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// === UTILITAIRES ===

// Vérifier si l'utilisateur est modérateur
export const isModerator = (user) => {
  return user && (user.role === 'moderator' || user.role === 'admin');
};

// Vérifier si l'utilisateur est admin
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Obtenir le statut de modération d'un utilisateur
export const getUserModerationStatus = (user) => {
  if (!user) return 'unknown';
  return user.moderationStatus || 'active';
};

// Vérifier si un utilisateur est suspendu
export const isUserSuspended = (user) => {
  if (!user) return false;
  
  if (user.moderationStatus === 'suspended' && user.suspensionEndDate) {
    return new Date() < new Date(user.suspensionEndDate);
  }
  
  return user.moderationStatus === 'banned';
};

// Formater les raisons de signalement
export const formatReportReason = (reason) => {
  const reasons = {
    spam: 'Spam',
    inappropriate_content: 'Contenu inapproprié',
    harassment: 'Harcèlement',
    fake_news: 'Fausses informations',
    violence: 'Violence',
    hate_speech: 'Discours de haine',
    copyright_violation: 'Violation de droits d\'auteur',
    other: 'Autre'
  };
  return reasons[reason] || reason;
};

// Formater les statuts de signalement
export const formatReportStatus = (status) => {
  const statuses = {
    pending: 'En attente',
    under_review: 'En cours d\'examen',
    resolved: 'Résolu',
    dismissed: 'Rejeté'
  };
  return statuses[status] || status;
};

// Formater les priorités de signalement
export const formatReportPriority = (priority) => {
  const priorities = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
    critical: 'Critique'
  };
  return priorities[priority] || priority;
};

// Formater les actions de modération
export const formatModerationAction = (action) => {
  const actions = {
    content_review: 'Révision de contenu',
    content_removal: 'Suppression de contenu',
    user_warning: 'Avertissement utilisateur',
    user_suspension: 'Suspension utilisateur',
    user_ban: 'Bannissement utilisateur',
    report_resolution: 'Résolution de signalement',
    automated_action: 'Action automatique',
    appeal_review: 'Révision d\'appel',
    policy_update: 'Mise à jour de politique'
  };
  return actions[action] || action;
};

// Obtenir la couleur pour les priorités
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  };
  return colors[priority] || 'default';
};

// Obtenir la couleur pour les statuts
export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    under_review: 'info',
    resolved: 'success',
    dismissed: 'error'
  };
  return colors[status] || 'default';
}; 