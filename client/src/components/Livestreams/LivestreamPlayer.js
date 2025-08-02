import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Avatar,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Slider
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Fullscreen as FullscreenIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  Settings as SettingsIcon,
  FlipCameraIos as FlipCameraIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const LivestreamPlayer = ({ livestream, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true); // Contrôle du miroir
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStream, setCurrentStream] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
  const chatRef = useRef(null);
  
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  // Simuler des messages de chat en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const mockMessages = [
        { id: Date.now(), user: 'Mamadou', message: 'Bonjour tout le monde !', timestamp: new Date() },
        { id: Date.now() + 1, user: 'Fatou', message: 'Merci pour ce live !', timestamp: new Date() },
        { id: Date.now() + 2, user: 'Ibrahima', message: 'Très intéressant !', timestamp: new Date() }
      ];
      setChatMessages(prev => [...prev, ...mockMessages.slice(0, 1)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll du chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Nettoyer les ressources - Version améliorée
  const cleanup = () => {
    console.log('Nettoyage des ressources...');
    
    // Arrêter le stream actuel
    if (currentStream) {
      try {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
      } catch (error) {
        console.error('Erreur lors de l\'arrêt du stream:', error);
      }
      setCurrentStream(null);
    }
    
    // Nettoyer la vidéo de manière sécurisée
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
      } catch (error) {
        console.error('Erreur lors du nettoyage vidéo:', error);
      }
      setIsVideoReady(false);
    }
    
    // Réinitialiser tous les états
    setIsCameraOn(false);
    setIsMicOn(false);
    setIsScreenSharing(false);
    setIsPlaying(false);
    setIsProcessing(false);
    
    console.log('Nettoyage terminé');
  };

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Surveiller les changements d'état et corriger les incohérences
  useEffect(() => {
    if (!isProcessing) {
      const isValid = validateStates();
      if (!isValid) {
        console.log('Correction automatique des états...');
        // Forcer un nettoyage et redémarrage si nécessaire
        if (isCameraOn && !currentStream) {
          setIsCameraOn(false);
          setIsPlaying(false);
        }
      }
    }
  }, [isCameraOn, isScreenSharing, isPlaying, currentStream, isProcessing]);

  // Arrêter la caméra
  const stopCamera = () => {
    cleanup();
  };

  // Démarrer la caméra - Version corrigée
  const startCamera = async () => {
    // Éviter les actions multiples
    if (isProcessing) {
      console.log('Action en cours, veuillez patienter...');
      return;
    }

    // Vérifier si on est déjà en train de démarrer la caméra
    if (isCameraOn && !isScreenSharing) {
      console.log('Caméra déjà active');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Vérifier si l'API mediaDevices est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('API mediaDevices non disponible, simulation en mode développement');
        simulateCamera();
        setIsProcessing(false);
        return;
      }

      // Arrêter le stream actuel s'il existe
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
        setCurrentStream(null);
      }

      // Nettoyer la vidéo de manière sécurisée
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        setIsVideoReady(false);
      }

      // Réinitialiser les états avant de démarrer
      setIsCameraOn(false);
      setIsMicOn(false);
      setIsPlaying(false);
      setIsScreenSharing(false);

      // Attendre un peu avant de démarrer la caméra
      await new Promise(resolve => setTimeout(resolve, 300));

      // Démarrer la caméra avec timeout
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
            // Désactiver le miroir automatique pour éviter les problèmes d'orientation
            transform: 'none'
          }, 
          audio: true 
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout starting video source')), 8000)
        )
      ]);
      
      // Vérifier que le stream est toujours valide
      if (!stream || stream.getTracks().length === 0) {
        throw new Error('Stream invalide après démarrage');
      }
      
      // Sauvegarder le stream
      setCurrentStream(stream);
      
      // Afficher le stream de manière sécurisée
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Attendre que la vidéo soit prête avant de jouer
        videoRef.current.onloadedmetadata = () => {
          setIsVideoReady(true);
          
          // Vérifier que la vidéo est toujours valide
          if (videoRef.current && videoRef.current.srcObject === stream) {
            videoRef.current.play().then(() => {
              // Mettre à jour les états seulement après le succès
              setIsCameraOn(true);
              setIsMicOn(true);
              setIsPlaying(true);
              setIsScreenSharing(false);
            }).catch(error => {
              console.log('Erreur lors de la lecture vidéo:', error);
              simulateCamera();
            });
          }
        };

        // Gérer les erreurs de la vidéo
        videoRef.current.onerror = (error) => {
          console.error('Erreur vidéo:', error);
          simulateCamera();
        };
      }
      
    } catch (error) {
      console.error('Erreur lors du démarrage de la caméra:', error);
      
      // Nettoyer en cas d'erreur
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
        setCurrentStream(null);
      }
      
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        setIsVideoReady(false);
      }
      
      // Réinitialiser les états
      setIsCameraOn(false);
      setIsMicOn(false);
      setIsPlaying(false);
      setIsScreenSharing(false);
      
      // Simuler la caméra en cas d'erreur
      simulateCamera();
    } finally {
      setIsProcessing(false);
    }
  };

  // Simuler la caméra en mode développement
  const simulateCamera = () => {
    console.log('Mode développement: Simulation de la caméra');
    setIsCameraOn(true);
    setIsMicOn(true);
    setIsPlaying(true);
    
    // Afficher un message à l'utilisateur
    const mockMessages = [
      { id: Date.now(), user: 'Système', message: 'Mode développement: Caméra simulée', timestamp: new Date() },
      { id: Date.now() + 1, user: 'Système', message: 'Vous pouvez tester les contrôles', timestamp: new Date() }
    ];
    setChatMessages(prev => [...prev, ...mockMessages]);
  };

  // Basculer la caméra - Version corrigée
  const toggleCamera = () => {
    // Éviter les déclenchements multiples
    if (isProcessing) {
      console.log('Action en cours, veuillez patienter...');
      return;
    }
    
    if (isScreenSharing) {
      console.log('Caméra désactivée pendant le partage d\'écran');
      return;
    }
    
    // Vérifier l'état actuel de la caméra
    if (isCameraOn && currentStream) {
      console.log('Arrêt de la caméra...');
      stopCamera();
    } else if (!isCameraOn) {
      console.log('Démarrage de la caméra...');
      startCamera();
    } else {
      console.log('État de caméra incohérent, redémarrage...');
      // Forcer le redémarrage en cas d'état incohérent
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  };

  // Basculer le micro
  const toggleMic = () => {
    if (currentStream && !isScreenSharing) {
      const audioTracks = currentStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMicOn(!isMicOn);
  };

  // Vérifier la cohérence des états
  const validateStates = () => {
    const issues = [];
    
    if (isCameraOn && !currentStream) {
      issues.push('Caméra activée mais pas de stream');
    }
    
    if (isScreenSharing && !currentStream) {
      issues.push('Partage d\'écran activé mais pas de stream');
    }
    
    if (isPlaying && !videoRef.current?.srcObject) {
      issues.push('Lecture active mais pas de source vidéo');
    }
    
    if (issues.length > 0) {
      console.warn('Incohérences d\'état détectées:', issues);
      return false;
    }
    
    return true;
  };

  // Partager l'écran - Version corrigée
  const toggleScreenShare = async () => {
    // Éviter les actions multiples
    if (isProcessing) {
      console.log('Action en cours, veuillez patienter...');
      return;
    }

    setIsProcessing(true);

    try {
      if (isScreenSharing) {
        // Arrêter le partage d'écran
        console.log('Arrêt du partage d\'écran...');
        
        // Arrêter le stream actuel
        if (currentStream) {
          currentStream.getTracks().forEach(track => {
            track.stop();
          });
          setCurrentStream(null);
        }
        
        // Nettoyer la vidéo de manière sécurisée
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          setIsVideoReady(false);
        }
        
        // Réinitialiser les états
        setIsScreenSharing(false);
        setIsCameraOn(false);
        setIsMicOn(false);
        setIsPlaying(false);
        
        // Attendre un peu avant de redémarrer la caméra
        setTimeout(() => {
          startCamera();
          setIsProcessing(false);
        }, 1000);
        
      } else {
        // Démarrer le partage d'écran
        console.log('Démarrage du partage d\'écran...');
        
        // Arrêter d'abord la caméra actuelle
        if (currentStream) {
          currentStream.getTracks().forEach(track => {
            track.stop();
          });
        }
        
        // Nettoyer la vidéo de manière sécurisée
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          setIsVideoReady(false);
        }
        
        // Attendre un peu avant de démarrer le partage
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Démarrer le partage d'écran
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
            displaySurface: "monitor"
          },
          audio: false
        });
        
        // Sauvegarder le stream
        setCurrentStream(screenStream);
        
        // Afficher le stream de manière sécurisée
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          
          // Attendre que la vidéo soit prête avant de jouer
          videoRef.current.onloadedmetadata = () => {
            setIsVideoReady(true);
            videoRef.current.play().catch(error => {
              console.log('Erreur lors de la lecture vidéo:', error);
            });
          };
        }
        
        // Mettre à jour les états
        setIsScreenSharing(true);
        setIsCameraOn(false);
        setIsMicOn(false);
        setIsPlaying(true);
        
        // Gérer la fin du partage d'écran
        screenStream.getVideoTracks()[0].onended = () => {
          console.log('Partage d\'écran terminé par l\'utilisateur');
          
          // Nettoyer de manière sécurisée
          if (currentStream) {
            currentStream.getTracks().forEach(track => {
              track.stop();
            });
            setCurrentStream(null);
          }
          
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            setIsVideoReady(false);
          }
          
          // Réinitialiser les états
          setIsScreenSharing(false);
          setIsCameraOn(false);
          setIsMicOn(false);
          setIsPlaying(false);
          
          // Redémarrer la caméra après un délai
          setTimeout(() => {
            startCamera();
          }, 1000);
        };
        
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error('Erreur lors du partage d\'écran:', error);
      setIsProcessing(false);
      
      // En cas d'erreur, redémarrer la caméra
      setTimeout(() => {
        startCamera();
      }, 1000);
    }
  };

  // Basculer le miroir
  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  const handlePlayPause = () => {
    // Éviter les actions pendant le traitement
    if (isProcessing) {
      console.log('Action en cours, veuillez patienter...');
      return;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error('Erreur lors de la lecture:', error);
            setIsPlaying(false);
          });
        }
      } catch (error) {
        console.error('Erreur lors du basculement play/pause:', error);
      }
    } else {
      console.log('Aucune source vidéo disponible');
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (videoRef.current) {
      videoRef.current.volume = newValue;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: user?.firstName || 'Utilisateur',
        message: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendChatMessage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: 'black',
      position: 'relative'
    }}>
      {/* Zone vidéo principale */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Vidéo */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: 'black',
            // Appliquer le miroir conditionnellement
            transform: isMirrored ? 'scaleX(-1)' : 'none'
          }}
          autoPlay
          muted
          playsInline
          onLoadedMetadata={() => {
            console.log('Vidéo chargée avec succès');
          }}
          onError={(e) => {
            console.error('Erreur vidéo:', e);
            simulateCamera();
          }}
        />
        
        {/* Overlay avec contrôles */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          p: 2,
          display: showControls ? 'block' : 'none'
        }}>
          {/* Contrôles principaux */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}>
            {/* Contrôles de caméra/micro */}
            <IconButton 
              onClick={toggleCamera}
              disabled={isScreenSharing}
              sx={{ 
                backgroundColor: isCameraOn ? 'error.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: isCameraOn ? 'error.dark' : 'rgba(255,255,255,0.3)' },
                '&:disabled': { opacity: 0.5 }
              }}
              title={isScreenSharing ? 'Désactivez le partage d\'écran d\'abord' : 'Basculer la caméra'}
            >
              {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            
            <IconButton 
              onClick={toggleMic}
              disabled={isScreenSharing}
              sx={{ 
                backgroundColor: isMicOn ? 'success.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: isMicOn ? 'success.dark' : 'rgba(255,255,255,0.3)' },
                '&:disabled': { opacity: 0.5 }
              }}
              title={isScreenSharing ? 'Désactivez le partage d\'écran d\'abord' : 'Basculer le micro'}
            >
              {isMicOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            
            <IconButton 
              onClick={toggleScreenShare}
              sx={{ 
                backgroundColor: isScreenSharing ? 'primary.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: isScreenSharing ? 'primary.dark' : 'rgba(255,255,255,0.3)' }
              }}
              title={isScreenSharing ? 'Arrêter le partage d\'écran' : 'Partager l\'écran'}
            >
              <ScreenShareIcon />
            </IconButton>
            
            <IconButton 
              onClick={toggleMirror}
              disabled={isScreenSharing}
              sx={{ 
                backgroundColor: isMirrored ? 'warning.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: isMirrored ? 'warning.dark' : 'rgba(255,255,255,0.3)' },
                '&:disabled': { opacity: 0.5 }
              }}
              title={isScreenSharing ? 'Désactivez le partage d\'écran d\'abord' : isMirrored ? 'Désactiver le miroir' : 'Activer le miroir'}
            >
              <FlipCameraIcon />
            </IconButton>
          </Box>
          
          {/* Contrôles de lecture */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton 
              onClick={handlePlayPause}
              sx={{ color: 'white' }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            
            <IconButton 
              onClick={handleStop}
              sx={{ color: 'white' }}
            >
              <StopIcon />
            </IconButton>
            
            <IconButton 
              onClick={handleMute}
              sx={{ color: 'white' }}
            >
              {isMuted ? <MuteIcon /> : <VolumeIcon />}
            </IconButton>
            
            <Box sx={{ width: 100, mx: 2 }}>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                sx={{ color: 'white' }}
              />
            </Box>
            
            <IconButton 
              onClick={handleFullscreen}
              sx={{ color: 'white' }}
            >
              <FullscreenIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Statistiques en direct */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1
        }}>
          <Typography variant="caption">
            👥 {livestream.stats?.currentViewers || 0} spectateurs
          </Typography>
        </Box>
        
        {/* Bouton fermer */}
        <IconButton 
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Chat en direct */}
      {showChat && (
        <Box sx={{ 
          width: 300, 
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Header du chat */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              💬 Chat en direct
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setShowChat(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box 
            ref={chatRef}
            sx={{ 
              flex: 1, 
              overflowY: 'auto',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            {chatMessages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                  {msg.user.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {msg.user}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                    {msg.message}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input du chat */}
          <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Tapez votre message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)'
                  }
                }}
              />
              <IconButton 
                onClick={handleSendChatMessage}
                disabled={!chatMessage.trim()}
                sx={{ color: 'white' }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Bouton pour afficher le chat */}
      {!showChat && (
        <IconButton
          onClick={() => setShowChat(true)}
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
          }}
        >
          <ChatIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default LivestreamPlayer; 