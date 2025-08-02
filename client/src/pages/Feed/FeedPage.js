import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
  useTheme,
  Fade,
  Grow,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  FilterList,
  TrendingUp,
  NewReleases,
  LocalFireDepartment,
  Search,
} from '@mui/icons-material';
import CreatePost from '../../components/Posts/CreatePost';
import PostCard from '../../components/Posts/PostCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatError } from '../../utils/errorHandler';

const FeedPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  // Gérer les états passés depuis la page d'accueil
  useEffect(() => {
    console.log('🔄 FeedPage useEffect - Vérification des états');
    console.log('📍 location.state:', location.state);
    console.log('📍 localStorage showCreatePost:', localStorage.getItem('showCreatePost'));
    console.log('📍 localStorage showSearch:', localStorage.getItem('showSearch'));
    
    // Vérifier location.state (méthode originale)
    if (location.state) {
      if (location.state.showCreatePost) {
        console.log('✅ Activation showCreatePost via location.state');
        setShowCreatePost(true);
      }
      if (location.state.showSearch) {
        console.log('✅ Activation showSearch via location.state');
        setShowSearch(true);
      }
    }
    
    // Vérifier localStorage (solution alternative)
    if (localStorage.getItem('showCreatePost') === 'true') {
      console.log('✅ Activation showCreatePost via localStorage');
      setShowCreatePost(true);
      localStorage.removeItem('showCreatePost');
    }
    if (localStorage.getItem('showSearch') === 'true') {
      console.log('✅ Activation showSearch via localStorage');
      setShowSearch(true);
      localStorage.removeItem('showSearch');
    }
  }, [location.state]);

  // Données fictives pour la démonstration
  const mockPosts = [
    {
      id: 1,
      content: "Bonjour à tous ! Je cherche un plombier de confiance dans le quartier de Kaloum. Quelqu'un peut me recommander ?",
      type: "besoin",
      author: {
        id: 1,
        name: "Mariama Diallo",
        avatar: null,
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
      location: "Kaloum, Conakry",
      likes: [2, 3, 4],
      comments: [
        {
          id: 1,
          content: "Je connais un excellent plombier, je vous envoie son numéro en MP",
          author: { name: "Souleymane Bah", avatar: null },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: 2,
          content: "Moi aussi j'ai besoin d'un plombier, partagez l'info !",
          author: { name: "Fatoumata Camara", avatar: null },
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
      tags: ["plomberie", "recommandation"],
    },
    {
      id: 2,
      content: "Vente de meubles d'occasion en excellent état. Table, chaises et armoire. Prix négociables. Contactez-moi si intéressé !",
      type: "vente",
      author: {
        id: 2,
        name: "Ibrahima Keita",
        avatar: null,
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // Il y a 4 heures
      location: "Dixinn, Conakry",
      likes: [1, 3],
      comments: [
        {
          id: 3,
          content: "Pouvez-vous me montrer des photos ?",
          author: { name: "Aissatou Barry", avatar: null },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
      tags: ["vente", "meubles"],
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      content: "Réunion de quartier ce samedi à 15h au centre communautaire. Ordre du jour : sécurité, propreté et projets pour 2024. Venez nombreux !",
      type: "evenement",
      author: {
        id: 3,
        name: "Mamadou Sylla",
        avatar: null,
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // Il y a 6 heures
      location: "Ratoma, Conakry",
      likes: [1, 2, 4, 5, 6],
      comments: [
        {
          id: 4,
          content: "Je serai présent !",
          author: { name: "Ousmane Diallo", avatar: null },
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
          id: 5,
          content: "Excellente initiative, je diffuse l'information",
          author: { name: "Hawa Conte", avatar: null },
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
      ],
      tags: ["réunion", "quartier", "communauté"],
    },
    {
      id: 4,
      content: "Coupure d'électricité prévue demain de 8h à 12h dans le secteur. Pensez à recharger vos appareils !",
      type: "alerte",
      author: {
        id: 4,
        name: "Service Public",
        avatar: null,
      },
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // Il y a 8 heures
      location: "Matam, Conakry",
      likes: [1, 2, 3, 5, 7, 8],
      comments: [
        {
          id: 6,
          content: "Merci pour l'information !",
          author: { name: "Kadiatou Bah", avatar: null },
          createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
        },
      ],
      tags: ["électricité", "maintenance"],
    },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now(),
      ...postData,
      author: {
        id: 1, // ID de l'utilisateur connecté
        name: "Vous",
        avatar: null,
      },
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
    setSnackbar({
      open: true,
      message: 'Publication créée avec succès !',
      severity: 'success'
    });
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(1); // ID de l'utilisateur connecté
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== 1)
            : [...post.likes, 1]
        };
      }
      return post;
    }));
  };

  const handleComment = (postId, commentText) => {
    const newComment = {
      id: Date.now(),
      content: commentText,
      author: {
        name: "Vous",
        avatar: null,
      },
      createdAt: new Date(),
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setSnackbar({
      open: true,
      message: 'Commentaire ajouté !',
      severity: 'success'
    });
  };

  const handleShare = (post) => {
    // TODO: Implémenter le partage
    setSnackbar({
      open: true,
      message: 'Publication partagée !',
      severity: 'info'
    });
  };

  const handleEdit = (post) => {
    // TODO: Implémenter l'édition
    setSnackbar({
      open: true,
      message: 'Fonctionnalité d\'édition à venir',
      severity: 'info'
    });
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setSnackbar({
      open: true,
      message: 'Publication supprimée',
      severity: 'success'
    });
  };

  const handleReport = (postId) => {
    // TODO: Implémenter le signalement
    setSnackbar({
      open: true,
      message: 'Publication signalée aux modérateurs',
      severity: 'warning'
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFilteredPosts = () => {
    let filteredPosts = posts;

    // Filtrage par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.author.name.toLowerCase().includes(searchLower) ||
        post.location.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        post.type.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par onglet
    switch (activeTab) {
      case 0: // Tous
        return filteredPosts;
      case 1: // Tendances
        return filteredPosts.filter(post => post.likes.length >= 3);
      case 2: // Récents
        return filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 3: // Alertes
        return filteredPosts.filter(post => post.type === 'alerte');
      default:
        return filteredPosts;
    }
  };

  const tabLabels = [
    { label: 'Tous', icon: <FilterList /> },
    { label: 'Tendances', icon: <TrendingUp /> },
    { label: 'Récents', icon: <NewReleases /> },
    { label: 'Alertes', icon: <LocalFireDepartment /> },
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des publications..." />;
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Fil d'actualité
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Restez connecté avec votre communauté
        </Typography>
      </Box>

      {/* Messages d'état */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')} >
          {formatError(error)}
        </Alert>
      )}

      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          sx={{ mb: 2 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Colonne principale */}
        <Grid item xs={12} lg={8}>
          {/* Bouton créer une publication */}
          {!showCreatePost && (
            <Grow in timeout={600}>
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowCreatePost(true)}
                  sx={{ py: 1.5 }}
                >
                  Créer une publication
                </Button>
              </Paper>
            </Grow>
          )}

          {/* Formulaire de création */}
          {showCreatePost && (
            <Fade in timeout={300}>
              <Box>
                <CreatePost
                  onSubmit={handleCreatePost}
                  onCancel={() => setShowCreatePost(false)}
                />
              </Box>
            </Fade>
          )}

          {/* Composant de recherche */}
          {showSearch && (
            <Fade in timeout={300}>
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher dans les publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>
            </Fade>
          )}

          {/* Filtres */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontWeight: 500,
                },
              }}
            >
              {tabLabels.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      {tab.label}
              </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>

          {/* Liste des publications */}
          <Box>
            {getFilteredPosts().map((post, index) => (
              <Grow in timeout={800 + index * 100} key={post.id}>
                <Box>
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReport={handleReport}
                  />
            </Box>
              </Grow>
            ))}
          </Box>

          {/* Message si aucune publication */}
          {getFilteredPosts().length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune publication trouvée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Soyez le premier à partager quelque chose avec votre communauté !
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            {/* Statistiques */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Statistiques
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Publications aujourd'hui
                  </Typography>
                  <Chip label={posts.length} size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total des j'aime
                  </Typography>
                  <Chip 
                    label={posts.reduce((sum, post) => sum + post.likes.length, 0)} 
                    size="small" 
                    color="secondary" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Commentaires
                  </Typography>
                  <Chip 
                    label={posts.reduce((sum, post) => sum + post.comments.length, 0)} 
                    size="small" 
                    color="info" 
                  />
                </Box>
              </Box>
            </Paper>

            {/* Tags populaires */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Tags populaires
          </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['communauté', 'entraide', 'sécurité', 'événements', 'vente', 'besoins'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedPage; 