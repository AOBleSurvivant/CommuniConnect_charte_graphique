// Service Worker pour CommuniConnect
const CACHE_NAME = 'communiConnect-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Fichiers à mettre en cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/badge-72x72.png'
];

// Installer le Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Installation du Service Worker CommuniConnect');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker installé avec succès');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erreur lors de l\'installation:', error);
      })
  );
});

// Activer le Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Activation du Service Worker CommuniConnect');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Gérer les requêtes API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache les réponses API réussies
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Retourner la version en cache si disponible
          return caches.match(request);
        })
    );
    return;
  }

  // Gérer les requêtes statiques
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Mettre en cache les nouvelles ressources
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          });
      })
  );
});

// Gérer les notifications push
self.addEventListener('push', (event) => {
  console.log('📨 Notification push reçue:', event);
  
  let notificationData = {
    title: 'CommuniConnect',
    body: 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {}
  };

  // Parser les données de la notification
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('❌ Erreur lors du parsing des données de notification:', error);
    }
  }

  // Afficher la notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      requireInteraction: false,
      silent: false,
      tag: notificationData.data.type || 'general',
      actions: [
        {
          action: 'open',
          title: 'Ouvrir',
          icon: '/icon-192x192.png'
        },
        {
          action: 'dismiss',
          title: 'Fermer',
          icon: '/badge-72x72.png'
        }
      ]
    })
  );
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Clic sur notification:', event);
  
  event.notification.close();

  const { action, notification } = event;
  const data = notification.data || {};

  if (action === 'dismiss') {
    return;
  }

  // Ouvrir l'application
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Si l'application est déjà ouverte, la focaliser
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          
          // Naviguer vers la page appropriée selon le type de notification
          if (data.type && client.postMessage) {
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              data: data
            });
          }
          
          return;
        }
      }

      // Si l'application n'est pas ouverte, l'ouvrir
      if (clients.openWindow) {
        let url = '/';
        
        // Déterminer l'URL selon le type de notification
        switch (data.type) {
          case 'message':
            url = data.conversationId ? `/messages?conversation=${data.conversationId}` : '/messages';
            break;
          case 'alert':
            url = data.alertId ? `/alerts/${data.alertId}` : '/alerts';
            break;
          case 'event':
            url = data.eventId ? `/events/${data.eventId}` : '/events';
            break;
          case 'help_request':
            url = data.helpRequestId ? `/help/${data.helpRequestId}` : '/help';
            break;
          default:
            url = '/';
        }
        
        return clients.openWindow(url);
      }
    })
  );
});

// Gérer les actions de notification
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification fermée:', event);
  
  // Envoyer des analytics si nécessaire
  const data = event.notification.data || {};
  
  // Ici vous pourriez envoyer des données d'analytics
  // pour tracker les interactions avec les notifications
});

// Gérer les messages du client
self.addEventListener('message', (event) => {
  console.log('💬 Message reçu du client:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      });
      break;
      
    default:
      console.log('📨 Message non reconnu:', type);
  }
});

// Gérer les erreurs
self.addEventListener('error', (event) => {
  console.error('❌ Erreur Service Worker:', event.error);
});

// Gérer les rejets de promesses non gérés
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promesse rejetée non gérée:', event.reason);
});

console.log('🔧 Service Worker CommuniConnect chargé'); 