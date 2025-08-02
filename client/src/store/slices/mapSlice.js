import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mapService } from '../../services/mapService';

// Actions asynchrones
export const fetchMapMarkers = createAsyncThunk(
  'map/fetchMapMarkers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await mapService.getMapMarkers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des marqueurs');
    }
  }
);

export const fetchAlerts = createAsyncThunk(
  'map/fetchAlerts',
  async (bounds = null, { rejectWithValue }) => {
    try {
      const response = await mapService.getAlerts(bounds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des alertes');
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'map/fetchEvents',
  async (bounds = null, { rejectWithValue }) => {
    try {
      const response = await mapService.getEvents(bounds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des événements');
    }
  }
);

export const fetchHelpRequests = createAsyncThunk(
  'map/fetchHelpRequests',
  async (bounds = null, { rejectWithValue }) => {
    try {
      const response = await mapService.getHelpRequests(bounds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des demandes d\'aide');
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'map/fetchPosts',
  async (bounds = null, { rejectWithValue }) => {
    try {
      const response = await mapService.getPosts(bounds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des posts');
    }
  }
);

export const geocodeAddress = createAsyncThunk(
  'map/geocodeAddress',
  async (address, { rejectWithValue }) => {
    try {
      const response = await mapService.geocodeAddress(address);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du géocodage');
    }
  }
);

export const reverseGeocode = createAsyncThunk(
  'map/reverseGeocode',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response = await mapService.reverseGeocode(lat, lng);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du géocodage inverse');
    }
  }
);

const initialState = {
  // État de la carte
  center: [9.5370, -13.6785], // Conakry par défaut
  zoom: 10,
  bounds: null,
  
  // Marqueurs
  markers: [],
  alerts: [],
  events: [],
  helpRequests: [],
  posts: [],
  
  // Filtres
  filters: {
    showAlerts: true,
    showEvents: true,
    showHelpRequests: true,
    showPosts: true,
    alertSeverity: 'all',
    eventType: 'all',
    helpType: 'all',
    postType: 'all',
    radius: 10 // km
  },
  
  // Géocodage
  geocoding: {
    address: '',
    coordinates: null,
    loading: false,
    error: null
  },
  
  // État général
  loading: false,
  error: null,
  
  // Sélection
  selectedMarker: null,
  selectedLocation: null,
  
  // Légende
  legendVisible: true,
  
  // Mode de la carte
  mapMode: 'view', // 'view', 'create-alert', 'create-event', 'create-help'
  
  // Données utilisateur
  userLocation: null,
  userLocationPermission: 'prompt' // 'granted', 'denied', 'prompt'
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Actions de base de la carte
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    
    setBounds: (state, action) => {
      state.bounds = action.payload;
    },
    
    // Actions des filtres
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Actions de sélection
    setSelectedMarker: (state, action) => {
      state.selectedMarker = action.payload;
    },
    
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedMarker = null;
      state.selectedLocation = null;
    },
    
    // Actions de la légende
    toggleLegend: (state) => {
      state.legendVisible = !state.legendVisible;
    },
    
    // Actions du mode de carte
    setMapMode: (state, action) => {
      state.mapMode = action.payload;
    },
    
    // Actions de localisation utilisateur
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    
    setUserLocationPermission: (state, action) => {
      state.userLocationPermission = action.payload;
    },
    
    // Actions de géocodage
    setGeocodingAddress: (state, action) => {
      state.geocoding.address = action.payload;
    },
    
    clearGeocoding: (state) => {
      state.geocoding = initialState.geocoding;
    },
    
    // Actions de nettoyage
    clearError: (state) => {
      state.error = null;
    },
    
    clearMapData: (state) => {
      state.markers = [];
      state.alerts = [];
      state.events = [];
      state.helpRequests = [];
      state.posts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMapMarkers
      .addCase(fetchMapMarkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMapMarkers.fulfilled, (state, action) => {
        state.loading = false;
        state.markers = action.payload.markers || [];
      })
      .addCase(fetchMapMarkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchAlerts
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload.alerts || [];
      })
      
      // fetchEvents
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload.events || [];
      })
      
      // fetchHelpRequests
      .addCase(fetchHelpRequests.fulfilled, (state, action) => {
        state.helpRequests = action.payload.helpRequests || [];
      })
      
      // fetchPosts
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts || [];
      })
      
      // geocodeAddress
      .addCase(geocodeAddress.pending, (state) => {
        state.geocoding.loading = true;
        state.geocoding.error = null;
      })
      .addCase(geocodeAddress.fulfilled, (state, action) => {
        state.geocoding.loading = false;
        state.geocoding.coordinates = action.payload;
      })
      .addCase(geocodeAddress.rejected, (state, action) => {
        state.geocoding.loading = false;
        state.geocoding.error = action.payload;
      })
      
      // reverseGeocode
      .addCase(reverseGeocode.pending, (state) => {
        state.geocoding.loading = true;
        state.geocoding.error = null;
      })
      .addCase(reverseGeocode.fulfilled, (state, action) => {
        state.geocoding.loading = false;
        state.geocoding.address = action.payload;
      })
      .addCase(reverseGeocode.rejected, (state, action) => {
        state.geocoding.loading = false;
        state.geocoding.error = action.payload;
      });
  }
});

export const {
  setCenter,
  setZoom,
  setBounds,
  setFilter,
  resetFilters,
  setSelectedMarker,
  setSelectedLocation,
  clearSelection,
  toggleLegend,
  setMapMode,
  setUserLocation,
  setUserLocationPermission,
  setGeocodingAddress,
  clearGeocoding,
  clearError,
  clearMapData
} = mapSlice.actions;

export default mapSlice.reducer; 