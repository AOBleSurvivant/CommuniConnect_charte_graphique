import api from './api';

const livestreamsService = {
  // Récupérer tous les lives communautaires
  getLivestreams: (filters = {}) => {
    return api.get('/api/livestreams', { params: filters });
  },

  // Récupérer les lives en direct
  getLiveStreams: () => {
    return api.get('/api/livestreams/live');
  },

  // Récupérer les lives programmés
  getScheduledStreams: () => {
    return api.get('/api/livestreams/scheduled');
  },

  // Récupérer les alertes en direct
  getAlertStreams: () => {
    return api.get('/api/livestreams/alerts');
  },

  // Récupérer les lives d'une communauté spécifique
  getCommunityStreams: (location) => {
    return api.get('/api/livestreams/community', { params: location });
  },

  // Créer un nouveau live
  createLivestream: (livestreamData) => {
    return api.post('/api/livestreams', livestreamData);
  },

  // Récupérer un live par ID
  getLivestreamById: (id) => {
    return api.get(`/api/livestreams/${id}`);
  },

  // Démarrer un live
  startLivestream: (id) => {
    return api.post(`/api/livestreams/${id}/start`);
  },

  // Terminer un live
  endLivestream: (id) => {
    return api.post(`/api/livestreams/${id}/end`);
  },

  // Rejoindre un live
  joinLivestream: (id) => {
    return api.post(`/api/livestreams/${id}/join`);
  },

  // Quitter un live
  leaveLivestream: (id) => {
    return api.post(`/api/livestreams/${id}/leave`);
  },

  // Envoyer un message dans le chat
  sendMessage: (id, message) => {
    return api.post(`/api/livestreams/${id}/message`, { message });
  },

  // Ajouter une réaction
  addReaction: (id, reactionType) => {
    return api.post(`/api/livestreams/${id}/reaction`, { type: reactionType });
  },

  // Signaler un live
  reportLivestream: (id, reason) => {
    return api.post(`/api/livestreams/${id}/report`, { reason });
  }
};

export default livestreamsService; 