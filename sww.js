
importScripts('js/idb.js');
importScripts('js/dbhelper.js');

/* checking the cache - success */
var cacheName='Cache-v-8';
self.addEventListener('install', function(event) {
	//createDB_Restaurants();
	//createDB_Reviews();
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
		/* caching *.html files, *.css files and .jpg images with cache API - service worker */
      return cache.addAll(
        [
          'index.html',
		  'css/i_desktop.css',
		  'css/i_mobile.css',
		  'css/i_tablet.css',
		  'css/r_desktop.css',
		  'css/r_mobile.css',
		  'css/r_tablet.css',
          'restaurant.html',
		  'img/logo-large.jpg',
		  'img/logo-small.jpg',
		  'manifest.json',
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
					'js/dbhelper.js',
					'js/idb.js',
					'js/main.js',
					'js/restaurant_info.js'
				])
			})
			.then(function(){
				console.log(7);
			})
			.catch(function(err){
				console.log(err);
			})	
	)
});

self.addEventListener('activate',function(event){
 createDB_Restaurants();
 createDB_Reviews();
});

/* Fetch event */
// Match in cache and fetch

self.addEventListener('fetch', function (event) {
  /* for restaurant URLs */
      if(event.request.url.includes('restaurant.html?id=')){
          const strippedurl = event.request.url.split('?')[0];
            event.respondWith(
              caches.match(strippedurl).then(function(response){
                  return response || fetch(event.request);
              })
					);

          return;
      }	
  /* for all other URLs */
      event.respondWith(
          caches.match(event.request).then(function(response){
              return response || fetch(event.request) 
					})
			);

});

function createDB_Restaurants() {
	 return idb.open('restaurants', 1, function(upgradeDB) {
		  var store = upgradeDB.createObjectStore('details', {
			keyPath: 'id'
			});
				}).then(function(db){
			DBHelper.fetchRestaurants((error,restaurants)=>{
				if(error){console.log(error)}
				else{
					var tx = db.transaction('details', 'readwrite');
					var store = tx.objectStore('details');
					var items=restaurants;
					return Promise.all(items.map(function(item) {
						return store.put(item);
						})
					).catch(function(e) {
					  tx.abort();
					  console.log(e);
					}).then(function() {
					});
				}
			})
		})	
};

function createDB_Reviews() {
		return idb.open('reviews', 1, function(upgradeDB) {
			 var store = upgradeDB.createObjectStore('details', {
			 keyPath: 'id',autoIncrement:true
			 });
				 }).then(function(db){
			 DBHelper.fetchReviews((error,reviews)=>{
				 if(error){console.log(error)}
				 else{
					 var tx = db.transaction('details', 'readwrite');
					 var store = tx.objectStore('details');
					  var items=reviews;
					 return Promise.all(items.map(function(item) {
						 console.log('Db reviews '+item);
						 return store.add(item);
						 })
					 ).catch(function(e) {
						 tx.abort();
						 console.log(e);
					 }).then(function() {
					 });
				 }
			 })
		 })
 };

