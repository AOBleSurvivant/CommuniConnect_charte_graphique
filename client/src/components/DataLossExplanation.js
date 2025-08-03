import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Warning,
  Info,
  CheckCircle,
  Error,
  Storage,
  CloudUpload,
  Database,
  Refresh
} from '@mui/icons-material';

const DataLossExplanation = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" color="error">
        ⚠️ Pourquoi vos données disparaissent au rechargement
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Attention : Données Temporaires</AlertTitle>
        <Typography variant="body2">
          Actuellement, l'application fonctionne en mode <strong>développement</strong> 
          sans base de données. Vos données sont sauvegardées temporairement dans le navigateur.
        </Typography>
      </Alert>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Explication du problème
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Error color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Pas de base de données"
              secondary="L'application n'est pas encore connectée à une base de données persistante"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Storage color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Stockage temporaire"
              secondary="Les données sont sauvegardées uniquement dans le localStorage du navigateur"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Refresh color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Rechargement de page"
              secondary="Le rechargement vide la mémoire et les données temporaires sont perdues"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ✅ Solutions mises en place
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Service de persistance locale"
              secondary="Sauvegarde automatique dans localStorage avec expiration"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Récupération automatique"
              secondary="Les données sont automatiquement restaurées si disponibles"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Gestion des médias"
              secondary="Photos et fichiers convertis en base64 pour la persistance"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Données actuellement sauvegardées
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label="Profils utilisateurs" color="primary" />
          <Chip label="Photos de profil" color="primary" />
          <Chip label="Publications" color="secondary" />
          <Chip label="Événements" color="secondary" />
          <Chip label="Messages" color="info" />
          <Chip label="Paramètres" color="default" />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Durée de conservation :</strong>
          <br />• Profils et photos : 30 jours
          <br />• Publications et événements : 7 jours
          <br />• Messages : 3 jours
          <br />• Paramètres : 1 an
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Solutions futures
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Database color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Base de données MongoDB"
              secondary="Stockage permanent et sécurisé de toutes les données"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CloudUpload color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Serveur de fichiers"
              secondary="Stockage séparé pour les images et médias"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Synchronisation automatique"
              secondary="Migration automatique des données locales vers la base"
            />
          </ListItem>
        </List>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>💡 Conseils pour l'instant</AlertTitle>
        <Typography variant="body2">
          • Évitez de recharger la page pendant vos sessions de travail
          <br />• Utilisez les onglets du navigateur pour naviguer
          <br />• Sauvegardez vos données importantes ailleurs
          <br />• Le système de persistance locale fonctionne entre les sessions (jusqu'à expiration)
        </Typography>
      </Alert>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Info />}
          onClick={() => window.open('/admin/storage-stats', '_blank')}
        >
          Voir les statistiques de stockage
        </Button>
      </Box>
    </Box>
  );
};

export default DataLossExplanation; 