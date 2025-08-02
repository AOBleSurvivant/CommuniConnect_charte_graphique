import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Autocomplete,
  Chip,
  Box,
  Typography,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { createConversation } from '../../store/slices/messagesSlice';
import { formatError } from '../../utils/errorHandler';
import LocationSelector from '../common/LocationSelector';

const CreateConversationForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    type: 'private',
    name: '',
    description: '',
    participants: [],
    quartier: '',
    ville: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sélecteurs Redux
  const user = useSelector(state => state.auth.user);
  const users = useSelector(state => state.users?.users || []);

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (open) {
      setFormData({
        type: 'private',
        name: '',
        description: '',
        participants: [],
        quartier: user?.quartier || '',
        ville: user?.ville || ''
      });
      setError('');
    }
  }, [open, user]);

  // Gérer les changements du formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Réinitialiser certains champs selon le type
    if (field === 'type') {
      if (value === 'private') {
        setFormData(prev => ({
          ...prev,
          type: value,
          name: '',
          description: '',
          participants: prev.participants.slice(0, 1) // Garder seulement 1 participant pour privé
        }));
      } else if (value === 'quartier') {
        setFormData(prev => ({
          ...prev,
          type: value,
          name: `Quartier ${prev.quartier}`,
          description: `Conversation du quartier ${prev.quartier} à ${prev.ville}`
        }));
      }
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validation
      if (formData.type === 'private' && formData.participants.length !== 1) {
        throw new Error('Une conversation privée doit avoir exactement un participant');
      }

      if (formData.type === 'group' && formData.participants.length < 2) {
        throw new Error('Une conversation de groupe doit avoir au moins 2 participants');
      }

      if (formData.type === 'quartier' && (!formData.quartier || !formData.ville)) {
        throw new Error('Veuillez spécifier le quartier et la ville');
      }

      // Préparer les données
      const conversationData = {
        type: formData.type,
        participants: formData.participants.map(p => p._id || p.id)
      };

      if (formData.type === 'group') {
        conversationData.name = formData.name;
        conversationData.description = formData.description;
      } else if (formData.type === 'quartier') {
        conversationData.name = formData.name;
        conversationData.description = formData.description;
        conversationData.quartier = formData.quartier;
        conversationData.ville = formData.ville;
      }

      await dispatch(createConversation(conversationData)).unwrap();
      
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la conversation');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les utilisateurs (exclure l'utilisateur actuel)
  const availableUsers = users.filter(u => u._id !== user?.id);

  // Obtenir les options pour les quartiers et villes
  const quartiers = [...new Set(users.map(u => u.quartier).filter(Boolean))];
  const villes = [...new Set(users.map(u => u.ville).filter(Boolean))];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Créer une nouvelle conversation
      </DialogTitle>

      <DialogContent>
        {/* Message d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formatError(error)}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Type de conversation */}
          <FormControl fullWidth>
            <InputLabel>Type de conversation</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              label="Type de conversation"
            >
              <MenuItem value="private">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Conversation privée
                </Box>
              </MenuItem>
              <MenuItem value="group">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon />
                  Groupe
                </Box>
              </MenuItem>
              <MenuItem value="quartier">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  Quartier
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Nom de la conversation (pour groupes et quartiers) */}
          {(formData.type === 'group' || formData.type === 'quartier') && (
            <TextField
              fullWidth
              label="Nom de la conversation"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={formData.type === 'quartier' ? 'Quartier Centre' : 'Mon groupe'}
            />
          )}

          {/* Description (pour groupes et quartiers) */}
          {(formData.type === 'group' || formData.type === 'quartier') && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la conversation..."
            />
          )}

          {/* Sélection des participants */}
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={availableUsers}
              value={formData.participants}
              onChange={(_, newValue) => handleChange('participants', newValue)}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Participants ${formData.type === 'private' ? '(1 max)' : ''}`}
                  placeholder="Sélectionner des utilisateurs..."
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar src={option.avatar} sx={{ width: 24, height: 24, mr: 1 }}>
                    {option.firstName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.quartier}, {option.ville}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option._id}
                    avatar={<Avatar src={option.avatar}>{option.firstName?.charAt(0)}</Avatar>}
                    label={`${option.firstName} ${option.lastName}`}
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </FormControl>

          {/* Champs géographiques pour les conversations de quartier */}
          {formData.type === 'quartier' && (
            <>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary">
                Informations géographiques
              </Typography>
              
              <LocationSelector 
                formData={formData}
                handleInputChange={(e) => {
                  const { name, value } = e.target;
                  handleChange(name, value);
                }}
                showGPS={true}
                required={true}
              />
            </>
          )}

          {/* Informations sur le type de conversation */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formData.type === 'private' && 'Une conversation privée entre deux utilisateurs.'}
              {formData.type === 'group' && 'Un groupe de discussion avec plusieurs participants.'}
              {formData.type === 'quartier' && 'Une conversation communautaire pour un quartier spécifique.'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.participants.length}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Création...' : 'Créer la conversation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateConversationForm; 