import api from './api';

const POSTS_URL = '/api/posts';

export const postsService = {
  // Récupérer tous les posts avec filtres et pagination
  getPosts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${POSTS_URL}?${queryParams.toString()}`);
    return response.data;
  },

  // Récupérer un post spécifique
  getPost: async (id) => {
    const response = await api.get(`${POSTS_URL}/${id}`);
    return response.data;
  },

  // Créer un nouveau post
  createPost: async (postData) => {
    const response = await api.post(POSTS_URL, postData);
    return response.data;
  },

  // Mettre à jour un post
  updatePost: async (id, postData) => {
    const response = await api.put(`${POSTS_URL}/${id}`, postData);
    return response.data;
  },

  // Supprimer un post
  deletePost: async (id) => {
    const response = await api.delete(`${POSTS_URL}/${id}`);
    return response.data;
  },

  // Ajouter/retirer une réaction
  toggleReaction: async (id, reactionType) => {
    const response = await api.post(`${POSTS_URL}/${id}/reactions`, { type: reactionType });
    return response.data;
  },

  // Ajouter un commentaire
  addComment: async (id, content) => {
    const response = await api.post(`${POSTS_URL}/${id}/comments`, { content });
    return response.data;
  },

  // Supprimer un commentaire
  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`${POSTS_URL}/${postId}/comments/${commentId}`);
    return response.data;
  },

  // Partager un post
  sharePost: async (id) => {
    const response = await api.post(`${POSTS_URL}/${id}/share`);
    return response.data;
  },

  // Créer un repost
  createRepost: async (repostData) => {
    const response = await api.post(POSTS_URL, repostData);
    return response.data;
  },

  // Récupérer les posts d'un utilisateur
  getUserPosts: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${POSTS_URL}/user/${userId}?${queryParams.toString()}`);
    return response.data;
  }
}; 