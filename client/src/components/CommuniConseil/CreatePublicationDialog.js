import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { createPublication, selectCommuniConseilLoading, selectCommuniConseilError } from '../../store/slices/communiconseilSlice';

const CreatePublicationDialog = ({ open, onClose, categories }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectCommuniConseilLoading);
  const error = useSelector(selectCommuniConseilError);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (formData.title.trim() && formData.category && formData.description.trim()) {
      try {
        await dispatch(createPublication(formData)).unwrap();
        setFormData({ title: '', category: '', description: '' });
        onClose();
      } catch (error) {
        // L'erreur sera gérée par le slice
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ title: '', category: '', description: '' });
      onClose();
    }
  };

  const isValid = formData.title.trim().length >= 10 && 
                 formData.category && 
                 formData.description.trim().length >= 50;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Créer une nouvelle publication
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Partagez vos connaissances et conseils avec la communauté. 
            Votre publication sera visible par tous les utilisateurs.
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Titre de la publication"
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Ex: Comment obtenir un acte de naissance rapidement"
            helperText={`${formData.title.length}/200 caractères (minimum 10)`}
            error={formData.title.length > 0 && formData.title.length < 10}
            disabled={loading}
          />

          <FormControl fullWidth margin="dense" disabled={loading}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={formData.category}
              onChange={handleChange('category')}
              label="Catégorie"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={6}
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Décrivez en détail votre conseil ou information..."
            helperText={`${formData.description.length} caractères (minimum 50)`}
            error={formData.description.length > 0 && formData.description.length < 50}
            disabled={loading}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            * Seuls les contributeurs vérifiés peuvent publier. 
            Si vous n'êtes pas encore contributeur, utilisez le bouton "Devenir contributeur".
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Création...' : 'Créer la publication'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePublicationDialog; 