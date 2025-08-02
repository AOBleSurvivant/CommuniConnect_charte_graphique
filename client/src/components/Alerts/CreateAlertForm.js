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
  Warning,
  LocationOn,
  MyLocation,
  PhotoCamera,
  Send,
} from '@mui/icons-material';
import LocationSelector from '../common/LocationSelector';

const CreateAlertForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'urgence',
    urgency: 'medium',
    visibility: 'quartier',
    scheduledAt: '',
    // Correction: initialiser avec des valeurs vides pour éviter les erreurs MUI
    region: '',
    prefecture: '',
    commune: '',
    quartier: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});
  const [locationStatus, setLocationStatus] = useState('idle');

  const alertTypes = [
    { value: 'security', label: 'Sécurité', color: 'error' },
    { value: 'health', label: 'Santé', color: 'warning' },
    { value: 'traffic', label: 'Trafic', color: 'info' },
    { value: 'weather', label: 'Météo', color: 'secondary' },
    { value: 'infrastructure', label: 'Infrastructure', color: 'default' },
    { value: 'other', label: 'Autre', color: 'default' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Faible', color: 'success' },
    { value: 'medium', label: 'Moyenne', color: 'warning' },
    { value: 'high', label: 'Élevée', color: 'error' },
    { value: 'critical', label: 'Critique', color: 'error' }
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

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.type) {
      newErrors.type = 'Le type d\'alerte est requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La localisation est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
          <Warning color="error" />
          Créer une alerte
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de l'alerte
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'alerte *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Ex: Accident de circulation sur la route principale"
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
                helperText={errors.description}
                placeholder="Décrivez en détail la situation, les risques et les recommandations..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Type d'alerte *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type d'alerte *"
                >
                  <MenuItem value="">
                    <em>Sélectionnez un type</em>
                  </MenuItem>
                  {alertTypes.map((type) => (
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
              <FormControl fullWidth>
                <InputLabel>Niveau de gravité</InputLabel>
                <Select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  label="Niveau de gravité"
                >
                  {severityLevels.map((level) => (
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

            {/* Localisation */}
            <Grid item xs={12}>
              <LocationSelector 
                formData={formData}
                handleInputChange={handleInputChange}
                showGPS={true}
                required={true}
              />
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
                color="error"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={<Send />}
              >
                {loading ? 'Envoi en cours...' : 'Publier l\'alerte'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAlertForm; 