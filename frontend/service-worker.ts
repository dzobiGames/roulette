const cacheName: string = "v1";

const cacheAssets: string[] = ["./index.html"];

// Install event
self.addEventListener("install", (e: ExtendableEvent) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache: Cache) => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
  console.log("Service Worker: Installed");
});

// Activate event
self.addEventListener("activate", (e: ExtendableEvent) => {
  console.log("Service Worker: Activated");
  e.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames.map((cache: string) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//Call Fetch event

// self.addEventListener("fetch", (e) => {
//     console.log("Service Worker: Fetching");
//     e.respondWith(
//       caches.match(e.request).then((cachedResponse) => {
//         if (cachedResponse) {
//           //If resource is not in the Cache, return it
//           return cachedResponse;
//         }

//         // If the resource is not in the cache, fetch it from the network.
//         return fetch(e.request).then((response) => {
//           // Check if the response is valid and cache it.
//           if (!response || response.status !== 200 || response.type !== "basic") {
//             return response;
//           }

//           const responseToCache = response.clone();
//           caches.open(cacheName).then((cache) => {
//             cache.put(e.request, responseToCache);
//           });
//         });
//       })
//     );
//   });
