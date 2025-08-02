import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as moderationService from '../../services/moderationService';

// === THUNKS ===

// Créer un signalement
export const createReport = createAsyncThunk(
  'moderation/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await moderationService.createReport(reportData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Obtenir les signalements
export const fetchReports = createAsyncThunk(
  'moderation/fetchReports',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await moderationService.getReports(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Obtenir un signalement spécifique
export const fetchReport = createAsyncThunk(
  'moderation/fetchReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await moderationService.getReport(reportId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Assigner un modérateur
export const assignModerator = createAsyncThunk(
  'moderation/assignModerator',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await moderationService.assignModerator(reportId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Résoudre un signalement
export const resolveReport = createAsyncThunk(
  'moderation/resolveReport',
  async ({ reportId, resolutionData }, { rejectWithValue }) => {
    try {
      const response = await moderationService.resolveReport(reportId, resolutionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Analyser du contenu
export const analyzeContent = createAsyncThunk(
  'moderation/analyzeContent',
  async ({ content, contentType, userId }, { rejectWithValue }) => {
    try {
      const response = await moderationService.analyzeContent(content, contentType, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Analyser un post
export const analyzePost = createAsyncThunk(
  'moderation/analyzePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await moderationService.analyzePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Appliquer des actions automatiques
export const applyAutomatedActions = createAsyncThunk(
  'moderation/applyAutomatedActions',
  async ({ contentId, contentType, analysis }, { rejectWithValue }) => {
    try {
      const response = await moderationService.applyAutomatedActions(contentId, contentType, analysis);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Obtenir les logs de modération
export const fetchModerationLogs = createAsyncThunk(
  'moderation/fetchModerationLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await moderationService.getModerationLogs(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Obtenir les statistiques d'automatisation
export const fetchAutomationStats = createAsyncThunk(
  'moderation/fetchAutomationStats',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await moderationService.getAutomationStats(startDate, endDate);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Obtenir les mots interdits
export const fetchBannedWords = createAsyncThunk(
  'moderation/fetchBannedWords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moderationService.getBannedWords();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Ajouter des mots interdits
export const addBannedWords = createAsyncThunk(
  'moderation/addBannedWords',
  async (words, { rejectWithValue }) => {
    try {
      const response = await moderationService.addBannedWords(words);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// === SLICE ===

const initialState = {
    // Signalements
    reports: [],
  currentReport: null,
  reportsLoading: false,
  reportsError: null,
    reportsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  // Analyse automatique
  contentAnalysis: null,
  analysisLoading: false,
  analysisError: null,

  // Logs de modération
  moderationLogs: [],
  logsLoading: false,
  logsError: null,
  logsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  // Statistiques
  automationStats: null,
  statsLoading: false,
  statsError: null,

  // Mots interdits
  bannedWords: [],
  bannedWordsLoading: false,
  bannedWordsError: null,

  // Filtres et état de l'interface
  filters: {
    status: '',
    priority: '',
    contentType: '',
    moderator: '',
    action: '',
    targetType: '',
    automated: '',
    startDate: '',
    endDate: ''
  },

  // Actions en cours
  pendingActions: {
    createReport: false,
    assignModerator: false,
    resolveReport: false,
    analyzeContent: false,
    applyAutomatedActions: false,
    addBannedWords: false
  }
};

const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    // Réinitialiser l'état
    resetModeration: (state) => {
      state.reports = [];
      state.currentReport = null;
      state.reportsError = null;
      state.contentAnalysis = null;
      state.analysisError = null;
      state.moderationLogs = [];
      state.logsError = null;
      state.automationStats = null;
      state.statsError = null;
      state.bannedWords = [];
      state.bannedWordsError = null;
    },

    // Mettre à jour les filtres
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Réinitialiser les filtres
    resetFilters: (state) => {
      state.filters = {
        status: '',
        priority: '',
        contentType: '',
        moderator: '',
        action: '',
        targetType: '',
        automated: '',
        startDate: '',
        endDate: ''
      };
    },

    // Mettre à jour le signalement actuel
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },

    // Mettre à jour l'analyse de contenu
    setContentAnalysis: (state, action) => {
      state.contentAnalysis = action.payload;
    },

    // Réinitialiser l'analyse de contenu
    clearContentAnalysis: (state) => {
      state.contentAnalysis = null;
      state.analysisError = null;
    },

    // Mettre à jour un signalement dans la liste
    updateReportInList: (state, action) => {
      const { reportId, updates } = action.payload;
      const index = state.reports.findIndex(report => report._id === reportId);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...updates };
      }
    },
    
    // Supprimer un signalement de la liste
    removeReportFromList: (state, action) => {
      const reportId = action.payload;
      state.reports = state.reports.filter(report => report._id !== reportId);
    }
  },
  extraReducers: (builder) => {
    builder
      // === CRÉATION DE SIGNALEMENT ===
      .addCase(createReport.pending, (state) => {
        state.pendingActions.createReport = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.pendingActions.createReport = false;
        state.reports.unshift(action.payload.report);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.pendingActions.createReport = false;
        state.reportsError = action.payload;
      })

      // === RÉCUPÉRATION DES SIGNALEMENTS ===
      .addCase(fetchReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload.reports;
        state.reportsPagination = action.payload.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      })

      // === RÉCUPÉRATION D'UN SIGNALEMENT ===
      .addCase(fetchReport.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.currentReport = action.payload.report;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      })

      // === ASSIGNATION DE MODÉRATEUR ===
      .addCase(assignModerator.pending, (state) => {
        state.pendingActions.assignModerator = true;
      })
      .addCase(assignModerator.fulfilled, (state, action) => {
        state.pendingActions.assignModerator = false;
        // Mettre à jour le signalement dans la liste
        const index = state.reports.findIndex(report => report._id === action.payload.report.id);
        if (index !== -1) {
          state.reports[index] = { ...state.reports[index], ...action.payload.report };
        }
        // Mettre à jour le signalement actuel
        if (state.currentReport && state.currentReport._id === action.payload.report.id) {
          state.currentReport = { ...state.currentReport, ...action.payload.report };
        }
      })
      .addCase(assignModerator.rejected, (state, action) => {
        state.pendingActions.assignModerator = false;
        state.reportsError = action.payload;
      })

      // === RÉSOLUTION DE SIGNALEMENT ===
      .addCase(resolveReport.pending, (state) => {
        state.pendingActions.resolveReport = true;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        state.pendingActions.resolveReport = false;
        // Mettre à jour le signalement dans la liste
        const index = state.reports.findIndex(report => report._id === action.payload.report.id);
        if (index !== -1) {
          state.reports[index] = { ...state.reports[index], ...action.payload.report };
        }
        // Mettre à jour le signalement actuel
        if (state.currentReport && state.currentReport._id === action.payload.report.id) {
          state.currentReport = { ...state.currentReport, ...action.payload.report };
        }
      })
      .addCase(resolveReport.rejected, (state, action) => {
        state.pendingActions.resolveReport = false;
        state.reportsError = action.payload;
      })

      // === ANALYSE DE CONTENU ===
      .addCase(analyzeContent.pending, (state) => {
        state.analysisLoading = true;
        state.analysisError = null;
      })
      .addCase(analyzeContent.fulfilled, (state, action) => {
        state.analysisLoading = false;
        state.contentAnalysis = action.payload;
      })
      .addCase(analyzeContent.rejected, (state, action) => {
        state.analysisLoading = false;
        state.analysisError = action.payload;
      })

      // === ANALYSE DE POST ===
      .addCase(analyzePost.pending, (state) => {
        state.analysisLoading = true;
        state.analysisError = null;
      })
      .addCase(analyzePost.fulfilled, (state, action) => {
        state.analysisLoading = false;
        state.contentAnalysis = action.payload;
      })
      .addCase(analyzePost.rejected, (state, action) => {
        state.analysisLoading = false;
        state.analysisError = action.payload;
      })

      // === ACTIONS AUTOMATIQUES ===
      .addCase(applyAutomatedActions.pending, (state) => {
        state.pendingActions.applyAutomatedActions = true;
      })
      .addCase(applyAutomatedActions.fulfilled, (state, action) => {
        state.pendingActions.applyAutomatedActions = false;
        // L'analyse peut être mise à jour après l'application des actions
        state.contentAnalysis = null;
      })
      .addCase(applyAutomatedActions.rejected, (state, action) => {
        state.pendingActions.applyAutomatedActions = false;
        state.analysisError = action.payload;
      })

      // === LOGS DE MODÉRATION ===
      .addCase(fetchModerationLogs.pending, (state) => {
        state.logsLoading = true;
        state.logsError = null;
      })
      .addCase(fetchModerationLogs.fulfilled, (state, action) => {
        state.logsLoading = false;
        state.moderationLogs = action.payload.logs;
        state.logsPagination = action.payload.pagination;
      })
      .addCase(fetchModerationLogs.rejected, (state, action) => {
        state.logsLoading = false;
        state.logsError = action.payload;
      })

      // === STATISTIQUES D'AUTOMATISATION ===
      .addCase(fetchAutomationStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchAutomationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.automationStats = action.payload.stats;
      })
      .addCase(fetchAutomationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })

      // === MOTS INTERDITS ===
      .addCase(fetchBannedWords.pending, (state) => {
        state.bannedWordsLoading = true;
        state.bannedWordsError = null;
      })
      .addCase(fetchBannedWords.fulfilled, (state, action) => {
        state.bannedWordsLoading = false;
        state.bannedWords = action.payload.bannedWords;
      })
      .addCase(fetchBannedWords.rejected, (state, action) => {
        state.bannedWordsLoading = false;
        state.bannedWordsError = action.payload;
      })

      // === AJOUT DE MOTS INTERDITS ===
      .addCase(addBannedWords.pending, (state) => {
        state.pendingActions.addBannedWords = true;
      })
      .addCase(addBannedWords.fulfilled, (state, action) => {
        state.pendingActions.addBannedWords = false;
        state.bannedWords = [...new Set([...state.bannedWords, ...action.payload.addedWords])];
      })
      .addCase(addBannedWords.rejected, (state, action) => {
        state.pendingActions.addBannedWords = false;
        state.bannedWordsError = action.payload;
      });
  }
});

export const {
  resetModeration,
  updateFilters,
  resetFilters,
  setCurrentReport,
  setContentAnalysis,
  clearContentAnalysis,
  updateReportInList,
  removeReportFromList
} = moderationSlice.actions;

export default moderationSlice.reducer; 