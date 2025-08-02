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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login,
  Google,
  Facebook,
  Phone,
} from '@mui/icons-material';
import { login } from '../../store/slices/authSlice';

const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      // setLoading(true); // This state is not defined in the original file, so it's removed.
      // setError(null); // This state is not defined in the original file, so it's removed.
      
      // Configuration des providers OAuth
      const oauthConfig = {
        google: {
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
          scope: 'email profile',
          redirectUri: `${window.location.origin}/auth/callback`
        },
        facebook: {
          clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
          scope: 'email public_profile',
          redirectUri: `${window.location.origin}/auth/callback`
        }
      };

      const config = oauthConfig[provider];
      
      // Construire l'URL d'autorisation
      const authUrl = provider === 'google' 
        ? `https://accounts.google.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(config.scope)}&response_type=code`
        : `https://www.facebook.com/dialog/oauth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(config.scope)}&response_type=code`;

      // Rediriger vers l'autorisation
      window.location.href = authUrl;
      
    } catch (error) {
      console.error(`Erreur de connexion ${provider}:`, error);
      // setError(`Erreur lors de la connexion avec ${provider}. Veuillez réessayer.`); // This state is not defined in the original file, so it's removed.
    } finally {
      // setLoading(false); // This state is not defined in the original file, so it's removed.
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
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
            maxWidth: 450,
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
                CommuniConnect
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Connectez-vous à votre communauté
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejoignez votre quartier et restez informé des événements locaux
              </Typography>
            </Box>

            {/* Messages d'erreur */}
            {error && (
              <Fade in timeout={300}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {typeof error === 'string' ? error : error?.message || 'Une erreur est survenue'}
                </Alert>
              </Fade>
            )}

            {/* Formulaire de connexion */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              {/* Sélecteur de méthode de connexion */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant={loginMethod === 'email' ? 'contained' : 'outlined'}
                  onClick={() => setLoginMethod('email')}
                  startIcon={<Email />}
                  sx={{ mr: 1, minWidth: 120 }}
                >
                  Email
                </Button>
                <Button
                  variant={loginMethod === 'phone' ? 'contained' : 'outlined'}
                  onClick={() => setLoginMethod('phone')}
                  startIcon={<Phone />}
                  sx={{ minWidth: 120 }}
                >
                  Téléphone
                </Button>
              </Box>

              {/* Champ email/téléphone */}
              <TextField
                fullWidth
                label={loginMethod === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
                name={loginMethod === 'email' ? 'email' : 'phone'}
                type={loginMethod === 'email' ? 'email' : 'tel'}
                value={formData[loginMethod === 'email' ? 'email' : 'phone'] || ''}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loginMethod === 'email' ? <Email color="action" /> : <Phone color="action" />}
                    </InputAdornment>
                  ),
                }}
              />

              {/* Champ mot de passe */}
              <TextField
                fullWidth
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Bouton de connexion */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<Login />}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>

              {/* Liens utiles */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ mr: 2 }}
                >
                  Mot de passe oublié ?
                </MuiLink>
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body2"
                >
                  Créer un compte
                </MuiLink>
              </Box>
            </Box>

            {/* Séparateur */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                ou
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Connexion sociale */}
            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('google')}
                sx={{ mb: 2, py: 1.5 }}
              >
                Continuer avec Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleSocialLogin('facebook')}
                sx={{ py: 1.5 }}
              >
                Continuer avec Facebook
              </Button>
            </Box>

            {/* Informations supplémentaires */}
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                En vous connectant, vous acceptez nos{' '}
                <MuiLink href="/terms" underline="hover">
                  conditions d'utilisation
                </MuiLink>{' '}
                et notre{' '}
                <MuiLink href="/privacy" underline="hover">
                  politique de confidentialité
                </MuiLink>
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default LoginPage; 