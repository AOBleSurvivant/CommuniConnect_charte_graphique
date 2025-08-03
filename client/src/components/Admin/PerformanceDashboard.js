import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  Speed,
  Memory,
  Error,
  Refresh,
  Storage,
  Analytics
} from '@mui/icons-material';
import performanceService from '../../services/performanceService';
import cacheService from '../../services/cacheService';

const PerformanceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeServices();
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const initializeServices = async () => {
    try {
      await performanceService.init();
      await cacheService.init();
      console.log('📊 Services de performance initialisés');
    } catch (error) {
      console.error('❌ Erreur d\'initialisation:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const perfStats = performanceService.getStats();
      const cacheStatsData = cacheService.getStats();
      
      setStats(perfStats);
      setCacheStats(cacheStatsData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleClearCache = async () => {
    try {
      await cacheService.clear();
      loadData();
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage du cache:', error);
    }
  };

  const getStatusColor = (value, threshold) => {
    const numValue = parseFloat(value);
    if (numValue > threshold) return 'error';
    if (numValue > threshold * 0.8) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard de Performance
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Actualiser
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Temps de Chargement</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats?.avgPageLoadTime || 'N/A'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(parseFloat(stats?.avgPageLoadTime) || 0, 100)}
                color={getStatusColor(stats?.avgPageLoadTime, 2000)}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Seuil: 2000ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Temps API</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats?.avgApiResponseTime || 'N/A'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(parseFloat(stats?.avgApiResponseTime) || 0, 100)}
                color={getStatusColor(stats?.avgApiResponseTime, 1000)}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Seuil: 1000ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Taux d'Erreur</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats?.errorRate || 'N/A'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(parseFloat(stats?.errorRate) || 0, 100)}
                color={getStatusColor(stats?.errorRate, 5)}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Seuil: 5%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Memory color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Mémoire</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats?.avgMemoryUsage || 'N/A'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(parseFloat(stats?.avgMemoryUsage) || 0, 100)}
                color={getStatusColor(stats?.avgMemoryUsage, 50)}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Seuil: 50MB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Cache Frontend</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Taux de Hit
                  </Typography>
                  <Typography variant="h6">
                    {cacheStats?.hitRate || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Requêtes
                  </Typography>
                  <Typography variant="h6">
                    {cacheStats?.totalRequests || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mémoire
                  </Typography>
                  <Typography variant="h6">
                    {cacheStats?.memorySize || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Storage
                  </Typography>
                  <Typography variant="h6">
                    {cacheStats?.storageSize || 0} bytes
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">IndexedDB</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {cacheStats?.indexedDBSize === 'disponible' ? 
                  '✅ IndexedDB disponible' : 
                  '❌ IndexedDB non disponible'
                }
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleClearCache}
                startIcon={<Refresh />}
              >
                Nettoyer le Cache
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceDashboard; 