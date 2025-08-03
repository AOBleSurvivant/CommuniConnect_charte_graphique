import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import communiconseilService from '../../services/communiconseilService';

// Actions asynchrones
export const fetchPublications = createAsyncThunk(
  'communiconseil/fetchPublications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.getPublications();
      return response.publications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des publications');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'communiconseil/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.getCategories();
      return response.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des catégories');
    }
  }
);

export const applyForContributor = createAsyncThunk(
  'communiconseil/applyForContributor',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.applyForContributor(applicationData);
      return response.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la demande de contributeur');
    }
  }
);

export const createPublication = createAsyncThunk(
  'communiconseil/createPublication',
  async (publicationData, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.createPublication(publicationData);
      return response.publication;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la publication');
    }
  }
);

export const reactToPublication = createAsyncThunk(
  'communiconseil/reactToPublication',
  async ({ publicationId, reaction }, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.reactToPublication(publicationId, reaction);
      return { publicationId, reaction, response: response.reaction };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la réaction');
    }
  }
);

export const reportPublication = createAsyncThunk(
  'communiconseil/reportPublication',
  async ({ publicationId, reason }, { rejectWithValue }) => {
    try {
      const response = await communiconseilService.reportPublication(publicationId, reason);
      return response.report;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du signalement');
    }
  }
);

// État initial
const initialState = {
  publications: [],
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  success: null,
  contributorApplication: null,
  isContributor: false,
  stats: {
    totalPublications: 0,
    totalContributors: 0,
    totalReactions: 0
  }
};

// Slice
const communiconseilSlice = createSlice({
  name: 'communiconseil',
  initialState,
  reducers: {
    // Réinitialiser l'état
    resetCommuniConseil: (state) => {
      state.publications = [];
      state.categories = [];
      state.selectedCategory = null;
      state.error = null;
      state.success = null;
    },

    // Sélectionner une catégorie
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    // Effacer les erreurs
    clearError: (state) => {
      state.error = null;
    },

    // Effacer les messages de succès
    clearSuccess: (state) => {
      state.success = null;
    },

    // Mettre à jour le statut de contributeur
    setContributorStatus: (state, action) => {
      state.isContributor = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPublications
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.publications = action.payload;
        state.stats.totalPublications = action.payload.length;
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // applyForContributor
      .addCase(applyForContributor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForContributor.fulfilled, (state, action) => {
        state.loading = false;
        state.contributorApplication = action.payload;
        state.success = 'Votre demande a été soumise avec succès';
      })
      .addCase(applyForContributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createPublication
      .addCase(createPublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPublication.fulfilled, (state, action) => {
        state.loading = false;
        state.publications.unshift(action.payload);
        state.success = 'Publication créée avec succès';
      })
      .addCase(createPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reactToPublication
      .addCase(reactToPublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactToPublication.fulfilled, (state, action) => {
        state.loading = false;
        const { publicationId, reaction } = action.payload;
        const publication = state.publications.find(p => p._id === publicationId);
        if (publication && publication.reactions) {
          publication.reactions[reaction] = (publication.reactions[reaction] || 0) + 1;
        }
        state.success = 'Réaction enregistrée';
      })
      .addCase(reactToPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reportPublication
      .addCase(reportPublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportPublication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Signalement enregistré';
      })
      .addCase(reportPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const {
  resetCommuniConseil,
  selectCategory,
  clearError,
  clearSuccess,
  setContributorStatus
} = communiconseilSlice.actions;

// Sélecteurs mémorisés
export const selectPublications = createSelector(
  [(state) => state.communiconseil.publications],
  (publications) => publications
);

export const selectCategories = createSelector(
  [(state) => state.communiconseil.categories],
  (categories) => categories
);

export const selectSelectedCategory = createSelector(
  [(state) => state.communiconseil.selectedCategory],
  (selectedCategory) => selectedCategory
);

export const selectCommuniConseilLoading = createSelector(
  [(state) => state.communiconseil.loading],
  (loading) => loading
);

export const selectCommuniConseilError = createSelector(
  [(state) => state.communiconseil.error],
  (error) => error
);

export const selectCommuniConseilSuccess = createSelector(
  [(state) => state.communiconseil.success],
  (success) => success
);

export const selectContributorApplication = createSelector(
  [(state) => state.communiconseil.contributorApplication],
  (contributorApplication) => contributorApplication
);

export const selectIsContributor = createSelector(
  [(state) => state.communiconseil.isContributor],
  (isContributor) => isContributor
);

export const selectCommuniConseilStats = createSelector(
  [(state) => state.communiconseil.stats],
  (stats) => stats
);

// Sélecteur pour les publications filtrées par catégorie
export const selectPublicationsByCategory = createSelector(
  [(state) => state.communiconseil.publications, (state) => state.communiconseil.selectedCategory],
  (publications, selectedCategory) => {
    if (!selectedCategory) return publications;
    return publications.filter(pub => pub.category === selectedCategory);
  }
);

export default communiconseilSlice.reducer; 