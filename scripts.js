
let map;
//track markers to delete
let markers = [];
//set infowindow to be accessible when creating marker
//let infowindow;
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
    //convert radius from meters to miles
    let userRadius = Number(radiusSelect.value) * 1609;
    deleteMarkers()
    addNearestMarkers(fpactData, userCenter, userRadius);
  })

  //click to change data end===============================


  //autocomplete function ===============================
  var autocomplete = new google.maps.places.Autocomplete(searchInput);
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
      window.alert("No details available for input: '" + place.name + "'." + ' Try clicking a point on the map or clicking one of the Search suggestions if problems persist.');
      return;
    }

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
//END INIT MAP
//===============================================


//===============================================
//FETCH DATA
//===============================================
//FPACT Data
//cors proxy -- You can easily run your own proxy using code from https://github.com/Rob--W/cors-anywhere/.
const proxyurl = "https://cors-anywhere.herokuapp.com/";
let url1 = 'http://dhcs-chhsagency.opendata.arcgis.com/datasets/a2742f60dd944a1fa49377bd0e8a7772_0.geojson';
let fpactData;
//fetch(proxyurl + url1)

fetch(url1)  
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
//END FETCH DATA
//===============================================

//===============================================
// ADD NEAREST MARKERS (geojson, center, radius)
//geojson - a geojson object
//center - a google maps latLng object (eg ...let center = new google.maps.LatLng(34.0522, -118.2437)...)
//radius - number (in miles) function converts radius from meters to miles 
//===============================================
function addNearestMarkers(geojson, center, radius){
let infoWindowBase = new google.maps.InfoWindow({
  content: 'YOLO'
});
let contentString = '';
console.log(geojson);
	geojson.features.forEach(feature=>{
		let newPoint = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
		//computeDistanceBetween is part of google maps geometry library loaded in html
		if(google.maps.geometry.spherical.computeDistanceBetween(newPoint, center) < radius){
    //create infowindow content
    infoContent = feature.properties;

    contentString = `<div class=info-window-container>
        <h1>`+ infoContent.Provider_Businness_Legal_Name +`</h1>
        <p>Alias` + infoContent.Provider_Address_Attention_Line + `</p>
        <p>City: ` + infoContent.Provider_Address_City +`</p>
        <p>County: ` + infoContent.Provider_Address_County_Code_De +`</p>
        <p>Zip: ` + infoContent.Provider_Address_Zip +` </p>
        <p>Phone: ` + 'phone number needed, google maps places API?' +` </p>
        <p>Type of Center: ` + infoContent.Provider_Type_Code_Desc +`</p>
      </div>`
			//add marker
      addMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0], contentString, infoWindowBase)
		}
	})
}


//===============================================
// ADD MARKER
//===============================================
function addMarker(lat, lng, contentString, infowindow){
  let marker = new google.maps.Marker({
    position: {
      lat: lat, 
      lng: lng
    },
    map: map,
    //infoContent not part of default marker attributes
    infoContent: contentString
  })

  marker.addListener('click', function(){
    infowindow.setContent(marker.infoContent);
    console.log(infowindow)
    //addInfoWindowToMarker(marker, altInfoWindow)
    infowindow.open(map, marker)
  })

  markers.push(marker)
}

//===============================================
// address query test
//-- get's the phone number
//figure out async await stuff
//===============================================
let testAddress = 'HOLLYWOOD WILSHIRE HLTH';
//let testAddress2 = 'PLANNED PARENTHOOD ASSC, SAN JOSE, CA, 95126';
//works! add to markers

let superTest;


function getPlacesData(address){
  let request = {
    query: address,
    fields: ['name', 'geometry', 'place_id']
  };
  
  let service = new google.maps.places.PlacesService(map);

  let newPlace;

  //async func 1 - getPlaceID()
  let details = service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results[0].place_id)
      let requestDetails = {
        placeId: results[0].place_id,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'place_id', 'geometry']
      }

      //async func 2 - getDetails()
      let level2Data = service.getDetails(requestDetails, function(place, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //marker must be added at this point to get async data like phone number from Places API
          superTest = place;
          console.log('superTest');
          console.log(superTest);
          console.log('place');
          console.log(place);
          return place
        }
      })
    } else {
        //return "sorry we can't seem to find that location"
        console.log("sorry we can't seem to find that location")
      }
    //return level2Data
    //return newPlace;
    });
  console.log(details);
  return details
  }

//===============================================
// addInfoWindowToMarker()
//===============================================
function addInfoWindowToMarker(marker, infowindow, content){
    marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
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
// The function can be used to toggle markers.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

//===============================================
// metersToMiles()
// google maps distances are in meters by default
//===============================================






//remove all markers 
//function removeAllMarkers(geoJson)

//sort by county

  //add marker labels