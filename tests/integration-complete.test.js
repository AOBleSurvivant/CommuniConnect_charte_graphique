const axios = require('axios');
const { io } = require('socket.io-client');

const BASE_URL = 'http://localhost:5000';

describe('CommuniConnect - Tests d\'Intégration Complets', () => {
    let authToken;
    let testUserId;
    let testConversationId;
    let socket;

    beforeAll(async () => {
        // Connexion Socket.IO
        socket = io(BASE_URL);
        
        // Authentification
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            identifier: 'test@example.com',
            password: 'password123'
        });
        authToken = loginResponse.data.token;
        testUserId = loginResponse.data.user._id;
    });

    afterAll(() => {
        if (socket) {
            socket.disconnect();
        }
    });

    describe('🔐 Authentification', () => {
        test('Devrait permettre la connexion avec des identifiants valides', async () => {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                identifier: 'test@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.token).toBeDefined();
            expect(response.data.user).toBeDefined();
        });

        test('Devrait rejeter la connexion avec des identifiants invalides', async () => {
            try {
                await axios.post(`${BASE_URL}/api/auth/login`, {
                    identifier: 'invalid@example.com',
                    password: 'wrongpassword'
                });
                fail('Devrait avoir échoué');
            } catch (error) {
                expect(error.response.status).toBe(400);
            }
        });
    });

    describe('👥 Gestion des Amis', () => {
        test('Devrait récupérer la liste des amis', async () => {
            const response = await axios.get(`${BASE_URL}/api/friends`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });

        test('Devrait récupérer les demandes d\'ami', async () => {
            const response = await axios.get(`${BASE_URL}/api/friends/requests`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    describe('📺 Livestreams', () => {
        test('Devrait récupérer la liste des livestreams', async () => {
            const response = await axios.get(`${BASE_URL}/api/livestreams`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });

        test('Devrait créer un nouveau livestream', async () => {
            const newLivestream = {
                title: 'Test Livestream',
                description: 'Test description',
                location: {
                    latitude: 9.5370,
                    longitude: -13.6785
                },
                category: 'test'
            };

            const response = await axios.post(`${BASE_URL}/api/livestreams`, newLivestream, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(201);
            expect(response.data.title).toBe(newLivestream.title);
        });
    });

    describe('💬 Conversations', () => {
        test('Devrait récupérer la liste des conversations', async () => {
            const response = await axios.get(`${BASE_URL}/api/conversations`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });

        test('Devrait créer une nouvelle conversation', async () => {
            const newConversation = {
                participants: [testUserId, 'user2'],
                name: 'Test Conversation'
            };

            const response = await axios.post(`${BASE_URL}/api/conversations`, newConversation, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(201);
            expect(response.data.name).toBe(newConversation.name);
            
            testConversationId = response.data._id;
        });

        test('Devrait récupérer une conversation spécifique', async () => {
            if (!testConversationId) {
                testConversationId = 'test-conversation-id';
            }

            const response = await axios.get(`${BASE_URL}/api/conversations/${testConversationId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
        });
    });

    describe('💭 Messages', () => {
        test('Devrait envoyer un message dans une conversation', async () => {
            if (!testConversationId) {
                testConversationId = 'test-conversation-id';
            }

            const newMessage = {
                content: 'Test message',
                type: 'text'
            };

            const response = await axios.post(
                `${BASE_URL}/api/conversations/${testConversationId}/messages`,
                newMessage,
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );

            expect(response.status).toBe(201);
            expect(response.data.content).toBe(newMessage.content);
        });

        test('Devrait récupérer les messages d\'une conversation', async () => {
            if (!testConversationId) {
                testConversationId = 'test-conversation-id';
            }

            const response = await axios.get(`${BASE_URL}/api/conversations/${testConversationId}/messages`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    describe('🔌 Socket.IO', () => {
        test('Devrait se connecter au serveur Socket.IO', (done) => {
            socket.on('connect', () => {
                expect(socket.connected).toBe(true);
                done();
            });

            if (socket.connected) {
                done();
            }
        });

        test('Devrait recevoir des événements de message', (done) => {
            socket.on('new_message', (data) => {
                expect(data).toBeDefined();
                expect(data.content).toBeDefined();
                done();
            });

            // Simuler l'envoi d'un message
            setTimeout(() => {
                socket.emit('send_message', {
                    conversationId: testConversationId,
                    content: 'Test message via Socket.IO',
                    type: 'text'
                });
            }, 1000);
        });
    });

    describe('📊 Performance', () => {
        test('Devrait répondre rapidement aux requêtes', async () => {
            const start = Date.now();
            
            const response = await axios.get(`${BASE_URL}/api/health`);
            
            const duration = Date.now() - start;
            
            expect(response.status).toBe(200);
            expect(duration).toBeLessThan(1000); // Moins d'1 seconde
        });

        test('Devrait gérer plusieurs requêtes simultanées', async () => {
            const requests = Array(10).fill().map(() => 
                axios.get(`${BASE_URL}/api/health`)
            );

            const responses = await Promise.all(requests);
            
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe('🔒 Sécurité', () => {
        test('Devrait rejeter les requêtes sans token', async () => {
            try {
                await axios.get(`${BASE_URL}/api/friends`);
                fail('Devrait avoir échoué');
            } catch (error) {
                expect(error.response.status).toBe(401);
            }
        });

        test('Devrait rejeter les tokens invalides', async () => {
            try {
                await axios.get(`${BASE_URL}/api/friends`, {
                    headers: { Authorization: 'Bearer invalid-token' }
                });
                fail('Devrait avoir échoué');
            } catch (error) {
                expect(error.response.status).toBe(401);
            }
        });
    });
}); 