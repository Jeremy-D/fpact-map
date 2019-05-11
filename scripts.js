
let map;
//track markers to delete
let markers = [];
//===============================================
//INIT MAP
//===============================================
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522, lng: -118.2437},
    zoom: 12
  });
}

//===============================================
//FETCH DATA
//===============================================
//FPACT Data
//cors proxy -- You can easily run your own proxy using code from https://github.com/Rob--W/cors-anywhere/.
const proxyurl = "https://cors-anywhere.herokuapp.com/";
let url1 = 'http://dhcs-chhsagency.opendata.arcgis.com/datasets/a2742f60dd944a1fa49377bd0e8a7772_0.geojson';
fetch(proxyurl + url1)
  .then(function(response) {
    return response.json();
  })
  .then(function(fpactData) {
    console.log(fpactData);
    let center = new google.maps.LatLng(34.0522, -118.2437)
    let radius = 5 * 1609; // convert meters to miles
    addNearestMarkers(fpactData, center, radius);

  });

  //===============================================
  // ADD ALL MARKERS
  //===============================================
  function addAllMarkers(geojson){
  	geojson.features.forEach(feature=>{
  		let marker = new google.maps.Marker({
  			position: {
  				lat: feature.geometry.coordinates[1], 
  				lng: feature.geometry.coordinates[0]
  			},
  			map: map
  		})
  		markers.push(marker)
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
 		geojson.features.forEach(feature=>{
 			let newPoint = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
 			console.log(radius);

 			//computeDistanceBetween is part of google maps geometry library loaded in html
 			if(google.maps.geometry.spherical.computeDistanceBetween(newPoint, center) < radius){
 				//add marker
	 			let marker = new google.maps.Marker({
	  			position: {
	  				lat: feature.geometry.coordinates[1], 
	  				lng: feature.geometry.coordinates[0]
	  			},
	  			map: map
	  		})


 			}
 		})
 	}









  //remove all markers 
  //function removeAllMarkers(geoJson)

  //sort by county

  //add marker labels