// Service de cache pour optimiser les performances
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    // Cache en mémoire pour le développement
    this.memoryCache = new NodeCache({
      stdTTL: 300, // 5 minutes par défaut
      checkperiod: 60, // Vérification toutes les minutes
      useClones: false,
      deleteOnExpire: true
    });

    // Configuration Redis (pour la production)
    this.redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    };

    this.isInitialized = false;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };

    // Stratégies de cache par type de données
    this.cacheStrategies = {
      users: { ttl: 600, keyPrefix: 'user:' },
      publications: { ttl: 300, keyPrefix: 'pub:' },
      conversations: { ttl: 180, keyPrefix: 'conv:' },
      messages: { ttl: 120, keyPrefix: 'msg:' },
      events: { ttl: 900, keyPrefix: 'event:' },
      analytics: { ttl: 3600, keyPrefix: 'analytics:' },
      reports: { ttl: 7200, keyPrefix: 'report:' }
    };
  }

  // Initialiser le service
  async init() {
    if (this.isInitialized) return;

    try {
      // En développement, utiliser le cache en mémoire
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Cache en mémoire initialisé pour le développement');
      } else {
        // En production, tenter de connecter Redis
        await this.initRedis();
      }

      this.isInitialized = true;
      console.log('📦 Service de cache initialisé');
    } catch (error) {
      console.warn('⚠️ Erreur d\'initialisation Redis, utilisation du cache en mémoire:', error.message);
      this.isInitialized = true;
    }
  }

  // Initialiser Redis
  async initRedis() {
    try {
      const Redis = require('ioredis');
      this.redis = new Redis(this.redisConfig);
      
      await this.redis.ping();
      console.log('🔴 Cache Redis connecté');
    } catch (error) {
      throw new Error(`Impossible de connecter Redis: ${error.message}`);
    }
  }

  // Générer une clé de cache
  generateKey(type, identifier, params = {}) {
    const strategy = this.cacheStrategies[type];
    if (!strategy) {
      throw new Error(`Type de cache '${type}' non supporté`);
    }

    const key = `${strategy.keyPrefix}${identifier}`;
    const paramString = Object.keys(params).length > 0 
      ? ':' + JSON.stringify(params)
      : '';
    
    return key + paramString;
  }

  // Obtenir une valeur du cache
  async get(type, identifier, params = {}) {
    try {
      const key = this.generateKey(type, identifier, params);
      
      if (this.redis) {
        // Utiliser Redis
        const value = await this.redis.get(key);
        if (value) {
          this.cacheStats.hits++;
          return JSON.parse(value);
        }
      } else {
        // Utiliser le cache en mémoire
        const value = this.memoryCache.get(key);
        if (value !== undefined) {
          this.cacheStats.hits++;
          return value;
        }
      }

      this.cacheStats.misses++;
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cache:', error);
      return null;
    }
  }

  // Définir une valeur dans le cache
  async set(type, identifier, value, params = {}, customTTL = null) {
    try {
      const key = this.generateKey(type, identifier, params);
      const strategy = this.cacheStrategies[type];
      const ttl = customTTL || strategy.ttl;

      if (this.redis) {
        // Utiliser Redis
        await this.redis.setex(key, ttl, JSON.stringify(value));
      } else {
        // Utiliser le cache en mémoire
        this.memoryCache.set(key, value, ttl);
      }

      this.cacheStats.sets++;
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la définition du cache:', error);
      return false;
    }
  }

  // Supprimer une valeur du cache
  async delete(type, identifier, params = {}) {
    try {
      const key = this.generateKey(type, identifier, params);
      
      if (this.redis) {
        await this.redis.del(key);
      } else {
        this.memoryCache.del(key);
      }

      this.cacheStats.deletes++;
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cache:', error);
      return false;
    }
  }

  // Invalider le cache par pattern
  async invalidatePattern(pattern) {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } else {
        // Pour le cache en mémoire, on ne peut pas faire de pattern matching
        // On nettoie tout le cache
        this.memoryCache.flushAll();
      }

      console.log(`🗑️ Cache invalidé pour le pattern: ${pattern}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'invalidation du cache:', error);
      return false;
    }
  }

  // Obtenir les statistiques du cache
  getStats() {
    const hitRate = this.cacheStats.hits + this.cacheStats.misses > 0
      ? (this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      totalRequests: this.cacheStats.hits + this.cacheStats.misses,
      memoryUsage: this.memoryCache ? this.memoryCache.getStats() : null,
      redisConnected: !!this.redis
    };
  }

  // Nettoyer le cache
  async clear() {
    try {
      if (this.redis) {
        await this.redis.flushdb();
      } else {
        this.memoryCache.flushAll();
      }

      console.log('🧹 Cache nettoyé');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage du cache:', error);
      return false;
    }
  }

  // Optimiser les requêtes avec cache
  async cachedQuery(type, identifier, queryFn, params = {}, ttl = null) {
    // Essayer de récupérer du cache
    let result = await this.get(type, identifier, params);
    
    if (result === null) {
      // Pas en cache, exécuter la requête
      result = await queryFn();
      
      // Mettre en cache
      if (result !== null && result !== undefined) {
        await this.set(type, identifier, result, params, ttl);
      }
    }

    return result;
  }

  // Middleware pour automatiser le cache
  middleware(type, ttl = null) {
    return async (req, res, next) => {
      const identifier = req.params.id || req.user?.id || 'default';
      const params = { ...req.query, ...req.body };
      
      const originalSend = res.send;
      res.send = function(data) {
        // Mettre en cache la réponse
        if (data && res.statusCode === 200) {
          cacheService.set(type, identifier, data, params, ttl);
        }
        return originalSend.call(this, data);
      };

      next();
    };
  }
}

// Instance singleton
const cacheService = new CacheService();

module.exports = cacheService; 