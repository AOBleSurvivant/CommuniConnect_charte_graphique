import LocationSelector from '../common/LocationSelector';

// Wrapper pour maintenir la compatibilité avec l'ancien composant
const AuthLocationSelector = (props) => {
  return <LocationSelector {...props} showGPS={true} required={true} />;
};

export default AuthLocationSelector; 