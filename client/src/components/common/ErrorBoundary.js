import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Error, Refresh, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour que le prochain rendu affiche l'UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Générer un ID d'erreur unique
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Logger l'erreur (en production, envoyer à un service de monitoring)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // En production, envoyer l'erreur à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // this.logErrorToService(error, errorInfo, errorId);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
    this.props.navigate('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
          bgcolor="background.default"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Oups ! Quelque chose s'est mal passé
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Une erreur inattendue s'est produite. Notre équipe a été notifiée.
            </Typography>

            {this.state.errorId && (
              <Alert severity="info" sx={{ mb: 2 }}>
                ID d'erreur : {this.state.errorId}
              </Alert>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                <Typography variant="body2" component="div">
                  <strong>Erreur :</strong> {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                    <strong>Stack :</strong>
                    <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </Typography>
                )}
              </Alert>
            )}

            <Box display="flex" gap={2} justifyContent="center" mt={3}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
              >
                Réessayer
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
              >
                Retour à l'accueil
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Si le problème persiste, contactez notre support technique.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrapper pour utiliser useNavigate dans ErrorBoundary
const ErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary navigate={navigate}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper; 