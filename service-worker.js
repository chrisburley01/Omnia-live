
// service-worker.js

const CACHE_NAME = "omnia-cache-v3"; // bump this version to force update
const ASSETS = [
  "/Omnia-live/",
  "/Omnia-live/index.html",
  "/Omnia-live/manifest.json",
  "/Omnia-live/icons/icon-192.png",
  "/Omnia-live/icons/icon-512.png",
  "/Omnia-live/icons/icon-180.png"
];

// Install: cache essential files
self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally update cache with fresh response
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Listen for skip waiting message (triggered by "Refresh" button)
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});