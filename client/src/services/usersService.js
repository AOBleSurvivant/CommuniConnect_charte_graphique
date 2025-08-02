import api from './api';

const usersService = {
  // Récupérer le profil utilisateur
  getProfile: () => {
    return api.get('/users/profile');
  },

  // Mettre à jour le profil utilisateur
  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },

  // Upload photo de profil
  uploadProfilePicture: (pictureData) => {
    return api.post('/users/profile/picture', pictureData);
  },

  // Rechercher des utilisateurs
  searchUsers: (query) => {
    return api.get('/users/search', { params: { q: query } });
  },

  // Récupérer les informations d'un utilisateur
  getUserInfo: (userId) => {
    return api.get(`/users/${userId}`);
  },

  // Mettre à jour les paramètres de notification
  updateNotificationSettings: (settings) => {
    return api.put('/users/notifications', settings);
  },

  // Récupérer les paramètres de notification
  getNotificationSettings: () => {
    return api.get('/users/notifications');
  },

  // Changer le mot de passe
  changePassword: (passwordData) => {
    return api.put('/users/password', passwordData);
  },

  // Supprimer le compte
  deleteAccount: () => {
    return api.delete('/users/account');
  },

  // Exporter les données utilisateur
  exportData: () => {
    return api.get('/users/export');
  },

  // Récupérer l'historique des connexions
  getLoginHistory: () => {
    return api.get('/users/login-history');
  },

  // Récupérer les statistiques utilisateur
  getUserStats: () => {
    return api.get('/users/stats');
  }
};

export default usersService; 