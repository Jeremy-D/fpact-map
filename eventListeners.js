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
	let testAddress2 = 'PLANNED PARENTHOOD ASSC, SAN JOSE, CA, 95126';
	let testPlace = getPlacesData(testAddress2);
})

btnTestes2.addEventListener("click", function(){
	let testAddress2 = 'PLANNED PARENTHOOD ASSC, SAN JOSE, CA, 95126';
	logAddress();
})

searchInput.addEventListener("mouseover", function(){
	//autoComplete();
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



