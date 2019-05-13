//TO DO
// figure out maps API and eventlisteners

let btn = document.getElementById('test-btn');
let btnTestes2 = document.getElementById('test-btn-2')
let radiusSelect = document.getElementById('radius-select');
let searchInput = document.getElementById('search-input');
let submitBtn = document.getElementById('submit');

btn.addEventListener("click", function(){
	//test1
	// let radiusValue = parseInt(radiusSelect.value, 10) * 1609
	// let testCenter = new google.maps.LatLng(37.3382, -121.8863)

	// addNearestMarkers(fpactData, testCenter,radiusValue)
	//test2
	//deleteMarkers();

	//test3
	//map.setCenter(new google.maps.LatLng(37.3382, -121.8863))

	//test4
	//addAllMarkers(fpactData)

	//test5
	testAddressQuery()


	let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
	//iconBase + 'info-i_maps.png'
})

btnTestes2.addEventListener("click", function(){
	deleteMarkers();
})

searchInput.addEventListener("mouseover", function(){
	autoComplete();
})

submitBtn.addEventListener("click", function(){
	//console.log(searchInput.value);
})
//let autocomplete = new google.maps.places.Autocomplete(searchInput);



//===============================================
//MAP LISTENERS
//===============================================

// map.addListener("click", function(){
// 	console.log("clicked")
// 	deleteMarkers()
// })



