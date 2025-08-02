const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    // Vérifier le token JWT
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // En mode développement, simuler un utilisateur admin
    if (process.env.NODE_ENV === 'development') {
      req.user = {
        _id: 'admin-user-id',
        email: 'admin@communiconnect.com',
        firstName: 'Admin',
        lastName: 'CommuniConnect',
        role: 'admin',
        isAdmin: true,
        isModerator: true
      };
    } else {
      // En production, vérifier les rôles réels
      if (!decoded.user || (!decoded.user.isAdmin && !decoded.user.isModerator)) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé - Droits d\'administrateur requis'
        });
      }
      req.user = decoded.user;
    }

    next();
  } catch (error) {
    console.error('Erreur d\'authentification admin:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

module.exports = adminAuth; 