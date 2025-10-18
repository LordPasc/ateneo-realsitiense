// ==== SERVICE WORKER ====

// Nombre de la caché — cambia la versión para forzar actualización
const CACHE_NAME = 'ateneo-cache-v1.0.2';

// Archivos que se cachearán
const urlsToCache = [
  'index.html',
  'foro.html',
  'manifest.json',
  'style.css',
  'script.js',
  'logo.jpg'
];

// Instalación: cachea los archivos y activa inmediatamente
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // activa SW inmediatamente
  );
});

// Activación: limpia caches antiguas y notifica a clientes que hay nueva versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );

  self.clients.claim(); // toma control de las pestañas abiertas

  // Notifica a los clientes que hay nueva versión lista
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then(clients => {
      clients.forEach(client => client.postMessage({ type: 'UPDATE_READY' }));
    });
});

// Fetch: responde con cache primero, fallback a red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});

// Mensajes: permite saltarse la espera cuando el SW se actualiza
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
