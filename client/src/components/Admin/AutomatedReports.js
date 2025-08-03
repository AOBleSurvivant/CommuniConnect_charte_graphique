import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Download,
  Schedule,
  Email,
  Visibility,
  VisibilityOff,
  Refresh,
  Assessment,
  Timeline,
  TrendingUp,
  People,
  Article,
  Report,
  BarChart,
  Analytics,
  CheckCircle,
  Error,
  Warning,
  Info,
  CalendarToday,
  AccessTime,
  Send
} from '@mui/icons-material';
import reportService from '../../services/reportService';

const AutomatedReports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // États pour les formulaires
  const [reportForm, setReportForm] = useState({
    type: 'daily',
    recipients: ['admin'],
    sections: ['metrics']
  });

  const [scheduleForm, setScheduleForm] = useState({
    type: 'daily',
    frequency: 'daily',
    recipients: ['admin'],
    isActive: true
  });

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      reportService.init();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const reportsData = reportService.getReports();
      const schedulesData = reportService.getSchedules();
      const statsData = reportService.getStats();

      setReports(reportsData);
      setSchedules(schedulesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const report = await reportService.generateReport(reportForm.type);
      await loadData();
      setDialogOpen(false);
      showSnackbar('Rapport généré avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors de la génération du rapport', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReport = async () => {
    try {
      setLoading(true);
      const schedule = reportService.scheduleReport(
        scheduleForm.type,
        scheduleForm.frequency,
        scheduleForm.recipients
      );
      await loadData();
      setScheduleDialogOpen(false);
      showSnackbar('Rapport planifié avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors de la planification du rapport', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const success = reportService.deleteReport(reportId);
      if (success) {
        await loadData();
        showSnackbar('Rapport supprimé avec succès', 'success');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const success = reportService.deleteSchedule(scheduleId);
      if (success) {
        await loadData();
        showSnackbar('Planification supprimée avec succès', 'success');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleSchedule = async (scheduleId) => {
    try {
      const success = reportService.toggleSchedule(scheduleId);
      if (success) {
        await loadData();
        showSnackbar('Planification mise à jour', 'success');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleExportReport = async (reportId) => {
    try {
      const exportData = reportService.exportReport(reportId);
      showSnackbar(`Rapport exporté: ${exportData.filename}`, 'success');
    } catch (error) {
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generated': return 'primary';
      case 'sent': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generated': return <Info />;
      case 'sent': return <CheckCircle />;
      case 'error': return <Error />;
      default: return <Warning />;
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      default: return frequency;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="primary">
                {stats.totalReports}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rapports générés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="secondary">
                {stats.totalSchedules}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Planifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="success.main">
                {stats.activeSchedules}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Planifications actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="info.main">
                {Object.keys(stats.reportsByType).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Types de rapports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderReportsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Rapports Générés</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Générer un rapport
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Généré le</TableCell>
              <TableCell>Destinataires</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {report.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={report.type} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(report.status)}
                    label={report.status}
                    color={getStatusColor(report.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(report.generatedAt)}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {report.recipients.join(', ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Voir le rapport">
                      <IconButton size="small" onClick={() => setSelectedReport(report)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Exporter">
                      <IconButton size="small" onClick={() => handleExportReport(report.id)}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderSchedulesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Planifications</Typography>
        <Button
          variant="contained"
          startIcon={<Schedule />}
          onClick={() => setScheduleDialogOpen(true)}
        >
          Planifier un rapport
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Fréquence</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Prochaine exécution</TableCell>
              <TableCell>Dernière exécution</TableCell>
              <TableCell>Destinataires</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {schedule.config.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getFrequencyLabel(schedule.frequency)} 
                    size="small" 
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={schedule.isActive ? <CheckCircle /> : <VisibilityOff />}
                    label={schedule.isActive ? 'Actif' : 'Inactif'}
                    color={schedule.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {schedule.nextRun ? formatDate(schedule.nextRun) : 'Non défini'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {schedule.lastRun ? formatDate(schedule.lastRun) : 'Jamais'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {schedule.recipients.join(', ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={schedule.isActive ? 'Désactiver' : 'Activer'}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleSchedule(schedule.id)}
                      >
                        {schedule.isActive ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderReportDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Générer un rapport</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type de rapport</InputLabel>
              <Select
                value={reportForm.type}
                onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                label="Type de rapport"
              >
                <MenuItem value="daily">Rapport Quotidien</MenuItem>
                <MenuItem value="weekly">Rapport Hebdomadaire</MenuItem>
                <MenuItem value="monthly">Rapport Mensuel</MenuItem>
                <MenuItem value="custom">Rapport Personnalisé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Destinataires (séparés par des virgules)"
              value={reportForm.recipients.join(', ')}
              onChange={(e) => setReportForm({ 
                ...reportForm, 
                recipients: e.target.value.split(',').map(s => s.trim()) 
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
        <Button 
          onClick={handleGenerateReport} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Génération...' : 'Générer'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderScheduleDialog = () => (
    <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Planifier un rapport</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type de rapport</InputLabel>
              <Select
                value={scheduleForm.type}
                onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                label="Type de rapport"
              >
                <MenuItem value="daily">Rapport Quotidien</MenuItem>
                <MenuItem value="weekly">Rapport Hebdomadaire</MenuItem>
                <MenuItem value="monthly">Rapport Mensuel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Fréquence</InputLabel>
              <Select
                value={scheduleForm.frequency}
                onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                label="Fréquence"
              >
                <MenuItem value="daily">Quotidien</MenuItem>
                <MenuItem value="weekly">Hebdomadaire</MenuItem>
                <MenuItem value="monthly">Mensuel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Destinataires (séparés par des virgules)"
              value={scheduleForm.recipients.join(', ')}
              onChange={(e) => setScheduleForm({ 
                ...scheduleForm, 
                recipients: e.target.value.split(',').map(s => s.trim()) 
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleForm.isActive}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, isActive: e.target.checked })}
                />
              }
              label="Activer immédiatement"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setScheduleDialogOpen(false)}>Annuler</Button>
        <Button 
          onClick={handleScheduleReport} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Planification...' : 'Planifier'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderReportDetailsDialog = () => (
    <Dialog 
      open={Boolean(selectedReport)} 
      onClose={() => setSelectedReport(null)} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        Détails du rapport: {selectedReport?.name}
      </DialogTitle>
      <DialogContent>
        {selectedReport && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedReport.type}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Statut</Typography>
                <Chip
                  icon={getStatusIcon(selectedReport.status)}
                  label={selectedReport.status}
                  color={getStatusColor(selectedReport.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Généré le</Typography>
                <Typography variant="body1">{formatDate(selectedReport.generatedAt)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Destinataires</Typography>
                <Typography variant="body1">{selectedReport.recipients.join(', ')}</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Sections incluses</Typography>
            <List dense>
              {selectedReport.sections.map((section, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {section === 'metrics' && <Assessment />}
                    {section === 'trends' && <TrendingUp />}
                    {section === 'contributors' && <People />}
                    {section === 'publications' && <Article />}
                    {section === 'reports' && <Report />}
                    {section === 'charts' && <BarChart />}
                    {section === 'analytics' && <Analytics />}
                  </ListItemIcon>
                  <ListItemText primary={section} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedReport(null)}>Fermer</Button>
        <Button 
          onClick={() => selectedReport && handleExportReport(selectedReport.id)}
          variant="contained"
          startIcon={<Download />}
        >
          Exporter
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Rapports Automatisés
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadData}
        >
          Actualiser
        </Button>
      </Box>

      {renderStats()}

      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Rapports Générés" />
            <Tab label="Planifications" />
          </Tabs>

          {activeTab === 0 && renderReportsTab()}
          {activeTab === 1 && renderSchedulesTab()}
        </CardContent>
      </Card>

      {renderReportDialog()}
      {renderScheduleDialog()}
      {renderReportDetailsDialog()}

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
    </Box>
  );
};

export default AutomatedReports; 