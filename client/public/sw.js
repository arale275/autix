const CACHE_NAME = "autix-v1"; // ✅ שם מעודכן
const urlsToCache = [
  "/", // דף הבית
  "/dealer/home", // דף דילר
  "/buyer/home", // דף קונה
  "/auth/login", // דף התחברות
];

// התקנת Service Worker עם error handling
self.addEventListener("install", (event) => {
  console.log("SW: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("SW: Cache opened");

        // ✅ Cache קבצים אחד אחד עם error handling
        return Promise.allSettled(
          urlsToCache.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  console.log(`SW: Cached ${url}`);
                  return cache.put(url, response);
                } else {
                  console.warn(
                    `SW: Failed to cache ${url} - ${response.status}`
                  );
                }
              })
              .catch((error) => {
                console.warn(`SW: Failed to fetch ${url}:`, error);
              })
          )
        );
      })
      .then(() => {
        console.log("SW: Installation complete");
        // אל תחכה לactivation
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("SW: Installation failed:", error);
      })
  );
});

// טיפול בבקשות
self.addEventListener("fetch", (event) => {
  // רק לGET requests
  if (event.request.method !== "GET") {
    return;
  }

  // דלג על API calls
  if (event.request.url.includes("/api/")) {
    return;
  }

  // דלג על external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // החזר מהקאש אם קיים
        if (response) {
          console.log(`SW: Served from cache: ${event.request.url}`);
          return response;
        }

        // אחרת, fetch מהרשת
        console.log(`SW: Fetching from network: ${event.request.url}`);
        return fetch(event.request).then((response) => {
          // אם זה תגובה תקינה, שמור בcache
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch((error) => {
        console.error("SW: Fetch failed:", error);
        // אפשר להחזיר דף offline כאן
        return new Response("Offline", { status: 503 });
      })
  );
});

// עדכון קאש - נקה קאש ישן
self.addEventListener("activate", (event) => {
  console.log("SW: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log(`SW: Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("SW: Activation complete");
        // תפוס control על כל הclients
        return self.clients.claim();
      })
  );
});
