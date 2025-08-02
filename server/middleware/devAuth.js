// Middleware d'authentification pour le mode développement
const devAuth = (req, res, next) => {
  console.log('🔐 Middleware devAuth appelé');
  
  // En mode développement, permettre l'accès sans authentification
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('✅ Mode développement - authentification bypassée');
    
    // Créer un utilisateur de test
    req.user = {
      _id: 'test-user-id',
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@communiconnect.gn',
      isVerified: true,
      profilePicture: '/api/static/avatars/T.jpg'
    };
    return next();
  }
  
  // En production, utiliser l'authentification normale
  console.log('🔒 Mode production - authentification requise');
  const auth = require('./auth');
  return auth(req, res, next);
};

module.exports = devAuth;