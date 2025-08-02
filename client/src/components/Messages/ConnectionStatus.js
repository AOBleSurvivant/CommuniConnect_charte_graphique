import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff, SignalCellular4Bar, SignalCellular0Bar } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ConnectionStatus = () => {
  const isConnected = useSelector(state => state.messages.isConnected);

  const getStatusColor = () => {
    return isConnected ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    return isConnected ? <Wifi /> : <WifiOff />;
  };

  const getStatusText = () => {
    return isConnected ? 'Connecté' : 'Déconnecté';
  };

  const getTooltipText = () => {
    return isConnected 
      ? 'Connexion temps réel active' 
      : 'Connexion temps réel perdue - Tentative de reconnexion...';
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        color={getStatusColor()}
        size="small"
        variant="outlined"
        sx={{
          position: 'fixed',
          top: 80,
          right: 16,
          zIndex: 1000,
          opacity: 0.8,
          '&:hover': {
            opacity: 1
          }
        }}
      />
    </Tooltip>
  );
};

export default ConnectionStatus; 