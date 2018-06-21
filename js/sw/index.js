let staticCacheName = 'restaurant_reviews2';
let filesToCache  = [
        '../',
        'js/main.js',
        'css/main.css'
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
 
  event.respondWith(
      
      caches.match(event.request)
        .then(function(response) {
          return response
        });
      
      let requestClone = event.request.clone();
      
      fetch(requestClone)
        .then(function(response) {
          let responseClone = response.clone();
          caches.open(staticCacheName)
            .then(function(cache) {
              cache.put(event.request, responseClone);
              return event.response;
            })
        })
        .catch(function(err) {
          console.log(err);
        });

});