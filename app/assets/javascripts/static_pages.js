var rtwMap = new function () {
  var map = null;
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var locationsUrl = '/locations.json';
  var locations = null;

  var plotLocation = function (location) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lon),
      map: map,
      title: location.name
    });
  }

  var plotLocations = function () {
    $.each(locations, function () {
      console.log(this);
      plotLocation(this);
    })
  }

  var getLocations = function () {
    $.ajax({
      url: locationsUrl,
      type: 'GET',
      success: function (data) {
        locations = data;
        console.log('Success obtaining locations.');
        plotLocations();
      },
      error: function () {
        console.log('Error obtaining locations.');
      }
    });
  }

  return {
    init: function () {
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    },
    plotLocations: function () {
      getLocations();
    }
  }
}

$(document).ready(function() {
  rtwMap.init();
  rtwMap.plotLocations();
});
