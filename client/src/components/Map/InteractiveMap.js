import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Alert,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  MyLocation,
  FilterList,
  Event,
  Warning,
  LocationOn,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  Layers,
  Search,
  Directions,
  Share,
  Info,
  Celebration,
  School,
  SportsEsports,
  MusicNote,
  Restaurant,
  Business,
  VolunteerActivism,
  Group,
  LocalFireDepartment,
  ElectricBolt,
  Construction,
  PersonSearch,
  VolumeUp,
  LocalHospital,
  Lock,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Composant pour gérer les événements de la carte
const MapController = ({ onMapClick, onLocationFound }) => {
  const map = useMap();
  const mapEvents = useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  useEffect(() => {
    // Centrer sur la Guinée par défaut
    map.setView([9.5370, -13.6785], 8);
  }, [map]);

  return null;
};

// Composant pour gérer la géolocalisation
const LocationMarker = ({ onLocationFound }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = [latitude, longitude];
          setPosition(newPosition);
          map.setView(newPosition, 13);
          onLocationFound(newPosition);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [map, onLocationFound]);

  return position ? (
    <Marker position={position}>
      <Popup>
        <Typography variant="body2">Votre position</Typography>
      </Popup>
    </Marker>
  ) : null;
};

const InteractiveMap = ({ events = [], alerts = [], onMarkerClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);
  
  const [mapRef, setMapRef] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    events: true,
    alerts: true,
    eventTypes: {
      celebration: true,
      education: true,
      sport: true,
      music: true,
      food: true,
      business: true,
      charity: true,
      meeting: true,
    },
    alertTypes: {
      incendie: true,
      coupure_electricite: true,
      route_bloquee: true,
      personne_disparue: true,
      tapage_nocturne: true,
      accident: true,
      cambriolage: true,
    },
    radius: 10, // km
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Données de démonstration pour les événements et alertes
  const demoEvents = [
    {
      id: 1,
      title: "Soirée culturelle guinéenne",
      type: "celebration",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Centre culturel de Kaloum, Conakry",
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      participants: 45,
      maxParticipants: 100,
      isFree: true,
    },
    {
      id: 2,
      title: "Formation en entrepreneuriat",
      type: "education",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Université de Conakry, Dixinn",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: 28,
      maxParticipants: 50,
      isFree: true,
    },
    {
      id: 3,
      title: "Tournoi de football de quartier",
      type: "sport",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Terrain de football de Ratoma",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      participants: 65,
      maxParticipants: 80,
      isFree: true,
    },
  ];

  const demoAlerts = [
    {
      id: 1,
      title: "Incendie dans le quartier de Kaloum",
      type: "incendie",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Kaloum, Conakry",
      severity: "critique",
      status: "active",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: 2,
      title: "Coupure d'électricité prolongée",
      type: "coupure_electricite",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Dixinn, Conakry",
      severity: "moderate",
      status: "active",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 3,
      title: "Route bloquée par un camion",
      type: "route_bloquee",
      latitude: 9.5370,
      longitude: -13.6785,
      location: "Ratoma, Conakry",
      severity: "moderate",
      status: "resolved",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ];

  const allEvents = [...events, ...demoEvents];
  const allAlerts = [...alerts, ...demoAlerts];

  const handleMapClick = (latlng) => {
    console.log('Clic sur la carte:', latlng);
    setSnackbar({
      open: true,
      message: `Position: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
      severity: 'info'
    });
  };

  const handleLocationFound = (position) => {
    setUserLocation(position);
    setSnackbar({
      open: true,
      message: 'Votre position a été localisée !',
      severity: 'success'
    });
  };

  const handleMarkerClick = (item, type) => {
    setSelectedMarker({ item, type });
    onMarkerClick?.(item, type);
  };

  const handleZoomIn = () => {
    mapRef?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef?.zoomOut();
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFilterChange = (category, type, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const getEventIcon = (type) => {
    const icons = {
      celebration: <Celebration />,
      education: <School />,
      sport: <SportsEsports />,
      music: <MusicNote />,
      food: <Restaurant />,
      business: <Business />,
      charity: <VolunteerActivism />,
      meeting: <Group />,
    };
    return icons[type] || <Event />;
  };

  const getAlertIcon = (type) => {
    const icons = {
      incendie: <LocalFireDepartment />,
      coupure_electricite: <ElectricBolt />,
      route_bloquee: <Construction />,
      personne_disparue: <PersonSearch />,
      tapage_nocturne: <VolumeUp />,
      accident: <LocalHospital />,
      cambriolage: <Lock />,
    };
    return icons[type] || <Warning />;
  };

  const getEventColor = (type) => {
    const colors = {
      celebration: '#1976d2',
      education: '#0288d1',
      sport: '#388e3c',
      music: '#7b1fa2',
      food: '#f57c00',
      business: '#1976d2',
      charity: '#d32f2f',
      meeting: '#0288d1',
    };
    return colors[type] || '#757575';
  };

  const getAlertColor = (type) => {
    const colors = {
      incendie: '#d32f2f',
      coupure_electricite: '#f57c00',
      route_bloquee: '#0288d1',
      personne_disparue: '#d32f2f',
      tapage_nocturne: '#f57c00',
      accident: '#d32f2f',
      cambriolage: '#d32f2f',
    };
    return colors[type] || '#757575';
  };

  const filteredEvents = allEvents.filter(event => 
    filters.events && filters.eventTypes[event.type]
  );

  const filteredAlerts = allAlerts.filter(alert => 
    filters.alerts && filters.alertTypes[alert.type]
  );

  const createCustomIcon = (color, icon) => {
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        ">
          ${icon}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Carte principale */}
      <MapContainer
        center={[9.5370, -13.6785]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={setMapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController onMapClick={handleMapClick} onLocationFound={handleLocationFound} />
        <LocationMarker onLocationFound={handleLocationFound} />

        {/* Marqueurs d'événements */}
        {filteredEvents.map((event) => (
          <Marker
            key={`event-${event.id}`}
            position={[event.latitude, event.longitude]}
            icon={createCustomIcon(getEventColor(event.type), getEventIcon(event.type))}
            eventHandlers={{
              click: () => handleMarkerClick(event, 'event'),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {event.startDate.toLocaleDateString('fr-FR')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={event.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {event.isFree && (
                    <Chip label="Gratuit" size="small" color="success" />
                  )}
                </Box>
                <Typography variant="body2">
                  {event.participants}/{event.maxParticipants} participants
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => handleMarkerClick(event, 'event')}
                >
                  Voir détails
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}

        {/* Marqueurs d'alertes */}
        {filteredAlerts.map((alert) => (
          <Marker
            key={`alert-${alert.id}`}
            position={[alert.latitude, alert.longitude]}
            icon={createCustomIcon(getAlertColor(alert.type), getAlertIcon(alert.type))}
            eventHandlers={{
              click: () => handleMarkerClick(alert, 'alert'),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  {alert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {alert.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={alert.type}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                  <Chip
                    label={alert.severity}
                    size="small"
                    color={alert.severity === 'critique' ? 'error' : 'warning'}
                  />
                </Box>
                <Typography variant="body2" gutterBottom>
                  {alert.createdAt.toLocaleDateString('fr-FR')}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => handleMarkerClick(alert, 'alert')}
                >
                  Voir détails
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}

        {/* Cercle de rayon autour de la position utilisateur */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={filters.radius * 1000} // Convertir en mètres
            pathOptions={{
              color: theme.palette.primary.main,
              fillColor: theme.palette.primary.main,
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}
      </MapContainer>

      {/* Contrôles de la carte */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn />
          </IconButton>
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut />
          </IconButton>
          <IconButton onClick={handleFullscreen} size="small">
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Paper>
      </Box>

      {/* Bouton de géolocalisation */}
      <Fab
        color="primary"
        size="small"
        sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                mapRef?.setView([latitude, longitude], 13);
                setUserLocation([latitude, longitude]);
              },
              (error) => {
                setSnackbar({
                  open: true,
                  message: 'Impossible d\'obtenir votre position',
                  severity: 'error'
                });
              }
            );
          }
        }}
      >
        <MyLocation />
      </Fab>

      {/* Bouton de filtres */}
      <Fab
        color="secondary"
        size="small"
        sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000 }}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FilterList />
      </Fab>

      {/* Panneau de filtres */}
      <Drawer
        anchor="left"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        PaperProps={{
          sx: { width: isMobile ? '100%' : 320 }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtres de la carte
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtres généraux */}
          <Typography variant="subtitle1" gutterBottom>
            Affichage
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.events}
                onChange={(e) => setFilters(prev => ({ ...prev, events: e.target.checked }))}
              />
            }
            label="Événements"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.alerts}
                onChange={(e) => setFilters(prev => ({ ...prev, alerts: e.target.checked }))}
              />
            }
            label="Alertes"
          />

          <Divider sx={{ my: 2 }} />

          {/* Types d'événements */}
          <Typography variant="subtitle1" gutterBottom>
            Types d'événements
          </Typography>
          {Object.entries(filters.eventTypes).map(([type, checked]) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => handleFilterChange('eventTypes', type, e.target.checked)}
                />
              }
              label={type.charAt(0).toUpperCase() + type.slice(1)}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Types d'alertes */}
          <Typography variant="subtitle1" gutterBottom>
            Types d'alertes
          </Typography>
          {Object.entries(filters.alertTypes).map(([type, checked]) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => handleFilterChange('alertTypes', type, e.target.checked)}
                />
              }
              label={type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Rayon de recherche */}
          <Typography variant="subtitle1" gutterBottom>
            Rayon de recherche: {filters.radius} km
          </Typography>
          <Slider
            value={filters.radius}
            onChange={(e, value) => setFilters(prev => ({ ...prev, radius: value }))}
            min={1}
            max={50}
            marks={[
              { value: 1, label: '1km' },
              { value: 10, label: '10km' },
              { value: 25, label: '25km' },
              { value: 50, label: '50km' },
            ]}
          />
        </Box>
      </Drawer>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InteractiveMap; 