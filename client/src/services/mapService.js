import api from './api';

const MAP_URL = '/api/locations';

export const mapService = {
  // Valider une localisation
  validateLocation: async (locationData) => {
    try {
      const response = await api.post(`${MAP_URL}/validate`, locationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation de localisation:', error);
      return {
        success: false,
        message: 'Erreur lors de la validation'
      };
    }
  },

  // Récupérer les marqueurs pour la carte (posts, alertes, événements, etc.)
  getMapMarkers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/api/map/markers?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des marqueurs:', error);
      return { markers: [] };
    }
  }
}; 