var CACHE_NAME = 'jobplanner-v1';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(serviceWorkerOption.assets);
      })
  );
});

self.addEventListener('fetch', function(event) {
  let request = event.request
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(request)
        .then(function(response) {
          if (response) {
            return response;
          }

          return fetch(request).then(function(response) {
            cache.put(request, response.clone())
            return response
          })
        })
      })
  );
});
