import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  People,
  PostAdd,
  Event,
  Notifications,
  Security,
  Analytics,
  Settings,
  Dashboard,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Visibility,
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  Refresh,
  Download,
  Upload,
  Block,
  VerifiedUser,
  Report,
  Flag,
  Message,
  LocationOn,
  Schedule,
  Star,
  ThumbUp,
  Comment,
  Share
} from '@mui/icons-material';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalPosts: 156,
    totalEvents: 23,
    totalAlerts: 5,
    pendingModeration: 12,
    reportedContent: 8,
    systemHealth: 'excellent'
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'user_registration',
      user: 'Marie Dubois',
      action: 'Nouvelle inscription',
      time: 'Il y a 5 minutes',
      status: 'success'
    },
    {
      id: 2,
      type: 'content_reported',
      user: 'Ahmed Diallo',
      action: 'Contenu signalé',
      time: 'Il y a 15 minutes',
      status: 'warning'
    },
    {
      id: 3,
      type: 'event_created',
      user: 'Fatoumata Bah',
      action: 'Nouvel événement créé',
      time: 'Il y a 1 heure',
      status: 'info'
    },
    {
      id: 4,
      type: 'moderation_required',
      user: 'Jean Martin',
      action: 'Modération requise',
      time: 'Il y a 2 heures',
      status: 'error'
    }
  ]);

  const [pendingModeration, setPendingModeration] = useState([
    {
      id: 1,
      type: 'post',
      content: 'Publication avec contenu inapproprié...',
      author: 'Utilisateur123',
      reportedBy: 'Marie Dubois',
      time: 'Il y a 30 minutes',
      priority: 'high'
    },
    {
      id: 2,
      type: 'comment',
      content: 'Commentaire offensant...',
      author: 'Utilisateur456',
      reportedBy: 'Ahmed Diallo',
      time: 'Il y a 1 heure',
      priority: 'medium'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <Dashboard /> },
    { id: 'users', label: 'Utilisateurs', icon: <People /> },
    { id: 'content', label: 'Contenu', icon: <PostAdd /> },
    { id: 'events', label: 'Événements', icon: <Event /> },
    { id: 'moderation', label: 'Modération', icon: <Security /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'error': return 'var(--color-error)';
      case 'info': return 'var(--color-info)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-error)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      case 'info': return <Visibility />;
      default: return <Visibility />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Dashboard Administrateur</h1>
          <p>Gestion complète de CommuniConnect</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn btn-outline">
            <Refresh />
            <span>Actualiser</span>
          </button>
          <button className="btn btn-primary">
            <Download />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* Statistiques principales */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <People />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Utilisateurs totaux</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp />
                </div>
                <div className="stat-content">
                  <h3>{stats.activeUsers}</h3>
                  <p>Utilisateurs actifs</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <PostAdd />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalPosts}</h3>
                  <p>Publications</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Event />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalEvents}</h3>
                  <p>Événements</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Notifications />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalAlerts}</h3>
                  <p>Alertes actives</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Security />
                </div>
                <div className="stat-content">
                  <h3>{stats.pendingModeration}</h3>
                  <p>En attente de modération</p>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="recent-activity">
              <div className="section-header">
                <h2>Activité récente</h2>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/moderation')}>
                  <Visibility />
                  <span>Voir tout</span>
                </button>
              </div>

              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div 
                      className="activity-icon"
                      style={{ backgroundColor: getStatusColor(activity.status) }}
                    >
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="activity-content">
                      <h4>{activity.user}</h4>
                      <p>{activity.action}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modération en attente */}
            <div className="pending-moderation">
              <div className="section-header">
                <h2>Modération en attente</h2>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/moderation')}>
                  <Security />
                  <span>Modérer</span>
                </button>
              </div>

              <div className="moderation-list">
                {pendingModeration.map((item) => (
                  <div key={item.id} className="moderation-item">
                    <div className="moderation-header">
                      <div className="moderation-type">
                        <span className={`badge badge-${item.type}`}>
                          {item.type === 'post' ? <PostAdd /> : <Comment />}
                          {item.type}
                        </span>
                      </div>
                      <div 
                        className="moderation-priority"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </div>
                    </div>
                    <div className="moderation-content">
                      <p>{item.content}</p>
                      <div className="moderation-meta">
                        <span>Auteur: {item.author}</span>
                        <span>Signalé par: {item.reportedBy}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <div className="moderation-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => navigate('/moderation')}>
                        <Visibility />
                        <span>Voir</span>
                      </button>
                      <button className="btn btn-sm btn-success" onClick={() => navigate('/moderation')}>
                        <CheckCircle />
                        <span>Approuver</span>
                      </button>
                      <button className="btn btn-sm btn-error" onClick={() => navigate('/moderation')}>
                        <Block />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>Gestion des utilisateurs</h2>
              <div className="header-actions">
                <button className="btn btn-outline" onClick={() => navigate('/users')}>
                  <Search />
                  <span>Rechercher</span>
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/users')}>
                  <FilterList />
                  <span>Filtrer</span>
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/users')}>
                  <Add />
                  <span>Nouvel utilisateur</span>
                </button>
              </div>
            </div>
            <p>Interface de gestion des utilisateurs en cours de développement...</p>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Gestion du contenu</h2>
              <div className="header-actions">
                <button className="btn btn-outline">
                  <Search />
                  <span>Rechercher</span>
                </button>
                <button className="btn btn-outline">
                  <FilterList />
                  <span>Filtrer</span>
                </button>
              </div>
            </div>
            <p>Interface de gestion du contenu en cours de développement...</p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h2>Gestion des événements</h2>
              <div className="header-actions">
                <button className="btn btn-outline">
                  <Search />
                  <span>Rechercher</span>
                </button>
                <button className="btn btn-primary">
                  <Add />
                  <span>Nouvel événement</span>
                </button>
              </div>
            </div>
            <p>Interface de gestion des événements en cours de développement...</p>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="moderation-section">
            <div className="section-header">
              <h2>Modération de contenu</h2>
              <div className="header-actions">
                <button className="btn btn-outline">
                  <Search />
                  <span>Rechercher</span>
                </button>
                <button className="btn btn-outline">
                  <FilterList />
                  <span>Filtrer</span>
                </button>
              </div>
            </div>
            <p>Interface de modération en cours de développement...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Analytics et statistiques</h2>
              <div className="header-actions">
                <button className="btn btn-outline">
                  <Download />
                  <span>Exporter</span>
                </button>
                <button className="btn btn-outline">
                  <Refresh />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
            <p>Interface d'analytics en cours de développement...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Paramètres du site</h2>
              <div className="header-actions">
                <button className="btn btn-primary">
                  <Upload />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
            <p>Interface de paramètres en cours de développement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 