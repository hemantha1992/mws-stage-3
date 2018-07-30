/**
 * Common database helper functions.
 */
 class DBHelper {
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  static get DATABASE_URL_R() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`;
  }

  static readDB_Restaurants(){
    return idb.open('restaurants', 1).then(function(db) {
    var tx = db.transaction('details', 'readonly');
    var store = tx.objectStore('details');
    return store.getAll();
  }).then(function(items) {
    const restaurants=JSON.stringify(items);
      return items;  
    })
  }
  static readDB_Reviews(){
    return idb.open('reviews', 1).then(function(db) {
    var tx = db.transaction(['details'], 'readonly');
    var store = tx.objectStore('details');
    return store.getAll();
  }).then(function(items) {
    const reviews=JSON.stringify(items);
      return items;  
    })
  }

    
static fetchRestaurants(callback){
  /**
   * Checking the state of online/offline to populate the UI from indexedDB
   */
  if(navigator.onLine===false){
    DBHelper.readDB_Restaurants()
    .then(function(data){
      callback(null, data);
  }); 
  return;
  }
  else{
  fetch(DBHelper.DATABASE_URL)
    .then((response) =>  
    response.json())
    .then((res) => {
      const restaurants = res;
      callback(null,restaurants);
       })
    .catch(function(err){
      const error = (`Request failed. Returned status of ${err}.`);
  });
}
}

 /**
   * Fetch a reviews
   */

  static fetchReviews(callback){
    if(navigator.onLine===false){
      DBHelper.readDB_Reviews()
      .then(function(data){
        //console.log(data);
        reviews=data;
        callback(null, reviews);
    }); 
    return;
    };
    fetch(DBHelper.DATABASE_URL_R)
      .then((response) =>  
       response.json())
      .then((res) => {
        const reviews = res; 
        callback(null,reviews);
         })
      .catch(function(err){
        const error = (`Request failed. Returned status of ${err}.`);
    }); 
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

/* Fetch reviews by id */

  static fetchReviewsById(id,callback) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        const review = reviews.find(r => r.id == id);
        if (review) { // Got the review
          //console.log(reivew)
          callback(null, review);
        } else { // Review does not exist in the database
          callback('There are no reviews for this restaurant.', null);
        }
      }
    });
  } 


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
         callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }



  /**
   * Fetch all neighborhoods with proper error handling.
   */

  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
         DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)

        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
	return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
     /* return default image */ 
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph["small"]}`);
  }
      /* return all images */  
   static imageUrlForRestaurant_responsive(restaurant) {
    return (`/img/${restaurant.photograph["respons"]}`);
  }
    /* return image sizes  */
   static imageUrlForRestaurant_sizes(restaurant) {
    return (`${restaurant.photograph["sizes"]}`);
  }

  static imageUrlForLazy_load(restaurant)  {
    return (`/img/${restaurant.photograph["lazy"]}`);
  }
  static restaurant_ID(restaurant){
    return (restaurant.id);
  }

static restaurant_fav(restaurant){
  return (restaurant.is_favorite);
}

static fetchAndCacheRestaurants(){
  return fetch(DBHelper.DATABASE_URL+'restaurants')
  .then(response => response.json())
  .then(restaurants => {
    return this.dbPromise()
      .then(db => {
     const tx=db.transaction('restaurants','readwrite');
     const restaurantStore=tx.objectStore('restaurants');
     restaurants.forEach(restaurant => restaurantStore.put(restaurant));
     return tx.complete.then(() => Promise.resolve(restaurants));
    });  
  })
}

static updateFavouriteStatus(restaurantId, isFavorite){
console.log('Changed state to '+ isFavorite);
return fetch(`http://localhost:1337/restaurants/${restaurantId}?is_favorite=${isFavorite}`, {
  method: 'PUT'
  })
.then(() =>{
  console.log('status changed');
  this.dbPromise();
})
.then(db => {
  const tx=db.transaction('restaurants','readwrite');
  const restaurantsStore=tx.objectStore('restaurants');
  restaurantsStore.get(restaurantId)
  .then(restaurant => {
    restaurant.is_favorite=isFavorite;
    restaurantsStore.put(restaurnt);  
  })
})
}

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      icon:'../img/mkrman.jpg',
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
