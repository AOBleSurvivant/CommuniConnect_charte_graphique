import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Styles personnalisés pour la navigation CommuniConnect
const CommuniConnectAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const CommuniConnectToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  },
}));

const NavigationBrand = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 700,
  fontSize: '24px',
  color: theme.palette.primary.contrastText,
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavigationActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease-in-out',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
}));

const NavigationDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const NavigationListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  transition: 'all 0.2s ease-in-out',
  
  ...(active && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  }),
  
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
    transform: 'translateX(4px)',
  },
}));

// Composant principal
const CommuniConnectNavigation = ({ 
  user,
  notifications = 0,
  onNavigate,
  onLogout,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const navigationItems = [
    { id: 'home', label: 'Accueil', icon: <HomeIcon /> },
    { id: 'friends', label: 'Amis', icon: <PeopleIcon /> },
    { id: 'events', label: 'Événements', icon: <EventIcon /> },
    { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
  ];

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    setDrawerOpen(false);
    onNavigate?.(pageId);
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    onLogout?.();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderMobileNavigation = () => (
    <>
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        sx={{ display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      
      <NavigationDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ p: 2 }}>
          <NavigationBrand variant="h6" sx={{ mb: 2 }}>
            CommuniConnect
          </NavigationBrand>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1 }}>
              <Avatar src={user.avatar} sx={{ mr: 1 }}>
                {user.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}
          
          <List>
            {navigationItems.map((item) => (
              <NavigationListItem
                key={item.id}
                button
                active={activePage === item.id}
                onClick={() => handleNavigation(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </NavigationListItem>
            ))}
            
            <NavigationListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </NavigationListItem>
          </List>
        </Box>
      </NavigationDrawer>
    </>
  );

  const renderDesktopNavigation = () => (
    <NavigationActions>
      {navigationItems.map((item) => (
        <NavigationButton
          key={item.id}
          onClick={() => handleNavigation(item.id)}
          sx={{
            backgroundColor: activePage === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          }}
        >
          {item.label}
        </NavigationButton>
      ))}
    </NavigationActions>
  );

  return (
    <CommuniConnectAppBar {...props}>
      <CommuniConnectToolbar>
        {isMobile && renderMobileNavigation()}
        
        <NavigationBrand onClick={() => handleNavigation('home')}>
          CommuniConnect
        </NavigationBrand>
        
        {!isMobile && renderDesktopNavigation()}
        
        <NavigationActions>
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {user && (
            <IconButton color="inherit">
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                {user.name?.charAt(0)}
              </Avatar>
            </IconButton>
          )}
        </NavigationActions>
      </CommuniConnectToolbar>
    </CommuniConnectAppBar>
  );
};

export default CommuniConnectNavigation; 