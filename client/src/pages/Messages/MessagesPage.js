import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  TextField,
  IconButton,
  Fab,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Drawer,
  AppBar,
  Toolbar,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  fetchConversations,
  selectConversation,
  selectConversations,
  selectCurrentConversation,
  selectMessagesLoading,
  selectMessagesError,
  selectUnreadCount,
  clearError,
  clearSuccess
} from '../../store/slices/messagesSlice';
import {
  selectConversationMessages,
  sendMessage,
  fetchConversationMessages
} from '../../store/slices/messagesSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CreateConversationForm from '../../components/Messages/CreateConversationForm';
import MessageBubble from '../../components/Messages/MessageBubble';
import ConversationHeader from '../../components/Messages/ConversationHeader';
import TypingIndicator from '../../components/Messages/TypingIndicator';
import ConnectionStatus from '../../components/Messages/ConnectionStatus';
import useMessageSocket from '../../hooks/useMessageSocket';
import { formatError } from '../../utils/errorHandler';
import messagesService from '../../services/messagesService';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [attachments, setAttachments] = useState([]);

  // Sélecteurs Redux
  const conversations = useSelector(selectConversations);
  const currentConversation = useSelector(selectCurrentConversation);
  const selectedConversationId = useSelector(state => state.messages.selectedConversationId);
  const loading = useSelector(selectMessagesLoading);
  const error = useSelector(selectMessagesError);
  const unreadCount = useSelector(selectUnreadCount);
  const messages = useSelector(selectConversationMessages(selectedConversationId));
  const user = useSelector(state => state.auth.user);
  const success = useSelector(state => state.messages.success);

  // Hook Socket.IO
  const {
    isConnected,
    sendTypingIndicator,
    sendStopTypingIndicator,
    markMessageAsRead
  } = useMessageSocket();

  // Charger les conversations au montage
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchConversationMessages(selectedConversationId));
    }
  }, [selectedConversationId, dispatch]);

  // Gérer les erreurs et succès
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Charger les données de test
  const handleLoadTestData = () => {
    messagesService.addTestData();
    dispatch(fetchConversations());
  };

  // Filtrer les conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || conv.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Gérer l'envoi d'un message
  const handleSendMessage = () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversationId) return;

    dispatch(sendMessage({
      conversationId: selectedConversationId,
      content: newMessage.trim(),
      attachments: attachments
    }));

    setNewMessage('');
    setAttachments([]);
  };

  // Gérer l'upload de fichiers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      file: file,
      filename: file.name,
      type: file.type,
      size: file.size
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    event.target.value = ''; // Reset input
  };

  // Supprimer un fichier attaché
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Gérer la sélection d'une conversation
  const handleSelectConversation = (conversationId) => {
    dispatch(selectConversation(conversationId));
  };

  // Gérer la touche Entrée pour envoyer un message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gérer les changements de saisie pour l'indicateur de frappe
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (selectedConversationId) {
      if (e.target.value.length > 0) {
        sendTypingIndicator(selectedConversationId);
      } else {
        sendStopTypingIndicator(selectedConversationId);
      }
    }
  };

  // Obtenir l'avatar d'une conversation
  const getConversationAvatar = (conversation) => {
    if (conversation.avatar) return conversation.avatar;
    
    if (conversation.type === 'private') {
      const otherParticipant = conversation.participants?.find(p => p.user._id !== user?.id);
      return otherParticipant?.user.avatar;
    }
    
    return null;
  };

  // Obtenir le nom d'une conversation
  const getConversationName = (conversation) => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === 'private') {
      const otherParticipant = conversation.participants?.find(p => p.user._id !== user?.id);
      return otherParticipant ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}` : 'Utilisateur';
    }
    
    return 'Conversation de groupe';
  };

  // Obtenir l'icône du type de conversation
  const getConversationIcon = (type) => {
    switch (type) {
      case 'private':
        return <PersonIcon />;
      case 'group':
        return <GroupIcon />;
      case 'quartier':
        return <LocationIcon />;
      default:
        return <ChatIcon />;
    }
  };

  if (loading && conversations.length === 0) {
    return <LoadingSpinner fullScreen message="Chargement des conversations..." />;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Messages
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={() => setShowCreateForm(true)}>
            <AddIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleLoadTestData}
            sx={{ ml: 1 }}
          >
            Données de test
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container sx={{ flexGrow: 1, height: 'calc(100vh - 64px)' }}>
        {/* Liste des conversations */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Barre de recherche */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Rechercher des conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filtres */}
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'Toutes', icon: <ChatIcon /> },
                  { key: 'private', label: 'Privées', icon: <PersonIcon /> },
                  { key: 'group', label: 'Groupes', icon: <GroupIcon /> },
                  { key: 'quartier', label: 'Quartiers', icon: <LocationIcon /> }
                ].map((filter) => (
                  <Chip
                    key={filter.key}
                    label={filter.label}
                    icon={filter.icon}
                    onClick={() => setFilterType(filter.key)}
                    color={filterType === filter.key ? 'primary' : 'default'}
                    size="small"
                    variant={filterType === filter.key ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Liste des conversations */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {/* Messages d'erreur/succès */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                  {formatError(error)}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
                  {typeof success === 'string' ? success : 'Opération réussie'}
                </Alert>
              )}

              {filteredConversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredConversations.map((conversation) => (
                    <ListItem
                      key={conversation.id}
                      button
                      selected={selectedConversationId === conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={conversation.unreadCount || 0}
                          color="primary"
                          invisible={!conversation.unreadCount}
                        >
                          <Avatar src={getConversationAvatar(conversation)}>
                            {getConversationIcon(conversation.type)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: conversation.unreadCount ? 'bold' : 'normal',
                                flexGrow: 1,
                              }}
                            >
                              {getConversationName(conversation)}
                            </Typography>
                            {conversation.lastMessage && (
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(conversation.lastMessage.timestamp), 'HH:mm', { locale: fr })}
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontWeight: conversation.unreadCount ? 'bold' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {conversation.lastMessage?.content || 'Aucun message'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Zone de conversation */}
        <Grid item xs={12} md={8} lg={9}>
          {selectedConversationId ? (
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header de la conversation */}
              <ConversationHeader conversation={currentConversation} />

              <Divider />

              {/* Messages */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Aucun message dans cette conversation
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.sender._id === user?.id}
                      />
                    ))}
                    
                    {/* Indicateur de frappe */}
                    <TypingIndicator conversationId={selectedConversationId} />
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Zone de saisie */}
              <Box sx={{ p: 2 }}>
                {/* Aperçu des fichiers attachés */}
                {attachments.length > 0 && (
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {attachments.map((attachment, index) => (
                      <Chip
                        key={index}
                        label={attachment.filename}
                        onDelete={() => removeAttachment(index)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  {/* Boutons d'attachement */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload-message"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="image-upload-message">
                      <IconButton component="span" size="small">
                        <ImageIcon />
                      </IconButton>
                    </label>

                    <input
                      accept="video/*"
                      style={{ display: 'none' }}
                      id="video-upload-message"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="video-upload-message">
                      <IconButton component="span" size="small">
                        <VideoLibraryIcon />
                      </IconButton>
                    </label>

                    <input
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      id="file-upload-message"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload-message">
                      <IconButton component="span" size="small">
                        <AttachFileIcon />
                      </IconButton>
                    </label>
                  </Box>

                                <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={!selectedConversationId}
              />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && attachments.length === 0) || !selectedConversationId}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
              }}
            >
              <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Sélectionnez une conversation
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Choisissez une conversation dans la liste pour commencer à discuter
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Formulaire de création de conversation */}
      <CreateConversationForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />

      {/* Indicateur de statut de connexion */}
      <ConnectionStatus />
    </Box>
  );
};

export default MessagesPage; 