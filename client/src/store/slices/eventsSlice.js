import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsService } from '../../services/eventsService';

// Actions asynchrones
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await eventsService.getEvents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des événements');
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcomingEvents',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await eventsService.getUpcomingEvents(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des événements à venir');
    }
  }
);

export const fetchNearbyEvents = createAsyncThunk(
  'events/fetchNearbyEvents',
  async ({ latitude, longitude, radius = 10 }, { rejectWithValue }) => {
    try {
      const response = await eventsService.getNearbyEvents(latitude, longitude, radius);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des événements à proximité');
    }
  }
);

export const fetchEvent = createAsyncThunk(
  'events/fetchEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventsService.getEvent(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de l\'événement');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventsService.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de l\'événement');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await eventsService.updateEvent(id, updateData);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'événement');
    }
  }
);

export const participateInEvent = createAsyncThunk(
  'events/participateInEvent',
  async ({ id, status = 'confirmed' }, { rejectWithValue }) => {
    try {
      const response = await eventsService.participateInEvent(id, status);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'inscription à l\'événement');
    }
  }
);

export const leaveEvent = createAsyncThunk(
  'events/leaveEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventsService.leaveEvent(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la désinscription');
    }
  }
);

export const reportEvent = createAsyncThunk(
  'events/reportEvent',
  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const response = await eventsService.reportEvent(id, reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du signalement');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventsService.deleteEvent(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'événement');
    }
  }
);

const initialState = {
  events: [],
  upcomingEvents: [],
  nearbyEvents: [],
  currentEvent: null,
  userEvents: [],
  loading: false,
  error: null,
  success: false,
  filters: {
    type: '',
    category: '',
    status: 'published',
    region: '',
    prefecture: '',
    commune: '',
    startDate: '',
    endDate: '',
    isFree: '',
    search: '',
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

const eventsSlice = createSlice({
  name: 'events',
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
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    addEventToList: (state, action) => {
      const event = action.payload;
      const exists = state.events.find(e => e._id === event._id);
      if (!exists) {
        state.events.unshift(event);
      }
    },
    updateEventInList: (state, action) => {
      const { id, updates } = action.payload;
      const eventIndex = state.events.findIndex(event => event._id === id);
      if (eventIndex !== -1) {
        state.events[eventIndex] = { ...state.events[eventIndex], ...updates };
      }
    },
    removeEventFromList: (state, action) => {
      state.events = state.events.filter(event => event._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
        state.success = true;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
        state.success = true;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Nearby Events
      .addCase(fetchNearbyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyEvents = action.payload;
        state.success = true;
      })
      .addCase(fetchNearbyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Single Event
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        state.success = true;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.success = true;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const eventIndex = state.events.findIndex(event => event._id === id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = { ...state.events[eventIndex], ...data };
        }
        if (state.currentEvent && state.currentEvent._id === id) {
          state.currentEvent = { ...state.currentEvent, ...data };
        }
        state.success = true;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Participate in Event
      .addCase(participateInEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(participateInEvent.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const eventIndex = state.events.findIndex(event => event._id === id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = data;
        }
        if (state.currentEvent && state.currentEvent._id === id) {
          state.currentEvent = data;
        }
        state.success = true;
      })
      .addCase(participateInEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Leave Event
      .addCase(leaveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const eventIndex = state.events.findIndex(event => event._id === id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = data;
        }
        if (state.currentEvent && state.currentEvent._id === id) {
          state.currentEvent = data;
        }
        state.success = true;
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Report Event
      .addCase(reportEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportEvent.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(reportEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload.id);
        if (state.currentEvent && state.currentEvent._id === action.payload.id) {
          state.currentEvent = null;
        }
        state.success = true;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
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
  setCurrentEvent,
  clearCurrentEvent,
  addEventToList,
  updateEventInList,
  removeEventFromList
} = eventsSlice.actions;

export default eventsSlice.reducer; 