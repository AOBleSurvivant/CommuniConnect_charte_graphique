import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import alertsService from '../../services/alertsService';

// Actions asynchrones
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await alertsService.getAlerts(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des alertes');
    }
  }
);

export const fetchUrgentAlerts = createAsyncThunk(
  'alerts/fetchUrgentAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertsService.getUrgentAlerts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des alertes urgentes');
    }
  }
);

export const fetchNearbyAlerts = createAsyncThunk(
  'alerts/fetchNearbyAlerts',
  async ({ latitude, longitude, radius = 5 }, { rejectWithValue }) => {
    try {
      const response = await alertsService.getNearbyAlerts(latitude, longitude, radius);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des alertes à proximité');
    }
  }
);

export const fetchAlert = createAsyncThunk(
  'alerts/fetchAlert',
  async (id, { rejectWithValue }) => {
    try {
      const response = await alertsService.getAlert(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération de l\'alerte');
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await alertsService.createAlert(alertData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la création de l\'alerte');
    }
  }
);

export const updateAlert = createAsyncThunk(
  'alerts/updateAlert',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await alertsService.updateAlert(id, updateData);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la mise à jour de l\'alerte');
    }
  }
);

export const confirmAlert = createAsyncThunk(
  'alerts/confirmAlert',
  async (id, { rejectWithValue }) => {
    try {
      const response = await alertsService.confirmAlert(id);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la confirmation de l\'alerte');
    }
  }
);

export const denyAlert = createAsyncThunk(
  'alerts/denyAlert',
  async (id, { rejectWithValue }) => {
    try {
      const response = await alertsService.denyAlert(id);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la dénégation de l\'alerte');
    }
  }
);

export const addAlertUpdate = createAsyncThunk(
  'alerts/addUpdate',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await alertsService.addUpdate(id, updateData);
      return { id, update: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'ajout de la mise à jour');
    }
  }
);

export const reportAlert = createAsyncThunk(
  'alerts/reportAlert',
  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const response = await alertsService.reportAlert(id, reportData);
      return { id, report: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du signalement de l\'alerte');
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (id, { rejectWithValue }) => {
    try {
      await alertsService.deleteAlert(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la suppression de l\'alerte');
    }
  }
);

const initialState = {
  alerts: [],
  urgentAlerts: [],
  nearbyAlerts: [],
  currentAlert: null,
  loading: false,
  error: null,
  success: false,
  filters: {
    priority: '',
    type: '',
    category: '',
    region: '',
    prefecture: '',
    commune: '',
    limit: 20,
    page: 1
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentAlert: (state, action) => {
      state.currentAlert = action.payload;
    },
    clearCurrentAlert: (state) => {
      state.currentAlert = null;
    },
    addAlertToNearby: (state, action) => {
      const alert = action.payload;
      const exists = state.nearbyAlerts.find(a => a._id === alert._id);
      if (!exists) {
        state.nearbyAlerts.unshift(alert);
      }
    },
    updateAlertInList: (state, action) => {
      const { id, updates } = action.payload;
      const alertIndex = state.alerts.findIndex(alert => alert._id === id);
      if (alertIndex !== -1) {
        state.alerts[alertIndex] = { ...state.alerts[alertIndex], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.alerts) {
          state.alerts = action.payload.alerts;
          state.pagination = action.payload.pagination;
        } else {
          state.alerts = action.payload || [];
        }
        state.success = true;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Urgent Alerts
      .addCase(fetchUrgentAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrgentAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.urgentAlerts = action.payload || [];
        state.success = true;
      })
      .addCase(fetchUrgentAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Nearby Alerts
      .addCase(fetchNearbyAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyAlerts = action.payload || [];
        state.success = true;
      })
      .addCase(fetchNearbyAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Single Alert
      .addCase(fetchAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAlert = action.payload || null;
        state.success = true;
      })
      .addCase(fetchAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Create Alert
      .addCase(createAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.alerts.unshift(action.payload);
        }
        state.success = true;
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Alert
      .addCase(updateAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlert.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const alertIndex = state.alerts.findIndex(alert => alert._id === id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex] = { ...state.alerts[alertIndex], ...data };
        }
        if (state.currentAlert && state.currentAlert._id === id) {
          state.currentAlert = { ...state.currentAlert, ...data };
        }
        state.success = true;
      })
      .addCase(updateAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Confirm Alert
      .addCase(confirmAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmAlert.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const alertIndex = state.alerts.findIndex(alert => alert._id === id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex].interactions.confirmations = data.confirmations;
          state.alerts[alertIndex].interactions.denials = data.denials;
        }
        if (state.currentAlert && state.currentAlert._id === id) {
          state.currentAlert.interactions.confirmations = data.confirmations;
          state.currentAlert.interactions.denials = data.denials;
        }
        state.success = true;
      })
      .addCase(confirmAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Deny Alert
      .addCase(denyAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(denyAlert.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const alertIndex = state.alerts.findIndex(alert => alert._id === id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex].interactions.confirmations = data.confirmations;
          state.alerts[alertIndex].interactions.denials = data.denials;
        }
        if (state.currentAlert && state.currentAlert._id === id) {
          state.currentAlert.interactions.confirmations = data.confirmations;
          state.currentAlert.interactions.denials = data.denials;
        }
        state.success = true;
      })
      .addCase(denyAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Add Update
      .addCase(addAlertUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAlertUpdate.fulfilled, (state, action) => {
        state.loading = false;
        const { id, update } = action.payload;
        const alertIndex = state.alerts.findIndex(alert => alert._id === id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex].updates.push(update);
        }
        if (state.currentAlert && state.currentAlert._id === id) {
          state.currentAlert.updates.push(update);
        }
        state.success = true;
      })
      .addCase(addAlertUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Report Alert
      .addCase(reportAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportAlert.fulfilled, (state, action) => {
        state.loading = false;
        const { id, report } = action.payload;
        const alertIndex = state.alerts.findIndex(alert => alert._id === id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex].moderation.reports.push(report);
        }
        if (state.currentAlert && state.currentAlert._id === id) {
          state.currentAlert.moderation.reports.push(report);
        }
        state.success = true;
      })
      .addCase(reportAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Alert
      .addCase(deleteAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.alerts = state.alerts.filter(alert => alert._id !== deletedId);
        state.urgentAlerts = state.urgentAlerts.filter(alert => alert._id !== deletedId);
        state.nearbyAlerts = state.nearbyAlerts.filter(alert => alert._id !== deletedId);
        if (state.currentAlert && state.currentAlert._id === deletedId) {
          state.currentAlert = null;
        }
        state.success = true;
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  setCurrentAlert,
  clearCurrentAlert,
  addAlertToNearby,
  updateAlertInList
} = alertsSlice.actions;

export default alertsSlice.reducer; 