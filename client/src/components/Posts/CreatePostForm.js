import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert
} from '@mui/material';
import {
  Send,
  Image,
  VideoLibrary,
  AttachFile,
  Close,
  Edit
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, clearError, clearSuccess } from '../../store/slices/postsSlice';
import { formatError } from '../../utils/errorHandler';
import LocationSelector from '../common/LocationSelector';

const CreatePostForm = ({ open, onClose, editPost = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.posts);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    category: 'communautaire',
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

  const [mediaFiles, setMediaFiles] = useState([]);

  // Initialiser le formulaire avec les données du post à éditer
  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title || '',
        content: editPost.content,
        type: editPost.type,
        category: editPost.category || 'communautaire',
        isPublic: editPost.isPublic,
        allowComments: editPost.allowComments,
        allowReactions: editPost.allowReactions,
        region: editPost.location?.region || '',
        prefecture: editPost.location?.prefecture || '',
        commune: editPost.location?.commune || '',
        quartier: editPost.location?.quartier || '',
        address: editPost.location?.address || '',
        latitude: editPost.location?.coordinates?.latitude || '',
        longitude: editPost.location?.coordinates?.longitude || '',
        location: {
          region: editPost.location?.region || '',
          prefecture: editPost.location?.prefecture || '',
          commune: editPost.location?.commune || '',
          quartier: editPost.location?.quartier || '',
          address: editPost.location?.address || '',
          coordinates: {
            latitude: editPost.location?.coordinates?.latitude || '',
            longitude: editPost.location?.coordinates?.longitude || ''
          }
        }
      });
      setMediaFiles(editPost.media || []);
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'general',
        category: 'communautaire',
        isPublic: true,
        allowComments: true,
        allowReactions: true,
        region: user?.region || '',
        prefecture: user?.prefecture || '',
        commune: user?.commune || '',
        quartier: user?.quartier || '',
        address: user?.address || '',
        latitude: user?.latitude || '',
        longitude: user?.longitude || '',
        location: {
          region: user?.region || '',
          prefecture: user?.prefecture || '',
          commune: user?.commune || '',
          quartier: user?.quartier || '',
          address: user?.address || '',
          coordinates: {
            latitude: user?.latitude || '',
            longitude: user?.longitude || ''
          }
        }
      });
      setMediaFiles([]);
    }
  }, [editPost, user]);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      return;
    }

    const postData = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      category: formData.category,
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
      },
      isPublic: formData.isPublic,
      allowComments: formData.allowComments,
      allowReactions: formData.allowReactions,
      media: mediaFiles
    };

    if (editPost) {
      await dispatch(updatePost({ id: editPost._id, postData }));
    } else {
      await dispatch(createPost(postData));
    }

    if (!error) {
      setFormData({
        title: '',
        content: '',
        type: 'general',
        category: 'communautaire',
        isPublic: true,
        allowComments: true,
        allowReactions: true,
        region: user?.region || '',
        prefecture: user?.prefecture || '',
        commune: user?.commune || '',
        quartier: user?.quartier || '',
        address: user?.address || '',
        latitude: user?.latitude || '',
        longitude: user?.longitude || '',
        location: {
          region: user?.region || '',
          prefecture: user?.prefecture || '',
          commune: user?.commune || '',
          quartier: user?.quartier || '',
          address: user?.address || '',
          coordinates: {
            latitude: user?.latitude || '',
            longitude: user?.longitude || ''
          }
        }
      });
      setMediaFiles([]);
      onClose();
    }
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const postTypes = [
    { value: 'community', label: 'Communautaire', color: 'primary' },
    { value: 'news', label: 'Actualités', color: 'info' },
    { value: 'event', label: 'Événement', color: 'secondary' },
    { value: 'help', label: 'Demande d\'aide', color: 'warning' },
    { value: 'announcement', label: 'Annonce', color: 'success' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {editPost ? 'Modifier le post' : 'Créer un nouveau post'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formatError(error)}
            </Alert>
          )}

          {/* Contenu du post */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Que voulez-vous partager ?"
            value={formData.content}
            onChange={handleInputChange}
            name="content"
            placeholder="Partagez vos pensées, actualités, événements..."
            sx={{ mb: 3 }}
          />

          {/* Type de post */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Type de post</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Type de post"
            >
              {postTypes.map((type) => (
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
          </FormControl>

          {/* Localisation */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Localisation
            </Typography>
            <LocationSelector 
              formData={formData}
              handleInputChange={handleInputChange}
              showGPS={true}
              required={false}
            />
          </Box>

          {/* Médias */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Médias (optionnel)
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <input
                accept="image/*,video/*"
                style={{ display: 'none' }}
                id="media-upload"
                type="file"
                multiple
                onChange={handleMediaUpload}
              />
              <label htmlFor="media-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Image />}
                >
                  Photos/Vidéos
                </Button>
              </label>
            </Box>

            {/* Aperçu des médias */}
            {mediaFiles.length > 0 && (
              <Grid container spacing={1}>
                {mediaFiles.map((file, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Media ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                        onClick={() => removeMedia(index)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Paramètres de visibilité */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Visibilité</InputLabel>
            <Select
              name="isPublic"
              value={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.value }))}
              label="Visibilité"
            >
              <MenuItem value={true}>Public</MenuItem>
              <MenuItem value={false}>Privé</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.content.trim()}
            startIcon={<Send />}
          >
            {loading ? 'Publication...' : (editPost ? 'Modifier' : 'Publier')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostForm; 