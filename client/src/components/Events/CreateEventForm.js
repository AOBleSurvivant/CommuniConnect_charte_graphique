import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Event,
  LocationOn,
  PhotoCamera,
  Send,
} from '@mui/icons-material';
import LocationSelector from '../common/LocationSelector';

const CreateEventForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'reunion',
    category: 'communautaire',
    date: '',
    time: '',
    venue: '',
    address: '',
    latitude: 9.537,
    longitude: -13.6785,
    capacity: 50,
    maxParticipants: '',
    contactPhone: '',
    isFree: true,
    price: { amount: 0, currency: 'GNF' },
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
      venue: '',
      coordinates: {
        latitude: 9.537,
        longitude: -13.6785
      }
    }
  });

  const [errors, setErrors] = useState({});

  // Types d'événements correspondant au backend
  const eventTypes = [
    { value: 'reunion', label: 'Réunion', color: 'primary' },
    { value: 'formation', label: 'Formation', color: 'secondary' },
    { value: 'nettoyage', label: 'Nettoyage', color: 'success' },
    { value: 'festival', label: 'Festival', color: 'info' },
    { value: 'sport', label: 'Sport', color: 'warning' },
    { value: 'culture', label: 'Culture', color: 'default' },
    { value: 'sante', label: 'Santé', color: 'error' },
    { value: 'education', label: 'Éducation', color: 'primary' },
    { value: 'autre', label: 'Autre', color: 'default' }
  ];

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

  const validateForm = () => {
    const newErrors = {};

    // Validation du titre
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }

    // Validation de la description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'La description ne peut pas dépasser 2000 caractères';
    }

    // Validation du type
    if (!formData.type) {
      newErrors.type = 'Le type d\'événement est requis';
    }

    // Validation de la date
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'La date ne peut pas être dans le passé';
      }
    }

    // Validation de l'heure
    if (!formData.time) {
      newErrors.time = 'L\'heure est requise';
    }

    // Validation de la localisation
    if (!formData.region.trim()) {
      newErrors.region = 'La région est requise';
    }
    if (!formData.prefecture.trim()) {
      newErrors.prefecture = 'La préfecture est requise';
    }
    if (!formData.commune.trim()) {
      newErrors.commune = 'La commune est requise';
    }
    if (!formData.quartier.trim()) {
      newErrors.quartier = 'Le quartier est requis';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    // Validation des coordonnées GPS
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Les coordonnées GPS sont requises';
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        newErrors.location = 'Les coordonnées GPS sont invalides';
      } else if (lat < 7.1935 || lat > 12.6769 || lng < -15.0820 || lng > -7.6411) {
        newErrors.location = 'Les coordonnées doivent être dans les limites de la Guinée';
      }
    }

    // Validation du nombre de participants
    if (formData.maxParticipants) {
      const participants = parseInt(formData.maxParticipants);
      if (isNaN(participants) || participants < 1 || participants > 10000) {
        newErrors.maxParticipants = 'Le nombre de participants doit être entre 1 et 10000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validation du formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Formatage des données pour l'API
    const formattedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      category: formData.category,
      startDate: formData.date,
      endDate: formData.date, // Même date pour l'instant
      venue: formData.address.trim(),
      address: formData.address.trim(),
      latitude: parseFloat(formData.latitude) || 9.5370,
      longitude: parseFloat(formData.longitude) || -13.6785,
      capacity: parseInt(formData.maxParticipants) || 50,
      maxParticipants: parseInt(formData.maxParticipants) || 50,
      contactPhone: formData.contactPhone.trim(),
      isFree: formData.isFree,
      price: formData.isFree ? { amount: 0, currency: 'GNF' } : formData.price,
      location: {
        region: formData.region || 'Conakry',
        prefecture: formData.prefecture || 'Conakry',
        commune: formData.commune || 'Kaloum',
        quartier: formData.quartier || 'Centre',
        address: formData.address.trim(),
        venue: formData.address.trim(),
        coordinates: {
          latitude: parseFloat(formData.latitude) || 9.5370,
          longitude: parseFloat(formData.longitude) || -13.6785
        }
      }
    };

    // Appel de la fonction onSubmit passée en props
    if (onSubmit) {
      onSubmit(formattedData);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'L\'image est trop volumineuse (max 5MB)' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Event color="primary" />
          Créer un événement
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de l'événement
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'événement *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title || 'Entre 5 et 100 caractères'}
                placeholder="Ex: Fête de quartier de Kaloum"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description détaillée *"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description || 'Entre 10 et 2000 caractères'}
                placeholder="Décrivez votre événement, le programme, les activités prévues..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Type d'événement *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type d'événement *"
                >
                  <MenuItem value="">
                    <em>Sélectionnez un type</em>
                  </MenuItem>
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={type.label} 
                          size="small" 
                          color={type.color} 
                          variant="outlined"
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <Typography variant="caption" color="error">
                    {errors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone de contact"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Ex: 22412345678"
              />
            </Grid>

            {/* Date et heure */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heure *"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                error={!!errors.time}
                helperText={errors.time}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre max de participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                placeholder="Ex: 100"
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants || 'Entre 1 et 10000'}
                InputProps={{
                  endAdornment: <InputAdornment position="end">personnes</InputAdornment>,
                }}
              />
            </Grid>

            {/* Localisation */}
            <Grid item xs={12}>
              <LocationSelector 
                formData={formData}
                handleInputChange={handleInputChange}
                showGPS={true}
                required={true}
              />
              {errors.location && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.location}
                </Alert>
              )}
            </Grid>

            {/* Image optionnelle */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Image (optionnel)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: 2 }}
                >
                  Ajouter une image
                </Button>
              </label>
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={formData.image} 
                    alt="Aperçu" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
              {errors.image && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.image}
                </Alert>
              )}
            </Grid>

            {/* Bouton de soumission */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={<Send />}
              >
                {loading ? 'Envoi en cours...' : 'Publier l\'événement'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateEventForm; 