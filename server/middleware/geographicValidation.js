const fs = require('fs');
const path = require('path');

// Charger les données géographiques de la Guinée
const loadGuineaGeography = () => {
  try {
    const geographyPath = path.join(__dirname, '../../data/guinea-geography-complete.json');
    const geographyData = fs.readFileSync(geographyPath, 'utf8');
    return JSON.parse(geographyData);
  } catch (error) {
    console.error('Erreur lors du chargement des données géographiques:', error);
    return null;
  }
};

// Vérifier si les coordonnées sont en Guinée
const isLocationInGuinea = (latitude, longitude) => {
  // Limites approximatives de la Guinée
  const guineaBounds = {
    north: 12.6769, // Latitude nord
    south: 7.1935,  // Latitude sud
    east: -7.6411,  // Longitude est
    west: -15.0820  // Longitude ouest
  };

  return (
    latitude >= guineaBounds.south &&
    latitude <= guineaBounds.north &&
    longitude >= guineaBounds.west &&
    longitude <= guineaBounds.east
  );
};

// Trouver la localisation exacte dans la hiérarchie géographique
const findExactLocation = (latitude, longitude, geographyData) => {
  if (!geographyData || !geographyData.Guinée) {
    console.log('Données géographiques non disponibles');
    return null;
  }

  // Distance maximale pour considérer qu'un point appartient à une commune (en km)
  const MAX_DISTANCE_KM = 100;
  let closestLocation = null;
  let minDistance = Infinity;

  console.log(`Recherche de localisation pour: lat=${latitude}, lon=${longitude}`);

  for (const region of geographyData.Guinée.Régions) {
    for (const prefecture of region.préfectures) {
      for (const commune of prefecture.communes) {
        if (commune.coordonnées) {
          const distance = calculateDistance(
            latitude,
            longitude,
            commune.coordonnées.latitude,
            commune.coordonnées.longitude
          );

          console.log(`Distance vers ${commune.nom}: ${distance.toFixed(2)} km`);

          if (distance <= MAX_DISTANCE_KM) {
            // Garder la localisation la plus proche
            if (distance < minDistance) {
              minDistance = distance;
              closestLocation = {
              region: region.nom,
              prefecture: prefecture.nom,
              commune: commune.nom,
              coordinates: commune.coordonnées,
              distance: distance
            };
          }
        }
      }
    }
  }
  }

  if (closestLocation) {
    console.log(`Localisation trouvée: ${closestLocation.commune} (${closestLocation.distance.toFixed(2)} km)`);
  } else {
    console.log('Aucune localisation trouvée dans le rayon de 100km');
  }

  return closestLocation;
};

// Calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Middleware de validation géographique simplifié
const validateGuineanLocation = (req, res, next) => {
  const { latitude, longitude, address } = req.body;

  // Vérifier que l'adresse est fournie
  if (!address || !address.trim()) {
    return res.status(400).json({
      success: false,
      message: 'L\'adresse est requise pour l\'inscription'
    });
  }

  // Si des coordonnées sont fournies, les valider basiquement
  if (latitude && longitude) {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Vérifier que les coordonnées sont des nombres valides
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: 'Les coordonnées géographiques doivent être des nombres valides'
      });
    }

    // Vérification basique si les coordonnées sont en Guinée (approximatif)
    const isInGuinea = lat >= 7.0 && lat <= 12.5 && 
                      lon >= -15.0 && lon <= -7.5;

    if (!isInGuinea) {
      return res.status(403).json({
        success: false,
        message: 'CommuniConnect est réservé aux résidents de la Guinée. Votre localisation actuelle ne se trouve pas en Guinée.'
      });
    }

    // Ajouter les coordonnées validées à la requête
    req.validatedLocation = {
      coordinates: {
        latitude: lat,
        longitude: lon
      },
      address: address.trim()
    };
  } else {
    // Si pas de coordonnées, juste valider l'adresse
    req.validatedLocation = {
      address: address.trim()
    };
  }

  next();
};

// Middleware pour vérifier la localisation lors de la mise à jour du profil
const validateLocationUpdate = (req, res, next) => {
  const { latitude, longitude } = req.body;

  // Si pas de nouvelles coordonnées, continuer
  if (!latitude && !longitude) {
    return next();
  }

  // Appliquer la même validation
  return validateGuineanLocation(req, res, next);
};

module.exports = {
  validateGuineanLocation
}; 