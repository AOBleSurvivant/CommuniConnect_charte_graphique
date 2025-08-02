import api from './api';

const EVENTS_ENDPOINT = '/api/events';

export const eventsService = {
  // Obtenir tous les événements avec filtres
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`${EVENTS_ENDPOINT}?${params.toString()}`);
    return response.data;
  },

  // Obtenir les événements à venir
  getUpcomingEvents: async (limit = 10) => {
    const response = await api.get(`${EVENTS_ENDPOINT}/upcoming?limit=${limit}`);
    return response.data;
  },

  // Obtenir les événements à proximité
  getNearbyEvents: async (latitude, longitude, radius = 10) => {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString()
    });

    const response = await api.get(`${EVENTS_ENDPOINT}/nearby?${params.toString()}`);
    return response.data;
  },

  // Obtenir un événement spécifique
  getEvent: async (id) => {
    const response = await api.get(`${EVENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Créer un nouvel événement
  createEvent: async (eventData) => {
    const response = await api.post(EVENTS_ENDPOINT, eventData);
    return response.data;
  },

  // Mettre à jour un événement
  updateEvent: async (id, updateData) => {
    const response = await api.put(`${EVENTS_ENDPOINT}/${id}`, updateData);
    return response.data;
  },

  // Participer à un événement
  participateInEvent: async (id, status = 'confirmed') => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/participate`, { status });
    return response.data;
  },

  // Se désinscrire d'un événement
  leaveEvent: async (id) => {
    const response = await api.delete(`${EVENTS_ENDPOINT}/${id}/participate`);
    return response.data;
  },

  // Signaler un événement
  reportEvent: async (id, reportData) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/report`, reportData);
    return response.data;
  },

  // Supprimer un événement
  deleteEvent: async (id) => {
    const response = await api.delete(`${EVENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Obtenir les événements par type
  getEventsByType: async (type) => {
    const response = await api.get(`${EVENTS_ENDPOINT}?type=${type}`);
    return response.data;
  },

  // Obtenir les événements par organisateur
  getEventsByOrganizer: async (organizerId) => {
    const response = await api.get(`${EVENTS_ENDPOINT}?organizer=${organizerId}`);
    return response.data;
  },

  // Obtenir les événements par date
  getEventsByDateRange: async (startDate, endDate) => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const response = await api.get(`${EVENTS_ENDPOINT}?${params.toString()}`);
    return response.data;
  },

  // Obtenir les événements gratuits
  getFreeEvents: async () => {
    const response = await api.get(`${EVENTS_ENDPOINT}?isFree=true`);
    return response.data;
  },

  // Obtenir les événements payants
  getPaidEvents: async () => {
    const response = await api.get(`${EVENTS_ENDPOINT}?isFree=false`);
    return response.data;
  },

  // Rechercher des événements par mot-clé
  searchEvents: async (searchTerm) => {
    const response = await api.get(`${EVENTS_ENDPOINT}?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Obtenir les statistiques des événements
  getEventStats: async () => {
    const response = await api.get(`${EVENTS_ENDPOINT}/stats`);
    return response.data;
  },

  // Ajouter un co-organisateur
  addCoOrganizer: async (eventId, userId, role = 'coordinateur') => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/co-organizers`, {
      userId,
      role
    });
    return response.data;
  },

  // Supprimer un co-organisateur
  removeCoOrganizer: async (eventId, userId) => {
    const response = await api.delete(`${EVENTS_ENDPOINT}/${eventId}/co-organizers/${userId}`);
    return response.data;
  },

  // Marquer la présence d'un participant
  markAttendance: async (eventId, userId, attended = true) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/attendance`, {
      userId,
      attended
    });
    return response.data;
  },

  // Obtenir la liste des participants
  getEventParticipants: async (eventId) => {
    const response = await api.get(`${EVENTS_ENDPOINT}/${eventId}/participants`);
    return response.data;
  },

  // Exporter les participants (CSV)
  exportParticipants: async (eventId, format = 'csv') => {
    const response = await api.get(`${EVENTS_ENDPOINT}/${eventId}/export-participants`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Envoyer des notifications aux participants
  notifyParticipants: async (eventId, message) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/notify`, {
      message
    });
    return response.data;
  },

  // Dupliquer un événement
  duplicateEvent: async (eventId, newDates) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/duplicate`, newDates);
    return response.data;
  },

  // Annuler un événement
  cancelEvent: async (eventId, reason) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/cancel`, {
      reason
    });
    return response.data;
  },

  // Reporter un événement
  postponeEvent: async (eventId, newDates) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/postpone`, newDates);
    return response.data;
  },

  // Marquer un événement comme terminé
  completeEvent: async (eventId, summary) => {
    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/complete`, {
      summary
    });
    return response.data;
  }
}; 