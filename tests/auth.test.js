const request = require('supertest');
const express = require('express');
const authRoutes = require('../server/routes/auth');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('🔐 Tests d\'Authentification', () => {
  
  describe('POST /api/auth/login', () => {
    test('Devrait permettre la connexion avec des identifiants valides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    test('Devrait rejeter la connexion avec des identifiants invalides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'invalid@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('Devrait rejeter la connexion sans identifiants', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/status', () => {
    test('Devrait retourner le statut du service d\'authentification', async () => {
      const response = await request(app)
        .get('/api/auth/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /api/auth', () => {
    test('Devrait retourner les informations du service d\'authentification', async () => {
      const response = await request(app)
        .get('/api/auth')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
      expect(response.body.endpoints).toBeDefined();
    });
  });
}); 