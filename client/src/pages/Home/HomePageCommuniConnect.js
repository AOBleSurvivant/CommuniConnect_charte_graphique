import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  People,
  Event,
  Notifications,
  TrendingUp,
  LocationOn,
  Chat,
  Help,
  Star,
  Visibility,
  ThumbUp,
  Share,
  Add,
  Search,
  FilterList,
} from '@mui/icons-material';
import './HomePageCommuniConnect.css';

const HomePageCommuniConnect = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    members: 1247,
    events: 23,
    alerts: 5,
    posts: 156
  });

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      author: 'Marie Dubois',
      avatar: '/api/static/avatars/marie.jpg',
      content: 'Bonjour à tous ! J\'organise une collecte de vêtements pour les familles dans le besoin ce weekend. Qui veut participer ?',
      location: 'Labé-Centre',
      timestamp: 'Il y a 2 heures',
      likes: 24,
      comments: 8,
      shares: 3,
      type: 'help'
    },
    {
      id: 2,
      author: 'Ahmed Diallo',
      avatar: '/api/static/avatars/ahmed.jpg',
      content: 'Félicitations à notre équipe de football locale qui a remporté le tournoi régional ! 🏆',
      location: 'Labé',
      timestamp: 'Il y a 4 heures',
      likes: 45,
      comments: 12,
      shares: 7,
      type: 'celebration'
    },
    {
      id: 3,
      author: 'Fatoumata Bah',
      avatar: '/api/static/avatars/fatoumata.jpg',
      content: 'Alerte : Attention aux travaux sur la route principale demain matin. Prévoyez des délais supplémentaires.',
      location: 'Labé-Centre',
      timestamp: 'Il y a 6 heures',
      likes: 18,
      comments: 5,
      shares: 15,
      type: 'alert'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Réunion du conseil de quartier',
      date: 'Demain, 18h00',
      location: 'Mairie de Labé',
      attendees: 45,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Festival culturel',
      date: 'Samedi, 14h00',
      location: 'Place du marché',
      attendees: 120,
      type: 'festival'
    },
    {
      id: 3,
      title: 'Cours de cuisine traditionnelle',
      date: 'Dimanche, 10h00',
      location: 'Centre communautaire',
      attendees: 15,
      type: 'workshop'
    }
  ]);

  // Gestionnaires d'événements pour les boutons
  const handleFilterPosts = () => {
    navigate('/feed');
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  const handleCreateNewPost = () => {
    console.log('🔵 Bouton "Nouvelle publication" cliqué');
    // Solution alternative avec localStorage
    localStorage.setItem('showCreatePost', 'true');
    console.log('✅ localStorage showCreatePost défini');
    navigate('/feed');
    console.log('✅ Navigation vers /feed');
  };

  const handleSearch = () => {
    console.log('🔍 Bouton "Rechercher" cliqué');
    // Solution alternative avec localStorage
    localStorage.setItem('showSearch', 'true');
    console.log('✅ localStorage showSearch défini');
    navigate('/feed');
    console.log('✅ Navigation vers /feed');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'help':
        navigate('/help');
        break;
      case 'event':
        navigate('/events');
        break;
      case 'report':
        navigate('/alerts');
        break;
      case 'message':
        navigate('/messages');
        break;
      default:
        break;
    }
  };

  // Gestionnaire d'événements global pour les boutons
  useEffect(() => {
    const handleButtonClick = (event) => {
      const target = event.target;
      
      // Vérifier si le clic est sur un bouton de la section welcome-actions
      if (target.closest('.welcome-actions')) {
        const button = target.closest('button');
        if (button) {
          const buttonText = button.textContent.trim();
          console.log('🎯 Clic détecté sur:', buttonText);
          
          if (buttonText.includes('Nouvelle publication')) {
            console.log('🔵 Déclenchement handleCreateNewPost via gestionnaire global');
            handleCreateNewPost();
          } else if (buttonText.includes('Rechercher')) {
            console.log('🔍 Déclenchement handleSearch via gestionnaire global');
            handleSearch();
          }
        }
      }
    };

    // Ajouter le gestionnaire d'événements
    document.addEventListener('click', handleButtonClick);
    
    // Nettoyer le gestionnaire d'événements
    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Header avec bienvenue */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Bonjour, {user?.firstName || 'Utilisateur'} ! 👋
          </h1>
          <p className="welcome-subtitle">
            Découvrez ce qui se passe dans votre communauté aujourd'hui
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleCreateNewPost}
            style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
            onMouseDown={(e) => {
              console.log('🖱️ MouseDown sur Nouvelle publication');
              e.preventDefault();
              handleCreateNewPost();
            }}
          >
            <Add />
            <span>Nouvelle publication</span>
          </button>
          <button 
            className="btn btn-outline" 
            onClick={handleSearch}
            style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
            onMouseDown={(e) => {
              console.log('🖱️ MouseDown sur Rechercher');
              e.preventDefault();
              handleSearch();
            }}
          >
            <Search />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <People />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.members}</h3>
            <p className="stat-label">Membres actifs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Event />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.events}</h3>
            <p className="stat-label">Événements ce mois</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Notifications />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.alerts}</h3>
            <p className="stat-label">Alertes actives</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.posts}</h3>
            <p className="stat-label">Publications récentes</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <div className="content-grid">
          {/* Publications récentes */}
          <div className="content-section">
            <div className="section-header">
              <h2>Publications récentes</h2>
              <button className="btn btn-outline btn-sm" onClick={handleFilterPosts}>
                <FilterList />
                <span>Filtrer</span>
              </button>
            </div>

            <div className="posts-list">
              {recentPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">
                        {post.avatar ? (
                          <img src={post.avatar} alt={post.author} />
                        ) : (
                          <div className="avatar-placeholder">
                            {post.author.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">{post.author}</h4>
                        <div className="post-meta">
                          <LocationOn className="meta-icon" />
                          <span>{post.location}</span>
                          <span className="meta-separator">•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="post-type-badge">
                      <span className={`badge badge-${post.type}`}>
                        {post.type === 'help' && <Help />}
                        {post.type === 'celebration' && <Star />}
                        {post.type === 'alert' && <Notifications />}
                        {post.type}
                      </span>
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div className="post-actions">
                    <button className="action-btn" onClick={() => navigate('/feed')}>
                      <ThumbUp />
                      <span>{post.likes}</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/feed')}>
                      <Chat />
                      <span>{post.comments}</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/feed')}>
                      <Share />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Événements à venir */}
          <div className="content-section">
            <div className="section-header">
              <h2>Événements à venir</h2>
              <button className="btn btn-outline btn-sm" onClick={handleViewAllEvents}>
                <Event />
                <span>Voir tout</span>
              </button>
            </div>

            <div className="events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-type-icon">
                      {event.type === 'meeting' && <People />}
                      {event.type === 'festival' && <Star />}
                      {event.type === 'workshop' && <Help />}
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-meta">
                        <span className="event-date">{event.date}</span>
                        <span className="event-location">
                          <LocationOn />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="event-footer">
                    <span className="event-attendees">
                      {event.attendees} participants
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/events')}>
                      Participer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <button className="quick-action-btn" onClick={() => handleQuickAction('help')}>
            <Help />
            <span>Demander de l'aide</span>
          </button>
          <button className="quick-action-btn" onClick={() => handleQuickAction('event')}>
            <Event />
            <span>Créer un événement</span>
          </button>
          <button className="quick-action-btn" onClick={() => handleQuickAction('report')}>
            <Notifications />
            <span>Signaler un problème</span>
          </button>
          <button className="quick-action-btn" onClick={() => handleQuickAction('message')}>
            <Chat />
            <span>Nouveau message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageCommuniConnect; 