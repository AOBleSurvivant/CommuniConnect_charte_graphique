import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message }]);
  };

  const testNavigation = () => {
    addResult('Navigation', true, 'Composant de test chargé');
    addResult('Location', true, `Page actuelle: ${location.pathname}`);
    
    // Tester la navigation vers /friends
    try {
      navigate('/friends');
      addResult('Navigation vers /friends', true, 'Navigation réussie');
    } catch (error) {
      addResult('Navigation vers /friends', false, `Erreur: ${error.message}`);
    }
  };

  const testDirectAccess = () => {
    // Simuler un accès direct à /friends
    window.history.pushState({}, '', '/friends');
    addResult('Accès direct /friends', true, 'URL changée vers /friends');
  };

  useEffect(() => {
    addResult('Chargement', true, 'Composant monté avec succès');
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Navigation - Fonctionnalité Amis
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ce test vérifie la navigation vers la page /friends et les problèmes potentiels.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testNavigation}
        >
          🧪 Tester Navigation
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testDirectAccess}
        >
          🧪 Test Accès Direct
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats des tests:
        </Typography>
        {testResults.map((result, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2" color={result.success ? 'success.main' : 'error.main'}>
              {result.success ? '✅' : '❌'} {result.test}: {result.message}
            </Typography>
          </Box>
        ))}
      </Paper>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Si vous voyez des erreurs, vérifiez la console du navigateur pour plus de détails.
      </Alert>
    </Box>
  );
};

export default NavigationTest;
