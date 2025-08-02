// Utilitaires d'optimisation des performances frontend

// Cache pour les requêtes API
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour mettre en cache les réponses API
export const cacheApiResponse = (key, data, duration = CACHE_DURATION) => {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
    duration
  };
  apiCache.set(key, cacheEntry);
};

// Fonction pour récupérer du cache
export const getCachedResponse = (key) => {
  const cacheEntry = apiCache.get(key);
  
  if (!cacheEntry) return null;
  
  const isExpired = Date.now() - cacheEntry.timestamp > cacheEntry.duration;
  
  if (isExpired) {
    apiCache.delete(key);
    return null;
  }
  
  return cacheEntry.data;
};

// Fonction pour nettoyer le cache expiré
export const cleanupCache = () => {
  const now = Date.now();
  
  for (const [key, entry] of apiCache.entries()) {
    if (now - entry.timestamp > entry.duration) {
      apiCache.delete(key);
    }
  }
};

// Debounce pour les fonctions fréquemment appelées
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle pour limiter la fréquence d'exécution
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading pour les images
export const lazyLoadImage = (imgElement, src) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgElement.src = src;
        observer.unobserve(imgElement);
      }
    });
  });
  
  observer.observe(imgElement);
};

// Optimisation des listes avec virtualisation
export class VirtualList {
  constructor(container, itemHeight, totalItems, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
    this.scrollTop = 0;
    this.startIndex = 0;
    this.endIndex = this.visibleItems;
    
    this.init();
  }
  
  init() {
    this.container.style.position = 'relative';
    this.container.style.height = `${this.totalItems * this.itemHeight}px`;
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    this.render();
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.endIndex = Math.min(
      this.startIndex + this.visibleItems + 1,
      this.totalItems
    );
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = '';
    
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.renderItem(i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      this.container.appendChild(item);
    }
  }
}

// Optimisation des composants React avec memo
export const memoizeComponent = (Component, propsAreEqual) => {
  return React.memo(Component, propsAreEqual);
};

// Optimisation des calculs coûteux
export const memoizeFunction = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Optimisation des événements
export const optimizeEventHandlers = {
  // Optimiser les clics
  onClick: debounce((handler) => handler, 100),
  
  // Optimiser les changements de formulaire
  onChange: debounce((handler) => handler, 150),
  
  // Optimiser les recherches
  onSearch: debounce((handler) => handler, 300),
  
  // Optimiser le scroll
  onScroll: throttle((handler) => handler, 16) // ~60fps
};

// Mesure des performances
export const performanceMonitor = {
  marks: new Map(),
  
  start(label) {
    this.marks.set(label, performance.now());
  },
  
  end(label) {
    const startTime = this.marks.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.marks.delete(label);
      return duration;
    }
    return 0;
  },
  
  measure(label, fn) {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }
};

// Optimisation des requêtes réseau
export const networkOptimizer = {
  // Regrouper les requêtes similaires
  pendingRequests: new Map(),
  
  async batchRequest(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    const promise = requestFn();
    this.pendingRequests.set(key, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  },
  
  // Précharger les ressources importantes
  preloadResources(resources) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.type;
      document.head.appendChild(link);
    });
  }
};

// Optimisation du stockage local
export const storageOptimizer = {
  // Compression des données avant stockage
  compress(data) {
    return JSON.stringify(data);
  },
  
  // Décompression des données
  decompress(data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
  
  // Stockage avec expiration
  setWithExpiry(key, value, ttl = 3600000) { // 1 heure par défaut
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, this.compress(item));
  },
  
  // Récupération avec vérification d'expiration
  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = this.decompress(itemStr);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  },
  
  // Nettoyage du stockage expiré
  cleanup() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('temp_')) {
        const item = this.decompress(localStorage.getItem(key));
        if (item && Date.now() > item.expiry) {
          localStorage.removeItem(key);
        }
      }
    }
  }
};

// Nettoyage automatique du cache
setInterval(cleanupCache, 60000); // Toutes les minutes
setInterval(() => storageOptimizer.cleanup(), 300000); // Toutes les 5 minutes

export default {
  cacheApiResponse,
  getCachedResponse,
  debounce,
  throttle,
  lazyLoadImage,
  VirtualList,
  memoizeComponent,
  memoizeFunction,
  optimizeEventHandlers,
  performanceMonitor,
  networkOptimizer,
  storageOptimizer
}; 