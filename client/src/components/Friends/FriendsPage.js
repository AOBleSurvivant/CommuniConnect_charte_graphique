import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { PersonAdd, Check, Close, Person } from '@mui/icons-material';
import friendsService from '../../services/friendsService';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState('');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    setIsLoading(true);
    try {
      const [friendsResponse, requestsResponse] = await Promise.all([
        friendsService.getFriendsList(),
        friendsService.getFriendRequests()
      ]);

      if (friendsResponse.data.success) {
        setFriends(friendsResponse.data.friends || []);
      }

      if (requestsResponse.data.success) {
        setFriendRequests(requestsResponse.data.requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!emailToAdd.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Correction : utiliser l'email comme recipientId
      const response = await friendsService.sendFriendRequest(emailToAdd.trim());
      
      if (response.data && response.data.success) {
        setSuccess('Demande d\'ami envoyée avec succès');
        setEmailToAdd('');
        setShowAddFriendDialog(false);
        // Recharger les données
        loadFriendsData();
      } else {
        setError(response.data?.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await friendsService.acceptFriendRequest(requestId);
      if (response.data.success) {
        setSuccess('Demande acceptée');
        loadFriendsData();
      }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      setError('Erreur lors de l\'acceptation');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await friendsService.declineFriendRequest(requestId);
      if (response.data.success) {
        setSuccess('Demande refusée');
        loadFriendsData();
      }
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      setError('Erreur lors du refus');
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    try {
      const response = await friendsService.removeFriend(friendshipId);
      if (response.data.success) {
        setSuccess('Ami supprimé');
        loadFriendsData();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Amis
      </Typography>

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

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setShowAddFriendDialog(true)}
        >
          Ajouter un ami
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Amis (${friends.length})`} />
          <Tab label={`Demandes (${friendRequests.length})`} />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {activeTab === 0 && (
            <List>
              {friends.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                  Vous n'avez pas encore d'amis. Ajoutez-en un !
                </Typography>
              ) : (
                friends.map((friend) => (
                  <ListItem key={friend._id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${friend.firstName} ${friend.lastName}`}
                      secondary={friend.email}
                    />
                    <Chip label="Ami" color="primary" size="small" />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFriend(friend.friendshipId)}
                      sx={{ ml: 1 }}
                    >
                      Supprimer
                    </Button>
                  </ListItem>
                ))
              )}
            </List>
          )}

          {activeTab === 1 && (
            <List>
              {friendRequests.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                  Aucune demande d'ami en attente
                </Typography>
              ) : (
                friendRequests.map((request) => (
                  <ListItem key={request._id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${request.requester.firstName} ${request.requester.lastName}`}
                      secondary={request.requester.email}
                    />
                    <Button
                      size="small"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => handleAcceptRequest(request._id)}
                      sx={{ mr: 1 }}
                    >
                      Accepter
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => handleDeclineRequest(request._id)}
                    >
                      Refuser
                    </Button>
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      )}

      {/* Dialog pour ajouter un ami */}
      <Dialog open={showAddFriendDialog} onClose={() => setShowAddFriendDialog(false)}>
        <DialogTitle>Ajouter un ami</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email de l'ami"
            type="email"
            fullWidth
            variant="outlined"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            placeholder="exemple@communiconnect.gn"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFriendDialog(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSendFriendRequest}
            disabled={!emailToAdd.trim() || isLoading}
            variant="contained"
          >
            {isLoading ? <CircularProgress size={20} /> : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendsPage; 