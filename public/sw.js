const CACHE_NAME = 'fasosante-v1';
const urlsToCache = [
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Erreur cache:', err))
  );
});

// Interception des requêtes (Stratégie : Cache First, puis Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si c'est dans le cache, on le retourne
        if (response) {
          return response;
        }
        // Sinon, on va sur le réseau
        return fetch(event.request).then(
          (response) => {
            // Si la réponse est valide, on la met en cache
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
        );
      })
      .catch(() => {
        // Fallback si hors ligne et pas dans le cache
        if (event.request.url.endsWith('.png') || event.request.url.endsWith('.jpg')) {
          return caches.match('/icons/icon-192x192.png');
        }
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
