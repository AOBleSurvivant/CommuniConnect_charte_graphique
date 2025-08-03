import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Fullscreen,
  Download,
  Timeline,
  BarChart,
  PieChart,
  Radar,
  ScatterPlot
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import chartDataService from '../../services/chartDataService';

const AdvancedCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('publications');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [chartType, setChartType] = useState('line');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadChartData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        chartDataService.updateData();
        loadChartData();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadChartData = () => {
    const data = chartDataService.getDashboardData();
    setChartData(data);
  };

  const handleRefresh = () => {
    loadChartData();
  };

  const getMetricColor = (metric) => {
    const colors = {
      publications: '#2196F3',
      signalements: '#F44336',
      candidatures: '#4CAF50',
      tests: '#FF9800'
    };
    return colors[metric] || '#607D8B';
  };

  const getMetricLabel = (metric) => {
    const labels = {
      publications: 'Publications',
      signalements: 'Signalements',
      candidatures: 'Candidatures',
      tests: 'Tests'
    };
    return labels[metric] || metric;
  };

  const renderLineChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getLineChartData(selectedMetric);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getMetricColor(selectedMetric)}
            strokeWidth={2}
            dot={{ fill: getMetricColor(selectedMetric), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderAreaChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getTimeSeriesData(selectedPeriod);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey={selectedMetric}
            stackId="1"
            stroke={getMetricColor(selectedMetric)}
            fill={getMetricColor(selectedMetric)}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getBarChartData(selectedMetric);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="value" fill={getMetricColor(selectedMetric)} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getPieChartData('categories');
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  const renderRadarChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getRadarChartData();
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <RechartsRadar
            name="Temps moyen (s)"
            dataKey="Temps moyen (s)"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <RechartsRadar
            name="Taux de succès (%)"
            dataKey="Taux de succès (%)"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <RechartsTooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderScatterChart = () => {
    if (!chartData) return null;

    const data = chartDataService.getScatterData();
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Temps moyen" />
          <YAxis type="number" dataKey="y" name="Taux de succès" />
          <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Performance" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'radar':
        return renderRadarChart();
      case 'scatter':
        return renderScatterChart();
      default:
        return renderLineChart();
    }
  };

  const renderMetricsCards = () => {
    if (!chartData) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(chartData.metrics).map(([key, metric]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" component="div" color="primary">
                      {metric.current}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getMetricLabel(key)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {metric.change > 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={metric.change > 0 ? 'success.main' : 'error.main'}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderProgressCards = () => {
    if (!chartData) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(chartData.progress).map(([key, progress]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {progress.percentage}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {progress.current} / {progress.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Chargement des données...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Graphiques et Visualisations
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Actualiser">
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualisation automatique">
            <IconButton
              color={autoRefresh ? 'primary' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Timeline />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Métriques principales */}
      {renderMetricsCards()}

      {/* Cartes de progression */}
      {renderProgressCards()}

      {/* Contrôles du graphique */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Métrique</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  label="Métrique"
                >
                  <MenuItem value="publications">Publications</MenuItem>
                  <MenuItem value="signalements">Signalements</MenuItem>
                  <MenuItem value="candidatures">Candidatures</MenuItem>
                  <MenuItem value="tests">Tests</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Période</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Période"
                >
                  <MenuItem value="30days">30 jours</MenuItem>
                  <MenuItem value="12months">12 mois</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={(e, newType) => newType && setChartType(newType)}
                size="small"
              >
                <ToggleButton value="line">
                  <Timeline />
                </ToggleButton>
                <ToggleButton value="area">
                  <BarChart />
                </ToggleButton>
                <ToggleButton value="bar">
                  <BarChart />
                </ToggleButton>
                <ToggleButton value="pie">
                  <PieChart />
                </ToggleButton>
                <ToggleButton value="radar">
                  <Radar />
                </ToggleButton>
                <ToggleButton value="scatter">
                  <ScatterPlot />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Graphique principal */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {getMetricLabel(selectedMetric)} - {chartType === 'line' ? 'Évolution' : 
             chartType === 'area' ? 'Aire' :
             chartType === 'bar' ? 'Barres' :
             chartType === 'pie' ? 'Répartition' :
             chartType === 'radar' ? 'Performance' :
             'Dispersion'}
          </Typography>
          {renderChart()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvancedCharts; 