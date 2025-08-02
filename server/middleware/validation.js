const Joi = require('joi');

// Schémas de validation
const schemas = {
  // Validation pour l'authentification
  auth: {
    register: Joi.object({
      username: Joi.string().min(3).max(30).required()
        .messages({
          'string.min': 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
          'string.max': 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères',
          'any.required': 'Le nom d\'utilisateur est requis'
        }),
      email: Joi.string().email().required()
        .messages({
          'string.email': 'L\'email doit être valide',
          'any.required': 'L\'email est requis'
        }),
      password: Joi.string().min(6).required()
        .messages({
          'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
          'any.required': 'Le mot de passe est requis'
        }),
      location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
      }).optional()
    }),

    login: Joi.object({
      email: Joi.string().email().required()
        .messages({
          'string.email': 'L\'email doit être valide',
          'any.required': 'L\'email est requis'
        }),
      password: Joi.string().required()
        .messages({
          'any.required': 'Le mot de passe est requis'
        })
    })
  },

  // Validation pour les événements
  event: {
    create: Joi.object({
      title: Joi.string().min(3).max(100).required()
        .messages({
          'string.min': 'Le titre doit contenir au moins 3 caractères',
          'string.max': 'Le titre ne peut pas dépasser 100 caractères',
          'any.required': 'Le titre est requis'
        }),
      description: Joi.string().min(10).max(1000).required()
        .messages({
          'string.min': 'La description doit contenir au moins 10 caractères',
          'string.max': 'La description ne peut pas dépasser 1000 caractères',
          'any.required': 'La description est requise'
        }),
      date: Joi.date().greater('now').required()
        .messages({
          'date.greater': 'La date de l\'événement doit être dans le futur',
          'any.required': 'La date est requise'
        }),
      location: Joi.string().min(3).max(200).required()
        .messages({
          'string.min': 'L\'emplacement doit contenir au moins 3 caractères',
          'string.max': 'L\'emplacement ne peut pas dépasser 200 caractères',
          'any.required': 'L\'emplacement est requis'
        }),
      category: Joi.string().valid('reunion', 'festival', 'sport', 'culture', 'autre').required()
        .messages({
          'any.only': 'La catégorie doit être une des valeurs autorisées',
          'any.required': 'La catégorie est requise'
        }),
      image: Joi.string().uri().optional()
        .messages({
          'string.uri': 'L\'URL de l\'image doit être valide'
        })
    }),

    update: Joi.object({
      title: Joi.string().min(3).max(100).optional(),
      description: Joi.string().min(10).max(1000).optional(),
      date: Joi.date().greater('now').optional(),
      location: Joi.string().min(3).max(200).optional(),
      category: Joi.string().valid('reunion', 'festival', 'sport', 'culture', 'autre').optional(),
      image: Joi.string().uri().optional()
    })
  },

  // Validation pour les alertes
  alert: {
    create: Joi.object({
      title: Joi.string().min(3).max(100).required()
        .messages({
          'string.min': 'Le titre doit contenir au moins 3 caractères',
          'string.max': 'Le titre ne peut pas dépasser 100 caractères',
          'any.required': 'Le titre est requis'
        }),
      description: Joi.string().min(10).max(500).required()
        .messages({
          'string.min': 'La description doit contenir au moins 10 caractères',
          'string.max': 'La description ne peut pas dépasser 500 caractères',
          'any.required': 'La description est requise'
        }),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical').required()
        .messages({
          'any.only': 'La sévérité doit être une des valeurs autorisées',
          'any.required': 'La sévérité est requise'
        }),
      location: Joi.string().min(3).max(200).required()
        .messages({
          'string.min': 'L\'emplacement doit contenir au moins 3 caractères',
          'string.max': 'L\'emplacement ne peut pas dépasser 200 caractères',
          'any.required': 'L\'emplacement est requis'
        })
    })
  },

  // Validation pour les posts
  post: {
    create: Joi.object({
      content: Joi.string().min(1).max(1000).required()
        .messages({
          'string.min': 'Le contenu ne peut pas être vide',
          'string.max': 'Le contenu ne peut pas dépasser 1000 caractères',
          'any.required': 'Le contenu est requis'
        }),
      image: Joi.string().uri().optional()
        .messages({
          'string.uri': 'L\'URL de l\'image doit être valide'
        }),
      location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
      }).optional()
    })
  },

  // Validation pour les messages
  message: {
    create: Joi.object({
      content: Joi.string().min(1).max(500).required()
        .messages({
          'string.min': 'Le message ne peut pas être vide',
          'string.max': 'Le message ne peut pas dépasser 500 caractères',
          'any.required': 'Le contenu du message est requis'
        }),
      recipientId: Joi.string().required()
        .messages({
          'any.required': 'L\'ID du destinataire est requis'
        })
    })
  }
};

// Middleware de validation générique
const validate = (schemaName, schemaType) => {
  return (req, res, next) => {
    const schema = schemas[schemaName]?.[schemaType];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Schéma de validation non trouvé'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
    }

    // Remplacer req.body avec les données validées
    req.body = value;
    next();
  };
};

// Middleware de validation pour les paramètres de requête
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Paramètres de requête invalides',
        errors
      });
    }

    req.query = value;
    next();
  };
};

// Middleware de validation pour les paramètres d'URL
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Paramètres d\'URL invalides',
        errors
      });
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas
}; 