import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  Share,
  ContentCopy,
  WhatsApp,
  Facebook,
  Twitter,
  Email,
  Link,
  Close,
  Repeat,
  Public
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { sharePost } from '../../store/slices/postsSlice';

const ShareDialog = ({ open, onClose, post }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const [shareText, setShareText] = useState('');
  const [isReposting, setIsReposting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // URL de partage
  const shareUrl = `${window.location.origin}/post/${post?._id}`;
  const defaultShareText = `Regardez ce post de ${post?.author?.firstName || 'quelqu\'un'} sur CommuniConnect !`;

  
  const handleRepost = async () => {
    if (!post || !post._id) {
      console.error('Erreur lors du repost: Le post original est requis pour un repost');
      setSuccessMessage('Erreur: Post original requis');
      setShowSuccess(true);
      return;
    }

    if (!shareText.trim()) {
      setShareText(defaultShareText);
      return;
    }

    setIsReposting(true);
    try {
      await dispatch(sharePost({ 
        postId: post._id, 
        type: 'repost',
        content: shareText 
      })).unwrap();
      
      setSuccessMessage('Post reposté avec succès !');
      setShowSuccess(true);
      onClose();
    } catch (error) {
      console.error('Erreur lors du repost:', error);
      setSuccessMessage('Erreur lors du repost');
      setShowSuccess(true);
    } finally {
      setIsReposting(false);
    }
  };

  const handleExternalShare = async (platform) => {
    const text = shareText || defaultShareText;
    const url = shareUrl;
    
    let shareUrl_platform = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl_platform = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl_platform = `mailto:?subject=${encodeURIComponent('Post partagé depuis CommuniConnect')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl_platform) {
      window.open(shareUrl_platform, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSuccessMessage('Lien copié dans le presse-papiers !');
      setShowSuccess(true);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      setSuccessMessage('Erreur lors de la copie');
      setShowSuccess(true);
    }
  };

  const handleClose = () => {
    setShareText('');
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Share />
              Partager ce post
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Aperçu du post */}
          {post && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {post.author?.firstName} {post.author?.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}
              </Typography>
              {post.image && (
                <Box sx={{ mt: 1 }}>
                  <img 
                    src={post.image} 
                    alt="Post" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '150px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Options de partage interne */}
          <Typography variant="h6" gutterBottom>
            Partager sur CommuniConnect
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Ajoutez votre commentaire (optionnel)..."
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={<Repeat />}
            onClick={handleRepost}
            disabled={isReposting}
            sx={{ mb: 2 }}
          >
            {isReposting ? 'Repost en cours...' : 'Reposter'}
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* Options de partage externe */}
          <Typography variant="h6" gutterBottom>
            Partager à l'extérieur
          </Typography>

          <List>
            <ListItem button onClick={() => handleExternalShare('whatsapp')}>
              <ListItemIcon>
                <WhatsApp sx={{ color: '#25D366' }} />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItem>

            <ListItem button onClick={() => handleExternalShare('facebook')}>
              <ListItemIcon>
                <Facebook sx={{ color: '#1877F2' }} />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>

            <ListItem button onClick={() => handleExternalShare('twitter')}>
              <ListItemIcon>
                <Twitter sx={{ color: '#1DA1F2' }} />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>

            <ListItem button onClick={() => handleExternalShare('email')}>
              <ListItemIcon>
                <Email sx={{ color: '#EA4335' }} />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItem>

            <ListItem button onClick={handleCopyLink}>
              <ListItemIcon>
                <Link />
              </ListItemIcon>
              <ListItemText primary="Copier le lien" />
            </ListItem>
          </List>

          {/* URL du post */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Lien du post :
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {shareUrl}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
      />
    </>
  );
};

export default ShareDialog;