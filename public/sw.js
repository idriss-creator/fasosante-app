const CACHE_NAME = 'fasosante-v5';

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith('fasosante'))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes externes (Firebase, Google, Vercel analytics, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  
  // Ignorer les requêtes Chrome DevTools
  if (event.request.url.includes('chrome-extension')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Si en cache, retourner immédiatement
      if (cached) {
        // Mettre à jour en arrière-plan (stale-while-revalidate)
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
          })
          .catch(() => {});
        return cached;
      }

      // Sinon, aller sur le réseau
      return fetch(event.request)
        .then((response) => {
          // Vérifier que la réponse est valide avant de la mettre en cache
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner et mettre en cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });

          return response;
        })
        .catch(() => {
          // Fallback pour les pages HTML
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
    })
  );
});