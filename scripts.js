
let map;
//track markers to delete
let markers = [];
//===============================================
//INIT MAP
//===============================================
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522, lng: -118.2437},
    zoom: 11
  });

  //click to change data ===============================
  map.addListener("click", function(event){
    let lat = event.latLng.lat()
    let lng = event.latLng.lng()
    let userCenter = new google.maps.LatLng(lat, lng)
    let userRadius = Number(radiusSelect.value) * 1609;
    console.log(typeof radiusSelect.value)
    deleteMarkers()
    addNearestMarkers(fpactData, userCenter, userRadius);
  })

  //click to change data end===============================


  //autocomplete function ===============================
  var autocomplete = new google.maps.places.Autocomplete(searchInput);
  // console.log(autocomplete)

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);

  autocomplete.addListener('place_changed', function(){
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    console.log(place)

    let lat = place.geometry.location.lat()
    let lng = place.geometry.location.lng()
    let autoCompleteCenter = new google.maps.LatLng(lat, lng);

    map.setCenter(place.geometry.location);
    let autoCompleteRadius = Number(radiusSelect.value) * 1609;
    deleteMarkers();
    addNearestMarkers(fpactData, place.geometry.location, autoCompleteRadius)
  })
  //end autocomplete function================================================
}


//===============================================
//FETCH DATA
//===============================================
//FPACT Data
//cors proxy -- You can easily run your own proxy using code from https://github.com/Rob--W/cors-anywhere/.
const proxyurl = "https://cors-anywhere.herokuapp.com/";
let url1 = 'http://dhcs-chhsagency.opendata.arcgis.com/datasets/a2742f60dd944a1fa49377bd0e8a7772_0.geojson';
let fpactData;
fetch(proxyurl + url1)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    fpactData = data;
    let center = new google.maps.LatLng(34.0522, -118.2437)
    let radius = 5 * 1609; // convert meters to miles
    addNearestMarkers(data, center, radius);

  });

  //===============================================
  // ADD ALL MARKERS
  //===============================================
  function addAllMarkers(geojson){
  	geojson.features.forEach(feature=>{
      addMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
  	})
  }

 	let center = {lat: 34.0522, lng: -118.2437}
 	let radius = 5 * 1609; //meters to miles 


  //===============================================
  // ADD NEAREST MARKERS (geojson, center, radius)
  //geojson - a geojson object
  //center - a google maps latLng object (eg ...let center = new google.maps.LatLng(34.0522, -118.2437)...)
  //radius - number (in miles) function converts radius from meters to miles 
  //===============================================
 	function addNearestMarkers(geojson, center, radius){
    let contentString = '';
 		geojson.features.forEach(feature=>{
 			let newPoint = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
 			//computeDistanceBetween is part of google maps geometry library loaded in html
 			if(google.maps.geometry.spherical.computeDistanceBetween(newPoint, center) < radius){
 				//add marker
        addMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
        contentString = "<div class=info-window-container>" + feature +"</div>"
        let infowindow = new google.maps.InfoWindow({
          content: contentString
        })
 			}
 		})
 	}

  //===============================================
  // PLACES SEARCH
  //===============================================
  //autocomplete
function autoComplete(){
   //let autocomplete = new google.maps.places.Autocomplete(searchInput);
   //console.log(autocomplete)
}


  //===============================================
  // CLEAR MAP
  //===============================================

      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
  
  //===============================================
  // ADD MARKER
  //===============================================
  function addMarker(lat, lng){
    let marker = new google.maps.Marker({
      position: {
        lat: lat, 
        lng: lng
      },
      map: map
    })
    markers.push(marker)
  }

  //===============================================
  // CLICK TO RECENTER
  //===============================================








  //remove all markers 
  //function removeAllMarkers(geoJson)

  //sort by county

  //add marker labels