import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  useTheme,
  Fade,
  Grow,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  LocationOn,
  School,
  Work,
  CheckCircle,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { register } from '../../store/slices/authSlice';
import LocationSelector from '../../components/Auth/LocationSelector';
import { formatError } from '../../utils/errorHandler';

const steps = ['Informations personnelles', 'Localisation', 'Sécurité'];

const RegisterPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profession: '',
    
    // Localisation
    region: '',
    prefecture: '',
    commune: '',
    quartier: '',
    address: '',
    latitude: '',
    longitude: '',
    
    // Sécurité
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Vérifier que tous les champs requis sont remplis
    if (!formData.dateOfBirth || !formData.gender) {
      alert('Veuillez remplir votre date de naissance et votre genre');
      return;
    }
    
    // Vérifier que toutes les données de localisation sont remplies
    if (!formData.region || !formData.prefecture || !formData.commune || !formData.quartier) {
      alert('Veuillez sélectionner votre localisation complète (région, préfecture, commune, quartier)');
      return;
    }
    
    try {
      const result = await dispatch(register(formData)).unwrap();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      alert(error.message || 'Erreur lors de l\'inscription');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth && formData.gender;
      case 1:
        return formData.region && formData.prefecture && formData.commune && formData.quartier && formData.latitude && formData.longitude;
      case 2:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      default:
        return false;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro de téléphone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                inputProps={{
                  max: new Date().toISOString().split('T')[0], // Empêche les dates futures
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Genre"
                >
                  <MenuItem value="Homme">Homme</MenuItem>
                  <MenuItem value="Femme">Femme</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <LocationSelector 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={
                  formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                    ? 'Les mots de passe ne correspondent pas'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  En créant un compte, vous acceptez nos{' '}
                  <MuiLink href="/terms" underline="hover">
                    conditions d'utilisation
                  </MuiLink>{' '}
                  et notre{' '}
                  <MuiLink href="/privacy" underline="hover">
                    politique de confidentialité
                  </MuiLink>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: 4,
        px: 2,
      }}
    >
      <Grow in timeout={800}>
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            boxShadow: theme.shadows[16],
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* En-tête */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Rejoignez CommuniConnect
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Créez votre compte et connectez-vous à votre communauté
              </Typography>
            </Box>

            {/* Messages d'erreur */}
            {error && (
              <Fade in timeout={300}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {formatError(error)}
                </Alert>
              </Fade>
            )}

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Formulaire */}
            <Box component="form" onSubmit={handleSubmit}>
              {renderStepContent(activeStep)}

              {/* Boutons de navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Précédent
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !isStepValid(activeStep)}
                    startIcon={<CheckCircle />}
                    sx={{ px: 4 }}
                  >
                    {loading ? 'Création...' : 'Créer mon compte'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepValid(activeStep)}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4 }}
                  >
                    Suivant
                  </Button>
                )}
              </Box>
            </Box>

            {/* Lien de connexion */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Vous avez déjà un compte ?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Se connecter
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default RegisterPage; 