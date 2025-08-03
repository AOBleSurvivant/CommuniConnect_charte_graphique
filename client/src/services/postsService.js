import api from './api';
import localPersistenceService from './localPersistenceService';

const POSTS_URL = '/api/posts';

export const postsService = {
  // Récupérer tous les posts avec filtres et pagination
  getPosts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${POSTS_URL}?${queryParams.toString()}`);
      
      // Sauvegarder localement les posts récupérés
      if (response.data.success && response.data.posts) {
        response.data.posts.forEach(post => {
          localPersistenceService.savePost(post);
        });
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, essayer de récupérer depuis le stockage local
      console.log('📂 Tentative de récupération depuis le stockage local');
      const localPosts = localPersistenceService.loadAllPosts();
      return {
        success: true,
        posts: localPosts,
        total: localPosts.length,
        message: 'Données récupérées depuis le stockage local'
      };
    }
  },

  // Récupérer un post spécifique
  getPost: async (id) => {
    try {
      const response = await api.get(`${POSTS_URL}/${id}`);
      
      // Sauvegarder localement le post récupéré
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, essayer de récupérer depuis le stockage local
      const localPost = localPersistenceService.loadPost(id);
      if (localPost) {
        console.log('📂 Post récupéré depuis le stockage local');
        return {
          success: true,
          post: localPost
        };
      }
      throw error;
    }
  },

  // Créer un nouveau post
  createPost: async (postData) => {
    try {
      const response = await api.post(POSTS_URL, postData);
      
      // Sauvegarder localement le nouveau post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, sauvegarder localement le post temporairement
      const tempPost = {
        _id: `temp_${Date.now()}`,
        ...postData,
        createdAt: new Date().toISOString(),
        isLocal: true
      };
      
      localPersistenceService.savePost(tempPost);
      
      console.log('💾 Post sauvegardé localement en attendant la synchronisation');
      return {
        success: true,
        post: tempPost,
        message: 'Post sauvegardé localement'
      };
    }
  },

  // Mettre à jour un post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`${POSTS_URL}/${id}`, postData);
      
      // Mettre à jour localement le post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, mettre à jour localement
      const localPost = localPersistenceService.loadPost(id);
      if (localPost) {
        const updatedPost = { ...localPost, ...postData, updatedAt: new Date().toISOString() };
        localPersistenceService.savePost(updatedPost);
        
        console.log('💾 Post mis à jour localement');
        return {
          success: true,
          post: updatedPost,
          message: 'Post mis à jour localement'
        };
      }
      throw error;
    }
  },

  // Supprimer un post
  deletePost: async (id) => {
    try {
      const response = await api.delete(`${POSTS_URL}/${id}`);
      
      // Supprimer localement le post
      localPersistenceService.remove('post', id);
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, supprimer localement
      localPersistenceService.remove('post', id);
      
      console.log('🗑️ Post supprimé localement');
      return {
        success: true,
        message: 'Post supprimé localement'
      };
    }
  },

  // Ajouter/retirer une réaction
  toggleReaction: async (id, reactionType) => {
    try {
      const response = await api.post(`${POSTS_URL}/${id}/reactions`, { type: reactionType });
      
      // Mettre à jour localement le post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, mettre à jour localement
      const localPost = localPersistenceService.loadPost(id);
      if (localPost) {
        const updatedPost = { ...localPost };
        if (!updatedPost.reactions) updatedPost.reactions = {};
        if (!updatedPost.reactions[reactionType]) updatedPost.reactions[reactionType] = [];
        
        const userId = localStorage.getItem('userId') || 'current';
        const hasReaction = updatedPost.reactions[reactionType].includes(userId);
        
        if (hasReaction) {
          updatedPost.reactions[reactionType] = updatedPost.reactions[reactionType].filter(id => id !== userId);
        } else {
          updatedPost.reactions[reactionType].push(userId);
        }
        
        localPersistenceService.savePost(updatedPost);
        
        console.log('💾 Réaction mise à jour localement');
        return {
          success: true,
          post: updatedPost,
          message: 'Réaction mise à jour localement'
        };
      }
      throw error;
    }
  },

  // Ajouter un commentaire
  addComment: async (id, content) => {
    try {
      const response = await api.post(`${POSTS_URL}/${id}/comments`, { content });
      
      // Mettre à jour localement le post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, ajouter localement
      const localPost = localPersistenceService.loadPost(id);
      if (localPost) {
        const newComment = {
          _id: `temp_comment_${Date.now()}`,
          content,
          author: {
            _id: localStorage.getItem('userId') || 'current',
            firstName: 'Vous',
            lastName: ''
          },
          createdAt: new Date().toISOString(),
          isLocal: true
        };
        
        const updatedPost = {
          ...localPost,
          comments: [...(localPost.comments || []), newComment]
        };
        
        localPersistenceService.savePost(updatedPost);
        
        console.log('💾 Commentaire ajouté localement');
        return {
          success: true,
          post: updatedPost,
          comment: newComment,
          message: 'Commentaire ajouté localement'
        };
      }
      throw error;
    }
  },

  // Supprimer un commentaire
  deleteComment: async (postId, commentId) => {
    try {
      const response = await api.delete(`${POSTS_URL}/${postId}/comments/${commentId}`);
      
      // Mettre à jour localement le post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, supprimer localement
      const localPost = localPersistenceService.loadPost(postId);
      if (localPost) {
        const updatedPost = {
          ...localPost,
          comments: (localPost.comments || []).filter(comment => comment._id !== commentId)
        };
        
        localPersistenceService.savePost(updatedPost);
        
        console.log('🗑️ Commentaire supprimé localement');
        return {
          success: true,
          post: updatedPost,
          message: 'Commentaire supprimé localement'
        };
      }
      throw error;
    }
  },

  // Partager un post
  sharePost: async (id) => {
    try {
      const response = await api.post(`${POSTS_URL}/${id}/share`);
      
      // Mettre à jour localement le post
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, mettre à jour localement
      const localPost = localPersistenceService.loadPost(id);
      if (localPost) {
        const updatedPost = {
          ...localPost,
          shares: (localPost.shares || 0) + 1
        };
        
        localPersistenceService.savePost(updatedPost);
        
        console.log('💾 Partage mis à jour localement');
        return {
          success: true,
          post: updatedPost,
          message: 'Partage mis à jour localement'
        };
      }
      throw error;
    }
  },

  // Créer un repost
  createRepost: async (repostData) => {
    try {
      const response = await api.post(POSTS_URL, repostData);
      
      // Sauvegarder localement le repost
      if (response.data.success && response.data.post) {
        localPersistenceService.savePost(response.data.post);
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, sauvegarder localement
      const tempRepost = {
        _id: `temp_repost_${Date.now()}`,
        ...repostData,
        createdAt: new Date().toISOString(),
        isLocal: true
      };
      
      localPersistenceService.savePost(tempRepost);
      
      console.log('💾 Repost sauvegardé localement');
      return {
        success: true,
        post: tempRepost,
        message: 'Repost sauvegardé localement'
      };
    }
  },

  // Récupérer les posts d'un utilisateur
  getUserPosts: async (userId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${POSTS_URL}/user/${userId}?${queryParams.toString()}`);
      
      // Sauvegarder localement les posts récupérés
      if (response.data.success && response.data.posts) {
        response.data.posts.forEach(post => {
          localPersistenceService.savePost(post);
        });
      }
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, essayer de récupérer depuis le stockage local
      const localPosts = localPersistenceService.loadAllPosts();
      const userPosts = localPosts.filter(post => 
        post.author && post.author._id === userId
      );
      
      return {
        success: true,
        posts: userPosts,
        total: userPosts.length,
        message: 'Posts récupérés depuis le stockage local'
      };
    }
  },

  // Méthodes pour la persistance locale
  getLocalPosts: () => {
    return localPersistenceService.loadAllPosts();
  },

  getLocalPost: (id) => {
    return localPersistenceService.loadPost(id);
  },

  saveLocalPost: (postData) => {
    return localPersistenceService.savePost(postData);
  },

  removeLocalPost: (id) => {
    return localPersistenceService.remove('post', id);
  }
}; 