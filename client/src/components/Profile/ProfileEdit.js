import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import { PhotoCamera, Save, Edit } from '@mui/icons-material';
import usersService from '../../services/usersService';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await usersService.getProfile();
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setProfile(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await usersService.updateProfile(profile);
      
      if (response.data.success) {
        setSuccess('Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfile(); // Recharger les données originales
  };

  if (isLoading && !isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mon Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profile.profilePicture}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              color="primary"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={profile.firstName}
              onChange={handleInputChange('firstName')}
              disabled={!isEditing || isLoading}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={profile.lastName}
              onChange={handleInputChange('lastName')}
              disabled={!isEditing || isLoading}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profile.email}
              disabled={true} // Email non modifiable
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={profile.phone}
              onChange={handleInputChange('phone')}
              disabled={!isEditing || isLoading}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Adresse"
              value={profile.address}
              onChange={handleInputChange('address')}
              disabled={!isEditing || isLoading}
              margin="normal"
            />
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={isLoading}
              >
                Changer la photo
              </Button>
            </label>
          </Box>
        )}

        {isEditing && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSaveProfile}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfileEdit; 