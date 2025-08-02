import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import livestreamsService from '../../services/livestreamsService';

// Actions asynchrones
export const fetchLivestreams = createAsyncThunk(
  'livestreams/fetchLivestreams',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getLivestreams(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des lives');
    }
  }
);

export const fetchLiveStreams = createAsyncThunk(
  'livestreams/fetchLiveStreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getLiveStreams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des lives en direct');
    }
  }
);

export const fetchScheduledStreams = createAsyncThunk(
  'livestreams/fetchScheduledStreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getScheduledStreams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des lives programmés');
    }
  }
);

export const fetchAlertStreams = createAsyncThunk(
  'livestreams/fetchAlertStreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getAlertStreams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des alertes');
    }
  }
);

export const fetchCommunityStreams = createAsyncThunk(
  'livestreams/fetchCommunityStreams',
  async (location, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getCommunityStreams(location);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des lives communautaires');
    }
  }
);

export const createLivestream = createAsyncThunk(
  'livestreams/createLivestream',
  async (livestreamData, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.createLivestream(livestreamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du live');
    }
  }
);

export const getLivestreamById = createAsyncThunk(
  'livestreams/getLivestreamById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.getLivestreamById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du live');
    }
  }
);

export const startLivestream = createAsyncThunk(
  'livestreams/startLivestream',
  async (id, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.startLivestream(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du démarrage du live');
    }
  }
);

export const endLivestream = createAsyncThunk(
  'livestreams/endLivestream',
  async (id, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.endLivestream(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'arrêt du live');
    }
  }
);

export const joinLivestream = createAsyncThunk(
  'livestreams/joinLivestream',
  async (id, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.joinLivestream(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la connexion au live');
    }
  }
);

export const leaveLivestream = createAsyncThunk(
  'livestreams/leaveLivestream',
  async (id, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.leaveLivestream(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la déconnexion du live');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'livestreams/sendMessage',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.sendMessage(id, message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }
);

export const addReaction = createAsyncThunk(
  'livestreams/addReaction',
  async ({ id, reactionType }, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.addReaction(id, reactionType);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'ajout de la réaction');
    }
  }
);

export const reportLivestream = createAsyncThunk(
  'livestreams/reportLivestream',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await livestreamsService.reportLivestream(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du signalement');
    }
  }
);

const initialState = {
  livestreams: [],
  liveStreams: [],
  scheduledStreams: [],
  alertStreams: [],
  communityStreams: [],
  currentLivestream: null,
  loading: false,
  error: null,
  success: null,
  filters: {
    type: '',
    urgency: '',
    quartier: '',
    commune: '',
    prefecture: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const livestreamsSlice = createSlice({
  name: 'livestreams',
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
        urgency: '',
        quartier: '',
        commune: '',
        prefecture: ''
      };
    },
    setCurrentLivestream: (state, action) => {
      state.currentLivestream = action.payload;
    },
    clearCurrentLivestream: (state) => {
      state.currentLivestream = null;
    },
    addMessageToCurrent: (state, action) => {
      if (state.currentLivestream) {
        state.currentLivestream.messages.push(action.payload);
        state.currentLivestream.stats.totalMessages += 1;
      }
    },
    updateViewerCount: (state, action) => {
      const { livestreamId, count } = action.payload;
      const livestream = state.livestreams.find(l => l._id === livestreamId);
      if (livestream) {
        livestream.stats.currentViewers = count;
      }
      if (state.currentLivestream && state.currentLivestream._id === livestreamId) {
        state.currentLivestream.stats.currentViewers = count;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchLivestreams
      .addCase(fetchLivestreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLivestreams.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, data: [...]}
        state.livestreams = action.payload.data || action.payload.livestreams || action.payload || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchLivestreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchLiveStreams
      .addCase(fetchLiveStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveStreams.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, data: [...]}
        state.liveStreams = action.payload.data || action.payload || [];
      })
      .addCase(fetchLiveStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchScheduledStreams
      .addCase(fetchScheduledStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduledStreams.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, data: [...]}
        state.scheduledStreams = action.payload.data || action.payload || [];
      })
      .addCase(fetchScheduledStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchAlertStreams
      .addCase(fetchAlertStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertStreams.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, data: [...]}
        state.alertStreams = action.payload.data || action.payload || [];
      })
      .addCase(fetchAlertStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchCommunityStreams
      .addCase(fetchCommunityStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityStreams.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, data: [...]}
        state.communityStreams = action.payload.data || action.payload || [];
      })
      .addCase(fetchCommunityStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // createLivestream
      .addCase(createLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Live créé avec succès';
        state.livestreams.unshift(action.payload);
      })
      .addCase(createLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // getLivestreamById
      .addCase(getLivestreamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLivestreamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLivestream = action.payload;
      })
      .addCase(getLivestreamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // startLivestream
      .addCase(startLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Live démarré avec succès';
        if (state.currentLivestream && state.currentLivestream._id === action.payload._id) {
          state.currentLivestream = action.payload;
        }
        const index = state.livestreams.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.livestreams[index] = action.payload;
        }
      })
      .addCase(startLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // endLivestream
      .addCase(endLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Live terminé';
        if (state.currentLivestream && state.currentLivestream._id === action.payload._id) {
          state.currentLivestream = action.payload;
        }
        const index = state.livestreams.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.livestreams[index] = action.payload;
        }
      })
      .addCase(endLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // joinLivestream
      .addCase(joinLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Connexion au live réussie';
        if (state.currentLivestream && state.currentLivestream._id === action.payload._id) {
          state.currentLivestream = action.payload;
        }
      })
      .addCase(joinLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // leaveLivestream
      .addCase(leaveLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Déconnexion du live réussie';
        if (state.currentLivestream && state.currentLivestream._id === action.payload._id) {
          state.currentLivestream = action.payload;
        }
      })
      .addCase(leaveLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentLivestream && state.currentLivestream._id === action.payload.livestreamId) {
          state.currentLivestream.messages.push(action.payload.message);
          state.currentLivestream.stats.totalMessages += 1;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // addReaction
      .addCase(addReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReaction.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentLivestream && state.currentLivestream._id === action.payload.livestreamId) {
          state.currentLivestream.reactions.push(action.payload.reaction);
        }
      })
      .addCase(addReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // reportLivestream
      .addCase(reportLivestream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportLivestream.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Signalement envoyé';
        if (state.currentLivestream && state.currentLivestream._id === action.payload._id) {
          state.currentLivestream = action.payload;
        }
      })
      .addCase(reportLivestream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  setCurrentLivestream,
  clearCurrentLivestream,
  addMessageToCurrent,
  updateViewerCount
} = livestreamsSlice.actions;

export default livestreamsSlice.reducer; 