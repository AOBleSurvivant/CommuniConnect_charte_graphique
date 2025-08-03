// Service de données pour les graphiques et visualisations

class ChartDataService {
  constructor() {
    this.mockData = this.generateMockData();
  }

  // Générer des données de démo
  generateMockData() {
    const now = new Date();
    const last30Days = [];
    const last12Months = [];
    
    // Données des 30 derniers jours
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      last30Days.push({
        date: date.toISOString().split('T')[0],
        publications: Math.floor(Math.random() * 20) + 5,
        signalements: Math.floor(Math.random() * 8) + 1,
        candidatures: Math.floor(Math.random() * 15) + 3,
        tests: Math.floor(Math.random() * 10) + 2
      });
    }

    // Données des 12 derniers mois
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      last12Months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        publications: Math.floor(Math.random() * 500) + 100,
        signalements: Math.floor(Math.random() * 200) + 50,
        candidatures: Math.floor(Math.random() * 300) + 80,
        tests: Math.floor(Math.random() * 150) + 30
      });
    }

    return {
      last30Days,
      last12Months,
      categories: [
        { name: 'Médecine', count: 45, color: '#2196F3' },
        { name: 'Nutrition', count: 32, color: '#4CAF50' },
        { name: 'Fitness', count: 28, color: '#FF9800' },
        { name: 'Santé mentale', count: 23, color: '#9C27B0' },
        { name: 'Dermatologie', count: 19, color: '#F44336' },
        { name: 'Autres', count: 15, color: '#607D8B' }
      ],
      contributeurs: [
        { status: 'Approuvé', count: 156, color: '#4CAF50' },
        { status: 'En attente', count: 23, color: '#FF9800' },
        { status: 'Rejeté', count: 8, color: '#F44336' }
      ],
      performance: [
        { scenario: 'Gestion contributeurs', avgTime: 145, successRate: 92 },
        { scenario: 'Modération publications', avgTime: 203, successRate: 88 },
        { scenario: 'Recherche avancée', avgTime: 89, successRate: 95 },
        { scenario: 'Gestion signalements', avgTime: 167, successRate: 90 },
        { scenario: 'Vue d\'ensemble', avgTime: 78, successRate: 97 }
      ],
      notifications: [
        { type: 'Signalements', count: 45, urgent: 12 },
        { type: 'Candidatures', count: 67, urgent: 0 },
        { type: 'Actions admin', count: 234, urgent: 0 },
        { type: 'Tests utilisateur', count: 23, urgent: 0 },
        { type: 'Système', count: 89, urgent: 0 }
      ]
    };
  }

  // Obtenir les données de tendances temporelles
  getTimeSeriesData(period = '30days') {
    if (period === '30days') {
      return this.mockData.last30Days.map(item => ({
        name: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        publications: item.publications,
        signalements: item.signalements,
        candidatures: item.candidatures,
        tests: item.tests
      }));
    } else {
      return this.mockData.last12Months.map(item => ({
        name: item.month,
        publications: item.publications,
        signalements: item.signalements,
        candidatures: item.candidatures,
        tests: item.tests
      }));
    }
  }

  // Obtenir les données de répartition par catégorie
  getCategoryData() {
    return this.mockData.categories;
  }

  // Obtenir les données de statut des contributeurs
  getContributorStatusData() {
    return this.mockData.contributeurs;
  }

  // Obtenir les données de performance des tests
  getPerformanceData() {
    return this.mockData.performance;
  }

  // Obtenir les données de notifications
  getNotificationData() {
    return this.mockData.notifications;
  }

  // Obtenir les métriques principales
  getMainMetrics() {
    const today = this.mockData.last30Days[this.mockData.last30Days.length - 1];
    const yesterday = this.mockData.last30Days[this.mockData.last30Days.length - 2];
    
    return {
      publications: {
        current: today.publications,
        previous: yesterday.publications,
        change: ((today.publications - yesterday.publications) / yesterday.publications * 100).toFixed(1)
      },
      signalements: {
        current: today.signalements,
        previous: yesterday.signalements,
        change: ((today.signalements - yesterday.signalements) / yesterday.signalements * 100).toFixed(1)
      },
      candidatures: {
        current: today.candidatures,
        previous: yesterday.candidatures,
        change: ((today.candidatures - yesterday.candidatures) / yesterday.candidatures * 100).toFixed(1)
      },
      tests: {
        current: today.tests,
        previous: yesterday.tests,
        change: ((today.tests - yesterday.tests) / yesterday.tests * 100).toFixed(1)
      }
    };
  }

  // Obtenir les données pour graphique en ligne
  getLineChartData(metric = 'publications') {
    return this.mockData.last30Days.map(item => ({
      date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      value: item[metric]
    }));
  }

  // Obtenir les données pour graphique en barres
  getBarChartData(metric = 'publications') {
    return this.mockData.last12Months.map(item => ({
      month: item.month,
      value: item[metric]
    }));
  }

  // Obtenir les données pour graphique circulaire
  getPieChartData(type = 'categories') {
    if (type === 'categories') {
      return this.mockData.categories;
    } else if (type === 'contributors') {
      return this.mockData.contributeurs;
    } else if (type === 'notifications') {
      return this.mockData.notifications;
    }
    return [];
  }

  // Obtenir les données pour graphique radar (performance)
  getRadarChartData() {
    return this.mockData.performance.map(item => ({
      subject: item.scenario,
      'Temps moyen (s)': item.avgTime,
      'Taux de succès (%)': item.successRate
    }));
  }

  // Obtenir les données pour graphique de progression
  getProgressData() {
    const totalContributors = this.mockData.contributeurs.reduce((sum, item) => sum + item.count, 0);
    const approvedContributors = this.mockData.contributeurs.find(item => item.status === 'Approuvé')?.count || 0;
    
    return {
      contributors: {
        current: approvedContributors,
        total: totalContributors,
        percentage: Math.round((approvedContributors / totalContributors) * 100)
      },
      publications: {
        current: 1247,
        total: 1500,
        percentage: Math.round((1247 / 1500) * 100)
      },
      tests: {
        current: 89,
        total: 100,
        percentage: Math.round((89 / 100) * 100)
      },
      satisfaction: {
        current: 4.2,
        total: 5,
        percentage: Math.round((4.2 / 5) * 100)
      }
    };
  }

  // Obtenir les données pour heatmap
  getHeatmapData() {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    return days.map(day => 
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 50) + 5
      }))
    ).flat();
  }

  // Obtenir les données pour graphique de dispersion
  getScatterData() {
    return this.mockData.performance.map(item => ({
      x: item.avgTime,
      y: item.successRate,
      label: item.scenario
    }));
  }

  // Obtenir les données pour graphique de tendances
  getTrendData(metric = 'publications', period = 7) {
    const recentData = this.mockData.last30Days.slice(-period);
    return recentData.map((item, index) => ({
      day: index + 1,
      value: item[metric],
      trend: index > 0 ? (item[metric] > recentData[index - 1][metric] ? 'up' : 'down') : 'stable'
    }));
  }

  // Obtenir les données pour tableau de bord
  getDashboardData() {
    return {
      metrics: this.getMainMetrics(),
      timeSeries: this.getTimeSeriesData(),
      categories: this.getCategoryData(),
      contributors: this.getContributorStatusData(),
      performance: this.getPerformanceData(),
      notifications: this.getNotificationData(),
      progress: this.getProgressData()
    };
  }

  // Mettre à jour les données en temps réel
  updateData() {
    // Simuler des mises à jour en temps réel
    const lastDay = this.mockData.last30Days[this.mockData.last30Days.length - 1];
    lastDay.publications += Math.floor(Math.random() * 3) - 1;
    lastDay.signalements += Math.floor(Math.random() * 2) - 0;
    lastDay.candidatures += Math.floor(Math.random() * 2) - 0;
    lastDay.tests += Math.floor(Math.random() * 1) - 0;
    
    // S'assurer que les valeurs restent positives
    lastDay.publications = Math.max(1, lastDay.publications);
    lastDay.signalements = Math.max(0, lastDay.signalements);
    lastDay.candidatures = Math.max(0, lastDay.candidatures);
    lastDay.tests = Math.max(0, lastDay.tests);
  }
}

// Instance singleton
const chartDataService = new ChartDataService();

export default chartDataService; 