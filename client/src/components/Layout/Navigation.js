import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Fade,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
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
  Close,
  NotificationsActive,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import NotificationCenter from '../common/NotificationCenter';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { 
      text: 'Accueil', 
      icon: <Home />, 
      path: '/',
      description: 'Tableau de bord principal'
    },
    { 
      text: 'Fil d\'actualité', 
      icon: <Feed />, 
      path: '/feed',
      description: 'Publications de la communauté'
    },
    { 
      text: 'Alertes', 
      icon: <Notifications />, 
      path: '/alerts',
      description: 'Alertes et urgences'
    },
    { 
      text: 'Événements', 
      icon: <Event />, 
      path: '/events',
      description: 'Événements communautaires'
    },
    { 
      text: 'Lives', 
      icon: <LiveTv />, 
      path: '/livestreams',
      description: 'Diffusions en direct'
    },
    { 
      text: 'Amis', 
      icon: <Person />, 
      path: '/friends',
      description: 'Gérer vos amis et invitations'
    },
    { 
      text: 'Demandes d\'aide', 
      icon: <Help />, 
      path: '/help',
      description: 'Demandes d\'aide et support'
    },
    { 
      text: 'Carte', 
      icon: <Map />, 
      path: '/map',
      description: 'Carte interactive de la communauté'
    },
    { 
      text: 'Messages', 
      icon: <Chat />, 
      path: '/messages',
      description: 'Messagerie privée'
    },
  ];

  // Ajouter les éléments de modération si l'utilisateur est modérateur
  if (user?.role === 'moderator' || user?.role === 'admin') {
    menuItems.push({
      text: 'Modération',
      icon: <AdminPanelSettings />,
      path: '/moderation',
      description: 'Outils de modération'
    });
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    if (isMobile) {
      setDrawerOpen(false);
    }
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CommuniConnect
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => handleNavigation(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              backgroundColor: isActiveRoute(item.path) 
                ? theme.palette.primary.light + '20' 
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '10',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActiveRoute(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary,
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActiveRoute(item.path) ? 600 : 400,
                color: isActiveRoute(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Menu hamburger (mobile seulement) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { lg: 'none' },
                color: theme.palette.primary.main,
                position: 'absolute',
                left: { xs: 8, sm: 16 },
                zIndex: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo - centré sur mobile, à gauche sur desktop */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: 'flex-start' },
              flexGrow: 1,
              position: 'relative',
            }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', lg: 'left' },
                }}
                onClick={() => navigate('/')}
              >
                CommuniConnect
              </Typography>
            </Box>

            {/* Navigation desktop (centre) */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {menuItems.map((item) => (
                  <Tooltip key={item.text} title={item.description} arrow>
                    <Button
                      color="inherit"
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        color: isActiveRoute(item.path) 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        fontWeight: isActiveRoute(item.path) ? 600 : 400,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light + '10',
                        },
                        fontSize: '0.875rem',
                        px: 1.5,
                        py: 0.5,
                        minWidth: 'auto',
                      }}
                    >
                      {item.text}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            )}

            {/* Actions utilisateur (droite) */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              zIndex: 1,
            }}>
              {/* Centre de notifications */}
              <NotificationCenter />

              {/* Menu utilisateur */}
              <Tooltip title="Profil" arrow>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            border: 'none',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Menu profil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Mon Profil
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Espace pour le contenu */}
      <Toolbar />
    </>
  );
};

export default Navigation; 