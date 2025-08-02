import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  FormHelperText,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  VideoCall as VideoCallIcon,
  MyLocation as MyLocationIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Celebration as CelebrationIcon,
  School as SchoolIcon,
  SportsEsports as SportsIcon,
  MusicNote as MusicIcon,
  Restaurant as FoodIcon,
  Business as BusinessIcon,
  VolunteerActivism as CharityIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createLivestream, clearError, clearSuccess } from '../../store/slices/livestreamsSlice';
import { formatError } from '../../utils/errorHandler';
import LocationSelector from '../common/LocationSelector';

const CreateLivestreamForm = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.livestreams);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'live',
    category: 'general',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    maxViewers: 100,
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    // Correction: initialiser avec des valeurs vides pour éviter les erreurs MUI
    region: '',
    prefecture: '',
    commune: '',
    quartier: '',
    location: {
      region: '',
      prefecture: '',
      commune: '',
      quartier: '',
      address: '',
      coordinates: {
        latitude: 9.537,
        longitude: -13.6785
      }
    }
  });

  const [errors, setErrors] = useState({});

  // Pré-remplir la localisation de l'utilisateur
  useEffect(() => {
    if (user?.region) {
      setFormData(prev => ({
        ...prev,
        region: user.region || '',
        prefecture: user.prefecture || '',
        commune: user.commune || '',
        quartier: user.quartier || '',
        address: user.address || '',
        latitude: user.latitude || '',
        longitude: user.longitude || ''
      }));
    }
  }, [user]);

  // Nettoyer les messages d'erreur/succès
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length > 80) {
      newErrors.title = 'Le titre ne peut pas dépasser 80 caractères';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'La description ne peut pas dépasser 200 caractères';
    }

    if (!formData.type) {
      newErrors.type = 'Le type de live est requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La localisation est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const livestreamData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      urgency: formData.urgency,
      visibility: formData.visibility,
      scheduledAt: formData.scheduledAt,
      location: {
        region: formData.region,
        prefecture: formData.prefecture,
        commune: formData.commune,
        quartier: formData.quartier,
        address: formData.address,
        coordinates: {
          latitude: parseFloat(formData.latitude) || null,
          longitude: parseFloat(formData.longitude) || null
        }
      }
    };

    await dispatch(createLivestream(livestreamData));
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        type: '',
        urgency: 'medium',
        visibility: 'quartier',
        scheduledAt: '',
        region: user?.region || '',
        prefecture: user?.prefecture || '',
        commune: user?.commune || '',
        quartier: user?.quartier || '',
        address: user?.address || '',
        latitude: user?.latitude || '',
        longitude: user?.longitude || ''
      });
      setErrors({});
      onClose();
    }
  };

  const livestreamTypes = [
    { value: 'community', label: 'Communauté', icon: <GroupIcon />, color: 'primary' },
    { value: 'education', label: 'Éducation', icon: <SchoolIcon />, color: 'info' },
    { value: 'entertainment', label: 'Divertissement', icon: <CelebrationIcon />, color: 'secondary' },
    { value: 'sports', label: 'Sport', icon: <SportsIcon />, color: 'success' },
    { value: 'music', label: 'Musique', icon: <MusicIcon />, color: 'secondary' },
    { value: 'food', label: 'Cuisine', icon: <FoodIcon />, color: 'warning' },
    { value: 'business', label: 'Business', icon: <BusinessIcon />, color: 'primary' },
    { value: 'charity', label: 'Charité', icon: <CharityIcon />, color: 'error' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Faible', color: 'success' },
    { value: 'medium', label: 'Moyenne', color: 'warning' },
    { value: 'high', label: 'Élevée', color: 'error' },
    { value: 'urgent', label: 'Urgente', color: 'error' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <PublicIcon />, description: 'Visible par tous' },
    { value: 'quartier', label: 'Quartier', icon: <GroupIcon />, description: 'Visible par le quartier' },
    { value: 'commune', label: 'Commune', icon: <GroupIcon />, description: 'Visible par la commune' },
    { value: 'private', label: 'Privé', icon: <GroupIcon />, description: 'Sur invitation uniquement' },
  ];

  const getTypeInfo = (type) => {
    return livestreamTypes.find(t => t.value === type) || {};
  };

  const getUrgencyInfo = (urgency) => {
    return urgencyLevels.find(u => u.value === urgency) || {};
  };

  const getVisibilityInfo = (visibility) => {
    return visibilityOptions.find(v => v.value === visibility) || {};
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VideoCallIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Créer un livestream
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Messages d'erreur/succès */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formatError(error)}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Type de livestream */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type de livestream *</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="Type de livestream *"
              >
                {livestreamTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: `${type.color}.main` }}>
                        {type.icon}
                      </Box>
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Niveau d'urgence */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Niveau d'urgence</InputLabel>
              <Select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                label="Niveau d'urgence"
              >
                {urgencyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={level.label}
                        size="small"
                        color={level.color}
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Titre */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Titre du livestream *"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Ex: Réunion de quartier en direct"
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Décrivez le contenu de votre livestream..."
            />
          </Grid>

          {/* Date et heure */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date et heure prévues"
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* Visibilité */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Visibilité</InputLabel>
              <Select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                label="Visibilité"
              >
                {visibilityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      <Box>
                        <Typography variant="body2">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Localisation */}
          <Grid item xs={12}>
            <LocationSelector 
              formData={formData}
              handleInputChange={handleInputChange}
              showGPS={true}
              required={true}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          color="primary"
          sx={{ px: 3 }}
        >
          {loading ? 'Création...' : 'Créer le livestream'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLivestreamForm; 