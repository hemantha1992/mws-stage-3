/* checking the cache - success */
var cacheName='Cache-v-19';
var rest;
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
		/* caching *.html files, *.css files and .jpg images with cache API - service worker */
      return cache.addAll(
        [
          'index.html',
          'css/css-for-index.css',
          'restaurant.html',
		  'css/css-for-restaurant.css',
		  'img/1-320_small.jpg',
		  'img/1-640_medium.jpg',
		  'img/2-800_large.jpg',
		  'img/2-320_small.jpg',
		  'img/2-640_medium.jpg',
		  'img/2-800_large.jpg',
		  'img/3-320_small.jpg',
		  'img/3-640_medium.jpg',
		  'img/3-800_large.jpg',
		  'img/4-320_small.jpg',
		  'img/4-640_medium.jpg',
		  'img/4-800_large.jpg',
		  'img/5-320_small.jpg',
		  'img/5-640_medium.jpg',
		  'img/5-800_large.jpg',
		  'img/6-320_small.jpg',
		  'img/6-640_medium.jpg',
		  'img/6-800_large.jpg',
		  'img/7-320_small.jpg',
		  'img/7-640_medium.jpg',
		  'img/7-800_large.jpg',
		  'img/8-320_small.jpg',
		  'img/8-640_medium.jpg',
		  'img/8-800_large.jpg',
		  'img/9-320_small.jpg',
		  'img/9-640_medium.jpg',
		  'img/9-800_large.jpg',
		  'img/10-320_small.jpg',
		  'img/10-640_medium.jpg',
		  'img/10-800_large.jpg',
		  'data/restaurants.json'
        ]
      );
    })
  );
});

/* Fetch event */
// Match in cache and fetch
self.addEventListener('fetch', function (event) {

  /* for restaurant URLs */
      if(event.request.url.includes('restaurant.html?id=')){
          const strippedurl = event.request.url.split('?')[0];
            event.respondWith(
              catches.match(strippedurl).then(function(response){
                  return response || fetch(event.response);
              })
          );
          return;
      }
  /* for all other URLs */
      event.respondWith(
          caches.match(event.request).then(function(response){
              return response || fetch(event.request);
          })
      );
  });