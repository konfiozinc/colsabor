const CACHE_NAME = 'colsabor-cache-v6';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './scripts.js',
  './data/configuracion.json',
  './data/productos.json',
  './data/firebase-config.json',
  './assets/logo/logo-colsabor.jpg',
  './assets/logo/no-image.png',
  './assets/productos/papas-rellenas.jpg',
  './assets/productos/empanadas.jpg',
  './assets/productos/arepas-de-huevo.jpg',
  './assets/productos/desayuno-mixto.jpg',
  './assets/productos/yuca-chicharron.jpg',
  './assets/productos/patacon-queso.jpg',
  './assets/productos/patacon-huevos.jpg',
  './assets/productos/arroz-coco-frito.jpg',
  './assets/productos/bandeja-paisa.jpg',
  './assets/productos/pechuga-plancha.jpg',
  './assets/productos/carne-cerdo.jpg',
  './assets/productos/carne-bistec.jpg',
  './assets/productos/carne-desmechada.jpg',
  './assets/productos/higado-encebollado.jpg',
  './assets/productos/mojarra-roja.webp',
  './assets/productos/sierra-cojinua.jpg',
  './assets/productos/pescado-zumo-coco.jpg',
  './assets/productos/sopa-pescado.jpg',
  './assets/productos/sopa-mondongo.jpg',
  './assets/productos/sancocho-gallina.jpg',
  './assets/productos/sancocho-costilla.jpg',
  './assets/productos/arroz-coco.jpg',
  './assets/productos/jugo-pina.jpg',
  './assets/productos/jugo-maracuya.jpg',
  './assets/productos/jugo-naranja.jpg',
  './assets/productos/jugo-tamarindo.jpg',
  './assets/productos/jugo-corozo.jpg',
  './assets/productos/chocolate.jpg',
  './assets/productos/cafe-leche.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/favicon.png'
];
];

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