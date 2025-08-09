const CACHE = 'omnia-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // icons and any other local files can be added here, e.g. './icons/icon-192.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Try cache first, then network
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match('./')))
  );
});