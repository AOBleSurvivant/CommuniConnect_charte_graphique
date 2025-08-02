import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styles personnalisés pour les boutons CommuniConnect
const CommuniConnectButton = styled(Button)(({ theme, variant = 'primary', size = 'medium' }) => ({
  // Styles de base
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
  padding: size === 'small' ? '4px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  
  // Variantes
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),
  
  ...(variant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),
  
  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),
  
  ...(variant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  }),
  
  // États désactivés
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  
  // Responsive
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    padding: '6px 12px',
  },
}));

// Composant principal
const CommuniConnectButtonComponent = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <CommuniConnectButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </CommuniConnectButton>
  );
};

// Groupe de boutons
const CommuniConnectButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    borderRadius: theme.shape.borderRadius,
    '&:first-of-type': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&:last-of-type': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&:not(:first-of-type):not(:last-of-type)': {
      borderRadius: 0,
    },
  },
}));

export { CommuniConnectButtonComponent as CommuniConnectButton, CommuniConnectButtonGroup };
export default CommuniConnectButtonComponent; 