import React from 'react';
import { Card, CardContent, CardHeader, CardActions, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styles personnalisés pour les cartes CommuniConnect
const CommuniConnectCard = styled(Card)(({ theme, variant = 'default', elevation = 'medium' }) => ({
  borderRadius: theme.shape.borderRadius * 1.5, // 12px
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  
  // Élévations
  ...(elevation === 'light' && {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }),
  ...(elevation === 'medium' && {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  }),
  ...(elevation === 'heavy' && {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  }),
  
  // Variantes
  ...(variant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
  }),
  
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  }),
  
  ...(variant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  }),
  
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
  }),
  
  // Responsive
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
  },
}));

// Header personnalisé
const CommuniConnectCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '& .MuiCardHeader-title': {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 600,
    fontSize: '18px',
  },
  '& .MuiCardHeader-subheader': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
  },
}));

// Contenu personnalisé
const CommuniConnectCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

// Actions personnalisées
const CommuniConnectCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 3, 2),
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));

// Media personnalisé
const CommuniConnectCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

// Composant principal
const CommuniConnectCardComponent = ({ 
  children, 
  variant = 'default', 
  elevation = 'medium',
  title,
  subheader,
  avatar,
  action,
  media,
  mediaHeight = 200,
  actions,
  onClick,
  ...props 
}) => {
  return (
    <CommuniConnectCard
      variant={variant}
      elevation={elevation}
      onClick={onClick}
      {...props}
    >
      {media && (
        <CommuniConnectCardMedia
          component="img"
          image={media}
          alt={title || 'Card media'}
          sx={{ height: mediaHeight }}
        />
      )}
      
      {(title || subheader) && (
        <CommuniConnectCardHeader
          title={title}
          subheader={subheader}
          avatar={avatar}
          action={action}
        />
      )}
      
      <CommuniConnectCardContent>
        {children}
      </CommuniConnectCardContent>
      
      {actions && (
        <CommuniConnectCardActions>
          {actions}
        </CommuniConnectCardActions>
      )}
    </CommuniConnectCard>
  );
};

// Composants exportés
export {
  CommuniConnectCardComponent as CommuniConnectCard,
  CommuniConnectCardHeader,
  CommuniConnectCardContent,
  CommuniConnectCardActions,
  CommuniConnectCardMedia,
};

export default CommuniConnectCardComponent; 