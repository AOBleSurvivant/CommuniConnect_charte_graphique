const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CommuniConnect API',
      version: '1.0.0',
      description: 'API pour la plateforme CommuniConnect - Application de communication communautaire en Guinée',
      contact: {
        name: 'Support CommuniConnect',
        email: 'support@communiconnect.gn'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.communiconnect.gn',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            avatar: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'] },
                coordinates: {
                  type: 'array',
                  items: { type: 'number' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            organizer: { type: 'string' },
            attendees: {
              type: 'array',
              items: { type: 'string' }
            },
            category: { type: 'string' },
            image: { type: 'string' }
          }
        },
        Alert: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            location: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['active', 'resolved'] }
          }
        },
        Livestream: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            streamUrl: { type: 'string' },
            isLive: { type: 'boolean' },
            viewers: { type: 'number' },
            startedAt: { type: 'string', format: 'date-time' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['info', 'warning', 'error', 'success'] },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './middleware/*.js', './index.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 