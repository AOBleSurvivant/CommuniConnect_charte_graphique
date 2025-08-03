import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Storage,
  Delete,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  DataUsage,
  Timeline
} from '@mui/icons-material';
import localPersistenceService from '../../services/localPersistenceService';

const LocalStorageStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setLoading(true);
    try {
      const statsData = localPersistenceService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = () => {
    try {
      const cleanedCount = localPersistenceService.cleanup();
      loadStats();
      console.log(`🧹 Nettoyage terminé: ${cleanedCount} éléments supprimés`);
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
    }
  };

  const handleClearAll = () => {
    try {
      const types = ['profile', 'profile_picture', 'post', 'event', 'message', 'user_settings'];
      let totalRemoved = 0;
      
      types.forEach(type => {
        totalRemoved += localPersistenceService.remove(type);
      });
      
      loadStats();
      console.log(`🗑️ Suppression terminée: ${totalRemoved} éléments supprimés`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStoragePercentage = () => {
    if (!stats) return 0;
    const maxStorage = 5 * 1024 * 1024; // 5MB limite
    return Math.min((stats.totalSize / maxStorage) * 100, 100);
  };

  const getStorageColor = (percentage) => {
    if (percentage > 80) return 'error';
    if (percentage > 60) return 'warning';
    return 'success';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'profile': return <Info />;
      case 'profile_picture': return <Info />;
      case 'post': return <Timeline />;
      case 'event': return <Timeline />;
      case 'message': return <Timeline />;
      case 'user_settings': return <DataUsage />;
      default: return <Storage />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'profile': return 'primary';
      case 'profile_picture': return 'primary';
      case 'post': return 'success';
      case 'event': return 'info';
      case 'message': return 'warning';
      case 'user_settings': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des statistiques...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Stockage Local
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadStats}
          >
            Actualiser
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Delete />}
            onClick={handleCleanup}
          >
            Nettoyer
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClearAll}
          >
            Tout supprimer
          </Button>
        </Box>
      </Box>

      {stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Storage color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total d'éléments</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Données sauvegardées
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DataUsage color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Taille totale</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {formatBytes(stats.totalSize)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getStoragePercentage()}
                    color={getStorageColor(getStoragePercentage())}
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getStoragePercentage().toFixed(1)}% utilisé
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Timeline color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Types de données</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {Object.keys(stats.byType).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Catégories différentes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Statut</Typography>
                  </Box>
                  <Chip 
                    label={getStoragePercentage() > 80 ? 'Critique' : getStoragePercentage() > 60 ? 'Attention' : 'Normal'}
                    color={getStorageColor(getStoragePercentage())}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {getStoragePercentage() > 80 ? 'Stockage presque plein' : 
                     getStoragePercentage() > 60 ? 'Stockage modéré' : 'Stockage normal'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détail par type de données
              </Typography>
              <List>
                {Object.entries(stats.byType).map(([type, typeStats]) => (
                  <React.Fragment key={type}>
                    <ListItem>
                      <ListItemIcon>
                        {getTypeIcon(type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                              {type === 'profile' ? 'Profils utilisateurs' :
                               type === 'profile_picture' ? 'Photos de profil' :
                               type === 'post' ? 'Publications' :
                               type === 'event' ? 'Événements' :
                               type === 'message' ? 'Messages' :
                               type === 'user_settings' ? 'Paramètres utilisateur' :
                               type}
                            </Typography>
                            <Chip 
                              label={`${typeStats.count} éléments`}
                              color={getTypeColor(type)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={`Taille: ${formatBytes(typeStats.size)}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Informations sur le stockage local</AlertTitle>
            <Typography variant="body2">
              Les données sont sauvegardées temporairement dans le navigateur pour améliorer les performances 
              et permettre l'utilisation hors ligne. Les données expirent automatiquement après 7 jours 
              (30 jours pour les profils). Vous pouvez nettoyer manuellement les données expirées.
            </Typography>
          </Alert>

          {getStoragePercentage() > 80 && (
            <Alert severity="warning">
              <AlertTitle>Stockage presque plein</AlertTitle>
              <Typography variant="body2">
                Le stockage local approche de sa limite. Considérez nettoyer les données anciennes 
                ou supprimer les éléments non essentiels.
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default LocalStorageStats; 