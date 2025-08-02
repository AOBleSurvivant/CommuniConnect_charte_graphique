import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
// import { login } from '../../store/slices/authSlice';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          setStatus('error');
          setErrorMessage(`Erreur d'autorisation: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setErrorMessage('Code d\'autorisation manquant');
          return;
        }

        // Envoyer le code au serveur pour échanger contre un token
        const response = await fetch('/api/auth/oauth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            redirectUri: `${window.location.origin}/auth/callback`
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de l\'authentification');
        }

        // Connexion réussie
        localStorage.setItem('token', data.token);
        // Rediriger vers la page d'accueil après 2 secondes
        
        setStatus('success');
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error) {
        console.error('Erreur OAuth callback:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Une erreur est survenue');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Authentification en cours...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Veuillez patienter pendant que nous vous connectons
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="success.main">
                Connexion réussie !
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirection vers l'accueil...
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="error.main">
                Erreur de connexion
              </Typography>
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Vous allez être redirigé vers la page de connexion
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthCallback; 