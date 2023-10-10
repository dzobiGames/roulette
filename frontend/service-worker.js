
const cacheName = "v1";

const cacheAssets = ["/", "/index.html", "/public/*", "/dist/*", "/src/*", "/assets/*" ];

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
