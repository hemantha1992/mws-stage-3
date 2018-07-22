let restaurant;
let review;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false,
        disableDefaultUI: true 
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}



/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.setAttribute('tabindex','0');
   const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('tabindex','0');
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.alt=restaurant.name;
  image.sizes=DBHelper.imageUrlForRestaurant_sizes(restaurant);
  image.srcset=DBHelper.imageUrlForRestaurant_responsive(restaurant);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute('tabindex','0');

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  hours.setAttribute('tabindex','0');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews) => {
  const id=getParameterByName('id');
  DBHelper.fetchReviews((error,items)=> {
 if (error){console.log(error);}
 else{
   var itms=[];
   items.forEach(function(item){
    if(item.restaurant_id==id){itms.push(item);}
   })
  reviews=itms;
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.setAttribute('tabindex','0');
  container.appendChild(title);
  var f = document.createElement("form");
        //f.setAttribute('target','_blank');
        f.setAttribute('id',"commentForm");
        f.setAttribute('style','padding:10px;');
        //f.setAttribute('action','http://localhost:1337/reviews/');
        f.setAttribute('tabindex','0');
        f.setAttribute('aria-label','form');
        //create input element
        var p1=document.createElement('P');
        var p2=document.createElement('P');
        var p3=document.createElement('P');
        var p4=document.createElement('P');
        var p5=document.createElement('P');
        var p6=document.createElement('P');
        /* Hidden Field */
        var i1 = document.createElement("input");
        i1.type = "hidden";
        i1.name = "restaurant_id";
        i1.id = "restaurant_id";
        i1.value=id;
        //i1.style="text-align:center;width:100px;"
        i1.setAttribute('tabindex','0');
        i1.setAttribute('aria-label','text-box');
        /* Name Label */
        var l1=document.createElement('label');
        l1.innerText=' Name: ';
        l1.setAttribute('tabindex','0');
        l1.setAttribute('aria-label','label');
        /* Name Input */
        var i2 = document.createElement("input");
        i2.type = "text";
        i2.name = "name";
        i2.id = "name";
        i2.style="margin:5px;text-align:center;width:150px;height:20px;"
        i2.setAttribute('tabindex','0');
        i2.setAttribute('aria-label','text-box');
        /* Rating Label */
        var l2=document.createElement('label');
        l2.setAttribute('tabindex','0');
        l2.setAttribute('aria-label','label');
        l2.innerText= 'Rating: (1 - 5) ';
        //l2.style="margin-left:20px;"
        /* Rating Input */
        var i3 = document.createElement("input");
        i3.type = "text";
        i3.name = "rating";
        i3.id = "rating";
        i3.style="margin:5px;text-align:center;width:150px;height:20px;"
        i3.setAttribute('tabindex','0');
        i3.setAttribute('aria-label','text-box');
        /* Comments Label */
        var l3=document.createElement('label');
        l3.setAttribute('tabindex','0');
        l3.setAttribute('aria-label','label');
        l3.innerText='Comments: ';
        /* Comments Input */
        var i4 = document.createElement("textarea");
        i4.type = "text";
        i4.name = "comments";
        i4.id = "comments"; 
        i4.cols=50;
        i4.rows=5;
        i4.style="padding:10px;margin:10px;width:300px;"
        i4.setAttribute('tabindex','0');
        i4.setAttribute('aria-label','text-area');
          /* Submit button */
        var s = document.createElement('input');
        s.setAttribute('type','button');
        s.setAttribute('value','Submit');
        s.setAttribute('onclick','postReview()');
        s.setAttribute('id','btn');
        s.setAttribute('style',"margin-bottom:10px;");
        s.setAttribute('tabindex','0');
        s.setAttribute('aria-label','submit-button');
        /* Adding Elements */
        f.appendChild(i1);
        f.appendChild(l1);
        f.appendChild(p1);
        f.appendChild(i2);
        f.appendChild(p2);
        f.appendChild(l2);
        f.appendChild(p3);
        f.appendChild(i3);
        f.appendChild(p4);
        f.appendChild(l3);
        f.appendChild(p5);
        f.appendChild(i4);
        f.appendChild(p6);
        f.appendChild(s);
  container.appendChild(f);
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  ul.setAttribute('tabindex','0');
  ul.setAttribute('role','listbox');
  ul.setAttribute('aria-label','review-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}
})
}


function postReview(){
  var rest_id=document.getElementById('restaurant_id').value;
  if(document.getElementById('name').value=="" || document.getElementById('rating').value=="" ||document.getElementById('comments').value==""){
    return "";
  }
  var rName=document.getElementById('name').value;
  var rRating=document.getElementById('rating').value;
  var rComments=document.getElementById('comments').value;
  var data = {restaurant_id:Number(rest_id),name:rName,rating:Number(rRating),comment:rComments};
  createForOffline(data)
  .then(()=> {return navigator.serviceWorker.ready})
  .then(reg => {
  return reg.sync.register('myF');
    }).then(() => {
  console.log('Sync registered!');
   }).catch(() => {
  console.log('Sync registration failed: ');
});
}

function createForOffline(dataitem){
  return idb.open('new-review', 1 ,function(upgradeDB) {
    var store = upgradeDB.createObjectStore('review', {
    keyPath: 'restaurant_id'
    })})
  .then(function(db){
    var tx = db.transaction('review', 'readwrite');
    var store = tx.objectStore('review');	
    store.clear();
    store.add(dataitem);
    return tx.complete;
  })
  .then(function(){
    console.log('Post review data to indexeddb - done! ');
  }).catch(function(e){
    console.log('Error from createoffline: ' + e);
  });
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.setAttribute('tabindex','0');
  li.setAttribute('role','listitem')
  const name = document.createElement('p');
  name.setAttribute('tabindex','0');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.setAttribute('tabindex','0');
  var d=new Date(review.createdAt);
  date.innerHTML = d;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.setAttribute('tabindex','0');
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute('style','text-align:left;');
  comments.setAttribute('tabindex','0');
  comments.innerHTML = review.comments;
  
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('tabindex','0');
  li.setAttribute('aria-current','page');
  li.setAttribute('role','listitem')
   li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


/* TODO: Add service worker script here */	 

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
  .then(function(registration) {
    console.log('Service Worker registration successful with scope: ', registration.scope);
  })
  .catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
}


    


  


