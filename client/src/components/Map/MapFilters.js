import React from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close,
  FilterList,
  Clear
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../../store/slices/mapSlice';

const MapFilters = ({ onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.map.filters);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        p: 2,
        minWidth: 280,
        maxHeight: 500,
        overflow: 'auto'
      }}
      elevation={3}
    >
      {/* En-tête */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList />
          <Typography variant="h6">
            Filtres
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Types de contenu */}
      <Typography variant="subtitle2" gutterBottom>
        Types de contenu
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={filters.showAlerts}
              onChange={(e) => handleFilterChange('showAlerts', e.target.checked)}
            />
          }
          label="Alertes"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showEvents}
              onChange={(e) => handleFilterChange('showEvents', e.target.checked)}
            />
          }
          label="Événements"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showHelpRequests}
              onChange={(e) => handleFilterChange('showHelpRequests', e.target.checked)}
            />
          }
          label="Demandes d'aide"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showPosts}
              onChange={(e) => handleFilterChange('showPosts', e.target.checked)}
            />
          }
          label="Posts communautaires"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Filtres spécifiques */}
      {filters.showAlerts && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Gravité des alertes
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Sévérité</InputLabel>
            <Select
              value={filters.alertSeverity}
              onChange={(e) => handleFilterChange('alertSeverity', e.target.value)}
              label="Sévérité"
            >
              <MenuItem value="all">Toutes les sévérités</MenuItem>
              <MenuItem value="low">Faible</MenuItem>
              <MenuItem value="normal">Normale</MenuItem>
              <MenuItem value="high">Élevée</MenuItem>
              <MenuItem value="critical">Critique</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {filters.showEvents && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Type d'événement
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              label="Type"
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="community">Communautaire</MenuItem>
              <MenuItem value="cultural">Culturel</MenuItem>
              <MenuItem value="sport">Sport</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="education">Éducation</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {filters.showHelpRequests && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Type d'aide
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.helpType}
              onChange={(e) => handleFilterChange('helpType', e.target.value)}
              label="Type"
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="medical">Médical</MenuItem>
              <MenuItem value="transport">Transport</MenuItem>
              <MenuItem value="food">Nourriture</MenuItem>
              <MenuItem value="shelter">Logement</MenuItem>
              <MenuItem value="other">Autre</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {filters.showPosts && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Type de post
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.postType}
              onChange={(e) => handleFilterChange('postType', e.target.value)}
              label="Type"
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="community">Communauté</MenuItem>
              <MenuItem value="alert">Alerte</MenuItem>
              <MenuItem value="event">Événement</MenuItem>
              <MenuItem value="help">Aide</MenuItem>
              <MenuItem value="announcement">Annonce</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Rayon de recherche */}
      <Typography variant="subtitle2" gutterBottom>
        Rayon de recherche
      </Typography>
      <Box sx={{ px: 1, mb: 2 }}>
        <Slider
          value={filters.radius}
          onChange={(e, value) => handleFilterChange('radius', value)}
          min={0}
          max={50}
          step={1}
          marks={[
            { value: 0, label: '0km' },
            { value: 10, label: '10km' },
            { value: 25, label: '25km' },
            { value: 50, label: '50km' }
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}km`}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Actions */}
      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleResetFilters}
          fullWidth
        >
          Réinitialiser
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
        >
          Appliquer
        </Button>
      </Box>
    </Paper>
  );
};

export default MapFilters; 