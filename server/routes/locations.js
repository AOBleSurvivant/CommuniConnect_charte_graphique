const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Route simplifiée pour valider une localisation
router.post('/validate', auth, [
  body('address').trim().notEmpty().withMessage('L\'adresse est requise'),
  body('latitude').optional().isFloat().withMessage('La latitude doit être un nombre'),
  body('longitude').optional().isFloat().withMessage('La longitude doit être un nombre')
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

    const { address, latitude, longitude } = req.body;

    // Validation basique
    let isValid = true;
    let message = 'Localisation valide';

    // Si des coordonnées sont fournies, vérifier qu'elles sont en Guinée
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      const isInGuinea = lat >= 7.0 && lat <= 12.5 && 
                        lon >= -15.0 && lon <= -7.5;

      if (!isInGuinea) {
        isValid = false;
        message = 'Les coordonnées ne se trouvent pas en Guinée';
      }
    }

    const validationResult = {
      isValid,
      location: {
        address: address.trim(),
        coordinates: latitude && longitude ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        } : null
      },
      message
    };

    res.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    console.error('Erreur lors de la validation de localisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 