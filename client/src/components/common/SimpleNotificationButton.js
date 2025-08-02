import React from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const SimpleNotificationButton = () => {
  return (
    <Tooltip title="Notifications">
      <IconButton
        color="inherit"
        sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Badge badgeContent={0} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default SimpleNotificationButton;
