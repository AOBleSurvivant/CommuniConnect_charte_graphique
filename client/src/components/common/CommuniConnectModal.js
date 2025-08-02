import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import { CommuniConnectButton } from './CommuniConnectButton';

// Styles personnalisés pour les modales CommuniConnect
const CommuniConnectDialog = styled(Dialog)(({ theme, size = 'medium' }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 1.5, // 12px
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: 'none',
    overflow: 'hidden',
    
    // Tailles personnalisées
    ...(size === 'small' && {
      maxWidth: 400,
      width: '90vw',
    }),
    ...(size === 'medium' && {
      maxWidth: 600,
      width: '90vw',
    }),
    ...(size === 'large' && {
      maxWidth: 800,
      width: '90vw',
    }),
    ...(size === 'full' && {
      maxWidth: '95vw',
      width: '95vw',
      height: '95vh',
    }),
  },
  
  // Animation d'entrée
  '& .MuiDialog-paper': {
    animation: 'slideInUp 0.3s ease-out',
  },
  
  '@keyframes slideInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px) scale(0.95)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
  },
}));

const CommuniConnectDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: theme.palette.primary.main,
  padding: theme.spacing(3, 3, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CommuniConnectDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&:first-of-type': {
    paddingTop: theme.spacing(2),
  },
}));

const CommuniConnectDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

// Composant principal
const CommuniConnectModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  maxHeight,
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' && !closeOnBackdropClick) {
      return;
    }
    onClose?.(event, reason);
  };

  return (
    <CommuniConnectDialog
      open={open}
      onClose={handleClose}
      size={size}
      closeOnEscape={closeOnEscape}
      {...props}
    >
      {title && (
        <CommuniConnectDialogTitle>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {showCloseButton && (
            <CloseButton onClick={onClose} size="small">
              <CloseIcon />
            </CloseButton>
          )}
        </CommuniConnectDialogTitle>
      )}
      
      <CommuniConnectDialogContent
        sx={{
          maxHeight: maxHeight || (size === 'full' ? 'calc(95vh - 140px)' : '70vh'),
          overflow: 'auto',
        }}
      >
        {children}
      </CommuniConnectDialogContent>
      
      {actions && (
        <CommuniConnectDialogActions>
          {actions}
        </CommuniConnectDialogActions>
      )}
    </CommuniConnectDialog>
  );
};

// Composant Modal de confirmation
const CommuniConnectConfirmModal = ({
  open,
  onClose,
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  severity = 'info',
  ...props
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <CommuniConnectModal
      open={open}
      onClose={onClose}
      title={title}
      size="small"
      {...props}
    >
      <Box sx={{ py: 1 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
      
      <CommuniConnectDialogActions>
        <CommuniConnectButton
          variant="outline"
          onClick={handleCancel}
        >
          {cancelText}
        </CommuniConnectButton>
        <CommuniConnectButton
          variant={getSeverityColor()}
          onClick={handleConfirm}
        >
          {confirmText}
        </CommuniConnectButton>
      </CommuniConnectDialogActions>
    </CommuniConnectModal>
  );
};

// Composant Modal d'alerte
const CommuniConnectAlertModal = ({
  open,
  onClose,
  title,
  message,
  severity = 'info',
  ...props
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <CommuniConnectModal
      open={open}
      onClose={onClose}
      title={title}
      size="small"
      {...props}
    >
      <Box sx={{ py: 1 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
      
      <CommuniConnectDialogActions>
        <CommuniConnectButton
          variant={getSeverityColor()}
          onClick={onClose}
        >
          OK
        </CommuniConnectButton>
      </CommuniConnectDialogActions>
    </CommuniConnectModal>
  );
};

export {
  CommuniConnectModal,
  CommuniConnectConfirmModal,
  CommuniConnectAlertModal,
};

export default CommuniConnectModal; 