import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Fab,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Dialog,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  LiveTv as LiveTvIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingIcon,
  NearMe as NearMeIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchLivestreams,
  fetchLiveStreams,
  fetchScheduledStreams,
  fetchAlertStreams,
  fetchCommunityStreams,
  startLivestream,
  joinLivestream,
  setFilters,
  clearFilters,
  clearError,
  clearSuccess
} from '../../store/slices/livestreamsSlice';
import { formatError } from '../../utils/errorHandler';
import LivestreamCard from '../../components/Livestreams/LivestreamCard';
import CreateLivestreamForm from '../../components/Livestreams/CreateLivestreamForm';
import LivestreamPlayer from '../../components/Livestreams/LivestreamPlayer';

const LivestreamsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const {
    livestreams,
    liveStreams,
    scheduledStreams,
    alertStreams,
    communityStreams,
    loading,
    error,
    success,
    filters
  } = useSelector(state => state.livestreams);

  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLivestream, setSelectedLivestream] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les lives au montage et quand les filtres changent
  useEffect(() => {
    dispatch(fetchLivestreams(filters));
    dispatch(fetchLiveStreams());
    dispatch(fetchScheduledStreams());
    dispatch(fetchAlertStreams());
    
    // Charger les lives de la communauté de l'utilisateur
    if (user?.location) {
      dispatch(fetchCommunityStreams({
        quartier: user.location.quartier,
        commune: user.location.commune,
        prefecture: user.location.prefecture
      }));
    }
  }, [dispatch, filters, user]);

  // Nettoyer les messages d'erreur/succès
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setFilters({ search: '' }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateLivestream = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleLivestreamClick = (livestream) => {
    setSelectedLivestream(livestream);
  };

  const handleClosePlayer = () => {
    setSelectedLivestream(null);
  };

  const handleStartLivestream = async (livestream) => {
    try {
      await dispatch(startLivestream(livestream.id || livestream._id)).unwrap();
      // Recharger les données après le démarrage
      dispatch(fetchLivestreams(filters));
      dispatch(fetchLiveStreams());
      dispatch(fetchScheduledStreams());
    } catch (error) {
      console.error('Erreur lors du démarrage du live:', error);
    }
  };

  const handleJoinLivestream = async (livestream) => {
    try {
      await dispatch(joinLivestream(livestream.id || livestream._id)).unwrap();
      // Ouvrir le lecteur après avoir rejoint
      setSelectedLivestream(livestream);
    } catch (error) {
      console.error('Erreur lors de la connexion au live:', error);
    }
  };

  const handleLikeLivestream = (livestreamId) => {
    // TODO: Implémenter la fonctionnalité de like
    console.log('Like livestream:', livestreamId);
  };

  const handleReportLivestream = (livestreamId) => {
    // TODO: Implémenter la fonctionnalité de signalement
    console.log('Report livestream:', livestreamId);
  };

  const getCurrentStreams = () => {
    switch (tabValue) {
      case 0: return livestreams || [];
      case 1: return liveStreams || [];
      case 2: return scheduledStreams || [];
      case 3: return alertStreams || [];
      case 4: return communityStreams || [];
      default: return livestreams || [];
    }
  };

  const getTabLabel = (index) => {
    switch (index) {
      case 0: return `Tous (${livestreams.length})`;
      case 1: return `En direct (${liveStreams.length})`;
      case 2: return `Programmés (${scheduledStreams.length})`;
      case 3: return `Alertes (${alertStreams.length})`;
      case 4: return `Ma communauté (${communityStreams.length})`;
      default: return 'Tous';
    }
  };

  const urgencyColors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  };

  const typeIcons = {
    alert: <WarningIcon />,
    event: <EventIcon />,
    meeting: <GroupIcon />,
    sensitization: <TrendingIcon />,
    community: <NearMeIcon />
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Lives Communautaires
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Diffusez et suivez les événements locaux en direct
        </Typography>
      </Box>

      {/* Messages d'erreur/succès */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {formatError(error)}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
          {success}
        </Alert>
      )}

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher un live..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                size="small"
              >
                Filtres
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => dispatch(fetchLivestreams(filters))}
                size="small"
              >
                Actualiser
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateLivestream}
                size="small"
                sx={{ ml: 'auto' }}
              >
                Nouveau Live
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filtres avancés */}
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="">Tous</MenuItem>
                    <MenuItem value="alert">Alerte</MenuItem>
                    <MenuItem value="event">Événement</MenuItem>
                    <MenuItem value="meeting">Réunion</MenuItem>
                    <MenuItem value="sensitization">Sensibilisation</MenuItem>
                    <MenuItem value="community">Communautaire</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Urgence</InputLabel>
                  <Select
                    value={filters.urgency}
                    onChange={(e) => handleFilterChange('urgency', e.target.value)}
                    label="Urgence"
                  >
                    <MenuItem value="">Toutes</MenuItem>
                    <MenuItem value="low">Faible</MenuItem>
                    <MenuItem value="medium">Moyenne</MenuItem>
                    <MenuItem value="high">Élevée</MenuItem>
                    <MenuItem value="critical">Critique</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quartier"
                  value={filters.quartier}
                  onChange={(e) => handleFilterChange('quartier', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Commune"
                  value={filters.commune}
                  onChange={(e) => handleFilterChange('commune', e.target.value)}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                size="small"
              >
                Effacer les filtres
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Onglets */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={getTabLabel(0)} />
          <Tab 
            label={getTabLabel(1)} 
            icon={<LiveTvIcon />}
            iconPosition="start"
          />
          <Tab 
            label={getTabLabel(2)} 
            icon={<ScheduleIcon />}
            iconPosition="start"
          />
          <Tab 
            label={getTabLabel(3)} 
            icon={<WarningIcon />}
            iconPosition="start"
          />
          <Tab 
            label={getTabLabel(4)} 
            icon={<NearMeIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      <Box sx={{ minHeight: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {getCurrentStreams().length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <VideocamOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aucun live trouvé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tabValue === 1 ? 'Aucun live en direct pour le moment' :
                     tabValue === 2 ? 'Aucun live programmé' :
                     tabValue === 3 ? 'Aucune alerte en direct' :
                     tabValue === 4 ? 'Aucun live dans votre communauté' :
                     'Aucun live disponible'}
                  </Typography>
                  {tabValue === 0 && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateLivestream}
                      sx={{ mt: 2 }}
                    >
                      Créer le premier live
                    </Button>
                  )}
                </Paper>
              </Grid>
            ) : (
              (getCurrentStreams() || []).map((livestream, index) => (
                <Grid item xs={12} sm={6} md={4} key={livestream._id || livestream.id || `livestream-${index}`}>
                  <LivestreamCard
                    livestream={livestream}
                    onClick={() => handleLivestreamClick(livestream)}
                    onStart={handleStartLivestream}
                    onJoin={handleJoinLivestream}
                    onLike={handleLikeLivestream}
                    onReport={handleReportLivestream}
                  />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>

      {/* Formulaire de création */}
      <CreateLivestreamForm
        open={showCreateForm}
        onClose={handleCloseCreateForm}
      />

      {/* Lecteur de live */}
      {selectedLivestream && (
        <Dialog
          open={!!selectedLivestream}
          onClose={handleClosePlayer}
          maxWidth="xl"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 2,
              minHeight: isMobile ? '100vh' : '80vh',
              backgroundColor: 'black'
            }
          }}
        >
        <LivestreamPlayer
          livestream={selectedLivestream}
          onClose={handleClosePlayer}
        />
        </Dialog>
      )}

      {/* Bouton flottant pour mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="nouveau live"
          onClick={handleCreateLivestream}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default LivestreamsPage; 