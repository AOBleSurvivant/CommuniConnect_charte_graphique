import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Badge
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  Reply,
  MoreVert,
  Verified,
  Schedule,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageExample = () => {
  const [liked, setLiked] = React.useState(false);
  const [favorited, setFavorited] = React.useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        💬 Exemple de Message de Conversation
      </Typography>

      {/* Message Principal */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Avatar avec badge de vérification */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Verified sx={{ fontSize: 16, color: '#2196F3' }} />
            }
          >
            <Avatar
              src="/api/uploads/profile-pictures/user123.jpg"
              alt="Dr. Mamadou Diallo"
              sx={{ width: 48, height: 48 }}
            >
              MD
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1 }}>
            {/* En-tête du message */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Dr. Mamadou Diallo
              </Typography>
              <Chip 
                label="Contributeur Vérifié" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                <Schedule sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                {format(new Date(), 'dd MMM yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            {/* Contenu du message */}
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              Bonjour à tous ! 👋
              <br /><br />
              Je voulais partager avec vous une information importante concernant les démarches administratives à Conakry.
              <br /><br />
              📋 <strong>Nouveau :</strong> La mairie de Conakry a mis en place un système de rendez-vous en ligne pour les actes de naissance. Plus besoin de faire la queue pendant des heures !
              <br /><br />
              🔗 <strong>Lien :</strong> <a href="#" style={{ color: '#2196F3' }}>https://conakry.gouv.gn/rdv</a>
              <br /><br />
              📞 <strong>Contact :</strong> +224 123 456 789
              <br /><br />
              ⏰ <strong>Horaires :</strong> Lundi-Vendredi, 8h-16h
              <br /><br />
              J'ai testé ce service la semaine dernière et c'est vraiment efficace. Le délai de traitement est passé de 2 semaines à 3 jours !
              <br /><br />
              N'hésitez pas à me contacter si vous avez des questions. 😊
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label="Administration" size="small" color="primary" />
              <Chip label="Conakry" size="small" color="secondary" />
              <Chip label="Acte de naissance" size="small" />
              <Chip label="Service public" size="small" />
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="J'aime">
                <IconButton 
                  size="small" 
                  onClick={handleLike}
                  color={liked ? 'primary' : 'default'}
                >
                  {liked ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {liked ? '24' : '23'} j'aime
              </Typography>

              <Tooltip title="Répondre">
                <IconButton size="small">
                  <Reply />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                5 réponses
              </Typography>

              <Tooltip title="Favoris">
                <IconButton 
                  size="small" 
                  onClick={handleFavorite}
                  color={favorited ? 'error' : 'default'}
                >
                  {favorited ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>

              <Box sx={{ ml: 'auto' }}>
                <Tooltip title="Plus d'options">
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Réponse */}
      <Paper elevation={1} sx={{ p: 2, ml: 6, mb: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            src="/api/uploads/profile-pictures/user456.jpg"
            alt="Fatoumata Camara"
            sx={{ width: 36, height: 36 }}
          >
            FC
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Fatoumata Camara
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {format(new Date(Date.now() - 3600000), 'HH:mm', { locale: fr })}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Merci Dr. Diallo pour cette information très utile ! 🙏
              <br />
              J'ai justement besoin d'un acte de naissance pour ma fille. Je vais essayer ce nouveau système.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <ThumbUpOutlined />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                8 j'aime
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Autre réponse */}
      <Paper elevation={1} sx={{ p: 2, ml: 6, mb: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            src="/api/uploads/profile-pictures/user789.jpg"
            alt="Ibrahima Keita"
            sx={{ width: 36, height: 36 }}
          >
            IK
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Ibrahima Keita
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {format(new Date(Date.now() - 1800000), 'HH:mm', { locale: fr })}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Excellente nouvelle ! 🎉
              <br />
              Est-ce que ce service fonctionne aussi pour les autres communes de Conakry ?
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <ThumbUpOutlined />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                3 j'aime
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Statistiques */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          📊 Statistiques de ce message
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" color="primary">23</Typography>
            <Typography variant="caption">J'aime</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="secondary">5</Typography>
            <Typography variant="caption">Réponses</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="success.main">12</Typography>
            <Typography variant="caption">Partages</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="info.main">156</Typography>
            <Typography variant="caption">Vues</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageExample; 