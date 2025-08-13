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
    '/_next/static/css/',
    '/_next/static/media/',
    '/_next/static/chunks/pages/',
    '/_next/static/chunks/framework',
    '/_next/static/chunks/main',
    '/_next/static/chunks/webpack',
    '/_next/static/chunks/app/',
    '/_next/static/development/',
    '/_next/static/runtime/',
    // Add offline page
    '/offline.html',
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
// In public/service-worker.js - Update the fetch event handler
self.addEventListener('fetch', (event) => {
    // Handle navigation requests (HTML pages) specially
    if (event.request.mode === 'navigate') {
        event.respondWith(
            // Try the cache first for navigation requests
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If not in cache, try network
                    return fetch(event.request)
                        .then(response => {
                            // Cache successful navigation responses
                            if (response && response.status === 200) {
                                const responseToCache = response.clone();
                                caches.open(CACHE_NAME).then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                                return response;
                            }
                            return response;
                        })
                        .catch(() => {
                            // If both cache and network fail, serve the root page
                            // This is better than showing offline.html for in-app navigation
                            return caches.match('/');
                        });
                })
        );
    } else {
        // For non-navigation requests, use the existing strategy
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                        return response;
                    })
                    .catch(() => {
                        return caches.match('/')
                            .then(cachedShell => {
                                if (cachedShell) {
                                    return cachedShell;
                                }
                                // If shell isn't cached, use offline page
                                return caches.match('/offline.html');
                            });
                    });
            })
        );
    }
});