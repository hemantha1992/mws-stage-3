let restaurants,
  neighborhoods,
  cuisines,
  reviews;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */

document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods;
  fetchCuisines;
  addFavourite;
});


/**
 * Fetch all neighborhoods and set their HTML.
 */
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
    } else {
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
    scrollwheel: false
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
  const name = document.createElement('h1');
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
  fvr.setAttribute('is_favorite',DBHelper.favourite_restaurant(restaurant));
  fvr.setAttribute('ID',DBHelper.restaurant_ID(restaurant));
  fvr.setAttribute('type','button');
  fvr.setAttribute('tabindex','0');
  fvr.setAttribute('onclick','addFavourite(this)');
  fvr.setAttribute('style','color:olive;font-size:large;background-color:lemonchiffon; margin-right:10px; width:60px;height:40px;border-radius:10px;');
  fvr.innerHTML ='&#10084;';
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

/** Toggle favourite button with a non-persistent cookie */
function addFavourite(x){
  if(document.cookie.length==0){
    for (var i=1;i<11;i++){
    document.cookie='fav'+i+'=f'+i;
    }
  };
  y='fav'+x.id;
  var yy=getCookie(y) 
  console.log(yy);
  if(yy=='f'+x.id||document.cookie.length==0){x.style.color="#ff0000";document.cookie='fav'+x.id+'=y'+x.id;}
  else{x.style.color="olive";document.cookie='fav'+x.id+'=f'+x.id}
};

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/** Toggle favourite at the database */

/* TODO: Add service worker script here */	  
		if ('serviceWorker' in navigator) {
		  navigator.serviceWorker.register('sw.js')
			.then(function(registration) {
			  console.log('Service Worker registration successful with scope: ',registration.scope);
			})
			.catch(function(err) {
			  console.log('Service Worker registration failed: ', err);
			});
		}

