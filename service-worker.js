/* Omnia PWA service worker (GitHub Pages) */
const CACHE_VERSION = "omnia-v3";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

/* IMPORTANT: this path must match your repo name on GitHub Pages */
const BASE = "/Omnia-live";

const STATIC_ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/service-worker.js`,
  `${BASE}/omnia-logo.png`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-256.png`,
  `${BASE}/icons/icon-384.png`,
  `${BASE}/icons/icon-512.png`,
  `${BASE}/icons/icon-maskable.png`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // External requests (e.g. Tailwind CDN, images) -> network first, fallback to cache
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Static assets -> cache first
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith(`${BASE}/icons/`)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((resp) => {
          const clone = resp.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return resp;
        });
      })
    );
    return;
  }

  // Default: stale-while-revalidate for same-origin pages/resources
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return resp;
        })
        .catch(() => cached || Promise.reject("offline"));
      return cached || fetchPromise;
    })
  );
});