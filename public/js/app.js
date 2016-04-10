function getPersonalProfile () {
	$.get("api/users/:id", function (response_data) {
		renderUserName(response_data);
	});
} 

function renderUserName (res) {
	var displayName = _.template($("#name-template").html());
	var personsName = displayName(res); 
	$("#name").append(personsName);
}

function changeBackgroundImages () {
	var images = [
	// "http://www.carolhighsmithamerica.com/data/photos/86_1coit_tower_in_san_francisco.jpg", 
	// "http://highincomerealestate.com/wp-content/uploads/2014/09/SanFrancisco2.jpg",
	// "http://www.juanaalicia.com/wp-content/uploads/2010/04/Web-Maestrapeace-18th-St-Facade.jpg", 
	// "http://www.woodnotephotography.net/wp-content/uploads/2014/03/THink-tattoo-editorial-los-angeles-wade-caroline-lee-woodnote-photography-37.jpg",
	// "http://www.rntl.net/MtTamCam.jpg",
	// "http://alcademics.typepad.com/.a/6a00e553b3da208834017d4145f73c970c-pi",
	// "http://missionbayparks.com/wp-content/uploads/2015/06/Kayak_Launch_atDock_1024x768.png"  
	]

	var i = 0;
	setInterval(function(){
		if (i === images.length - 1) {
			i = 0;
		}
		var url = 'url( ' + images[i] +')';
		$("#title").css("background-image", 
			url);
		$("#title").css("background-repeat", 'no-repeat');
		i++;
	}, 600);
}


$(document).ready(function(){
	// getPersonalProfile();
	// changeBackgroundImages();
	// $('#myModal').on('shown.bs.modal', function () {
 //  		$('#myInput').focus()
	// });
})