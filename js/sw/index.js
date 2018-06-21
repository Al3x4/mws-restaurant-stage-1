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
      //if there is a match in the caches, respond witht he cached response
      caches.match(event.request)
        .then(function(response) {
          return response
        });
      
      //if there isn't a match, clone the request, make the request and add the clone to cache
      let requestClone = event.request.clone();
      
      fetch(event.request)
        .then(function(response) {

          //clone the response, return the response and add the clone to cache
          let responseClone = response.clone();
          caches.open(staticCacheName)
            .then(function(cache) {
              cache.put(requestClone, responseClone);
              return event.response;
            })
        })
        .catch(function(err) {
          console.log(err);
        });

});