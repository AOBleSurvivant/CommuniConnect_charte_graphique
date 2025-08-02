import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Chip,
  Box,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  Comment,
  Share,
  MoreVert,
  Flag,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Send,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import ShareDialog from './ShareDialog';
import RepostCard from './RepostCard';

const PostCard = ({ post, onLike, onComment, onShare, onEdit, onDelete, onReport }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment?.(post.id, commentText);
      setCommentText('');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(post);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(post.id);
  };

  const handleReport = () => {
    handleMenuClose();
    onReport?.(post.id);
  };

  const getPostIcon = (type) => {
    const icons = {
      entraide: '🤝',
      vente: '💰',
      alerte: '🚨',
      besoin: '🙏',
      evenement: '📅',
      information: 'ℹ️',
    };
    return icons[type] || '📝';
  };

  const getPostColor = (type) => {
    const colors = {
      entraide: 'success',
      vente: 'warning',
      alerte: 'error',
      besoin: 'info',
      evenement: 'primary',
      information: 'default',
    };
    return colors[type] || 'default';
  };

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        {/* En-tête de la publication */}
        <CardHeader
          avatar={
            <Avatar
              src={post.author?.profilePicture}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                cursor: 'pointer',
              }}
            >
              {post.author?.firstName?.charAt(0) || post.author?.name?.charAt(0) || 'U'}
            </Avatar>
          }
          action={
            <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { minWidth: 150 },
                }}
              >
                {user?.id === post.author?.id ? (
                  <>
                    <MenuItem onClick={handleEdit}>
                      <ListItemIcon>
                        <Edit fontSize="small" />
                      </ListItemIcon>
                      Modifier
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <ListItemIcon>
                        <Delete fontSize="small" />
                      </ListItemIcon>
                      Supprimer
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={handleReport}>
                    <ListItemIcon>
                      <Flag fontSize="small" />
                    </ListItemIcon>
                    Signaler
                  </MenuItem>
                )}
                <MenuItem onClick={handleShare}>
                  <ListItemIcon>
                    <Share fontSize="small" />
                  </ListItemIcon>
                  Partager
                </MenuItem>
              </Menu>
            </Box>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author?.name || 'Utilisateur'}
              </Typography>
              <Chip 
                label={post.type}
                size="small" 
                color={getPostColor(post.type)}
                icon={<span>{getPostIcon(post.type)}</span>}
              />
            </Box>
          }
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(post.createdAt), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </Typography>
              </Box>
              {post.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                    {post.location}
                </Typography>
              </Box>
              )}
            </Box>
          }
        />

        {/* Contenu de la publication */}
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          
          {/* Affichage du repost si c'est un repost */}
          {post.isRepost && post.originalPost && (
            <RepostCard 
              repost={post} 
              originalPost={post.originalPost}
            />
          )}
          
          {/* Image de la publication */}
          {post.image && (
            <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={post.image}
                alt="Publication"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          )}
        </CardContent>

        {/* Statistiques */}
        <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
            {likeCount} j'aime • {post.comments?.length || 0} commentaires
              </Typography>
          </Box>

        <Divider />

        {/* Actions */}
        <CardActions sx={{ px: 2, py: 1 }}>
          <Button
            startIcon={isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
            onClick={handleLike}
            sx={{
              color: isLiked ? theme.palette.primary.main : 'text.secondary',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '10',
              },
            }}
          >
            J'aime
          </Button>
          
          <Button
            startIcon={<Comment />}
            onClick={() => setShowComments(!showComments)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '10',
              },
            }}
          >
            Commenter
          </Button>
          
          <Button
            startIcon={<Share />}
            onClick={handleShare}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '10',
              },
            }}
          >
            Partager
          </Button>
        </CardActions>

        {/* Section commentaires */}
        <Collapse in={showComments}>
          <Divider />
          <Box sx={{ p: 2 }}>
            {/* Formulaire de commentaire */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                  placeholder="Ajouter un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                size="small"
                  multiline
                  maxRows={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
              />
                <IconButton
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  color="primary"
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>

            {/* Liste des commentaires */}
            {post.comments && post.comments.length > 0 && (
              <List sx={{ pt: 0 }}>
                {post.comments.map((comment, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                      <Avatar
                        src={comment.author?.avatar}
                        sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}
                      >
                        {comment.author?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {comment.author?.name || 'Utilisateur'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.content}
                  />
                </ListItem>
              ))}
            </List>
            )}
          </Box>
        </Collapse>
      </Card>
      
      {/* Dialogue de partage */}
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        post={post}
      />
    </>
  );
};

export default PostCard; 