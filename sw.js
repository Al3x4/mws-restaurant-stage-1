let staticCacheName = 'restaurant_reviews2';
let filesToCache  = [
      ];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {

  console.log('Fetch event for ', event.request.url);
  event.respondWith(
      //if there is a match in the caches, respond witht he cached response
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }

        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          return caches.open(staticCacheName).then(function(cache) {
              cache.put(event.request.url, response.clone());
              return response;
            });
        });
      })
    )
});
            



