import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Report as ReportIcon,
  Flag as FlagIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  PostAdd as PostIcon,
  LiveTv as LiveIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { formatError } from '../../utils/errorHandler';

const ModerationPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoModeration, setAutoModeration] = useState(true);

  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Données fictives pour la démonstration
  const [reports, setReports] = useState([
    {
      id: '1',
          type: 'post',
      status: 'pending',
      severity: 'high',
      reporter: { name: 'Mamadou Diallo', avatar: null },
      reportedItem: {
        id: 'post-1',
        title: 'Post inapproprié',
        content: 'Contenu signalé comme inapproprié...',
        author: { name: 'Utilisateur Signalé', avatar: null }
      },
      reason: 'Contenu inapproprié',
      description: 'Ce post contient du contenu offensant',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'Kaloum, Conakry'
    },
    {
      id: '2',
      type: 'message',
      status: 'investigating',
      severity: 'medium',
      reporter: { name: 'Fatou Camara', avatar: null },
      reportedItem: {
        id: 'message-1',
        content: 'Message signalé...',
        author: { name: 'Utilisateur Signalé', avatar: null }
      },
      reason: 'Harcèlement',
      description: 'Messages répétés et harcelants',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      location: 'Dixinn, Conakry'
    },
    {
      id: '3',
      type: 'livestream',
      status: 'resolved',
      severity: 'low',
      reporter: { name: 'Ibrahima Bah', avatar: null },
      reportedItem: {
        id: 'livestream-1',
        title: 'Live signalé',
        author: { name: 'Utilisateur Signalé', avatar: null }
      },
      reason: 'Contenu inapproprié',
      description: 'Contenu du livestream inapproprié',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: 'Ratoma, Conakry'
    }
  ]);

  const [moderationLogs, setModerationLogs] = useState([
    {
      id: '1',
      action: 'delete',
          type: 'post',
      moderator: 'Admin',
      target: 'Post supprimé',
          reason: 'Contenu inapproprié',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '2',
      action: 'warn',
      type: 'user',
      moderator: 'Modérateur',
      target: 'Utilisateur averti',
      reason: 'Comportement inapproprié',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ]);

  const [stats, setStats] = useState({
        totalReports: 15,
    pendingReports: 5,
    resolvedReports: 10,
    bannedUsers: 2,
    deletedContent: 8,
    warningsIssued: 12
  });

  useEffect(() => {
    // Charger les données de modération
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    setLoading(true);
    try {
      // Simulation de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const handleModerationAction = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setShowActionDialog(true);
  };

  const executeModerationAction = async () => {
    if (!actionReason.trim()) {
      setError('Veuillez fournir une raison pour cette action');
      return;
    }

    setLoading(true);
    try {
      // Simulation d'action de modération
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour le statut du signalement
      setReports(prev => prev.map(report => 
        report.id === selectedItem.id 
          ? { ...report, status: actionType === 'delete' ? 'resolved' : 'investigating' }
          : report
      ));

      // Ajouter à l'historique
      const newLog = {
        id: Date.now().toString(),
        action: actionType,
        type: selectedItem.type,
        moderator: user?.firstName || 'Modérateur',
        target: selectedItem.reportedItem.title || selectedItem.reportedItem.content,
        reason: actionReason,
        timestamp: new Date()
      };

      setModerationLogs(prev => [newLog, ...prev]);

      setSuccess(`Action de modération exécutée avec succès`);
      setShowActionDialog(false);
      setActionReason('');
      setSelectedItem(null);
    } catch (error) {
      setError('Erreur lors de l\'exécution de l\'action');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post':
        return <PostIcon />;
      case 'message':
        return <MessageIcon />;
      case 'livestream':
        return <LiveIcon />;
      case 'event':
        return <EventIcon />;
      case 'user':
        return <PersonIcon />;
      default:
        return <FlagIcon />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'investigating':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'delete':
        return 'error';
      case 'warn':
        return 'warning';
      case 'ban':
        return 'error';
      case 'approve':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredReports = reports.filter(report => {
    const typeMatch = filterType === 'all' || report.type === filterType;
    const statusMatch = filterStatus === 'all' || report.status === filterStatus;
    const searchMatch = !searchQuery || 
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedItem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedItem.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && statusMatch && searchMatch;
  });

  const filteredLogs = moderationLogs.filter(log => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const searchMatch = !searchQuery || 
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  return (
    <Box sx={{ p: 3 }}>
        {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🛡️ Espace de Modération
            </Typography>
            <Typography variant="body1" color="text.secondary">
            Gérez les signalements et maintenez la qualité de la communauté
            </Typography>
          </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoModeration}
                onChange={(e) => setAutoModeration(e.target.checked)}
              />
            }
            label="Modération automatique"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadModerationData}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Messages d'état */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {formatError(error)}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

        {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.totalReports}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                Signalements totaux
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats.pendingReports}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                En attente
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats.resolvedReports}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                Résolus
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" gutterBottom>
                {stats.bannedUsers}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Utilisateurs bannis
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" gutterBottom>
                {stats.deletedContent}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                Contenu supprimé
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats.warningsIssued}
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                Avertissements
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Tous les types</MenuItem>
            <MenuItem value="post">Posts</MenuItem>
            <MenuItem value="message">Messages</MenuItem>
            <MenuItem value="livestream">Livestreams</MenuItem>
            <MenuItem value="event">Événements</MenuItem>
            <MenuItem value="user">Utilisateurs</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filterStatus}
            label="Statut"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="investigating">En cours</MenuItem>
            <MenuItem value="resolved">Résolu</MenuItem>
            <MenuItem value="dismissed">Rejeté</MenuItem>
          </Select>
        </FormControl>
      </Box>

        {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Signalements
                <Badge badgeContent={stats.pendingReports} color="error" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Historique
                <Badge badgeContent={moderationLogs.length} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Paramètres
                <SettingsIcon />
              </Box>
            } 
          />
          </Tabs>
      </Box>

          {/* Contenu des onglets */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
            {/* Onglet Signalements */}
            {activeTab === 0 && (
            <Grid container spacing={3}>
              {filteredReports.length === 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun signalement trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                        ? 'Aucun signalement ne correspond à vos filtres.'
                        : 'Aucun signalement en attente de modération.'
                      }
                    </Typography>
                  </Card>
                </Grid>
              ) : (
                filteredReports.map((report) => (
                  <Grid item xs={12} md={6} key={report.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getTypeIcon(report.type)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {report.reportedItem.title || 'Signalement'}
                            </Typography>
                          <Chip
                            label={report.severity}
                            color={getSeverityColor(report.severity)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={report.status}
                            color={getStatusColor(report.status)}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {report.reportedItem.content}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Signalé par {report.reporter.name} • {report.reason}
                          </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          {report.location} • {report.createdAt.toLocaleDateString()}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetails(report)}
                        >
                          Détails
                        </Button>
                        <Button
                          size="small"
                          color="warning"
                          startIcon={<WarningIcon />}
                          onClick={() => handleModerationAction(report, 'warn')}
                        >
                          Avertir
                        </Button>
                        <Button
                                  size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleModerationAction(report, 'delete')}
                        >
                          Supprimer
                        </Button>
                        <Button
                                  size="small"
                                  color="error"
                          startIcon={<BlockIcon />}
                          onClick={() => handleModerationAction(report, 'ban')}
                        >
                          Bannir
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Onglet Historique */}
            {activeTab === 1 && (
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                    <TableCell>Action</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Modérateur</TableCell>
                    <TableCell>Cible</TableCell>
                      <TableCell>Raison</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell>
                          <Chip 
                          label={log.action}
                          color={getActionColor(log.action)}
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getTypeIcon(log.type)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {log.type}
                            </Typography>
                          </Box>
                        </TableCell>
                      <TableCell>{log.moderator}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>{log.timestamp.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

          {/* Onglet Paramètres */}
          {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Paramètres de modération automatique
                      </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Détection automatique de contenu inapproprié"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Filtrage automatique des mots interdits"
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Modération automatique des images"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Notifications pour les signalements critiques"
                      />
                    </Box>
                    </CardContent>
                  </Card>
                </Grid>
              
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Seuils de modération
                      </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Seuil d'avertissement"
                        type="number"
                        defaultValue={3}
                        helperText="Nombre de signalements avant avertissement"
                      />
                      <TextField
                        label="Seuil de suspension"
                        type="number"
                        defaultValue={5}
                        helperText="Nombre de signalements avant suspension"
                      />
                      <TextField
                        label="Seuil de bannissement"
                        type="number"
                        defaultValue={10}
                        helperText="Nombre de signalements avant bannissement"
                      />
                    </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
        </>
      )}

      {/* Dialog de détails */}
      <Dialog 
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
            <DialogTitle>
          Détails du signalement
            </DialogTitle>
            <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedItem.reportedItem.title || 'Signalement'}
                  </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedItem.reportedItem.content}
                    </Typography>
              <Typography variant="body2" paragraph>
                <strong>Raison :</strong> {selectedItem.reason}
                    </Typography>
              <Typography variant="body2" paragraph>
                <strong>Description :</strong> {selectedItem.description}
                    </Typography>
              <Typography variant="body2" paragraph>
                <strong>Signalé par :</strong> {selectedItem.reporter.name}
                    </Typography>
              <Typography variant="body2" paragraph>
                <strong>Localisation :</strong> {selectedItem.location}
                    </Typography>
                    <Typography variant="body2">
                <strong>Date :</strong> {selectedItem.createdAt.toLocaleString()}
                    </Typography>
            </Box>
          )}
            </DialogContent>
            <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'action de modération */}
      <Dialog
        open={showActionDialog}
        onClose={() => setShowActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Action de modération - {actionType}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Raison de l'action"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="Expliquez la raison de cette action de modération..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActionDialog(false)}>
            Annuler
                  </Button>
                  <Button 
            onClick={executeModerationAction}
                    variant="contained"
            color={actionType === 'delete' || actionType === 'ban' ? 'error' : 'warning'}
            disabled={!actionReason.trim() || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Exécuter'}
                  </Button>
            </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModerationPage; 