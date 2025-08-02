import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Warning,
  Event,
  Help,
  Chat,
  LocationOn,
  Circle
} from '@mui/icons-material';

const MapLegend = () => {
  const legendItems = [
    {
      type: 'alert',
      label: 'Alertes',
      icon: <Warning />,
      color: '#f44336',
      subItems: [
        { severity: 'low', label: 'Faible', color: '#ffeb3b' },
        { severity: 'normal', label: 'Normale', color: '#ff9800' },
        { severity: 'high', label: 'Élevée', color: '#f44336' },
        { severity: 'critical', label: 'Critique', color: '#d32f2f' }
      ]
    },
    {
      type: 'event',
      label: 'Événements',
      icon: <Event />,
      color: '#4caf50'
    },
    {
      type: 'help',
      label: 'Demandes d\'aide',
      icon: <Help />,
      color: '#ff9800'
    },
    {
      type: 'post',
      label: 'Posts communautaires',
      icon: <Chat />,
      color: '#2196f3'
    },
    {
      type: 'user',
      label: 'Votre position',
      icon: <LocationOn />,
      color: '#2196f3'
    }
  ];

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        p: 2,
        minWidth: 250,
        maxHeight: 400,
        overflow: 'auto'
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom>
        Légende
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <List dense>
        {legendItems.map((item) => (
          <Box key={item.type}>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Circle sx={{ color: item.color, fontSize: 16 }} />
                  {item.icon}
                </Box>
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
            
            {/* Sous-éléments pour les alertes */}
            {item.subItems && (
              <List dense sx={{ pl: 4 }}>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.severity} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Circle sx={{ color: subItem.color, fontSize: 12 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.label} 
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="caption" color="text.secondary">
        Cliquez sur un marqueur pour plus d'informations
      </Typography>
    </Paper>
  );
};

export default MapLegend; 