import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container,
  Divider,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  CommuniConnectButton,
  CommuniConnectButtonGroup,
  CommuniConnectCard,
  CommuniConnectNavigation,
  CommuniConnectModal,
  CommuniConnectConfirmModal,
  CommuniConnectAlertModal,
  LoadingSpinner
} from './index';

const DesignSystemDemo = () => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const handleButtonClick = (variant) => {
    console.log(`Button clicked: ${variant}`);
    if (variant === 'loading') {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const demoUser = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    avatar: 'https://via.placeholder.com/150'
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <CommuniConnectNavigation
        user={demoUser}
        notifications={3}
        onNavigate={(page) => console.log('Navigate to:', page)}
        onLogout={() => console.log('Logout')}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom>
          Design System CommuniConnect
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Démonstration des composants UI personnalisés avec la charte graphique CommuniConnect.
        </Typography>

        {/* Section Boutons */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Boutons
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Variantes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <CommuniConnectButton onClick={() => handleButtonClick('primary')}>
                  Bouton Principal
                </CommuniConnectButton>
                <CommuniConnectButton variant="secondary" onClick={() => handleButtonClick('secondary')}>
                  Bouton Secondaire
                </CommuniConnectButton>
                <CommuniConnectButton variant="outline" onClick={() => handleButtonClick('outline')}>
                  Bouton Contour
                </CommuniConnectButton>
                <CommuniConnectButton variant="ghost" onClick={() => handleButtonClick('ghost')}>
                  Bouton Fantôme
                </CommuniConnectButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Tailles
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <CommuniConnectButton size="small">
                  Petit
                </CommuniConnectButton>
                <CommuniConnectButton size="medium">
                  Moyen
                </CommuniConnectButton>
                <CommuniConnectButton size="large">
                  Grand
                </CommuniConnectButton>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h3" gutterBottom>
                Avec Icônes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <CommuniConnectButton startIcon={<AddIcon />}>
                  Ajouter
                </CommuniConnectButton>
                <CommuniConnectButton endIcon={<SettingsIcon />}>
                  Paramètres
                </CommuniConnectButton>
                <CommuniConnectButton variant="secondary" startIcon={<FavoriteIcon />}>
                  J'aime
                </CommuniConnectButton>
                <CommuniConnectButton variant="outline" endIcon={<ShareIcon />}>
                  Partager
                </CommuniConnectButton>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h3" gutterBottom>
                États
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <CommuniConnectButton disabled>
                  Désactivé
                </CommuniConnectButton>
                <CommuniConnectButton onClick={() => handleButtonClick('loading')}>
                  {loading ? <LoadingSpinner size="small" /> : 'Chargement'}
                </CommuniConnectButton>
                <CommuniConnectButton fullWidth>
                  Pleine Largeur
                </CommuniConnectButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section Cartes */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Cartes
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <CommuniConnectCard
                title="Carte Standard"
                subheader="Description de la carte"
                media="https://via.placeholder.com/300x200"
                actions={
                  <>
                    <CommuniConnectButton size="small" variant="outline">
                      Action
                    </CommuniConnectButton>
                    <CommuniConnectButton size="small">
                      Principal
                    </CommuniConnectButton>
                  </>
                }
              >
                <Typography variant="body2">
                  Contenu de la carte avec du texte descriptif et des informations importantes.
                </Typography>
              </CommuniConnectCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CommuniConnectCard
                variant="primary"
                title="Carte Primaire"
                subheader="Avec variante primaire"
                media="https://via.placeholder.com/300x200"
              >
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Cette carte utilise la variante primaire avec le fond bleu CommuniConnect.
                </Typography>
              </CommuniConnectCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CommuniConnectCard
                variant="secondary"
                title="Carte Secondaire"
                subheader="Avec variante secondaire"
                media="https://via.placeholder.com/300x200"
              >
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Cette carte utilise la variante secondaire avec le fond jaune CommuniConnect.
                </Typography>
              </CommuniConnectCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CommuniConnectCard
                variant="outlined"
                title="Carte Contour"
                subheader="Avec bordure"
                elevation="light"
              >
                <Typography variant="body2">
                  Cette carte utilise une bordure et une élévation légère pour un effet subtil.
                </Typography>
              </CommuniConnectCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CommuniConnectCard
                title="Carte avec Avatar"
                subheader="Utilisateur"
                avatar={<Avatar>JD</Avatar>}
                elevation="heavy"
              >
                <Typography variant="body2">
                  Cette carte inclut un avatar et une élévation importante pour un effet de profondeur.
                </Typography>
              </CommuniConnectCard>
            </Grid>
          </Grid>
        </Box>

        {/* Section Modales */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Modales
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" gutterBottom>
                Modale Standard
              </Typography>
              <CommuniConnectButton onClick={() => setModalOpen(true)}>
                Ouvrir Modale
              </CommuniConnectButton>
              
              <CommuniConnectModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Modale de Démonstration"
                size="medium"
              >
                <Typography variant="body1" paragraph>
                  Ceci est une modale de démonstration avec du contenu personnalisé.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  La modale utilise la charte graphique CommuniConnect avec des animations fluides.
                </Typography>
              </CommuniConnectModal>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h3" gutterBottom>
                Modale de Confirmation
              </Typography>
              <CommuniConnectButton 
                variant="secondary" 
                onClick={() => setConfirmModalOpen(true)}
              >
                Confirmer Action
              </CommuniConnectButton>
              
              <CommuniConnectConfirmModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title="Confirmation"
                message="Êtes-vous sûr de vouloir effectuer cette action ? Cette opération ne peut pas être annulée."
                confirmText="Confirmer"
                cancelText="Annuler"
                severity="warning"
                onConfirm={() => console.log('Action confirmée')}
                onCancel={() => console.log('Action annulée')}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h3" gutterBottom>
                Modale d'Alerte
              </Typography>
              <CommuniConnectButton 
                variant="outline" 
                onClick={() => setAlertModalOpen(true)}
              >
                Afficher Alerte
              </CommuniConnectButton>
              
              <CommuniConnectAlertModal
                open={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                title="Information"
                message="Ceci est un message d'information important pour l'utilisateur."
                severity="info"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Section Alertes */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Alertes et Notifications
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Opération réussie ! Votre action a été effectuée avec succès.
              </Alert>
              <Alert severity="error" sx={{ mb: 2 }}>
                Une erreur s'est produite. Veuillez réessayer.
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Attention ! Cette action ne peut pas être annulée.
              </Alert>
              <Alert severity="info" sx={{ mb: 2 }}>
                Information importante concernant votre compte.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Badges et Chips
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip label="Nouveau" color="primary" />
                <Chip label="Populaire" color="secondary" />
                <Chip label="Terminé" color="success" />
                <Chip label="En attente" color="warning" />
                <Chip label="Erreur" color="error" />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section Typographie */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Typographie
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                Titre H1
              </Typography>
              <Typography variant="h2" gutterBottom>
                Titre H2
              </Typography>
              <Typography variant="h3" gutterBottom>
                Titre H3
              </Typography>
              <Typography variant="h4" gutterBottom>
                Titre H4
              </Typography>
              <Typography variant="h5" gutterBottom>
                Titre H5
              </Typography>
              <Typography variant="h6" gutterBottom>
                Titre H6
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                Texte de corps principal avec une taille de 16px et une ligne de 1.6 pour une lecture confortable.
              </Typography>
              <Typography variant="body2" paragraph>
                Texte de corps secondaire avec une taille de 14px pour les informations moins importantes.
              </Typography>
              <Typography variant="caption" display="block">
                Texte de légende avec une taille de 12px pour les annotations et notes.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DesignSystemDemo; 