import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
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
  IconButton,
  Badge,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  LinearProgress,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Help,
  LocalHospital,
  Restaurant,
  Home,
  Security,
  School,
  Work,
  DirectionsCar,
  ChildCare,
  Elderly,
  Pets,
  Construction,
  CleaningServices,
  ShoppingCart as Shopping,
  Money,
  Phone,
  Email,
  LocationOn,
  Schedule,
  Person,
  CheckCircle,
  Pending,
  Cancel,
  Edit,
  Delete,
  Share,
  Flag,
  Visibility,
  VisibilityOff,
  FilterList,
  Search,
  Sort,
  TrendingUp,
  TrendingDown,
  NewReleases,
  History,
  Favorite,
  Comment,
  ThumbUp,
  ThumbDown,
  Warning as Emergency,
  PriorityHigh,
  LowPriority,
  PriorityHigh as MediumPriority,
  Close,
  Verified,
} from '@mui/icons-material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LocationSelector from '../../components/common/LocationSelector';

const HelpPage = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: {
      region: user?.region || 'Conakry',
      prefecture: user?.prefecture || 'Conakry',
      commune: user?.commune || '',
      quartier: user?.quartier || '',
      address: '',
    },
    contactInfo: {
      phone: user?.phone || '',
      email: user?.email || '',
      preferredContact: 'phone',
    },
    isForNeighbor: false,
    neighborInfo: {
      name: '',
      phone: '',
      relationship: '',
    },
    deadline: '',
    budget: '',
  });

  const categories = [
    { value: 'health', label: 'Santé', icon: <LocalHospital />, color: 'error' },
    { value: 'food', label: 'Alimentation', icon: <Restaurant />, color: 'warning' },
    { value: 'housing', label: 'Logement', icon: <Home />, color: 'primary' },
    { value: 'security', label: 'Sécurité', icon: <Security />, color: 'error' },
    { value: 'education', label: 'Éducation', icon: <School />, color: 'info' },
    { value: 'work', label: 'Emploi', icon: <Work />, color: 'success' },
    { value: 'transport', label: 'Transport', icon: <DirectionsCar />, color: 'secondary' },
    { value: 'childcare', label: 'Garde d\'enfants', icon: <ChildCare />, color: 'warning' },
    { value: 'elderly', label: 'Aide aux personnes âgées', icon: <Elderly />, color: 'info' },
    { value: 'pets', label: 'Animaux', icon: <Pets />, color: 'success' },
    { value: 'construction', label: 'Construction/Réparation', icon: <Construction />, color: 'primary' },
    { value: 'cleaning', label: 'Nettoyage', icon: <CleaningServices />, color: 'secondary' },
    { value: 'shopping', label: 'Courses', icon: <Shopping />, color: 'warning' },
    { value: 'financial', label: 'Aide financière', icon: <Money />, color: 'error' },
    { value: 'other', label: 'Autre', icon: <Help />, color: 'default' },
  ];

  const priorities = [
    { value: 'low', label: 'Faible', icon: <LowPriority />, color: 'success' },
    { value: 'medium', label: 'Moyenne', icon: <MediumPriority />, color: 'warning' },
    { value: 'high', label: 'Élevée', icon: <PriorityHigh />, color: 'error' },
    { value: 'urgent', label: 'Urgente', icon: <Emergency />, color: 'error' },
  ];

  useEffect(() => {
    loadHelpRequests();
  }, []);

  const loadHelpRequests = async () => {
    setLoading(true);
    try {
      // TODO: Charger les demandes depuis l'API
      // Simuler le chargement
      setTimeout(() => {
        const mockRequests = [
          {
            id: 1,
            title: 'Besoin d\'aide pour courses',
            description: 'Je ne peux pas sortir de chez moi en ce moment. J\'aurais besoin d\'aide pour faire mes courses de base.',
            category: 'shopping',
            priority: 'medium',
            status: 'pending',
            author: {
              name: 'Fatou Camara',
              avatar: null,
              isVerified: true,
            },
            location: {
              region: 'Conakry',
              prefecture: 'Conakry',
              commune: 'Kaloum',
              quartier: 'Centre',
            },
            contactInfo: {
              phone: '+224 123 456 789',
              email: 'fatou@example.com',
            },
            createdAt: new Date(Date.now() - 3600000),
            deadline: new Date(Date.now() + 86400000),
            responses: 2,
            isForNeighbor: false,
          },
          {
            id: 2,
            title: 'Aide médicale urgente',
            description: 'Mon voisin âgé a besoin d\'aide pour se rendre à l\'hôpital. Il a des difficultés à marcher.',
            category: 'health',
            priority: 'urgent',
            status: 'in_progress',
            author: {
              name: 'Mamadou Diallo',
              avatar: null,
              isVerified: true,
            },
            location: {
              region: 'Conakry',
              prefecture: 'Conakry',
              commune: 'Ratoma',
              quartier: 'Kipé',
            },
            contactInfo: {
              phone: '+224 987 654 321',
              email: 'mamadou@example.com',
            },
            createdAt: new Date(Date.now() - 7200000),
            deadline: new Date(Date.now() + 3600000),
            responses: 5,
            isForNeighbor: true,
            neighborInfo: {
              name: 'Moussa Konaté',
              relationship: 'Voisin',
            },
          },
          {
            id: 3,
            title: 'Cours de soutien scolaire',
            description: 'Je cherche quelqu\'un pour aider mon enfant en mathématiques. Niveau collège.',
            category: 'education',
            priority: 'low',
            status: 'completed',
            author: {
              name: 'Aissatou Bah',
              avatar: null,
              isVerified: false,
            },
            location: {
              region: 'Conakry',
              prefecture: 'Conakry',
              commune: 'Dixinn',
              quartier: 'Lansanaya',
            },
            contactInfo: {
              phone: '+224 555 123 456',
              email: 'aissatou@example.com',
            },
            createdAt: new Date(Date.now() - 172800000),
            deadline: new Date(Date.now() - 86400000),
            responses: 3,
            isForNeighbor: false,
          },
        ];

        setRequests(mockRequests);
        setMyRequests(mockRequests.filter(r => r.author.name === user?.firstName + ' ' + user?.lastName));
        
        setStats({
          total: mockRequests.length,
          pending: mockRequests.filter(r => r.status === 'pending').length,
          inProgress: mockRequests.filter(r => r.status === 'in_progress').length,
          completed: mockRequests.filter(r => r.status === 'completed').length,
          urgent: mockRequests.filter(r => r.priority === 'urgent').length,
        });

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
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

  const handleLocationChange = (field, value) => {
    setFormData(prev => {
      const newLocation = { ...prev.location, [field]: value };
      
      // Réinitialiser les champs dépendants quand un niveau supérieur change
      if (field === 'region') {
        newLocation.prefecture = '';
        newLocation.commune = '';
        newLocation.quartier = '';
        newLocation.address = '';
      } else if (field === 'prefecture') {
        newLocation.commune = '';
        newLocation.quartier = '';
        newLocation.address = '';
      } else if (field === 'commune') {
        newLocation.quartier = '';
        newLocation.address = '';
      } else if (field === 'quartier') {
        // Générer automatiquement l'adresse complète
        newLocation.address = `${value}, ${newLocation.commune}, ${newLocation.prefecture}, ${newLocation.region}, Guinée`;
      }
      
      return {
        ...prev,
        location: newLocation
      };
    });
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleNeighborChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      neighborInfo: {
        ...prev.neighborInfo,
        [field]: value
      }
    }));
  };

  const handleCreateRequest = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const newRequest = {
        id: Date.now(),
        ...formData,
        author: {
          name: user?.firstName + ' ' + user?.lastName,
          avatar: user?.profilePicture,
          isVerified: user?.isVerified || false,
        },
        status: 'pending',
        createdAt: new Date(),
        responses: 0,
      };

      setRequests(prev => [newRequest, ...prev]);
      setMyRequests(prev => [newRequest, ...prev]);
      
      setShowCreateDialog(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: {
          region: user?.region || 'Conakry',
          prefecture: user?.prefecture || 'Conakry',
          commune: user?.commune || 'Kaloum',
          quartier: user?.quartier || 'Centre',
          address: '',
        },
        contactInfo: {
          phone: user?.phone || '',
          email: user?.email || '',
          preferredContact: 'phone',
        },
        isForNeighbor: false,
        neighborInfo: {
          name: '',
          phone: '',
          relationship: '',
        },
        deadline: '',
        budget: '',
      });

      setSnackbar({
        open: true,
        message: 'Demande d\'aide créée avec succès !',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création de la demande',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openDetailsDialog = (request) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 0: // Toutes
        return requests;
      case 1: // Mes demandes
        return myRequests;
      case 2: // Urgentes
        return requests.filter(r => r.priority === 'urgent');
      case 3: // En cours
        return requests.filter(r => r.status === 'in_progress');
      default:
        return requests;
    }
  };

  const tabLabels = [
    { label: 'Toutes', icon: <FilterList /> },
    { label: 'Mes demandes', icon: <Person /> },
    { label: 'Urgentes', icon: <Emergency /> },
    { label: 'En cours', icon: <TrendingUp /> },
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des demandes d'aide..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Help sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Demandes d'aide
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Entraide communautaire - Demandez ou proposez de l'aide
            </Typography>
          </Box>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Help color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total demandes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Pending color="warning" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.pending}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      En attente
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="info" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.inProgress}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      En cours
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.completed}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Terminées
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Emergency color="error" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.urgent}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Urgentes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Fab
                    color="primary"
                    size="medium"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Add />
                  </Fab>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  Nouvelle demande
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Onglets */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {tabLabels.map((tab, index) => (
              <Tab 
                key={index}
                label={
                  <Badge badgeContent={index === 1 ? myRequests.length : index === 2 ? stats.urgent : index === 3 ? stats.inProgress : 0} color="primary">
                    {tab.label}
                  </Badge>
                } 
                icon={tab.icon} 
                iconPosition="start"
              />
            ))}
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Liste des demandes */}
            <Grid container spacing={3}>
              {getFilteredRequests().map((request) => (
                <Grid item xs={12} md={6} key={request.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      border: request.priority === 'urgent' ? 2 : 1,
                      borderColor: request.priority === 'urgent' ? 'error.main' : 'divider'
                    }}
                    onClick={() => openDetailsDialog(request)}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: theme.palette[getCategoryInfo(request.category).color].main }}>
                          {getCategoryInfo(request.category).icon}
                        </Avatar>
                      }
                      action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={getPriorityInfo(request.priority).label}
                            size="small"
                            color={getPriorityInfo(request.priority).color}
                            icon={getPriorityInfo(request.priority).icon}
                          />
                          <Chip 
                            label={getStatusLabel(request.status)}
                            size="small"
                            color={getStatusColor(request.status)}
                          />
                        </Box>
                      }
                      title={request.title}
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          {request.author.name}
                          {request.isForNeighbor && (
                            <Chip label="Pour un voisin" size="small" color="info" />
                          )}
                        </Box>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {request.description.length > 100 
                          ? request.description.substring(0, 100) + '...' 
                          : request.description
                        }
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {request.location.quartier}, {request.location.commune}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {request.createdAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Comment fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {request.responses} réponses
                          </Typography>
                        </Box>
                      </Box>

                      {request.deadline && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Échéance: {new Date(request.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {getFilteredRequests().length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Help sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucune demande d'aide
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeTab === 1 ? 'Vous n\'avez pas encore créé de demande d\'aide.' : 'Aucune demande d\'aide disponible pour le moment.'}
                </Typography>
                {activeTab === 1 && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowCreateDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Créer une demande
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Dialog de création de demande */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle demande d'aide</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de la demande"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description détaillée"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Catégorie"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {category.icon}
                        <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priorité</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Priorité"
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {priority.icon}
                        <Typography sx={{ ml: 1 }}>{priority.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Localisation
              </Typography>
            </Grid>

            {/* Localisation */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Localisation
              </Typography>
              <LocationSelector 
                formData={formData.location}
                handleInputChange={(e) => {
                  const { name, value } = e.target;
                  handleLocationChange(name, value);
                }}
                showGPS={true}
                required={true}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                L'adresse complète sera générée automatiquement après la sélection du quartier.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de contact
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Contact préféré</InputLabel>
                <Select
                  value={formData.contactInfo.preferredContact}
                  onChange={(e) => handleContactChange('preferredContact', e.target.value)}
                  label="Contact préféré"
                >
                  <MenuItem value="phone">Téléphone</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Détails supplémentaires
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Échéance (optionnel)"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget (optionnel)"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="Ex: 50000 GNF"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateRequest} variant="contained" disabled={loading}>
            Créer la demande
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
        {selectedRequest && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  {selectedRequest.title}
                </Typography>
                <IconButton onClick={() => setShowDetailsDialog(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={getCategoryInfo(selectedRequest.category).label}
                      color={getCategoryInfo(selectedRequest.category).color}
                      icon={getCategoryInfo(selectedRequest.category).icon}
                    />
                    <Chip 
                      label={getPriorityInfo(selectedRequest.priority).label}
                      color={getPriorityInfo(selectedRequest.priority).color}
                      icon={getPriorityInfo(selectedRequest.priority).icon}
                    />
                    <Chip 
                      label={getStatusLabel(selectedRequest.status)}
                      color={getStatusColor(selectedRequest.status)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" paragraph>
                    {selectedRequest.description}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Auteur
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {selectedRequest.author.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {selectedRequest.author.name}
                    </Typography>
                    {selectedRequest.author.isVerified && (
                      <Verified color="primary" fontSize="small" />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Localisation
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.location.quartier}, {selectedRequest.location.commune}
                    <br />
                    {selectedRequest.location.prefecture}, {selectedRequest.location.region}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body2">
                    📞 {selectedRequest.contactInfo.phone}
                    <br />
                    📧 {selectedRequest.contactInfo.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Informations
                  </Typography>
                  <Typography variant="body2">
                    📅 Créée le {selectedRequest.createdAt.toLocaleDateString()}
                    <br />
                    💬 {selectedRequest.responses} réponses
                    {selectedRequest.deadline && (
                      <>
                        <br />
                        ⏰ Échéance: {new Date(selectedRequest.deadline).toLocaleDateString()}
                      </>
                    )}
                  </Typography>
                </Grid>

                {selectedRequest.isForNeighbor && selectedRequest.neighborInfo && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="subtitle2" gutterBottom>
                        Demande pour un voisin
                      </Typography>
                      <Typography variant="body2">
                        Nom: {selectedRequest.neighborInfo.name}
                        <br />
                        Relation: {selectedRequest.neighborInfo.relationship}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetailsDialog(false)}>Fermer</Button>
              <Button variant="outlined" startIcon={<Share />}>
                Partager
              </Button>
              <Button variant="contained" startIcon={<Comment />}>
                Répondre
              </Button>
            </DialogActions>
          </>
        )}
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

export default HelpPage; 