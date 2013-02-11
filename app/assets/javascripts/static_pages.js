var rtwMap = new function () {
  var map = null;
  var mapCanvas = 'map-canvas';
  var mapOptions = {
    center: new google.maps.LatLng(15, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var locationsUrl = '/locations.json';
  var locationsList = 'location-list';
  var locationPoints = [];
  var markerColor = 'ff0000';
  var routeColor = 'ff0000';

  var getMarkerImgPath = function (sequence) {
    return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + sequence + '%7C' + markerColor + '%7C000000';
  }

  var createLocationArray = function (locations) {
    $.each(locations, function () {
      var latLng = new google.maps.LatLng(this.lat, this.lon);
      locationPoints.push({ name: this.name, point: latLng, sequence: this.sequence });
    });
  }

  var getPoints = function () {
    return $.map(locationPoints, function (obj, i) {
      return obj.point;
    });
  }

  var plotLocation = function (location) {
    new google.maps.Marker({
      position: location.point,
      map: map,
      title: location.name,
      icon: getMarkerImgPath(location.sequence)
    });
  }

  var addToLocationsList = function (location) {
    var div = $('#'+ locationsList);
    if (div.children().length === 0) {
      div.append('<ol></ol>');
    }
    var ol = div.children().first();
    ol.append('<li>' + location.name + '</li>');
  }

  var displayLocations = function () {
    $.each(locationPoints, function () {
      plotLocation(this);
      addToLocationsList(this);
    });
  }

  var drawRoute = function () {
    var arrow = { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW };
    var route = new google.maps.Polyline({
      path: getPoints(),
      icons: [{ icon: arrow, offset: '100%' }],
      strokeColor: '#' + routeColor,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    route.setMap(map);
  }

  return {
    init: function () {
      map = new google.maps.Map(document.getElementById(mapCanvas), mapOptions);
    },
    draw: function () {
      $.ajax({
        url: locationsUrl,
        type: 'GET',
        success: function (data) {
          createLocationArray(data);
          displayLocations();
          drawRoute();
        },
        error: function () {
          console.log('Error obtaining locations.');
        }
      });
    }
  }
}

function displayImages(data) {
  console.log(data);
}

$(document).ready(function() {
  rtwMap.init();
  rtwMap.draw();
  $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=9fc6793bf69c7609db1121c696495f7e&photoset_id=72157629697818694&format=json&nojsoncallback=1&auth_token=72157632740462201-6f6a20c9e1204d55&api_sig=7ee844fbcce23aa1876cf1ee28ce8b0f', displayImages);
});
