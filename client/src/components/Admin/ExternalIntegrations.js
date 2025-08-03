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
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AlertTitle
} from '@mui/material';
import {
  Settings,
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  Email,
  Chat,
  CloudUpload,
  Analytics,
  BugReport,
  Notifications,
  ExpandMore,
  Link,
  LinkOff,
  Send,
  Upload,
  TrackChanges,
  Support
} from '@mui/icons-material';
import externalIntegrationsService from '../../services/externalIntegrationsService';

const ExternalIntegrations = () => {
  const [integrations, setIntegrations] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configForm, setConfigForm] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      externalIntegrationsService.init();
      await loadIntegrations();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  };

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const status = externalIntegrationsService.getIntegrationsStatus();
      setIntegrations(status);
    } catch (error) {
      console.error('Erreur lors du chargement des intégrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureIntegration = (integrationKey) => {
    const integration = externalIntegrationsService.integrations[integrationKey];
    setSelectedIntegration(integrationKey);
    setConfigForm(integration.config);
    setDialogOpen(true);
  };

  const handleSaveConfiguration = async () => {
    try {
      setLoading(true);
      const result = externalIntegrationsService.configureIntegration(selectedIntegration, configForm);
      
      if (result.success) {
        await loadIntegrations();
        setDialogOpen(false);
        showSnackbar('Configuration sauvegardée avec succès', 'success');
      } else {
        showSnackbar('Erreur lors de la sauvegarde', 'error');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestIntegration = async (integrationKey) => {
    try {
      setLoading(true);
      const result = await externalIntegrationsService.testIntegration(integrationKey);
      setTestResult(result);
      
      if (result.success) {
        showSnackbar(`Test réussi: ${result.message}`, 'success');
        externalIntegrationsService.updateLastUsed(integrationKey);
        await loadIntegrations();
      } else {
        showSnackbar(`Test échoué: ${result.message}`, 'error');
      }
    } catch (error) {
      showSnackbar('Erreur lors du test', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (configured) => {
    return configured ? 'success' : 'default';
  };

  const getStatusIcon = (configured) => {
    return configured ? <CheckCircle /> : <LinkOff />;
  };

  const getIntegrationIcon = (integrationKey) => {
    switch (integrationKey) {
      case 'email': return <Email />;
      case 'slack': return <Notifications />;
      case 'analytics': return <Analytics />;
      case 'storage': return <CloudUpload />;
      case 'monitoring': return <BugReport />;
      case 'chat': return <Chat />;
      default: return <Link />;
    }
  };

  const getIntegrationDescription = (integrationKey) => {
    const descriptions = {
      email: 'Envoi d\'emails automatisés via SendGrid',
      slack: 'Notifications et alertes en temps réel',
      analytics: 'Suivi des performances et analytics',
      storage: 'Stockage de fichiers et rapports',
      monitoring: 'Surveillance des erreurs et performance',
      chat: 'Support client et chat en direct'
    };
    return descriptions[integrationKey] || '';
  };

  const renderIntegrationCard = (integrationKey, integration) => {
    const isConfigured = integration.configured;
    const lastUsed = integration.lastUsed;
    const daysSinceLastUse = lastUsed ? Math.floor((new Date() - lastUsed) / (1000 * 60 * 60 * 24)) : null;

    return (
      <Grid item xs={12} sm={6} md={4} key={integrationKey}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2, color: isConfigured ? 'success.main' : 'text.secondary' }}>
                {getIntegrationIcon(integrationKey)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div">
                  {integration.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getIntegrationDescription(integrationKey)}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(isConfigured)}
                label={isConfigured ? 'Configuré' : 'Non configuré'}
                color={getStatusColor(isConfigured)}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Statut: {integration.status}
              </Typography>
              {lastUsed && (
                <Typography variant="body2" color="text.secondary">
                  Dernière utilisation: {lastUsed.toLocaleDateString('fr-FR')}
                  {daysSinceLastUse !== null && (
                    <span> ({daysSinceLastUse} jour{daysSinceLastUse > 1 ? 's' : ''})</span>
                  )}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => handleConfigureIntegration(integrationKey)}
              >
                Configurer
              </Button>
              {isConfigured && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<BugReport />}
                  onClick={() => handleTestIntegration(integrationKey)}
                >
                  Tester
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderConfigurationDialog = () => {
    if (!selectedIntegration) return null;

    const integration = externalIntegrationsService.integrations[selectedIntegration];
    const configFields = getConfigFields(selectedIntegration);

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Configurer {integration.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {integration.description}
          </Typography>
          
          <Grid container spacing={2}>
            {configFields.map((field) => (
              <Grid item xs={12} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={configForm[field.key] || ''}
                  onChange={(e) => setConfigForm({ ...configForm, [field.key]: e.target.value })}
                  type={field.type || 'text'}
                  helperText={field.helperText}
                />
              </Grid>
            ))}
          </Grid>

          {testResult && (
            <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
              <AlertTitle>{testResult.success ? 'Test réussi' : 'Test échoué'}</AlertTitle>
              {testResult.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSaveConfiguration} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getConfigFields = (integrationKey) => {
    const fields = {
      email: [
        { key: 'apiKey', label: 'Clé API SendGrid', helperText: 'Votre clé API SendGrid' },
        { key: 'fromEmail', label: 'Email d\'expédition', helperText: 'Email utilisé pour l\'envoi' }
      ],
      slack: [
        { key: 'webhookUrl', label: 'URL Webhook Slack', helperText: 'URL du webhook Slack' }
      ],
      analytics: [
        { key: 'trackingId', label: 'ID de suivi GA', helperText: 'ID de suivi Google Analytics' }
      ],
      storage: [
        { key: 'bucketName', label: 'Nom du bucket S3', helperText: 'Nom de votre bucket AWS S3' },
        { key: 'region', label: 'Région AWS', helperText: 'Région AWS (ex: eu-west-1)' },
        { key: 'accessKey', label: 'Clé d\'accès AWS', helperText: 'Votre clé d\'accès AWS' },
        { key: 'secretKey', label: 'Clé secrète AWS', helperText: 'Votre clé secrète AWS' }
      ],
      monitoring: [
        { key: 'dsn', label: 'DSN Sentry', helperText: 'Votre DSN Sentry' }
      ],
      chat: [
        { key: 'appId', label: 'ID App Intercom', helperText: 'ID de votre application Intercom' },
        { key: 'apiKey', label: 'Clé API Intercom', helperText: 'Votre clé API Intercom' }
      ]
    };
    return fields[integrationKey] || [];
  };

  const renderRecommendations = () => {
    const recommendations = externalIntegrationsService.getRecommendations();
    
    if (recommendations.length === 0) {
      return (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Toutes les intégrations sont configurées !</AlertTitle>
          Vos intégrations externes sont prêtes à être utilisées.
        </Alert>
      );
    }

    return (
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Recommandations d'intégration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {rec.priority === 'high' ? <Error color="error" /> : <Warning color="warning" />}
                </ListItemIcon>
                <ListItemText
                  primary={rec.message}
                  secondary={rec.benefit}
                />
                <Chip 
                  label={rec.priority === 'high' ? 'Priorité haute' : 'Priorité moyenne'}
                  color={rec.priority === 'high' ? 'error' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderUsageStats = () => {
    const stats = externalIntegrationsService.getUsageStats();
    const configuredCount = Object.values(stats).filter(s => s.configured).length;
    const totalCount = Object.keys(stats).length;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="primary">
                {configuredCount}/{totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intégrations configurées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="success.main">
                {Math.round((configuredCount / totalCount) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taux de configuration
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="info.main">
                {Object.values(stats).filter(s => s.lastUsed && s.daysSinceLastUse < 7).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilisées cette semaine
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="warning.main">
                {Object.values(stats).filter(s => s.configured && (!s.lastUsed || s.daysSinceLastUse > 30)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactives (>30 jours)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des intégrations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Intégrations Externes
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadIntegrations}
        >
          Actualiser
        </Button>
      </Box>

      {renderRecommendations()}
      {renderUsageStats()}

      <Typography variant="h6" gutterBottom>
        Intégrations disponibles
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(integrations).map(([key, integration]) => 
          renderIntegrationCard(key, integration)
        )}
      </Grid>

      {renderConfigurationDialog()}

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

export default ExternalIntegrations; 