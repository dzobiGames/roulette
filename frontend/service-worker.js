const cacheName = "v1";

const cacheAssets = [
  "/",
  "/index.html",
  "/public/*",
  "/dist/*",
  "/src/*",
  "/assets/*",
];

// Install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
  console.log("Service Worker: Installed");
});

// Activate event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Cache hit - return the response from the cache
      if (response) {
        return response;
      }

      // If the request is not in the cache, fetch it from the network
      return fetch(e.request).then((response) => {
        // Check if we received a valid response from the network
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response to store it in the cache
        const responseToCache = response.clone();

        caches.open(cacheName).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return response;
      });
    })
  );
});
