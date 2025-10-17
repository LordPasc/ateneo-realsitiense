const CACHE_NAME = 'ateneo-cache-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/foro.html',
  '/manifest.json',
  '/style.css',
  '/script.js',
  '/logo.jpg'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); }))
    )
  );
  return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});

// Control de actualización
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
