import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsService } from '../../services/postsService';

// Actions asynchrones
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postsService.getPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des posts');
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postsService.getPost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postsService.updatePost(id, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postsService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du post');
    }
  }
);

export const toggleReaction = createAsyncThunk(
  'posts/toggleReaction',
  async ({ id, reactionType }, { rejectWithValue }) => {
    try {
      const response = await postsService.toggleReaction(id, reactionType);
      return { id, reactionType, reactions: response.data.reactions, userReaction: response.data.userReaction };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la gestion de la réaction');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await postsService.addComment(id, content);
      return { postId: id, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await postsService.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du commentaire');
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/sharePost',
  async ({ postId, type = 'share', content = '' }, { rejectWithValue }) => {
    try {
      if (type === 'repost') {
        // Pour le repost, créer un nouveau post qui référence l'original
        const repostData = {
          content: content,
          type: 'repost',
          originalPost: postId,
          isRepost: true
        };
        const response = await postsService.createPost(repostData);
        return { 
          id: postId, 
          shares: response.data.shares,
          repost: response.data,
          type: 'repost'
        };
      } else {
        // Pour le partage simple, incrémenter le compteur
        const response = await postsService.sharePost(postId);
        return { 
          id: postId, 
          shares: response.data.shares,
          type: 'share'
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du partage du post');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await postsService.getUserPosts(userId, params);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des posts utilisateur');
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  userPosts: {},
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    type: '',
    region: '',
    commune: '',
    quartier: '',
    search: ''
  },
  loading: false,
  error: null,
  success: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        region: '',
        commune: '',
        quartier: '',
        search: ''
      };
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    addPostToFeed: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePostInFeed: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePostFromFeed: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchPost
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.success = 'Post créé avec succès';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updatePost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        state.success = 'Post mis à jour avec succès';
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // deletePost
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
        state.success = 'Post supprimé avec succès';
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // toggleReaction
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const { id, reactions, userReaction } = action.payload;
        const post = state.posts.find(p => p._id === id);
        if (post) {
          post.reactions = reactions;
        }
        if (state.currentPost && state.currentPost._id === id) {
          state.currentPost.reactions = reactions;
        }
      })
      
      // addComment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          post.comments.push(comment);
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.comments.push(comment);
        }
      })
      
      // deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          post.comments = post.comments.filter(c => c._id !== commentId);
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.comments = state.currentPost.comments.filter(c => c._id !== commentId);
        }
      })
      
      // sharePost
      .addCase(sharePost.fulfilled, (state, action) => {
        const { id, shares, repost, type } = action.payload;
        const post = state.posts.find(p => p._id === id);
        if (post) {
          if (type === 'repost') {
            post.reposts = repost;
          } else {
            post.shares = shares;
          }
        }
        if (state.currentPost && state.currentPost._id === id) {
          if (type === 'repost') {
            state.currentPost.reposts = repost;
          } else {
            state.currentPost.shares = shares;
          }
        }
      })
      
      // fetchUserPosts
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const { userId, posts, pagination } = action.payload;
        state.userPosts[userId] = { posts, pagination };
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  setCurrentPost,
  clearCurrentPost,
  addPostToFeed,
  updatePostInFeed,
  removePostFromFeed
} = postsSlice.actions;

export default postsSlice.reducer; 