// Service worker version for cache management
const CACHE_VERSION = 'v1';
const CACHE_NAME = `password-manager-${CACHE_VERSION}`;

// Assets to cache during installation
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/favicon.ico',
    '/icons/add-icon.png',
    // Add all icon files
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    // Add CSS and JS files (update with your actual build output)
    '/_next/static/chunks/main.js',
    '/_next/static/chunks/webpack.js',
    '/_next/static/css/app.css',
    // Add offline page
    '/offline.html'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('password-manager-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response (stream can only be consumed once)
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // When offline and not in cache, serve a fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});