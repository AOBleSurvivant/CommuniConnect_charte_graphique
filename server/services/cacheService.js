// Service de cache pour optimiser les performances
const redis = require('redis');
const { logPerformance } = require('../config/logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.warn('⚠️ Redis non disponible, cache désactivé');
            return null;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Cache Redis connecté');
      });

      this.client.on('error', (err) => {
        console.warn('⚠️ Erreur Redis:', err.message);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        console.warn('⚠️ Connexion Redis fermée');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.warn('⚠️ Cache Redis non disponible:', error.message);
      this.isConnected = false;
    }
  }

  // Générer une clé de cache
  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  }

  // Définir une valeur avec expiration
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      logPerformance('Cache SET', { key, ttl });
      return true;
    } catch (error) {
      console.warn('Erreur cache SET:', error.message);
      return false;
    }
  }

  // Récupérer une valeur
  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const start = Date.now();
      const value = await this.client.get(key);
      const duration = Date.now() - start;
      
      if (value) {
        logPerformance('Cache HIT', { key, duration });
        return JSON.parse(value);
      } else {
        logPerformance('Cache MISS', { key, duration });
        return null;
      }
    } catch (error) {
      console.warn('Erreur cache GET:', error.message);
      return null;
    }
  }

  // Supprimer une clé
  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      logPerformance('Cache DEL', { key });
      return true;
    } catch (error) {
      console.warn('Erreur cache DEL:', error.message);
      return false;
    }
  }

  // Supprimer plusieurs clés par pattern
  async delPattern(pattern) {
    if (!this.isConnected) return false;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logPerformance('Cache DEL PATTERN', { pattern, count: keys.length });
      }
      return true;
    } catch (error) {
      console.warn('Erreur cache DEL PATTERN:', error.message);
      return false;
    }
  }

  // Vérifier si une clé existe
  async exists(key) {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Erreur cache EXISTS:', error.message);
      return false;
    }
  }

  // Incrémenter une valeur
  async incr(key, ttl = 3600) {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.client.incr(key);
      await this.client.expire(key, ttl);
      return value;
    } catch (error) {
      console.warn('Erreur cache INCR:', error.message);
      return null;
    }
  }

  // Définir une valeur avec expiration conditionnelle
  async setNX(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    
    try {
      const serializedValue = JSON.stringify(value);
      const result = await this.client.setNX(key, serializedValue);
      if (result) {
        await this.client.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.warn('Erreur cache SETNX:', error.message);
      return false;
    }
  }

  // Cache pour les utilisateurs
  async cacheUser(userId, userData, ttl = 1800) {
    const key = this.generateKey('user', { id: userId });
    return await this.set(key, userData, ttl);
  }

  async getCachedUser(userId) {
    const key = this.generateKey('user', { id: userId });
    return await this.get(key);
  }

  // Cache pour les événements
  async cacheEvent(eventId, eventData, ttl = 3600) {
    const key = this.generateKey('event', { id: eventId });
    return await this.set(key, eventData, ttl);
  }

  async getCachedEvent(eventId) {
    const key = this.generateKey('event', { id: eventId });
    return await this.get(key);
  }

  // Cache pour les listes (avec pagination)
  async cacheList(prefix, params, data, ttl = 1800) {
    const key = this.generateKey(prefix, params);
    return await this.set(key, data, ttl);
  }

  async getCachedList(prefix, params) {
    const key = this.generateKey(prefix, params);
    return await this.get(key);
  }

  // Cache pour les statistiques
  async cacheStats(type, data, ttl = 300) {
    const key = this.generateKey('stats', { type });
    return await this.set(key, data, ttl);
  }

  async getCachedStats(type) {
    const key = this.generateKey('stats', { type });
    return await this.get(key);
  }

  // Invalider le cache utilisateur
  async invalidateUser(userId) {
    const pattern = `user:id:${userId}`;
    return await this.delPattern(pattern);
  }

  // Invalider le cache événement
  async invalidateEvent(eventId) {
    const pattern = `event:id:${eventId}`;
    return await this.delPattern(pattern);
  }

  // Invalider le cache par type
  async invalidateByType(type) {
    const pattern = `${type}:*`;
    return await this.delPattern(pattern);
  }

  // Obtenir les statistiques du cache
  async getCacheStats() {
    if (!this.isConnected) return null;
    
    try {
      const info = await this.client.info('stats');
      const keys = await this.client.dbSize();
      
      return {
        connected: this.isConnected,
        keys,
        info: info.split('\r\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) acc[key] = value;
          return acc;
        }, {})
      };
    } catch (error) {
      console.warn('Erreur cache stats:', error.message);
      return null;
    }
  }

  // Middleware pour cache automatique
  cacheMiddleware(prefix, ttl = 1800) {
    return async (req, res, next) => {
      if (!this.isConnected) {
        return next();
      }

      const params = {
        ...req.query,
        ...req.params,
        userId: req.user?._id || 'anonymous'
      };

      const cacheKey = this.generateKey(prefix, params);
      const cachedData = await this.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Intercepter la réponse pour la mettre en cache
      const originalSend = res.json;
      res.json = function(data) {
        this.set(cacheKey, data, ttl);
        originalSend.call(this, data);
      };

      next();
    };
  }

  // Fermer la connexion
  async close() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

// Instance singleton
const cacheService = new CacheService();

module.exports = cacheService; 