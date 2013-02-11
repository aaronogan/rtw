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
      locationPoints.push({ name: this.name, point: latLng, sequence: this.sequence, photoset: this.photoset });
    });
  }

  var getPoints = function () {
    return $.map(locationPoints, function (obj, i) {
      return obj.point;
    });
  }

  var generateInfoWindow = function (location) {
    var content = '<h4>' + location.name + '</h4>';

    if (location.photoset) {
      rtwFlickr.getThumbnails(location.photoset, 4, function (data) {
        if (data) {
          console.log(data);
        }
      });
    }

    return new google.maps.InfoWindow({
      content: content
    });
  }

  var plotLocation = function (location) {
    var marker = new google.maps.Marker({
      position: location.point,
      map: map,
      title: location.name,
      icon: getMarkerImgPath(location.sequence)
    });

    var infoWindow = generateInfoWindow(location);
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(map, marker);
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

  var displayDetails = function () {
    console.log('displayDetails');
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
