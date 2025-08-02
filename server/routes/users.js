const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // En mode développement, retourner un profil fictif
    const profile = {
      _id: userId,
      firstName: req.user.firstName || 'Test',
      lastName: req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: req.user.phone || '+224123456789',
      address: req.user.address || 'Conakry, Guinée',
      profilePicture: req.user.profilePicture || null,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/users/profile - Modifier le profil utilisateur
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim().isMobilePhone('any'),
  body('address').optional().trim().isLength({ min: 5, max: 200 }),
  body('profilePicture').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const userId = req.user._id || req.user.id;
    const { firstName, lastName, phone, address, profilePicture } = req.body;

    // En mode développement, simuler la mise à jour
    const updatedProfile = {
      _id: userId,
      firstName: firstName || req.user.firstName || 'Test',
      lastName: lastName || req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: phone || req.user.phone || '+224123456789',
      address: address || req.user.address || 'Conakry, Guinée',
      profilePicture: profilePicture || req.user.profilePicture || null,
      isVerified: true,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/users/profile/picture - Upload photo de profil
router.post('/profile/picture', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { profilePicture } = req.body;

    // En mode développement, simuler l'upload
    const updatedProfile = {
      _id: userId,
      firstName: req.user.firstName || 'Test',
      lastName: req.user.lastName || 'User',
      email: req.user.email || 'test@communiconnect.gn',
      phone: req.user.phone || '+224123456789',
      address: req.user.address || 'Conakry, Guinée',
      profilePicture: profilePicture || 'https://via.placeholder.com/150',
      isVerified: true,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Photo de profil mise à jour avec succès',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 