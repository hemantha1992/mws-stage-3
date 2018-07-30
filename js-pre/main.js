//importScripts('restaurant_info.js');

let restaurants,
  neighborhoods,
  cuisines,
  reviews,
  yesno=true,
  favno=false;
var map
var markers = []
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
window.onload = function() {
  fetchNeighborhoods();
  fetchCuisines();
  //offlinePosting();
};

checkFavourite = (x) => {
favno=JSON.parse(DBHelper.restaurant_fav(x));
console.log(favno);
};



fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.setAttribute('aria-label','listitem')
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    }
    else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.setAttribute('aria-label','listitem')
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
    disableDefaultUI: true 
   });   
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}
 
/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const observer = lozad();
  observer.observe();
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    observer.observe();
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.setAttribute('aria-label','listitem')
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute('tabindex','0');
  li.append(name);
  const image = document.createElement('img');
  image.className = 'restaurant-img lozad'; 
  image.setAttribute('data-srcset',DBHelper.imageUrlForRestaurant_responsive(restaurant));
  image.setAttribute('data-sizes',DBHelper.imageUrlForRestaurant_sizes(restaurant));
  image.setAttribute('data-src',DBHelper.imageUrlForLazy_load(restaurant));
  image.alt= 'An image from restaurant ' + restaurant.name;
  li.append(image);
 
  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);
  
  const fvr = document.createElement('button');
  //fvr.setAttribute('value',DBHelper.restaurant_isFavourite(restaurant));
  //fvr.setAttribute('id',DBHelper.restaurant_ID(restaurant));
  fvr.setAttribute('type','button');
  fvr.setAttribute('tabindex','0');
  fvr.setAttribute('style','width:60px;height:40px;margin:10px;color:olive;background-color:lemonchiffon;font-weight:bold;font-size:large;padding:5px;border-radius:10px;');
  fvr.setAttribute('aria-label','mark as favorite');
  fvr.onclick=function(){
    if(favno==false){
      favno=true;
      console.log(favno);
      fvr.setAttribute('style','width:60px;height:40px;margin:10px;color:red;background-color:lemonchiffon;font-weight:bold;font-size:large;padding:5px;border-radius:10px;');
      el.setAttribute('aria-label','marked as favorite');
    }

    else{favno=false;  fvr.setAttribute('style','width:60px;height:40px;margin:10px;color:olive;background-color:lemonchiffon;font-weight:bold;font-size:large;padding:5px;border-radius:10px;');
    el.setAttribute('aria-label','marked as unfavorite')
  }
  var data={is_favorite:favno};
    return fetch('http://localhost:1337/restaurants/'+restaurant.id, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(){
    return idb.open('restaurants', 1);
  })
  .then(function(db){
    var tx = db.transaction('details', 'readwrite');
    var store = tx.objectStore('details');
     restaurant.is_favorite=favno;
    store.put(restaurant);
    return tx.complete;
  })
  .then((res) => {console.log(res);})
  .catch((error) =>console.log(error));
  };
  fvr.innerHTML ='&#10084;';
  //changeFavElementClass(fvr,restaurant.is_favorite);
  li.append(fvr);

  const more = document.createElement('a');
  more.innerHTML ='<span style="font-size:large;"> &#127869;</span> View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li

}

/**
 * Add markers for current restaurants to the map.
 */

addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}


/* Toggle button for Google Mpa - hide/show */
function tgl(){
  if(yesno==true){document.getElementById('map').style.display="none";yesno=false;
    document.getElementById('bt').innerHTML="&#9788; Show Map";
  }
 else{document.getElementById('map').style.display="block";yesno=true;
    document.getElementById('bt').innerHTML="&#9728; Hide Map";
  }
};

if ('serviceWorker' in navigator) {
		  navigator.serviceWorker.register('sw.js')
			.then(function(registration) {
			  //console.log('Service Worker registration successful with scope: ',registration.scope);
		})
			.catch(function(err) {
			  console.log('Service Worker registration failed: ', err);
			});
}

