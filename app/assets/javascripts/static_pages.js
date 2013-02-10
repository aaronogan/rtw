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
  var routeColor = '#ff0000';

  var createLocationArray = function (locations) {
    $.each(locations, function () {
      var latLng = new google.maps.LatLng(this.lat, this.lon);
      locationPoints.push({ name: this.name, point: latLng });
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
      title: location.name
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
    })

    var route = new google.maps.Polyline({
      path: getPoints(),
      strokeColor: routeColor,
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
  rtwMap.draw();
});
