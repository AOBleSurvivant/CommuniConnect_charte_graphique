import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  Favorite,
  FavoriteBorder,
  Report,
  Add,
  FilterList,
  Verified,
  Star,
  Refresh
} from '@mui/icons-material';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  fetchPublications,
  fetchCategories,
  reactToPublication,
  reportPublication,
  selectCategory,
  selectPublications,
  selectCategories,
  selectSelectedCategory,
  selectCommuniConseilLoading,
  selectCommuniConseilError,
  selectCommuniConseilSuccess,
  clearError,
  clearSuccess
} from '../store/slices/communiconseilSlice';

import CreatePublicationDialog from '../components/CommuniConseil/CreatePublicationDialog';
import ContributorApplicationDialog from '../components/CommuniConseil/ContributorApplicationDialog';
import communiconseilService from '../services/communiconseilService';

const CommuniConseil = () => {
  const dispatch = useDispatch();
  const publications = useSelector(selectPublications);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const loading = useSelector(selectCommuniConseilLoading);
  const error = useSelector(selectCommuniConseilError);
  const success = useSelector(selectCommuniConseilSuccess);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    dispatch(fetchPublications());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 5000);
    }
  }, [error, success, dispatch]);

  const handleCategoryChange = (category) => {
    dispatch(selectCategory(category));
  };

  const handleReaction = (publicationId, reaction) => {
    dispatch(reactToPublication({ publicationId, reaction }));
  };

  const handleReport = (publication) => {
    setSelectedPublication(publication);
    setReportDialogOpen(true);
  };

  const submitReport = () => {
    if (selectedPublication && reportReason.trim()) {
      dispatch(reportPublication({
        publicationId: selectedPublication._id,
        reason: reportReason
      }));
      setReportDialogOpen(false);
      setReportReason('');
      setSelectedPublication(null);
    }
  };

  const filteredPublications = selectedCategory
    ? publications.filter(pub => pub.category === selectedCategory)
    : publications;

  const getCategoryColor = (category) => {
    const colors = {
      'Santé': 'error',
      'Droit': 'primary',
      'Administration': 'secondary',
      'Agriculture': 'success',
      'Sécurité': 'warning',
      'Éducation': 'info',
      'Transport': 'default',
      'Commerce': 'success',
      'Environnement': 'success',
      'Technologie': 'primary'
    };
    return colors[category] || 'default';
  };

  const formatDateDisplay = (date) => {
    try {
      return formatDate(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  // Fonction pour charger les données de test
  const handleLoadTestData = () => {
    try {
      communiconseilService.addTestData();
      // Recharger les publications
      dispatch(fetchPublications());
      console.log('✅ Données de test chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données de test:', error);
    }
  };

  if (loading && publications.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom>
            CommuniConseil
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Partagez vos connaissances et conseils
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Bouton pour charger les données de test */}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleLoadTestData}
            sx={{ mr: 1 }}
          >
            Charger données de test
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Créer une publication
          </Button>
        </Box>
      </Box>

      {/* Messages d'erreur/succès */}
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

      {/* Filtres par catégorie */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filtrer par catégorie
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Toutes"
            onClick={() => handleCategoryChange(null)}
            color={selectedCategory === null ? 'primary' : 'default'}
            variant={selectedCategory === null ? 'filled' : 'outlined'}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Publications */}
      <Grid container spacing={3}>
        {filteredPublications.map((publication) => (
          <Grid item xs={12} md={6} lg={4} key={publication._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* En-tête avec catégorie */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={publication.category}
                    color={getCategoryColor(publication.category)}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleReport(publication)}
                    color="error"
                  >
                    <Report />
                  </IconButton>
                </Box>

                {/* Titre */}
                <Typography variant="h6" component="h2" gutterBottom>
                  {publication.title}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {publication.description}
                </Typography>

                {/* Auteur */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                    {publication.author?.name ? publication.author.name.charAt(0) : '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      {publication.author?.name || 'Auteur inconnu'}
                      {publication.author?.verified && (
                        <Verified color="primary" sx={{ ml: 0.5, fontSize: 16 }} />
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {publication.author?.region || 'Région inconnue'} • {publication.author?.expertise || 'Expertise inconnue'}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="caption">
                      {publication.author?.reliabilityScore || 0}%
                    </Typography>
                  </Box>
                </Box>

                {/* Date */}
                <Typography variant="caption" color="text.secondary">
                  {formatDateDisplay(publication.createdAt || new Date())}
                </Typography>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Button
                    size="small"
                    startIcon={(publication.reactions?.thanks || 0) > 0 ? <ThumbUp /> : <ThumbUpOutlined />}
                    onClick={() => handleReaction(publication._id, 'thanks')}
                  >
                    Merci ({(publication.reactions?.thanks || 0)})
                  </Button>
                  <Button
                    size="small"
                    startIcon={(publication.reactions?.useful || 0) > 0 ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => handleReaction(publication._id, 'useful')}
                  >
                    Utile ({(publication.reactions?.useful || 0)})
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bouton flottant pour créer une publication */}
      <Tooltip title="Créer une publication">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Bouton pour demander à devenir contributeur */}
      <Tooltip title="Devenir contributeur">
        <Fab
          color="secondary"
          aria-label="apply"
          sx={{ position: 'fixed', bottom: 16, right: 80 }}
          onClick={() => setApplyDialogOpen(true)}
        >
          <Verified />
        </Fab>
      </Tooltip>

      {/* Dialog de création de publication */}
      <CreatePublicationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        categories={categories}
      />

      {/* Dialog de demande de contributeur */}
      <ContributorApplicationDialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
      />

      {/* Dialog de signalement */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Signaler une publication</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Raison du signalement"
            fullWidth
            multiline
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Expliquez pourquoi vous signalez cette publication..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Annuler</Button>
          <Button onClick={submitReport} color="error">
            Signaler
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommuniConseil; 