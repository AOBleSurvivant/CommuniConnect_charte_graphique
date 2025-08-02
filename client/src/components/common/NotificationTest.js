import React from 'react';
import { Box, IconButton, Badge, Tooltip, Typography, Paper } from '@mui/material';
import { Notifications, NotificationsActive } from '@mui/icons-material';

const NotificationTest = () => {
  return (
    <Paper sx={{ p: 3, m: 2, backgroundColor: '#f8f9fa' }}>
      <Typography variant="h6" gutterBottom>
        🧪 Test Bouton Notifications
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        flexWrap: 'wrap',
        mb: 2
      }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Bouton de base:
          </Typography>
          <Tooltip title="Notifications" arrow>
            <IconButton
              color="primary"
              sx={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                minHeight: 48,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '2px solid #1976d2',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={3} color="error" max={99}>
                <Notifications sx={{ fontSize: 24, color: '#1976d2' }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Bouton actif:
          </Typography>
          <Tooltip title="Notifications actives" arrow>
            <IconButton
              color="success"
              sx={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                minHeight: 48,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '2px solid #2e7d32',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={5} color="error" max={99}>
                <NotificationsActive sx={{ fontSize: 24, color: '#2e7d32' }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Bouton avec style de navigation:
          </Typography>
          <Tooltip title="Notifications (style nav)" arrow>
            <IconButton
              color="inherit"
              sx={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                minHeight: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease-in-out',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Badge 
                badgeContent={2} 
                color="error" 
                max={99}
                showZero={false}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                  }
                }}
              >
                <Notifications sx={{ fontSize: 24, color: '#666' }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        ✅ Si vous voyez les boutons ci-dessus, le problème de visibilité est résolu.
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        ❌ Si les boutons ne sont pas visibles, il y a un problème de rendu ou de CSS.
      </Typography>
    </Paper>
  );
};

export default NotificationTest;
