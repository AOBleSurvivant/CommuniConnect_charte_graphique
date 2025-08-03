// Service de cache frontend pour optimiser les performances

class CacheService {
  constructor() {
    this.cache = new Map();
    this.storage = window.localStorage;
    this.dbName = 'CommuniConnectCache';
    this.dbVersion = 1;
    this.db = null;
    this.isInitialized = false;
    
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      size: 0
    };

    // Stratégies de cache par type
    this.cacheStrategies = {
      users: { ttl: 600000, storage: 'memory', maxSize: 100 }, // 10 min
      publications: { ttl: 300000, storage: 'indexeddb', maxSize: 500 }, // 5 min
      conversations: { ttl: 180000, storage: 'memory', maxSize: 200 }, // 3 min
      messages: { ttl: 120000, storage: 'memory', maxSize: 1000 }, // 2 min
      events: { ttl: 900000, storage: 'indexeddb', maxSize: 200 }, // 15 min
      analytics: { ttl: 3600000, storage: 'indexeddb', maxSize: 100 }, // 1 heure
      reports: { ttl: 7200000, storage: 'indexeddb', maxSize: 50 } // 2 heures
    };
  }

  // Initialiser le service
  async init() {
    if (this.isInitialized) return;

    try {
      // Initialiser IndexedDB
      await this.initIndexedDB();
      
      // Charger les statistiques
      this.loadStats();
      
      // Nettoyer le cache expiré
      this.cleanup();
      
      // Nettoyer périodiquement
      setInterval(() => this.cleanup(), 60000); // Toutes les minutes
      
      this.isInitialized = true;
      console.log('📦 Service de cache frontend initialisé');
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du cache:', error);
    }
  }

  // Initialiser IndexedDB
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Créer les stores pour chaque type de cache
        Object.keys(this.cacheStrategies).forEach(type => {
          if (!db.objectStoreNames.contains(type)) {
            const store = db.createObjectStore(type, { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        });
      };
    });
  }

  // Générer une clé de cache
  generateKey(type, identifier, params = {}) {
    const paramString = Object.keys(params).length > 0 
      ? ':' + JSON.stringify(params)
      : '';
    
    return `${type}:${identifier}${paramString}`;
  }

  // Obtenir une valeur du cache
  async get(type, identifier, params = {}) {
    try {
      const key = this.generateKey(type, identifier, params);
      const strategy = this.cacheStrategies[type];
      
      if (!strategy) {
        throw new Error(`Type de cache '${type}' non supporté`);
      }

      let cachedItem = null;

      if (strategy.storage === 'memory') {
        // Cache en mémoire
        cachedItem = this.cache.get(key);
      } else if (strategy.storage === 'indexeddb' && this.db) {
        // Cache IndexedDB
        cachedItem = await this.getFromIndexedDB(type, key);
      } else {
        // Fallback localStorage
        const stored = this.storage.getItem(key);
        if (stored) {
          cachedItem = JSON.parse(stored);
        }
      }

      if (cachedItem && !this.isExpired(cachedItem)) {
        this.stats.hits++;
        return cachedItem.value;
      }

      this.stats.misses++;
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
      
      const cachedItem = {
        key,
        value,
        timestamp: Date.now(),
        ttl,
        expiresAt: Date.now() + ttl
      };

      if (strategy.storage === 'memory') {
        // Cache en mémoire
        this.cache.set(key, cachedItem);
        
        // Limiter la taille du cache
        if (this.cache.size > strategy.maxSize) {
          this.evictOldest(type);
        }
      } else if (strategy.storage === 'indexeddb' && this.db) {
        // Cache IndexedDB
        await this.setToIndexedDB(type, cachedItem);
      } else {
        // Fallback localStorage
        this.storage.setItem(key, JSON.stringify(cachedItem));
      }

      this.stats.sets++;
      this.updateStats();
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
      const strategy = this.cacheStrategies[type];

      if (strategy.storage === 'memory') {
        this.cache.delete(key);
      } else if (strategy.storage === 'indexeddb' && this.db) {
        await this.deleteFromIndexedDB(type, key);
      } else {
        this.storage.removeItem(key);
      }

      this.stats.deletes++;
      this.updateStats();
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cache:', error);
      return false;
    }
  }

  // Vérifier si un item est expiré
  isExpired(item) {
    return Date.now() > item.expiresAt;
  }

  // Nettoyer le cache expiré
  cleanup() {
    try {
      // Nettoyer le cache en mémoire
      for (const [key, item] of this.cache.entries()) {
        if (this.isExpired(item)) {
          this.cache.delete(key);
        }
      }

      // Nettoyer IndexedDB
      if (this.db) {
        Object.keys(this.cacheStrategies).forEach(type => {
          this.cleanupIndexedDB(type);
        });
      }

      // Nettoyer localStorage
      for (let i = this.storage.length - 1; i >= 0; i--) {
        const key = this.storage.key(i);
        if (key && key.startsWith('cache:')) {
          try {
            const item = JSON.parse(this.storage.getItem(key));
            if (this.isExpired(item)) {
              this.storage.removeItem(key);
            }
          } catch (error) {
            // Item invalide, le supprimer
            this.storage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage du cache:', error);
    }
  }

  // Évincer les plus anciens items
  evictOldest(type) {
    const strategy = this.cacheStrategies[type];
    const items = Array.from(this.cache.entries())
      .filter(([key]) => key.startsWith(`${type}:`))
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    const toRemove = items.slice(0, Math.floor(strategy.maxSize * 0.2));
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  // IndexedDB helpers
  async getFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async setToIndexedDB(storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const request = index.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (this.isExpired(cursor.value)) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Optimiser les requêtes avec cache
  async cachedQuery(type, identifier, queryFn, params = {}) {
    // Essayer de récupérer du cache
    let result = await this.get(type, identifier, params);
    
    if (result === null) {
      // Pas en cache, exécuter la requête
      result = await queryFn();
      
      // Mettre en cache
      if (result !== null && result !== undefined) {
        await this.set(type, identifier, result, params);
      }
    }

    return result;
  }

  // Obtenir les statistiques
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      totalRequests: this.stats.hits + this.stats.misses,
      memorySize: this.cache.size,
      storageSize: this.getStorageSize(),
      indexedDBSize: this.db ? 'disponible' : 'non disponible'
    };
  }

  // Calculer la taille du storage
  getStorageSize() {
    let size = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith('cache:')) {
        size += this.storage.getItem(key).length;
      }
    }
    return size;
  }

  // Sauvegarder les statistiques
  updateStats() {
    this.storage.setItem('cache_stats', JSON.stringify(this.stats));
  }

  // Charger les statistiques
  loadStats() {
    try {
      const stored = this.storage.getItem('cache_stats');
      if (stored) {
        this.stats = { ...this.stats, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des stats:', error);
    }
  }

  // Nettoyer tout le cache
  async clear() {
    try {
      // Vider le cache en mémoire
      this.cache.clear();
      
      // Vider IndexedDB
      if (this.db) {
        Object.keys(this.cacheStrategies).forEach(type => {
          const transaction = this.db.transaction([type], 'readwrite');
          const store = transaction.objectStore(type);
          store.clear();
        });
      }
      
      // Vider localStorage
      for (let i = this.storage.length - 1; i >= 0; i--) {
        const key = this.storage.key(i);
        if (key && key.startsWith('cache:')) {
          this.storage.removeItem(key);
        }
      }
      
      console.log('🧹 Cache frontend nettoyé');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage du cache:', error);
      return false;
    }
  }
}

// Instance singleton
const cacheService = new CacheService();

export default cacheService; 