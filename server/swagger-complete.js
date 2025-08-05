const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CommuniConnect API',
            version: '1.0.0',
            description: 'API complète pour la plateforme communautaire CommuniConnect',
            contact: {
                name: 'CommuniConnect Team',
                email: 'support@communiconnect.com'
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
                url: 'https://api.communiconnect.com',
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
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        region: { type: 'string' },
                        prefecture: { type: 'string' },
                        commune: { type: 'string' },
                        quartier: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        profilePicture: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Conversation: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        participants: { 
                            type: 'array', 
                            items: { type: 'string' } 
                        },
                        lastMessage: { type: 'object' },
                        unreadCount: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Message: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        conversationId: { type: 'string' },
                        senderId: { type: 'string' },
                        content: { type: 'string' },
                        type: { type: 'string', enum: ['text', 'image', 'file'] },
                        isRead: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Livestream: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number' },
                                longitude: { type: 'number' }
                            }
                        },
                        category: { type: 'string' },
                        isLive: { type: 'boolean' },
                        viewers: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Friend: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        friendId: { type: 'string' },
                        status: { type: 'string', enum: ['pending', 'accepted', 'rejected'] },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 