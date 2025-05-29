const CACHE_NAME = "autodeal-v1";
const urlsToCache = [
  "/",
  "/dashboard",
  "/login",
  "/static/js/bundle.js",
  "/static/css/main.css",
];

// התקנת Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// טיפול בבקשות
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // החזר מהקאש אם קיים
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// עדכון קאש
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
