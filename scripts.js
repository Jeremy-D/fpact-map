//google map 
let map;
//track markers to delete
let markers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522, lng: -118.2437},
    zoom: 8
  });
}
//FPACT Data
//cors proxy -- You can easily run your own proxy using code from https://github.com/Rob--W/cors-anywhere/.
const proxyurl = "https://cors-anywhere.herokuapp.com/";
let url1 = 'http://dhcs-chhsagency.opendata.arcgis.com/datasets/a2742f60dd944a1fa49377bd0e8a7772_0.geojson';
let testUrl = 'https://opendata.arcgis.com/datasets/299cd32301b34e1792812ce8b5c30fe7_0.geojson'
fetch(proxyurl + url1)
  .then(function(response) {
    return response.json();
  })
  .then(function(fpactData) {
    console.log(fpactData);
    //add all markers
    //addAllMarkers(fpactData);

    nearestMarkers(fpactData);


   //  fpactData.features.forEach(feature=>{
 		// 	let newPoint = {
 		// 		lat: feature.geometry.coordinates[1], 
  	// 		lng: feature.geometry.coordinates[0]
 		// 	}
 		// 	let center = {lat: 34.0522, lng: -118.2437}
 		// 	let otherPoint = {lat: 32.0522, lng: -118.2437}
 		// 	console.log(google.maps.geometry.spherical.computeDistanceBetween(otherPoint, center));
 		// })
  });

  //add all markers
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

  //store locator
  // set center
  // set radius
  // iterate through lat, lng points
  //  computeDistanceBetween
  //   if distance < radius
  //     set marker
  //   else 
 	//     do nothing

 	let center = {lat: 34.0522, lng: -118.2437}
 	let radius = 5 * 1609; //meters to miles 

 	function nearestMarkers(geojson){
 		geojson.features.forEach(feature=>{
 			// let newPoint = {
 			// 	lat: feature.geometry.coordinates[1], 
  		// 	lng: feature.geometry.coordinates[0]
 			// }
 			let newPoint = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
 			let middle = new google.maps.LatLng(34.0522, -118.2437)
 			let radius = 5 * 1609; // convert meters to miles
 			console.log(google.maps.geometry.spherical.computeDistanceBetween(newPoint, middle));
 			if(google.maps.geometry.spherical.computeDistanceBetween(newPoint, middle)<radius){
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

  //sort by distance

  //add marker labels