import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
  LinearProgress,
  AlertTitle
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Block,
  Person,
  Article,
  Report,
  Search,
  FilterList,
  Refresh,
  Visibility,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Star,
  Verified,
  PendingActions,
  CheckCircleOutline
} from '@mui/icons-material';
import UserTestingPanel from '../../components/Admin/UserTestingPanel';
import AnalyticsDashboard from '../../components/Admin/AnalyticsDashboard';
import NotificationPanel from '../../components/Admin/NotificationPanel';
import AdvancedCharts from '../../components/Admin/AdvancedCharts';
import AutomatedReports from '../../components/Admin/AutomatedReports';
import ExternalIntegrations from '../../components/Admin/ExternalIntegrations';
import PerformanceDashboard from '../../components/Admin/PerformanceDashboard';
import analyticsService from '../../services/analyticsService';

const CommuniConseilAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Initialiser l'analytics
  useEffect(() => {
    analyticsService.init('admin');
  }, []);

  // Données mockées améliorées
  const contributors = [
    {
      id: '1',
      name: 'Mamadou Diallo',
      region: 'Conakry',
      expertise: 'Administration publique',
      status: 'pending',
      reliabilityScore: 95,
      email: 'mamadou.diallo@exemple.com',
      phone: '22412345678',
      createdAt: new Date(Date.now() - 86400000 * 7),
      documents: ['CNI', 'Diplôme']
    },
    {
      id: '2',
      name: 'Fatoumata Camara',
      region: 'Kankan',
      expertise: 'Médecine générale',
      status: 'approved',
      reliabilityScore: 88,
      email: 'fatoumata.camara@exemple.com',
      phone: '22487654321',
      createdAt: new Date(Date.now() - 86400000 * 14),
      documents: ['CNI', 'Diplôme médical']
    },
    {
      id: '3',
      name: 'Ibrahima Keita',
      region: 'Labé',
      expertise: 'Droit civil',
      status: 'rejected',
      reliabilityScore: 0,
      email: 'ibrahima.keita@exemple.com',
      phone: '22411223344',
      createdAt: new Date(Date.now() - 86400000 * 3),
      documents: ['CNI']
    }
  ];

  const publications = [
    {
      id: '1',
      title: 'Comment obtenir un acte de naissance rapidement',
      author: 'Mamadou Diallo',
      category: 'Administration',
      status: 'published',
      reports: 0,
      reactions: { thanks: 12, useful: 8 },
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      title: 'Guide des soins de santé primaires',
      author: 'Fatoumata Camara',
      category: 'Santé',
      status: 'published',
      reports: 2,
      reactions: { thanks: 25, useful: 15 },
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: '3',
      title: 'Informations douteuses sur les impôts',
      author: 'Utilisateur Anonyme',
      category: 'Administration',
      status: 'blocked',
      reports: 5,
      reactions: { thanks: 0, useful: 0 },
      createdAt: new Date(Date.now() - 86400000 * 5)
    }
  ];

  const reports = [
    {
      id: '1',
      publicationId: '2',
      publicationTitle: 'Guide des soins de santé primaires',
      reporter: 'Utilisateur 1',
      reason: 'Informations médicales incorrectes',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: '2',
      publicationId: '3',
      publicationTitle: 'Informations douteuses sur les impôts',
      reporter: 'Utilisateur 2',
      reason: 'Fausses informations sur les procédures fiscales',
      status: 'resolved',
      createdAt: new Date(Date.now() - 86400000 * 5)
    }
  ];

  // Statistiques calculées
  const stats = {
    totalContributors: contributors.length,
    pendingContributors: contributors.filter(c => c.status === 'pending').length,
    approvedContributors: contributors.filter(c => c.status === 'approved').length,
    totalPublications: publications.length,
    blockedPublications: publications.filter(p => p.status === 'blocked').length,
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length
  };

  // Filtrage des données
  const filteredContributors = contributors.filter(contributor => {
    const matchesSearch = contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contributor.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contributor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publication.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || publication.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || publication.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTabChange = (event, newValue) => {
    // Tracker la navigation
    analyticsService.trackNavigation(activeTab, newValue);
    
    setActiveTab(newValue);
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const handleApprove = (contributorId) => {
    analyticsService.trackAdminAction('approve', 'contributor', contributorId);
    setSelectedItem({ type: 'contributor', id: contributorId });
    setApprovalDialogOpen(true);
  };

  const handleReject = (contributorId) => {
    analyticsService.trackAdminAction('reject', 'contributor', contributorId);
    setSelectedItem({ type: 'contributor', id: contributorId });
    setApprovalDialogOpen(true);
  };

  const handleBlock = (publicationId) => {
    analyticsService.trackAdminAction('block', 'publication', publicationId);
    setSelectedItem({ type: 'publication', id: publicationId });
    setBlockDialogOpen(true);
  };

  const handleUnblock = (publicationId) => {
    analyticsService.trackAdminAction('unblock', 'publication', publicationId);
    // Logique de déblocage
    console.log('Débloquer publication:', publicationId);
  };

  const handleResolveReport = (reportId) => {
    analyticsService.trackAdminAction('resolve', 'report', reportId);
    // Logique de résolution
    console.log('Résoudre signalement:', reportId);
  };

  const confirmAction = () => {
    analyticsService.trackAdminAction('confirm', selectedItem?.type, selectedItem?.id, { reason });
    setApprovalDialogOpen(false);
    setBlockDialogOpen(false);
    setReason('');
    setSelectedItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'published': return 'success';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleOutline />;
      case 'pending': return <PendingActions />;
      case 'rejected': return <Cancel />;
      case 'published': return <Visibility />;
      case 'blocked': return <Block />;
      default: return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Tableau de bord CommuniConseil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestion des contributeurs et modération des publications
            </Typography>
          </Box>
          <NotificationPanel />
        </Box>
      </Box>

      {/* Statistiques améliorées */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalContributors}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contributeurs
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.approvedContributors / stats.totalContributors) * 100} 
                sx={{ height: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.approvedContributors} approuvés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Article />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalPublications}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publications
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={((stats.totalPublications - stats.blockedPublications) / stats.totalPublications) * 100} 
                sx={{ height: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.blockedPublications} bloquées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Report />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalReports}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Signalements
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.pendingReports / stats.totalReports) * 100} 
                sx={{ height: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.pendingReports} en attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.pendingContributors}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.pendingContributors / stats.totalContributors) * 100} 
                sx={{ height: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                Candidatures à traiter
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onglets */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Vue d'ensemble" />
        <Tab label="Contributeurs" />
        <Tab label="Publications" />
        <Tab label="Signalements" />
        <Tab label="Tests Utilisateur" />
        <Tab label="Analytics" />
        <Tab label="Graphiques" />
                    <Tab label="Rapports" />
            <Tab label="Intégrations" />
            <Tab label="Performance" />
      </Tabs>

      {/* Filtres et recherche */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Statut"
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="approved">Approuvé</MenuItem>
            <MenuItem value="rejected">Rejeté</MenuItem>
            <MenuItem value="published">Publié</MenuItem>
            <MenuItem value="blocked">Bloqué</MenuItem>
          </Select>
        </FormControl>
        {activeTab === 1 && (
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Catégorie"
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="Administration">Administration</MenuItem>
              <MenuItem value="Santé">Santé</MenuItem>
              <MenuItem value="Droit">Droit</MenuItem>
              <MenuItem value="Agriculture">Agriculture</MenuItem>
              <MenuItem value="Sécurité">Sécurité</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button
          startIcon={<Refresh />}
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setCategoryFilter('all');
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Vue d'ensemble
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vue d'ensemble des activités CommuniConseil
          </Typography>
        </Box>
      )}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Contributeurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestion des contributeurs
          </Typography>
        </Box>
      )}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Publications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modération des publications
          </Typography>
        </Box>
      )}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Signalements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestion des signalements
          </Typography>
        </Box>
      )}
      {activeTab === 4 && (
        <UserTestingPanel />
      )}
      {activeTab === 5 && (
        <AnalyticsDashboard />
      )}
      {activeTab === 6 && (
        <AdvancedCharts />
      )}
      {activeTab === 7 && (
        <AutomatedReports />
      )}
      {activeTab === 8 && (
        <ExternalIntegrations />
      )}
      {activeTab === 9 && (
        <PerformanceDashboard />
      )}

      {/* Dialog d'approbation */}
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem?.type === 'contributor' ? 'Gérer le contributeur' : 'Action'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Raison de l'action"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Expliquez votre décision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={confirmAction} variant="contained" color="success">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de blocage */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bloquer la publication</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Attention</AlertTitle>
            Cette action masquera la publication pour tous les utilisateurs.
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="Raison du blocage"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Expliquez pourquoi vous bloquez cette publication..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={confirmAction} variant="contained" color="error">
            Bloquer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommuniConseilAdminDashboard; 