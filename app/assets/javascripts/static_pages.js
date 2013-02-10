var rtwMap = new function () {
  var map = null;
  var mapCanvas = 'map-canvas';
  var mapOptions = {
    center: new google.maps.LatLng(15, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var locationsUrl = '/locations.json';
  var locations = null;
  var locationsList = 'location-list';

  var plotLocation = function (location) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lon),
      map: map,
      title: location.name
    });
  }

  var addToLocationsList = function (location) {
    var div = $('#'+ locationsList);
    if (div.children().length === 0) {
      div.append('<ul></ul>');
    }
    var ul = div.children().first();
    ul.append('<li>' + location.name + '</li>');
  }

  var displayLocations = function () {
    $.each(locations, function () {
      plotLocation(this);
      addToLocationsList(this);
    })
  }

  return {
    init: function () {
      map = new google.maps.Map(document.getElementById(mapCanvas), mapOptions);
    },
    plotLocations: function () {
      $.ajax({
        url: locationsUrl,
        type: 'GET',
        success: function (data) {
          locations = data;
          displayLocations();
        },
        error: function () {
          console.log('Error obtaining locations.');
        }
      });
    }
  }
}

$(document).ready(function() {
  rtwMap.init();
  rtwMap.plotLocations();
});
