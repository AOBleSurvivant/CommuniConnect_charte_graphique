import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Button,
  Grid
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  Error as ErrorIcon
} from '@mui/icons-material';

const LocationSelector = ({ formData, handleInputChange, showGPS = true, required = true }) => {
  const [geographyData, setGeographyData] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [prefectures, setPrefectures] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  // Données par défaut si le fichier JSON n'est pas trouvé
  const defaultGeographyData = [
    {
      nom: "Conakry",
      préfectures: [
        {
          nom: "Conakry",
          communes: [
            {
              nom: "Kaloum",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 9.537, longitude: -13.6785 } },
                { nom: "Port", coordonnées: { latitude: 9.540, longitude: -13.680 } },
                { nom: "Almamya", coordonnées: { latitude: 9.535, longitude: -13.675 } }
              ]
            },
            {
              nom: "Ratoma",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 9.545, longitude: -13.685 } },
                { nom: "Hamdallaye", coordonnées: { latitude: 9.550, longitude: -13.690 } },
                { nom: "Koloma", coordonnées: { latitude: 9.548, longitude: -13.688 } }
              ]
            },
            {
              nom: "Dixinn",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 9.555, longitude: -13.695 } },
                { nom: "Kipé", coordonnées: { latitude: 9.560, longitude: -13.700 } },
                { nom: "Lansanaya", coordonnées: { latitude: 9.558, longitude: -13.698 } }
              ]
            },
            {
              nom: "Matam",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 9.565, longitude: -13.705 } },
                { nom: "Matoto", coordonnées: { latitude: 9.570, longitude: -13.710 } },
                { nom: "Kagbelen", coordonnées: { latitude: 9.568, longitude: -13.708 } }
              ]
            }
          ]
        }
      ]
    },
    {
      nom: "Labé",
      préfectures: [
        {
          nom: "Labé",
          communes: [
            {
              nom: "Labé-Centre",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 11.316, longitude: -12.283 } },
                { nom: "Porel", coordonnées: { latitude: 11.320, longitude: -12.285 } },
                { nom: "Hafia", coordonnées: { latitude: 11.318, longitude: -12.287 } }
              ]
            }
          ]
        },
        {
          nom: "Lélouma",
          communes: [
            {
              nom: "Lélouma-Centre",
              quartiers: [
                { nom: "Centre", coordonnées: { latitude: 11.400, longitude: -12.350 } },
                { nom: "Koubia", coordonnées: { latitude: 11.405, longitude: -12.355 } },
                { nom: "Tougué", coordonnées: { latitude: 11.403, longitude: -12.353 } }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Charger les données géographiques
  useEffect(() => {
    const loadGeographyData = async () => {
      try {
        const response = await fetch('/data/guinea-geography-complete.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const regions = data.Guinée?.Régions || defaultGeographyData;
        setGeographyData(regions);
        
        // Initialiser les options en cascade si des valeurs existent déjà
        if (formData.region) {
          const selectedRegion = regions.find(r => r.nom === formData.region);
          if (selectedRegion) {
            setPrefectures(selectedRegion.préfectures || []);
            
            if (formData.prefecture) {
              const selectedPrefecture = selectedRegion.préfectures?.find(p => p.nom === formData.prefecture);
              if (selectedPrefecture) {
                setCommunes(selectedPrefecture.communes || []);
                
                if (formData.commune) {
                  const selectedCommune = selectedPrefecture.communes?.find(c => c.nom === formData.commune);
                  if (selectedCommune) {
                    setQuartiers(selectedCommune.quartiers || []);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données géographiques:', error);
        setLocationError('Impossible de charger les données géographiques. Utilisation des données par défaut.');
        setGeographyData(defaultGeographyData);
      }
    };
    loadGeographyData();
  }, []);

  // Initialiser les données quand geographyData change
  useEffect(() => {
    if (geographyData.length > 0 && formData.region) {
      const selectedRegion = geographyData.find(r => r.nom === formData.region);
      if (selectedRegion) {
        setPrefectures(selectedRegion.préfectures || []);
        
        if (formData.prefecture) {
          const selectedPrefecture = selectedRegion.préfectures?.find(p => p.nom === formData.prefecture);
          if (selectedPrefecture) {
            setCommunes(selectedPrefecture.communes || []);
            
            if (formData.commune) {
              const selectedCommune = selectedPrefecture.communes?.find(c => c.nom === formData.commune);
              if (selectedCommune) {
                setQuartiers(selectedCommune.quartiers || []);
              }
            }
          }
        }
      }
    }
  }, [geographyData, formData.region, formData.prefecture, formData.commune]);

  // Gérer les changements de sélection en cascade
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);
    
    // Mettre à jour les options en cascade
    if (name === 'region') {
      const selectedRegion = geographyData?.find(r => r.nom === value);
      if (selectedRegion) {
        setPrefectures(selectedRegion.préfectures || []);
        setCommunes([]);
        setQuartiers([]);
        handleInputChange({ target: { name: 'prefecture', value: '' } });
        handleInputChange({ target: { name: 'commune', value: '' } });
        handleInputChange({ target: { name: 'quartier', value: '' } });
      }
    } else if (name === 'prefecture') {
      const selectedPrefecture = prefectures.find(p => p.nom === value);
      if (selectedPrefecture) {
        setCommunes(selectedPrefecture.communes || []);
        setQuartiers([]);
        handleInputChange({ target: { name: 'commune', value: '' } });
        handleInputChange({ target: { name: 'quartier', value: '' } });
      }
    } else if (name === 'commune') {
      const selectedCommune = communes.find(c => c.nom === value);
      if (selectedCommune) {
        setQuartiers(selectedCommune.quartiers || []);
        handleInputChange({ target: { name: 'quartier', value: '' } });
      }
    } else if (name === 'quartier') {
      const selectedQuartier = quartiers.find(q => q.nom === value);
      if (selectedQuartier && selectedQuartier.coordonnées) {
        handleInputChange({ target: { name: 'latitude', value: selectedQuartier.coordonnées.latitude } });
        handleInputChange({ target: { name: 'longitude', value: selectedQuartier.coordonnées.longitude } });
        
        const fullAddress = `${value}, ${formData.commune}, ${formData.prefecture}, ${formData.region}, Guinée`;
        handleInputChange({ target: { name: 'address', value: fullAddress } });
      }
    }
  };

  return (
    <Box>
      {/* Section GPS */}
      {showGPS && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MyLocation color="primary" />
            Localisation GPS
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Utilisez votre position GPS pour remplir automatiquement votre localisation.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<MyLocation />}
            onClick={() => {
              // TODO: Implémenter la géolocalisation
              console.log('Géolocalisation à implémenter');
            }}
            sx={{ mb: 2 }}
          >
            Utiliser ma position GPS
          </Button>

          {locationError && (
            <Alert severity="warning" sx={{ mb: 2 }} startIcon={<ErrorIcon />}>
              {locationError}
            </Alert>
          )}
        </Box>
      )}

      {/* Section sélection manuelle */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="primary" />
          Sélection manuelle
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sélectionnez votre localisation étape par étape. L'adresse complète sera générée automatiquement quand vous choisissez votre quartier.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Région {required ? '*' : ''}</InputLabel>
              <Select
                name="region"
                value={formData.region || ''}
                onChange={handleLocationChange}
                label={`Région ${required ? '*' : ''}`}
                required={required}
              >
                <MenuItem value="">
                  <em>Sélectionnez une région</em>
                </MenuItem>
                {geographyData.map((region) => (
                  <MenuItem key={region.nom} value={region.nom}>
                    {region.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Préfecture {required ? '*' : ''}</InputLabel>
              <Select
                name="prefecture"
                value={formData.prefecture || ''}
                onChange={handleLocationChange}
                label={`Préfecture ${required ? '*' : ''}`}
                required={required}
                disabled={!formData.region}
              >
                <MenuItem value="">
                  <em>Sélectionnez une préfecture</em>
                </MenuItem>
                {prefectures.map((prefecture) => (
                  <MenuItem key={prefecture.nom} value={prefecture.nom}>
                    {prefecture.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Commune {required ? '*' : ''}</InputLabel>
              <Select
                name="commune"
                value={formData.commune || ''}
                onChange={handleLocationChange}
                label={`Commune ${required ? '*' : ''}`}
                required={required}
                disabled={!formData.prefecture}
              >
                <MenuItem value="">
                  <em>Sélectionnez une commune</em>
                </MenuItem>
                {communes.map((commune) => (
                  <MenuItem key={commune.nom} value={commune.nom}>
                    {commune.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Quartier {required ? '*' : ''}</InputLabel>
              <Select
                name="quartier"
                value={formData.quartier || ''}
                onChange={handleLocationChange}
                label={`Quartier ${required ? '*' : ''}`}
                required={required}
                disabled={!formData.commune}
              >
                <MenuItem value="">
                  <em>Sélectionnez un quartier</em>
                </MenuItem>
                {quartiers.map((quartier) => (
                  <MenuItem key={quartier.nom} value={quartier.nom}>
                    {quartier.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LocationSelector;