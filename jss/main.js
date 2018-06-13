let restaurants,neighborhoods,cuisines,dbPromise;var map,markers=[];document.addEventListener("DOMContentLoaded",e=>{fetchNeighborhoods(),fetchCuisines(),pushRestaurantsintoIndexedDB()}),pushRestaurantsintoIndexedDB=(()=>{DBHelper.fetchRestaurants((e,t)=>{e?console.error(e):DBHelper.getRestaurantsforIndexedDB(t)})}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const s=document.createElement("option");s.setAttribute("aria-label","listitem"),s.innerHTML=e,s.value=e,t.append(s)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const s=document.createElement("option");s.setAttribute("aria-label","listitem"),s.innerHTML=e,s.value=e,t.append(s)})}),window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),s=e.selectedIndex,r=t.selectedIndex,n=e[s].value,a=t[r].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(n,a,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li");t.setAttribute("aria-label","listitem");const s=document.createElement("h1");s.innerHTML=e.name,s.setAttribute("tabindex","0"),t.append(s);const r=document.createElement("img");r.className="restaurant-img lazy",r.srcset=DBHelper.imageUrlForRestaurant_responsive(e),r.sizes=DBHelper.imageUrlForRestaurant_sizes(e),r.src=DBHelper.imageUrlForRestaurant(e),r.alt="An image from restaurant "+e.name,t.append(r);const n=document.createElement("p");n.innerHTML=e.neighborhood,t.append(n);const a=document.createElement("p");a.innerHTML=e.address,t.append(a);const o=document.createElement("a");return o.innerHTML='<span style="font-size:large;">&#127869;</span> View Details',o.href=DBHelper.urlForRestaurant(e),t.append(o),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})}),document.addEventListener("touchstart",{passive:!0}),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(function(e){console.log("Service Worker registration successful with scope: ",e.scope)}).catch(function(e){console.log("Service Worker registration failed: ",e)});