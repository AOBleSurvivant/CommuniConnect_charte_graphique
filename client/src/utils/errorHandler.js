/**
 * Utilitaire pour gérer l'affichage des erreurs de manière sécurisée
 */

/**
 * Convertit une erreur (string ou object) en chaîne de caractères sécurisée pour l'affichage
 * @param {string|object} error - L'erreur à convertir
 * @returns {string} - La chaîne d'erreur sécurisée
 */
export const formatError = (error) => {
  if (!error) return '';
  
  // Si c'est déjà une chaîne, on la retourne
  if (typeof error === 'string') {
    return error;
  }
  
  // Si c'est un objet, on essaie d'extraire le message
  if (typeof error === 'object') {
    // Si c'est un objet d'erreur API avec une propriété message
    if (error.message) {
      return error.message;
    }
    
    // Si c'est un objet d'erreur API avec une propriété errors
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.map(err => err.msg || err.message || 'Erreur inconnue').join(', ');
    }
    
    // Si c'est un objet d'erreur avec une propriété error
    if (error.error) {
      return typeof error.error === 'string' ? error.error : 'Erreur inconnue';
    }
    
    // Sinon, on essaie de convertir l'objet en JSON
    try {
      return JSON.stringify(error);
    } catch {
      return 'Erreur inconnue';
    }
  }
  
  // Fallback
  return String(error);
};

/**
 * Vérifie si une erreur est un objet
 * @param {any} error - L'erreur à vérifier
 * @returns {boolean} - True si c'est un objet
 */
export const isErrorObject = (error) => {
  return error && typeof error === 'object' && !Array.isArray(error);
};

/**
 * Extrait le message principal d'une erreur
 * @param {string|object} error - L'erreur
 * @returns {string} - Le message principal
 */
export const getErrorMessage = (error) => {
  if (!error) return '';
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (isErrorObject(error)) {
    return error.message || error.msg || 'Erreur inconnue';
  }
  
  return String(error);
}; 