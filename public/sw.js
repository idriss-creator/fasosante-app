const CACHE_NAME = 'fasosante-v3';
const STATIC_CACHE = 'fasosante-static-v3';
const DYNAMIC_CACHE = 'fasosante-dynamic-v3';

// Assets statiques à mettre en cache immédiatement
const STATIC_ASSETS = [
 '/',
  '/dashboard',
  '/dashboard/search',
  '/dashboard/pharmacies',
  '/dashboard/reservations',
  '/dashboard/profile',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  , '/images/payment/orange-money.png',
  '/images/payment/moov-money.png',   
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Erreur cache statique:', err))
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName.startsWith('fasosante-')
            );
          })
          .map((cacheName) => {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes Chrome DevTools
  if (event.request.url.includes('chrome-extension')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si c'est dans le cache, retourner
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, aller sur le réseau
        return fetch(event.request)
          .then((response) => {
            // Si la réponse n'est pas valide, retourner
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[SW] Erreur réseau:', error);
            
            // Fallback pour les pages HTML
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Mise à jour automatique
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});