import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import NavigationCommuniConnect from './NavigationCommuniConnect';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation CommuniConnect */}
      <NavigationCommuniConnect />
      
      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 1, sm: 2 },
          pb: { xs: 2, sm: 4 },
          minHeight: 'calc(100vh - 64px)',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 0, sm: 2 },
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 