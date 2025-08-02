import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Repeat,
  Share
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const RepostCard = ({ repost, originalPost }) => {
  const theme = useTheme();

  if (!originalPost) {
    return null;
  }

  return (
    <Box sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      p: 2,
      mb: 2,
      bgcolor: 'grey.50'
    }}>
      {/* En-tête du repost */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Repeat sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          {repost.author?.firstName} {repost.author?.lastName} a reposté
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(new Date(repost.createdAt), { 
            addSuffix: true, 
            locale: fr 
          })}
        </Typography>
      </Box>

      {/* Contenu du repost */}
      {repost.repostContent && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {repost.repostContent}
        </Typography>
      )}

      {/* Post original */}
      <Card sx={{ bgcolor: 'white' }}>
        <CardContent sx={{ p: 2 }}>
          {/* Auteur du post original */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              src={originalPost.author?.profilePicture}
              sx={{ width: 24, height: 24, bgcolor: theme.palette.secondary.main }}
            >
              {originalPost.author?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body2" fontWeight="bold">
              {originalPost.author?.firstName} {originalPost.author?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(originalPost.createdAt), { 
                addSuffix: true, 
                locale: fr 
              })}
            </Typography>
          </Box>

          {/* Contenu du post original */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            {originalPost.content}
          </Typography>

          {/* Image du post original */}
          {originalPost.image && (
            <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden' }}>
              <img
                src={originalPost.image}
                alt="Post original"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}

          {/* Tags du post original */}
          {originalPost.tags && originalPost.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
              {originalPost.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
            </Box>
          )}

          {/* Statistiques du post original */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {originalPost.likes?.length || 0} j'aime
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {originalPost.comments?.length || 0} commentaires
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {originalPost.shares || 0} partages
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RepostCard;