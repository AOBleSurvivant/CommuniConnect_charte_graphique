const express = require('express');
const router = express.Router();
const devAuth = require('../middleware/devAuth');

// Appliquer le middleware d'authentification de développement
router.use(devAuth);

// Mock data pour les livestreams
const mockLivestreams = [
  {
    id: 1,
    title: 'Live communautaire Labé',
    description: 'Discussion sur les événements locaux',
          status: 'live',
    streamer: {
      id: 1,
      name: 'Mamadou Diallo',
      profilePicture: '/api/static/avatars/A.jpg'
    },
          location: {
      prefecture: 'Labé',
      commune: 'Labé-Centre',
      quartier: 'Porel'
    },
    viewers: 45,
    startedAt: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
    tags: ['communauté', 'local']
  },
  {
    id: 2,
    title: 'Actualités de la région',
    description: 'Les dernières nouvelles de Labé',
    status: 'scheduled',
    streamer: {
      id: 2,
      name: 'Fatoumata Bah',
      profilePicture: '/api/static/avatars/F.jpg'
    },
          location: {
      prefecture: 'Labé',
      commune: 'Labé-Centre',
      quartier: 'Centre-ville'
    },
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // Dans 2 heures
    tags: ['actualités', 'région']
  }
];

      const mockAlerts = [
        {
    id: 1,
    type: 'urgent',
    message: 'Alerte météo - Fortes pluies attendues',
          location: {
      prefecture: 'Labé',
      commune: 'Labé-Centre',
      quartier: 'Porel'
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // Il y a 15 minutes
    priority: 'high'
  },
  {
    id: 2,
    type: 'info',
    message: 'Réunion communautaire ce soir',
    location: {
      prefecture: 'Labé',
      commune: 'Labé-Centre',
      quartier: 'Centre-ville'
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // Il y a 45 minutes
    priority: 'medium'
  }
];

// GET /api/livestreams - Liste des livestreams avec filtres
router.get('/', (req, res) => {
  console.log('📺 GET /api/livestreams - Liste des livestreams');
  
  const { type, urgency, quartier, commune, prefecture } = req.query;
  
  let filteredLivestreams = [...mockLivestreams];
  
  // Filtrage par type
  if (type) {
    filteredLivestreams = filteredLivestreams.filter(ls => ls.status === type);
  }
  
  // Filtrage par localisation
  if (prefecture) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.prefecture === prefecture
    );
  }
  
  if (commune) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.commune === commune
    );
  }
  
  if (quartier) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.quartier === quartier
    );
  }

    res.json({
      success: true,
      livestreams: filteredLivestreams,
      total: filteredLivestreams.length
    });
});

// GET /api/livestreams/live - Livestreams en direct
router.get('/live', (req, res) => {
  console.log('📺 GET /api/livestreams/live - Lives en direct');
  
  const liveStreams = mockLivestreams.filter(ls => ls.status === 'live');

      res.json({
        success: true,
        livestreams: liveStreams,
        total: liveStreams.length
      });
});

// GET /api/livestreams/scheduled - Livestreams programmés
router.get('/scheduled', (req, res) => {
  console.log('📺 GET /api/livestreams/scheduled - Lives programmés');
  
  const scheduledStreams = mockLivestreams.filter(ls => ls.status === 'scheduled');

    res.json({
      success: true,
      livestreams: scheduledStreams,
      total: scheduledStreams.length
    });
});

// GET /api/livestreams/alerts - Alertes
router.get('/alerts', (req, res) => {
  console.log('📺 GET /api/livestreams/alerts - Alertes');
  
  const { urgency, quartier, commune, prefecture } = req.query;
  
  let filteredAlerts = [...mockAlerts];
  
  // Filtrage par urgence
  if (urgency) {
    filteredAlerts = filteredAlerts.filter(alert => alert.priority === urgency);
  }
  
  // Filtrage par localisation
  if (prefecture) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.location.prefecture === prefecture
    );
  }
  
  if (commune) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.location.commune === commune
    );
  }
  
  if (quartier) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.location.quartier === quartier
    );
  }

    res.json({
      success: true,
    data: filteredAlerts,
    total: filteredAlerts.length
  });
});

// GET /api/livestreams/community - Livestreams par communauté
router.get('/community', (req, res) => {
  console.log('📺 GET /api/livestreams/community - Lives par communauté');
  
  const { quartier, commune, prefecture } = req.query;
  
  let filteredLivestreams = [...mockLivestreams];
  
  // Filtrage par localisation
  if (prefecture) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.prefecture === prefecture
    );
  }
  
  if (commune) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.commune === commune
    );
  }
  
  if (quartier) {
    filteredLivestreams = filteredLivestreams.filter(ls => 
      ls.location.quartier === quartier
    );
  }

      res.json({
        success: true,
    data: filteredLivestreams,
    total: filteredLivestreams.length
  });
});

// GET /api/livestreams/:id - Détails d'un livestream
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📺 GET /api/livestreams/${id} - Détails du live`);
  
  const livestream = mockLivestreams.find(ls => ls.id === parseInt(id));
  
  if (!livestream) {
      return res.status(404).json({
        success: false,
      message: 'Livestream non trouvé'
      });
    }

    res.json({
      success: true,
    data: livestream
  });
});

// POST /api/livestreams - Créer un nouveau livestream
router.post('/', (req, res) => {
  console.log('📺 POST /api/livestreams - Créer un nouveau live');
  
  const { title, description, location, scheduledFor } = req.body;

    const newLivestream = {
    id: mockLivestreams.length + 1,
      title,
      description,
    status: scheduledFor ? 'scheduled' : 'live',
    streamer: {
      id: req.user.id,
      name: req.user.name,
      profilePicture: req.user.profilePicture
    },
    location,
    viewers: 0,
    startedAt: scheduledFor ? null : new Date(),
    scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    tags: []
  };
  
  mockLivestreams.push(newLivestream);

    res.status(201).json({
      success: true,
    data: newLivestream,
    message: 'Livestream créé avec succès'
  });
});

// POST /api/livestreams/:id/start - Démarrer un livestream
router.post('/:id/start', (req, res) => {
    const { id } = req.params;
  console.log(`📺 POST /api/livestreams/${id}/start - Démarrer le live`);
  
  const livestream = mockLivestreams.find(ls => ls.id === parseInt(id));
  
  if (!livestream) {
      return res.status(404).json({
        success: false,
      message: 'Livestream non trouvé'
    });
  }
  
  livestream.status = 'live';
  livestream.startedAt = new Date();

    res.json({
      success: true,
    data: livestream,
    message: 'Livestream démarré avec succès'
  });
});

// POST /api/livestreams/:id/join - Rejoindre un livestream
router.post('/:id/join', (req, res) => {
    const { id } = req.params;
  console.log(`📺 POST /api/livestreams/${id}/join - Rejoindre le live`);
  
  const livestream = mockLivestreams.find(ls => ls.id === parseInt(id));
  
  if (!livestream) {
      return res.status(404).json({
        success: false,
      message: 'Livestream non trouvé'
    });
  }
  
  livestream.viewers += 1;

    res.json({
      success: true,
    data: { viewers: livestream.viewers },
    message: 'Vous avez rejoint le livestream'
  });
});

// POST /api/livestreams/:id/message - Envoyer un message
router.post('/:id/message', (req, res) => {
    const { id } = req.params;
  const { message } = req.body;
  console.log(`📺 POST /api/livestreams/${id}/message - Envoyer un message`);
  
  const livestream = mockLivestreams.find(ls => ls.id === parseInt(id));
  
  if (!livestream) {
      return res.status(404).json({
      success: false,
      message: 'Livestream non trouvé'
    });
  }

    res.json({
      success: true,
    data: {
      message,
        user: {
        id: req.user.id,
        name: req.user.name,
          profilePicture: req.user.profilePicture
        },
        timestamp: new Date()
    },
      message: 'Message envoyé avec succès'
    });
});

// POST /api/livestreams/:id/reaction - Réagir à un livestream
router.post('/:id/reaction', (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
  console.log(`📺 POST /api/livestreams/${id}/reaction - Réaction ${type}`);
  
  const livestream = mockLivestreams.find(ls => ls.id === parseInt(id));
  
  if (!livestream) {
      return res.status(404).json({
        success: false,
      message: 'Livestream non trouvé'
    });
  }

    res.json({
      success: true,
    data: {
      type,
      user: {
        id: req.user.id,
        name: req.user.name
      },
      timestamp: new Date()
    },
    message: 'Réaction envoyée avec succès'
  });
});

module.exports = router; 