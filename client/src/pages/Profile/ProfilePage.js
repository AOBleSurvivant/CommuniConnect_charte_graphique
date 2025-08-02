import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfilePicture } from '../../store/slices/authSlice';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  useTheme,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Security,
  Notifications,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Delete,
  Verified,
  Warning,
  CheckCircle,
  Block,
  Settings,
  History,
  Favorite,
  Comment,
  Share,
  Event,
  NotificationsActive,
  NotificationsOff,
  Public,
  Private,
  Lock,
  Unlock,
} from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../services/authService';
import LocationSelector from '../../components/common/LocationSelector';

const ProfilePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    profession: user?.profession || '',
    region: user?.region || '',
    prefecture: user?.prefecture || '',
    commune: user?.commune || '',
    quartier: user?.quartier || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      locationVisible: true,
      activityVisible: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
    }
  });

  const [stats, setStats] = useState({
    posts: 0,
    alerts: 0,
    events: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    reports: 0,
    joinDate: new Date(),
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Charger les données du profil
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // TODO: Charger les données depuis l'API
      // Simuler le chargement
      setTimeout(() => {
        setStats({
          posts: 15,
          alerts: 3,
          events: 8,
          likes: 127,
          comments: 45,
          shares: 23,
          reports: 0,
          joinDate: new Date(Date.now() - 2592000000), // Il y a 30 jours
        });

        setRecentActivity([
          {
            id: 1,
            type: 'post',
            content: 'Publication créée',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 2,
            type: 'like',
            content: 'A aimé une publication',
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            id: 3,
            type: 'comment',
            content: 'A commenté une publication',
            timestamp: new Date(Date.now() - 10800000),
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Sauvegarder les données via l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Profil mis à jour avec succès !',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour du profil',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Les mots de passe ne correspondent pas',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Changer le mot de passe via l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSnackbar({
        open: true,
        message: 'Mot de passe changé avec succès !',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors du changement de mot de passe',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // TODO: Supprimer le compte via l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowDeleteDialog(false);
      // TODO: Déconnexion et redirection
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du compte',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setSnackbar({
        open: true,
        message: 'L\'image est trop volumineuse. Taille maximale : 5MB',
        severity: 'error'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setSnackbar({
        open: true,
        message: 'Veuillez sélectionner une image valide',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Upload via l'API
      await dispatch(updateProfilePicture(formData)).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Photo de profil mise à jour avec succès !',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Erreur lors de la mise à jour de la photo de profil',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      // Reset l'input
      event.target.value = '';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'post': return <Comment />;
      case 'like': return <Favorite />;
      case 'comment': return <Comment />;
      case 'share': return <Share />;
      case 'event': return <Event />;
      default: return <Person />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'post': return 'primary';
      case 'like': return 'error';
      case 'comment': return 'info';
      case 'share': return 'success';
      case 'event': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du profil..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* En-tête du profil */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}
                      onClick={() => document.getElementById('profile-picture-upload').click()}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ width: 100, height: 100, fontSize: '2rem' }}
                  >
                    {user?.firstName?.charAt(0) || 'U'}
                  </Avatar>
                </Badge>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  style={{ display: 'none' }}
                />
              </Grid>
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" component="h1">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  {user?.isVerified && (
                    <Tooltip title="Compte vérifié">
                      <Verified color="primary" sx={{ ml: 1 }} />
                    </Tooltip>
                  )}
                  <Chip 
                    label={user?.role || 'Utilisateur'} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Membre depuis {stats.joinDate.toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Annuler' : 'Modifier'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Informations" icon={<Person />} iconPosition="start" />
            <Tab label="Statistiques" icon={<CheckCircle />} iconPosition="start" />
            <Tab label="Activité" icon={<History />} iconPosition="start" />
            <Tab label="Paramètres" icon={<Settings />} iconPosition="start" />
            <Tab label="Sécurité" icon={<Security />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Onglet Informations */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informations personnelles
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prénom"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
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
                        disabled={!editMode}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!editMode}>
                        <InputLabel>Genre</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          label="Genre"
                        >
                          <MenuItem value="male">Homme</MenuItem>
                          <MenuItem value="female">Femme</MenuItem>
                          <MenuItem value="other">Autre</MenuItem>
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
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Localisation
                  </Typography>
                  {editMode ? (
                    <LocationSelector 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      showGPS={true}
                      required={true}
                    />
                  ) : (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Région :</strong> {formData.region}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Préfecture :</strong> {formData.prefecture}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Commune :</strong> {formData.commune}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Quartier :</strong> {formData.quartier}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Adresse :</strong> {formData.address}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {editMode && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        Sauvegarder
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Onglet Statistiques */}
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Comment color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="h6">{stats.posts}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Publications
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Favorite color="error" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="h6">{stats.likes}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            J'aime reçus
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Share color="success" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="h6">{stats.shares}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Partages
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Event color="warning" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="h6">{stats.events}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Événements
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Onglet Activité */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Activité récente
                </Typography>
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette[getActivityColor(activity.type)].main }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.content}
                        secondary={activity.timestamp.toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Onglet Paramètres */}
            {activeTab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                      />
                    }
                    label="Notifications par email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingsChange('notifications', 'push', e.target.checked)}
                      />
                    }
                    label="Notifications push"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sms}
                        onChange={(e) => handleSettingsChange('notifications', 'sms', e.target.checked)}
                      />
                    }
                    label="Notifications SMS"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Confidentialité
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => handleSettingsChange('privacy', 'profileVisible', e.target.checked)}
                      />
                    }
                    label="Profil visible"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.locationVisible}
                        onChange={(e) => handleSettingsChange('privacy', 'locationVisible', e.target.checked)}
                      />
                    }
                    label="Localisation visible"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.activityVisible}
                        onChange={(e) => handleSettingsChange('privacy', 'activityVisible', e.target.checked)}
                      />
                    }
                    label="Activité visible"
                  />
                </Grid>
              </Grid>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 4 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Sécurité du compte
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordDialog(true)}
                    sx={{ mb: 2 }}
                  >
                    Changer le mot de passe
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleSettingsChange('security', 'twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Authentification à deux facteurs"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.loginAlerts}
                        onChange={(e) => handleSettingsChange('security', 'loginAlerts', e.target.checked)}
                      />
                    }
                    label="Alertes de connexion"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="error">
                    Zone dangereuse
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Supprimer mon compte
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cette action est irréversible et supprimera définitivement votre compte.
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Dialog de changement de mot de passe */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Mot de passe actuel"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Annuler</Button>
          <Button onClick={handleChangePassword} variant="contained" disabled={loading}>
            Changer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression de compte */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Supprimer le compte</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Attention ! Cette action est irréversible.
          </Alert>
          <Typography>
            Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données seront définitivement perdues.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage; 