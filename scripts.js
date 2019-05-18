
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
			//add marker
      addMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0], infoWindowBase, infoContent)
		}
	})
}


//===============================================
// ADD MARKER
//addMarker(lat, lng, contentString, infowindow, infocontent)
//Notes:
//  - infowindow is set in parent scope of add marker to avoid having multiple 
//    infowindows and cluttering the UI
//  - infocontent must be in the form that the data is retrieved from the FPACT data set
//    in order for createInfoWindowObject() to work correctly and dynamically display
//    the content of the info window
//===============================================
function addMarker(lat, lng, infowindow, infocontent){
  let marker = new google.maps.Marker({
    position: {
      lat: lat, 
      lng: lng
    },
    map: map,
  })

  let windowObj = createInfoWindowObject(infocontent);
  renderInfoWindow(windowObj)
  let address = infocontent.Provider_Businness_Legal_Name + ' ' + infocontent.Provider_Address_City + ' ' + infocontent.Provider_Address_Zip

  marker.addListener('click', function(){
    infowindow.setContent(renderInfoWindow(windowObj))
    infowindow.open(map, marker)
    getPlacesData(address, infowindow, windowObj)
  })

  markers.push(marker)
}

//===============================================
//getPlacesData(address, infowindow)
//Uses address built on the FPACT geojson feature data from a marker
//in order to:
//  fetch the place ID
//    fetch the google Places API placeDetails 
//    set/update infoWindow content with the correct phone number
//===============================================
function getPlacesData(address, infowindow, windowObj){
  let request = {
    query: address,
    fields: ['name', 'geometry', 'place_id']
  };
  let service = new google.maps.places.PlacesService(map);

  //async func 1 - findPlaceFromQuery() retrieves the place_id
  let details = service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let requestDetails = {
        placeId: results[0].place_id,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'place_id', 'geometry']
      }
      //async func 2 - getDetails()
      let level2Data = service.getDetails(requestDetails, function(place, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //update infowindow content here to add phone number
          windowObj.phone = place.formatted_phone_number;
          infowindow.setContent(renderInfoWindow(windowObj) )
        }
      })
    } else {
        console.log("sorry we can't seem to find that location")
      }
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
// createInfoWindowObject(featureData)
// creates an object to be passed into createInfoWindowContent()

//===============================================

function createInfoWindowObject(featureData){
  let infoWindowData = {}
  infoWindowData.title = featureData.Provider_Businness_Legal_Name;
  infoWindowData.address = featureData.Provider_Address_Line_1;
  infoWindowData.city = featureData.Provider_Address_City;
  infoWindowData.zip = featureData.Provider_Address_Zip;
  infoWindowData.phone = 'Retrieving phone number ...';
  //category anti pattern
  infoWindowData.category = featureData.Provider_Type_Code_Desc;
  return infoWindowData;
}

//===============================================
// renderInfoWindow(featureData)
// uses the feature data from the FPACT data set
// to create an infowindow with all relevant data
//===============================================

function renderInfoWindow(dataObj){
      let contentString = ''

      Object.keys(dataObj).forEach(key=>{
        if(key === 'title'){
          contentString += '<h1>' + dataObj[key] + '</h1>'
        } else if (key === 'category') {
          contentString += '<p>' + key + ':' + dataObj[key] + '</p>'
        } else {
          contentString += '<p>' + dataObj[key] + '</p>'
        }
      })

      return contentString;
}