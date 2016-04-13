var flickr_photos_endpoint = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=65047e4592abbdfb8fb4a52b6c01f803&text=landscape&has_geo=yes&format=json&nojsoncallback=?';
var $pic_row_target;
var map;


$(document).ready(function() {
    // fetchPhotos();

});

function fetchPhotos(){
    $.get(flickr_photos_endpoint, function(response) {
        response.photos.photo.forEach(function renderInfo(pic){
            // add info row
            var title = pic.title;
            $("#info").append("<p>" + title + "<p>");
            // $("#photos").append("<p>" + title + "<p>");
        })
    });
};


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.77, lng: -122.41},
        zoom: 8
    });
}