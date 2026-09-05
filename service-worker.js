const CACHE_NAME = 'colsabor-cache-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo/no-image.webp',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/favicon.png',
  './assets/galeria/foto1.webp',
  './assets/galeria/foto2.webp',
  './assets/galeria/foto3.webp',
  './assets/galeria/foto4.webp',
  './assets/galeria/foto5.webp'
];
// Nota: el logo real (assets/logo/logo-colsabor.png) se agrega al precache
// cuando el archivo exista en el proyecto.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const esAssetLocal = url.origin === self.location.origin && url.pathname.includes('/assets/');

  if (esAssetLocal) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return response;
        }).catch(() => cached);
      })
    );
  } else {
    event.respondWith(
      fetch(request).then((response) => {
        if (request.url.startsWith(self.location.origin)) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        }
        return response;
      }).catch(() => caches.match(request))
    );
  }
});