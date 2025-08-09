// service-worker.js
const CACHE_NAME = "omnia-v7"; // bump this whenever you ship
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./omnia-logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for HTML (so new index always wins), cache-first for the rest
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");
  if (isHTML) {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return r;
      }).catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => cached ||
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return r;
      })
    )
  );
});