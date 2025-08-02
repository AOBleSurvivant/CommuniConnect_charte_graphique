import api from './api';

const ALERTS_ENDPOINT = '/api/alerts';

export const alertsService = {
  // Obtenir toutes les alertes avec filtres
  getAlerts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`${ALERTS_ENDPOINT}?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des alertes');
      }
    } catch (error) {
      console.error('Erreur dans getAlerts:', error);
      throw error;
    }
  },

  // Obtenir les alertes urgentes
  getUrgentAlerts: async () => {
    try {
      const response = await api.get(`${ALERTS_ENDPOINT}/urgent`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des alertes urgentes');
      }
    } catch (error) {
      console.error('Erreur dans getUrgentAlerts:', error);
      throw error;
    }
  },

  // Obtenir les alertes à proximité
  getNearbyAlerts: async (latitude, longitude, radius = 5) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString()
      });

      const response = await api.get(`${ALERTS_ENDPOINT}/nearby?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des alertes à proximité');
      }
    } catch (error) {
      console.error('Erreur dans getNearbyAlerts:', error);
      throw error;
    }
  },

  // Obtenir une alerte spécifique
  getAlert: async (id) => {
    try {
      const response = await api.get(`${ALERTS_ENDPOINT}/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans getAlert:', error);
      throw error;
    }
  },

  // Créer une nouvelle alerte
  createAlert: async (alertData) => {
    try {
      const response = await api.post(ALERTS_ENDPOINT, alertData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans createAlert:', error);
      throw error;
    }
  },

  // Mettre à jour une alerte
  updateAlert: async (id, updateData) => {
    try {
      const response = await api.put(`${ALERTS_ENDPOINT}/${id}`, updateData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans updateAlert:', error);
      throw error;
    }
  },

  // Confirmer une alerte
  confirmAlert: async (id) => {
    try {
      const response = await api.post(`${ALERTS_ENDPOINT}/${id}/confirm`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la confirmation de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans confirmAlert:', error);
      throw error;
    }
  },

  // Dénier une alerte
  denyAlert: async (id) => {
    try {
      const response = await api.post(`${ALERTS_ENDPOINT}/${id}/deny`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la dénégation de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans denyAlert:', error);
      throw error;
    }
  },

  // Ajouter une mise à jour à une alerte
  addUpdate: async (id, updateData) => {
    try {
      const response = await api.post(`${ALERTS_ENDPOINT}/${id}/update`, updateData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'ajout de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur dans addUpdate:', error);
      throw error;
    }
  },

  // Signaler une alerte
  reportAlert: async (id, reportData) => {
    try {
      const response = await api.post(`${ALERTS_ENDPOINT}/${id}/report`, reportData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du signalement de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans reportAlert:', error);
      throw error;
    }
  },

  // Supprimer une alerte
  deleteAlert: async (id) => {
    try {
      const response = await api.delete(`${ALERTS_ENDPOINT}/${id}`);
      
      if (response.data.success) {
        return response.data.message;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur dans deleteAlert:', error);
      throw error;
    }
  }
};

export default alertsService; 