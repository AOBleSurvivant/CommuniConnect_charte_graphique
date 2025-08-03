import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Speed,
  Error,
  CheckCircle,
  Warning,
  Info,
  Download,
  Refresh,
  Visibility,
  ThumbUp,
  ThumbDown,
  Timer,
  Analytics,
  Assessment,
  Timeline
} from '@mui/icons-material';
import analyticsService from '../../services/analyticsService';

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportData, setExportData] = useState(null);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = () => {
    const dashboardMetrics = analyticsService.getDashboardMetrics();
    const stats = analyticsService.getStats();
    setMetrics({ ...dashboardMetrics, ...stats });
  };

  const handleExport = () => {
    const data = analyticsService.exportData();
    setExportData(data);
    setShowExportDialog(true);
  };

  const downloadExport = () => {
    if (!exportData) return;
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  if (!metrics) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Chargement des métriques...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          📊 Analytics - Tableau de Bord Admin
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadMetrics}
            variant="outlined"
          >
            Actualiser
          </Button>
          <Button
            startIcon={<Download />}
            onClick={handleExport}
            variant="contained"
          >
            Exporter
          </Button>
        </Box>
      </Box>

      {/* Métriques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics sx={{ color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{metrics.totalEvents}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Événements totaux
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, metrics.totalEvents / 10)} 
                sx={{ height: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{formatDuration(metrics.averageSessionDuration)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Durée session
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, metrics.averageSessionDuration / 300000)} 
                sx={{ height: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{Math.round(metrics.performance?.successRate || 0)}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taux de succès
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.performance?.successRate || 0} 
                sx={{ height: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUp sx={{ color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{Math.round(metrics.userSatisfaction || 0)}/5</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Satisfaction
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(metrics.userSatisfaction || 0) * 20} 
                sx={{ height: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Détails des performances */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance des Opérations
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Opérations totales : {metrics.performance?.totalOperations || 0}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Durée moyenne : {Math.round(metrics.performance?.averageDuration || 0)}ms
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Taux de succès : {Math.round(metrics.performance?.successRate || 0)}%
                </Typography>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={metrics.performance?.successRate || 0} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions Utilisateur
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Actions totales : {metrics.userActions?.totalActions || 0}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Action la plus fréquente : {metrics.userActions?.mostCommonAction || 'Aucune'}
                </Typography>
              </Box>

              {metrics.userActions?.actionsByType && (
                <Box>
                  {Object.entries(metrics.userActions.actionsByType).map(([action, count]) => (
                    <Box key={action} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{action}</Typography>
                      <Chip label={count} size="small" />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activité récente */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activité Récente
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Événement</TableCell>
                  <TableCell>Détails</TableCell>
                  <TableCell>Heure</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.recentActivity?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Chip 
                        label={event.eventName} 
                        size="small"
                        color={
                          event.eventName === 'error' ? 'error' :
                          event.eventName === 'admin_action' ? 'primary' :
                          event.eventName === 'user_test' ? 'success' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.eventName === 'admin_action' && `${event.properties.action} ${event.properties.targetType}`}
                        {event.eventName === 'navigation' && `${event.properties.from} → ${event.properties.to}`}
                        {event.eventName === 'search' && `Recherche: "${event.properties.query}"`}
                        {event.eventName === 'user_test' && `Test: ${event.properties.scenarioId}`}
                        {event.eventName === 'error' && event.properties.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatTime(event.timestamp)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Événements par type */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Répartition des Événements
          </Typography>
          
          <Grid container spacing={2}>
            {metrics.eventsByType && Object.entries(metrics.eventsByType).map(([eventType, count]) => (
              <Grid item xs={12} sm={6} md={3} key={eventType}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="h4" color="primary">
                    {count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {eventType}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog d'export */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Exporter les Données Analytics</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Les données d'analytics incluent tous les événements, statistiques et métriques collectés.
          </Alert>
          
          {exportData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Résumé de l'export
              </Typography>
              <Typography variant="body2" gutterBottom>
                • {exportData.events.length} événements
              </Typography>
              <Typography variant="body2" gutterBottom>
                • {Object.keys(exportData.stats.eventsByType).length} types d'événements
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Date d'export : {new Date(exportData.exportDate).toLocaleString('fr-FR')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>
            Annuler
          </Button>
          <Button onClick={downloadExport} variant="contained">
            Télécharger
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalyticsDashboard; 