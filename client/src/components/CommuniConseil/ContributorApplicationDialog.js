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
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { applyForContributor, selectCommuniConseilLoading, selectCommuniConseilError } from '../../store/slices/communiconseilSlice';

const steps = ['Informations personnelles', 'Expertise', 'Validation'];

const ContributorApplicationDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectCommuniConseilLoading);
  const error = useSelector(selectCommuniConseilError);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    expertise: '',
    phone: '',
    email: ''
  });

  const regions = [
    'Conakry', 'Boké', 'Faranah', 'Kankan', 'Kindia', 
    'Labé', 'Mamou', 'Nzérékoré', 'Kouroussa', 'Kissidougou'
  ];

  const expertises = [
    'Administration publique',
    'Médecine générale',
    'Droit civil',
    'Droit pénal',
    'Agriculture',
    'Éducation',
    'Sécurité',
    'Transport',
    'Commerce',
    'Environnement',
    'Technologie',
    'Autre'
  ];

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (formData.name.trim() && formData.region && formData.expertise.trim()) {
      try {
        await dispatch(applyForContributor(formData)).unwrap();
        setFormData({ name: '', region: '', expertise: '', phone: '', email: '' });
        setActiveStep(0);
        onClose();
      } catch (error) {
        // L'erreur sera gérée par le slice
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', region: '', expertise: '', phone: '', email: '' });
      setActiveStep(0);
      onClose();
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.name.trim() && formData.region;
      case 1:
        return formData.expertise.trim();
      case 2:
        return formData.name.trim() && formData.region && formData.expertise.trim();
      default:
        return false;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Commençons par vos informations personnelles. Ces données nous permettront 
              de vérifier votre identité et votre expertise.
            </Typography>

            <TextField
              autoFocus
              margin="dense"
              label="Nom complet"
              fullWidth
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Votre nom et prénom"
              disabled={loading}
            />

            <FormControl fullWidth margin="dense" disabled={loading}>
              <InputLabel>Région</InputLabel>
              <Select
                value={formData.region}
                onChange={handleChange('region')}
                label="Région"
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Téléphone (optionnel)"
              fullWidth
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="Votre numéro de téléphone"
              disabled={loading}
            />

            <TextField
              margin="dense"
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="votre.email@exemple.com"
              disabled={loading}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Décrivez votre domaine d'expertise. Cela nous aidera à évaluer 
              la pertinence de vos contributions.
            </Typography>

            <FormControl fullWidth margin="dense" disabled={loading}>
              <InputLabel>Domaine d'expertise</InputLabel>
              <Select
                value={formData.expertise}
                onChange={handleChange('expertise')}
                label="Domaine d'expertise"
              >
                {expertises.map((expertise) => (
                  <MenuItem key={expertise} value={expertise}>
                    {expertise}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              * Vous devrez fournir une pièce d'identité valide (CNI ou passeport) 
              lors de la validation de votre demande.
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vérifiez vos informations avant de soumettre votre demande.
            </Typography>

            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Informations personnelles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nom: {formData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Région: {formData.region}
              </Typography>
              {formData.phone && (
                <Typography variant="body2" color="text.secondary">
                  Téléphone: {formData.phone}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Email: {formData.email}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Expertise
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Domaine: {formData.expertise}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Votre demande sera examinée par notre équipe. 
              Vous recevrez une notification par email une fois la décision prise.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Devenir contributeur CommuniConseil
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Retour
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
              disabled={!isStepValid(activeStep) || loading}
            >
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={!isStepValid(activeStep) || loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Soumission...' : 'Soumettre la demande'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ContributorApplicationDialog; 