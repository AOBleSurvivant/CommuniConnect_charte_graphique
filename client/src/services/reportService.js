// Service de rapports automatisés pour CommuniConseil

class ReportService {
  constructor() {
    this.reports = [];
    this.schedules = [];
    this.templates = this.initializeTemplates();
    this.isInitialized = false;
  }

  initializeTemplates() {
    return {
      daily: {
        name: 'Rapport Quotidien',
        description: 'Résumé des activités de la journée',
        frequency: 'daily',
        sections: ['metrics', 'contributors', 'publications', 'reports'],
        recipients: ['admin'],
        format: 'pdf'
      },
      weekly: {
        name: 'Rapport Hebdomadaire',
        description: 'Analyse des tendances de la semaine',
        frequency: 'weekly',
        sections: ['metrics', 'trends', 'contributors', 'publications', 'reports', 'charts'],
        recipients: ['admin', 'managers'],
        format: 'pdf'
      },
      monthly: {
        name: 'Rapport Mensuel',
        description: 'Bilan complet du mois',
        frequency: 'monthly',
        sections: ['metrics', 'trends', 'contributors', 'publications', 'reports', 'charts', 'analytics'],
        recipients: ['admin', 'managers', 'stakeholders'],
        format: 'pdf'
      },
      custom: {
        name: 'Rapport Personnalisé',
        description: 'Rapport configuré selon les besoins',
        frequency: 'custom',
        sections: ['metrics'],
        recipients: ['admin'],
        format: 'pdf'
      }
    };
  }

  init() {
    if (this.isInitialized) return;
    
    this.loadFromLocalStorage();
    this.setupSchedules();
    this.isInitialized = true;
    
    console.log('📊 Service de rapports automatisés initialisé');
  }

  async generateReport(type = 'daily', customData = null) {
    try {
      const template = this.templates[type];
      if (!template) {
        throw new Error(`Template de rapport '${type}' non trouvé`);
      }

      const reportData = await this.gatherReportData(template.sections, customData);
      const report = {
        id: this.generateId(),
        type,
        name: template.name,
        description: template.description,
        data: reportData,
        generatedAt: new Date().toISOString(),
        status: 'generated',
        format: template.format,
        recipients: template.recipients,
        sections: template.sections
      };

      this.reports.push(report);
      this.saveToLocalStorage();
      
      console.log(`📊 Rapport ${type} généré avec succès`);
      return report;
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport:', error);
      throw error;
    }
  }

  async gatherReportData(sections, customData = null) {
    const data = {};

    for (const section of sections) {
      switch (section) {
        case 'metrics':
          data.metrics = await this.getMetricsData();
          break;
        case 'trends':
          data.trends = await this.getTrendsData();
          break;
        case 'contributors':
          data.contributors = await this.getContributorsData();
          break;
        case 'publications':
          data.publications = await this.getPublicationsData();
          break;
        case 'reports':
          data.reports = await this.getReportsData();
          break;
        case 'charts':
          data.charts = await this.getChartsData();
          break;
        case 'analytics':
          data.analytics = await this.getAnalyticsData();
          break;
      }
    }

    return data;
  }

  async getMetricsData() {
    return {
      publications: {
        total: 1247,
        today: 23,
        change: '+12.5%',
        trend: 'up'
      },
      contributors: {
        total: 187,
        pending: 15,
        approved: 156,
        rejected: 16,
        change: '+8.2%',
        trend: 'up'
      },
      reports: {
        total: 89,
        resolved: 67,
        pending: 22,
        change: '-5.3%',
        trend: 'down'
      },
      tests: {
        completed: 234,
        successRate: 92.3,
        avgTime: 145,
        change: '+15.7%',
        trend: 'up'
      }
    };
  }

  async getTrendsData() {
    return {
      period: '7 derniers jours',
      publications: {
        trend: 'up',
        change: '+18.5%',
        data: [45, 52, 48, 61, 58, 67, 73]
      },
      contributors: {
        trend: 'up',
        change: '+12.3%',
        data: [8, 12, 9, 15, 11, 18, 22]
      },
      reports: {
        trend: 'down',
        change: '-8.7%',
        data: [15, 12, 8, 11, 9, 7, 6]
      }
    };
  }

  async getContributorsData() {
    return {
      recent: [
        {
          id: 1,
          name: 'Dr. Marie Dubois',
          email: 'marie.dubois@exemple.com',
          expertise: 'Cardiologie',
          status: 'approved',
          joinedAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Dr. Pierre Martin',
          email: 'pierre.martin@exemple.com',
          expertise: 'Nutrition',
          status: 'pending',
          joinedAt: '2024-01-20'
        }
      ],
      stats: {
        byExpertise: [
          { expertise: 'Médecine', count: 45 },
          { expertise: 'Nutrition', count: 32 },
          { expertise: 'Fitness', count: 28 },
          { expertise: 'Santé mentale', count: 23 }
        ],
        byRegion: [
          { region: 'Île-de-France', count: 67 },
          { region: 'Provence-Alpes-Côte d\'Azur', count: 34 },
          { region: 'Occitanie', count: 29 },
          { region: 'Nouvelle-Aquitaine', count: 25 }
        ]
      }
    };
  }

  async getPublicationsData() {
    return {
      recent: [
        {
          id: 1,
          title: 'Les bienfaits du régime méditerranéen',
          author: 'Dr. Marie Dubois',
          category: 'Nutrition',
          status: 'published',
          reactions: { thanks: 45, useful: 23 },
          createdAt: '2024-01-20'
        },
        {
          id: 2,
          title: 'Exercices cardio pour débutants',
          author: 'Dr. Pierre Martin',
          category: 'Fitness',
          status: 'published',
          reactions: { thanks: 38, useful: 19 },
          createdAt: '2024-01-19'
        }
      ],
      stats: {
        byCategory: [
          { category: 'Médecine', count: 45 },
          { category: 'Nutrition', count: 32 },
          { category: 'Fitness', count: 28 },
          { category: 'Santé mentale', count: 23 }
        ],
        byStatus: [
          { status: 'published', count: 1247 },
          { status: 'pending', count: 23 },
          { status: 'blocked', count: 8 }
        ]
      }
    };
  }

  async getReportsData() {
    return {
      recent: [
        {
          id: 1,
          publicationTitle: 'Conseils nutritionnels controversés',
          reporter: 'user123',
          reason: 'Information incorrecte',
          status: 'resolved',
          createdAt: '2024-01-20'
        },
        {
          id: 2,
          publicationTitle: 'Exercices dangereux',
          reporter: 'user456',
          reason: 'Contenu dangereux',
          status: 'pending',
          createdAt: '2024-01-19'
        }
      ],
      stats: {
        byReason: [
          { reason: 'Information incorrecte', count: 34 },
          { reason: 'Contenu dangereux', count: 23 },
          { reason: 'Spam', count: 18 },
          { reason: 'Autre', count: 14 }
        ],
        byStatus: [
          { status: 'resolved', count: 67 },
          { status: 'pending', count: 22 }
        ]
      }
    };
  }

  async getChartsData() {
    return {
      timeSeries: [
        { date: '2024-01-14', publications: 45, contributors: 8, reports: 15 },
        { date: '2024-01-15', publications: 52, contributors: 12, reports: 12 },
        { date: '2024-01-16', publications: 48, contributors: 9, reports: 8 },
        { date: '2024-01-17', publications: 61, contributors: 15, reports: 11 },
        { date: '2024-01-18', publications: 58, contributors: 11, reports: 9 },
        { date: '2024-01-19', publications: 67, contributors: 18, reports: 7 },
        { date: '2024-01-20', publications: 73, contributors: 22, reports: 6 }
      ],
      categories: [
        { name: 'Médecine', count: 45, color: '#2196F3' },
        { name: 'Nutrition', count: 32, color: '#4CAF50' },
        { name: 'Fitness', count: 28, color: '#FF9800' },
        { name: 'Santé mentale', count: 23, color: '#9C27B0' }
      ]
    };
  }

  async getAnalyticsData() {
    return {
      userEngagement: {
        avgSessionDuration: 8.5,
        bounceRate: 23.4,
        pageViews: 4567,
        uniqueVisitors: 2341
      },
      performance: {
        avgLoadTime: 2.3,
        uptime: 99.8,
        errorRate: 0.2
      },
      userTests: {
        completed: 234,
        successRate: 92.3,
        avgTime: 145,
        scenarios: [
          { name: 'Gestion contributeurs', successRate: 95, avgTime: 120 },
          { name: 'Modération publications', successRate: 88, avgTime: 180 },
          { name: 'Recherche avancée', successRate: 97, avgTime: 90 }
        ]
      }
    };
  }

  scheduleReport(type, frequency, recipients = null, customConfig = {}) {
    const schedule = {
      id: this.generateId(),
      type,
      frequency,
      recipients: recipients || this.templates[type].recipients,
      config: { ...this.templates[type], ...customConfig },
      isActive: true,
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: this.calculateNextRun(frequency)
    };

    this.schedules.push(schedule);
    this.saveToLocalStorage();
    
    console.log(`📅 Rapport ${type} planifié avec fréquence ${frequency}`);
    return schedule;
  }

  calculateNextRun(frequency) {
    const now = new Date();
    let nextRun = new Date(now);

    switch (frequency) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(9, 0, 0, 0);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        nextRun.setHours(9, 0, 0, 0);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(1);
        nextRun.setHours(9, 0, 0, 0);
        break;
      default:
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(9, 0, 0, 0);
    }

    return nextRun.toISOString();
  }

  async executeScheduledReports() {
    const now = new Date();
    const reportsToExecute = this.schedules.filter(schedule => {
      if (!schedule.isActive) return false;
      
      const nextRun = new Date(schedule.nextRun);
      return now >= nextRun;
    });

    for (const schedule of reportsToExecute) {
      try {
        console.log(`📊 Exécution du rapport planifié: ${schedule.type}`);
        
        const report = await this.generateReport(schedule.type);
        await this.sendReport(report, schedule.recipients);
        
        schedule.lastRun = now.toISOString();
        schedule.nextRun = this.calculateNextRun(schedule.frequency);
        
        console.log(`✅ Rapport ${schedule.type} exécuté et envoyé`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'exécution du rapport ${schedule.type}:`, error);
      }
    }

    this.saveToLocalStorage();
  }

  async sendReport(report, recipients) {
    try {
      console.log(`📧 Envoi du rapport ${report.name} à ${recipients.join(', ')}`);
      
      report.status = 'sent';
      report.sentAt = new Date().toISOString();
      report.recipients = recipients;
      
      this.saveToLocalStorage();
      
      return {
        success: true,
        message: `Rapport envoyé à ${recipients.length} destinataire(s)`
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du rapport:', error);
      throw error;
    }
  }

  getReports(filters = {}) {
    let filteredReports = [...this.reports];

    if (filters.type) {
      filteredReports = filteredReports.filter(r => r.type === filters.type);
    }
    if (filters.status) {
      filteredReports = filteredReports.filter(r => r.status === filters.status);
    }
    if (filters.dateFrom) {
      filteredReports = filteredReports.filter(r => 
        new Date(r.generatedAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filteredReports = filteredReports.filter(r => 
        new Date(r.generatedAt) <= new Date(filters.dateTo)
      );
    }

    return filteredReports.sort((a, b) => 
      new Date(b.generatedAt) - new Date(a.generatedAt)
    );
  }

  getSchedules() {
    return this.schedules.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  deleteReport(reportId) {
    const index = this.reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
      this.reports.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  deleteSchedule(scheduleId) {
    const index = this.schedules.findIndex(s => s.id === scheduleId);
    if (index !== -1) {
      this.schedules.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  toggleSchedule(scheduleId) {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.isActive = !schedule.isActive;
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  exportReport(reportId, format = 'pdf') {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) {
      throw new Error('Rapport non trouvé');
    }

    const exportData = {
      report,
      format,
      exportedAt: new Date().toISOString(),
      filename: `${report.name}_${new Date().toISOString().split('T')[0]}.${format}`
    };

    console.log(`📄 Export du rapport ${report.name} en format ${format}`);
    return exportData;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('reportService_data', JSON.stringify({
        reports: this.reports,
        schedules: this.schedules
      }));
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('reportService_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.reports = parsed.reports || [];
        this.schedules = parsed.schedules || [];
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
    }
  }

  setupSchedules() {
    setInterval(() => {
      this.executeScheduledReports();
    }, 60000);
  }

  getStats() {
    return {
      totalReports: this.reports.length,
      totalSchedules: this.schedules.length,
      activeSchedules: this.schedules.filter(s => s.isActive).length,
      reportsByType: this.reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
      }, {}),
      recentReports: this.reports.slice(-5)
    };
  }
}

const reportService = new ReportService();

export default reportService; 