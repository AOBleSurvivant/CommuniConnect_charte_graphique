import api from './api';

const friendsService = {
  // Envoyer une demande d'ami
  sendFriendRequest: (recipientId) => {
    return api.post('/api/friends/request', { recipientId });
  },

  // Récupérer la liste d'amis
  getFriendsList: () => {
    return api.get('/api/friends');
  },

  // Récupérer les demandes d'amis reçues
  getFriendRequests: () => {
    return api.get('/api/friends/requests');
  },

  // Accepter une demande d'ami
  acceptFriendRequest: (requestId) => {
    return api.post(`/api/friends/accept/${requestId}`);
  },

  // Refuser une demande d'ami
  declineFriendRequest: (requestId) => {
    return api.post(`/api/friends/reject/${requestId}`);
  },

  // Supprimer un ami
  removeFriend: (friendshipId) => {
    return api.delete(`/api/friends/remove/${friendshipId}`);
  },

  // Rechercher des utilisateurs
  searchUsers: (query) => {
    return api.get('/api/users/search', { params: { q: query } });
  },

  // Récupérer les suggestions d'amis
  getFriendSuggestions: () => {
    return api.get('/api/friends/suggestions');
  },

  // Bloquer un utilisateur
  blockUser: (userId) => {
    return api.post(`/api/friends/block/${userId}`);
  },

  // Débloquer un utilisateur
  unblockUser: (userId) => {
    return api.delete(`/api/friends/block/${userId}`);
  },

  // Récupérer la liste des utilisateurs bloqués
  getBlockedUsers: () => {
    return api.get('/api/friends/blocked');
  }
};

export default friendsService; 