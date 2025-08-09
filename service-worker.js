const CACHE_NAME = "omnia-cache-v1";
const OFFLINE_URL = "/Omnia-live/index.html";

// Files to cache
const ASSETS = [
  "/Omnia-live/",
  "/Omnia-live/index.html",
  "/Omnia-live/manifest.json",
  "/Omnia-live/icons/icon-192.png",
  "/Omnia-live/icons/icon-512.png",
  "/Omnia-live/icons/icon-180.png"
];

// Install — pre-cache files
self.addEventListener("install