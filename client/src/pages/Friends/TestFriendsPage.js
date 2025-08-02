import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const TestFriendsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const testApiCall = async (endpoint) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Erreur API');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testFriendsList = async () => {
    try {
      const result = await testApiCall('/friends/list');
      setFriends(result.friends || []);
      console.log('✅ Liste d'amis récupérée:', result);
    } catch (error) {
      setError(`Erreur liste d'amis: ${error.message}`);
      console.error('❌ Erreur liste d'amis:', error);
    }
  };

  const testFriendsRequests = async () => {
    try {
      const result = await testApiCall('/friends/requests');
      setRequests(result.requests || []);
      console.log('✅ Demandes d'amis récupérées:', result);
    } catch (error) {
      setError(`Erreur demandes d'amis: ${error.message}`);
      console.error('❌ Erreur demandes d'amis:', error);
    }
  };

  useEffect(() => {
    testFriendsList();
    testFriendsRequests();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Fonctionnalité Amis
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ce composant teste la fonctionnalité "Mes amis" et les routes API associées.
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Chargement...</Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testFriendsList}
          disabled={loading}
        >
          🧪 Tester Liste Amis
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testFriendsRequests}
          disabled={loading}
        >
          🧪 Tester Demandes
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Amis ({friends.length})
          </Typography>
          {friends.map((friend, index) => (
            <Box key={index} sx={{ p: 1, border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
              <Typography variant="body2">
                {friend.firstName} {friend.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {friend.email}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Demandes ({requests.length})
          </Typography>
          {requests.map((request, index) => (
            <Box key={index} sx={{ p: 1, border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
              <Typography variant="body2">
                {request.requester?.firstName} {request.requester?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.requester?.email}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TestFriendsPage;
