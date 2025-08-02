const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.header('Authorization');
    
    // En mode développement, permettre l'accès sans token
    if (process.env.NODE_ENV === 'development' && !authHeader) {
      req.user = {
        _id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: '',
          quartier: '',
          coordinates: {
            latitude: 9.5370,
            longitude: -13.6785
          }
        }
      };
      return next();
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // En mode développement, accepter le token mock
    if (process.env.NODE_ENV === 'development' && token === 'test-token-development') {
      req.user = {
        _id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: '',
          quartier: '',
          coordinates: {
            latitude: 9.5370,
            longitude: -13.6785
          }
        }
      };
      return next();
    }

    // Vérifier le token JWT pour la production
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // En mode développement, créer un utilisateur fictif si nécessaire
    if (process.env.NODE_ENV === 'development') {
      req.user = {
        _id: decoded.userId || 'test-user-id',
        email: decoded.email || 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: decoded.role || 'user',
        location: {
          region: 'Conakry',
          prefecture: 'Conakry',
          commune: '',
          quartier: '',
          coordinates: {
            latitude: 9.5370,
            longitude: -13.6785
          }
        }
      };
    } else {
      // En production, récupérer l'utilisateur depuis la base de données
      req.user = decoded;
    }

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

module.exports = auth; 