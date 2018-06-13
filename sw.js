importScripts('js/idb.js');
importScripts('js/dbhelper.js');

/* checking the cache - success */
var cacheName='Cache-v-8';
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
					'data/restaurants.json',
					'js/dbhelper.js',
					'js/idb.js',
					'js/main.js',
					'js/restaurant_info.js'
				])
			})


	)});

/*	self.addEventListener('activate',function(event){
		createDB();
	})

	function createDB() {
		idb.open('restaurant-reviews', 1, function(upgradeDB) {
		  var store = upgradeDB.createObjectStore('restaurant-details', {
			keyPath: 'name'
			});
				}).then(function(db){
			DBHelper.fetchRestaurants((error,restaurants)=>{
				if(error){console.log(error)}
				else{
					var tx = db.transaction('restaurant-details', 'readwrite');
					var store = tx.objectStore('restaurant-details');
					var items=restaurants;
					return Promise.all(items.map(function(item) {
						//console.log('Adding item: ', item);
						return store.add(item);
					  })
					).catch(function(e) {
					  tx.abort();
					  console.log(e);
					}).then(function() {
					  console.log('All items added successfully!');
					});
				}
			})
		})
	};
*/	


/* Fetch event */
// Match in cache and fetch

self.addEventListener('fetch', function (event) {

  /* for restaurant URLs */
      if(event.request.url.includes('restaurant.html?id=')){
          const strippedurl = event.request.url.split('?')[0];
            event.respondWith(
              caches.match(strippedurl).then(function(response){
								console.log(strippedurl);
                  return response || fetch(event.request);
              })
          );
          return;
      }
  /* for all other URLs */
      event.respondWith(
          caches.match(event.request).then(function(response){
						//console.log(event.request.url);
              return response || fetch(event.request);
          })
			);

  });
	


	



