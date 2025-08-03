import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Home,
  Feed,
  Notifications,
  Event,
  LiveTv,
  Help,
  Map,
  Chat,
  Person,
  Settings,
  Logout,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close,
  NotificationsActive,
  Group,
  Lightbulb,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import NotificationCenter from '../common/NotificationCenter';
import './NavigationCommuniConnect.css';

const NavigationCommuniConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation principale - éléments essentiels
  const mainMenuItems = [
    { 
      text: 'Accueil', 
      icon: <Home />, 
      path: '/',
      description: 'Tableau de bord principal'
    },
    { 
      text: 'Communauté', 
      icon: <Group />, 
      path: '/community',
      description: 'Interactions sociales',
      subItems: [
        { text: 'Fil d\'actualité', icon: <Feed />, path: '/feed' },
        { text: 'Amis', icon: <Person />, path: '/friends' },
        { text: 'Messages', icon: <Chat />, path: '/messages' },
        { text: 'CommuniConseil', icon: <Lightbulb />, path: '/communiconseil' },
        { text: 'Alertes', icon: <Notifications />, path: '/alerts' }
      ]
    },
    { 
      text: 'Activités', 
      icon: <Event />, 
      path: '/activities',
      description: 'Participation active',
      subItems: [
        { text: 'Événements', icon: <Event />, path: '/events' },
        { text: 'Lives', icon: <LiveTv />, path: '/livestreams' }
      ]
    },
    { 
      text: 'En entraide', 
      icon: <Help />, 
      path: '/help',
      description: 'Mise en relation pour demander/offrir de l\'aide'
    },
    { 
      text: 'Explorer', 
      icon: <Map />, 
      path: '/explore',
      description: 'Explorer les lieux, membres, points d\'intérêt',
      subItems: [
        { text: 'Carte', icon: <Map />, path: '/map' }
      ]
    },
  ];



  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setProfileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = (itemPath, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === itemPath ? null : itemPath);
  };

  const handleSubItemClick = (path) => {
    navigate(path);
    setOpenDropdown(null);
  };

  const handleMobileSubmenuToggle = (itemPath) => {
    setOpenMobileSubmenu(openMobileSubmenu === itemPath ? null : itemPath);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
  };

  return (
    <>
      {/* Navigation Desktop */}
      <nav className="navbar navbar-desktop">
        <div className="navbar-container">
          {/* Logo et titre */}
          <div className="navbar-brand">
            <span className="navbar-logo">🌍</span>
            <span 
              className="navbar-title" 
              onClick={() => handleNavigation('/')}
              style={{ cursor: 'pointer' }}
              title="Retour à l'accueil"
            >
              CommuniConnect
            </span>
          </div>

          {/* Navigation principale - éléments essentiels */}
          <div className="navbar-nav navbar-nav-main">
            {mainMenuItems.map((item) => (
              <div key={item.path} className="nav-item-container">
                <button
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''} ${openDropdown === item.path ? 'dropdown-open' : ''}`}
                  onClick={item.subItems ? (e) => handleDropdownToggle(item.path, e) : () => handleNavigation(item.path)}
                  title={item.description}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                  {item.subItems && (
                    <span className="dropdown-arrow">▼</span>
                  )}
                </button>
                
                {/* Sous-menus desktop */}
                {item.subItems && openDropdown === item.path && (
                  <div className="nav-dropdown">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.path}
                        className={`dropdown-item ${isActiveRoute(subItem.path) ? 'active' : ''}`}
                        onClick={() => handleSubItemClick(subItem.path)}
                      >
                        <span className="dropdown-icon">{subItem.icon}</span>
                        <span className="dropdown-text">{subItem.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bouton menu mobile - visible seulement sur mobile */}
          {isMobile && (
            <button
              className="btn btn-icon mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu mobile"
            >
              <MenuIcon />
            </button>
          )}

          {/* Actions utilisateur */}
          <div className="navbar-actions">
            {/* Notifications */}
            <button
              className="btn btn-icon"
              onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
              title="Notifications"
            >
              <NotificationsActive />
              <span className="notification-badge">3</span>
            </button>

            {/* Menu profil */}
            <div className="profile-menu">
              <button
                className="btn btn-profile"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="profile-avatar">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.firstName} 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="profile-name">{user?.firstName || 'Utilisateur'}</span>
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <Person />
                    <span>Mon Profil</span>
                  </button>
                  
                  {user?.role === 'admin' && (
                    <button
                      className="dropdown-item"
                      onClick={() => handleNavigation('/moderation')}
                    >
                      <AdminPanelSettings />
                      <span>Modération</span>
                    </button>
                  )}
                  
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation('/settings')}
                  >
                    <Settings />
                    <span>Paramètres</span>
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button
                    className="dropdown-item dropdown-item-danger"
                    onClick={handleLogout}
                  >
                    <Logout />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Mobile */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button
                className="btn btn-icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Close />
              </button>
            </div>

                         <div className="mobile-menu-items">
               {/* Navigation principale */}
               <div className="mobile-menu-section">
                 <h4 className="mobile-menu-section-title">Navigation</h4>
                 {mainMenuItems.map((item) => (
                   <div key={item.path}>
                     <button
                       className={`mobile-menu-item ${isActiveRoute(item.path) ? 'active' : ''} ${openMobileSubmenu === item.path ? 'submenu-open' : ''}`}
                       onClick={item.subItems ? () => handleMobileSubmenuToggle(item.path) : () => handleMobileNavigation(item.path)}
                     >
                       <span className="mobile-menu-icon">{item.icon}</span>
                       <span className="mobile-menu-text">{item.text}</span>
                       {item.subItems && (
                         <span className="mobile-submenu-arrow">
                           {openMobileSubmenu === item.path ? '▼' : '▶'}
                         </span>
                       )}
                     </button>
                     
                     {/* Sous-menus si présents */}
                     {item.subItems && openMobileSubmenu === item.path && (
                       <div className="mobile-submenu">
                         {item.subItems.map((subItem) => (
                           <button
                             key={subItem.path}
                             className={`mobile-menu-item mobile-submenu-item ${isActiveRoute(subItem.path) ? 'active' : ''}`}
                             onClick={() => handleMobileNavigation(subItem.path)}
                           >
                             <span className="mobile-menu-icon">{subItem.icon}</span>
                             <span className="mobile-menu-text">{subItem.text}</span>
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>

            <div className="mobile-menu-footer">
              <button
                className="btn btn-outline btn-block"
                onClick={handleLogout}
              >
                <Logout />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centre de notifications */}
      {notificationCenterOpen && (
        <NotificationCenter 
          onClose={() => setNotificationCenterOpen(false)}
        />
      )}
    </>
  );
};

export default NavigationCommuniConnect; 