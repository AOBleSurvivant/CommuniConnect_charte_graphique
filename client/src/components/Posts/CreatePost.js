import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  useTheme,
  Collapse,
  Alert,
} from '@mui/material';
import {
  PhotoCamera,
  Close,
  Add,
  LocationOn,
  Tag,
  Send,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { formatError } from '../../utils/errorHandler';

const CreatePost = ({ onSubmit, onCancel }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    content: '',
    type: 'information',
    location: '',
    tags: [],
    image: null,
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const postTypes = [
    { value: 'information', label: 'Information', icon: 'ℹ️' },
    { value: 'entraide', label: 'Entraide', icon: '🤝' },
    { value: 'vente', label: 'Vente', icon: '💰' },
    { value: 'alerte', label: 'Alerte', icon: '🚨' },
    { value: 'besoin', label: 'Besoin', icon: '🙏' },
    { value: 'evenement', label: 'Événement', icon: '📅' },
  ];

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('L\'image est trop volumineuse. Taille maximale : 5MB');
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

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      setError('Le contenu de la publication est requis');
      return;
    }

    onSubmit(formData);
    // Reset form
    setFormData({
      content: '',
      type: 'information',
      location: '',
      tags: [],
      image: null,
    });
    setShowAdvanced(false);
    setError('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={user?.avatar}
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: theme.palette.primary.main,
              mr: 2 
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.name || 'Utilisateur'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Créer une publication
            </Typography>
          </Box>
          {onCancel && (
            <IconButton onClick={onCancel} size="small">
              <Close />
            </IconButton>
          )}
        </Box>

        {/* Message d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formatError(error)}
          </Alert>
        )}

        {/* Type de publication */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type de publication</InputLabel>
          <Select
            value={formData.type}
            onChange={handleInputChange('type')}
            label="Type de publication"
          >
            {postTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{type.icon}</span>
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Contenu */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Que voulez-vous partager avec votre communauté ?"
          value={formData.content}
          onChange={handleInputChange('content')}
          onKeyPress={handleKeyPress}
          sx={{ mb: 2 }}
        />

        {/* Image uploadée */}
        {formData.image && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <img
              src={formData.image}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: theme.shape.borderRadius,
              }}
            />
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Options avancées */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ textTransform: 'none' }}
          >
            Options avancées
          </Button>
        </Box>

        <Collapse in={showAdvanced}>
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            
            {/* Localisation */}
            <TextField
              fullWidth
              label="Localisation"
              placeholder="Quartier, commune..."
              value={formData.location}
              onChange={handleInputChange('location')}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />

            {/* Tags */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="Ajouter un tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  InputProps={{
                    startAdornment: <Tag sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  startIcon={<Add />}
                >
                  Ajouter
                </Button>
              </Box>
              
              {/* Tags affichés */}
              {formData.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            color="primary"
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              '&:hover': {
                bgcolor: theme.palette.primary.light + '10',
              },
            }}
          >
            <PhotoCamera />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.content.trim()}
            startIcon={<Send />}
            sx={{ px: 3 }}
          >
            Publier
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost; 