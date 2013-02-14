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

  var accordion = 'accordion';

  var commentsUrl = '/comments/create';

  var currentInfoWindow = null;

  var getMarkerImgPath = function (sequence) {
    return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + sequence + '%7C' + markerColor + '%7C000000';
  }

  var createLocationArray = function (locations) {
    console.log(locations);
    $.each(locations, function () {
      var latLng = new google.maps.LatLng(this.lat, this.lon);
      locationPoints.push({ name: this.name, point: latLng, sequence: this.sequence, photoset: this.photoset, comments: this.comments });
    });
  }

  var getPoints = function () {
    return $.map(locationPoints, function (obj, i) {
      return obj.point;
    });
  }

  var setInfoWindowListener = function (point, marker, content) {
    var infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', function () {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      map.panTo(point);
      map.setZoom(5);
      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
    });
  }

  var attachInfoWindow = function (location, marker) {
    var content = '<h4>' + location.name + '</h4>{0}';
    var photos = '';

    if (location.photoset) {
      rtwFlickr.getPhotosetPreview(location.photoset, function (data) {
        photos += '<table><tr>';
        photos += '<td><img src="' + data.thumbs[0] + '"></td>';
        photos += '<td><img src="' + data.thumbs[1] + '"></td></tr>';
        photos += '<tr><td><img src="' + data.thumbs[2] + '"></td>';
        photos += '<td><img src="' + data.thumbs[3] + '"></td>';
        photos += '</tr></table>';
        photos += '<a href="' + rtwFlickr.getPhotosetUrl(location.photoset) + '" target="_blank">See Photos</a>';
        content = content.format(photos);
        setInfoWindowListener(location.point, marker, content);
      });
    } else {
      content = content.format(photos);
      setInfoWindowListener(location.point, marker, content);
    }
  }

  var plotLocation = function (location) {
    var marker = new google.maps.Marker({
      position: location.point,
      map: map,
      title: location.name,
      icon: getMarkerImgPath(location.sequence)
    });

    attachInfoWindow(location, marker);
    return marker;
  }

  //var addToLocationsList = function (location) {
  //var div = $('#'+ locationsList);
 // if (div.children().length === 0) {
//    div.append('<ol></ol>');
//  }
 // var ol = div.children().first();
//  ol.append('<li><a href="#" class="location" id="location_' + location.sequence + '">' + location.name + '</a></li>');// }

  var drawAccordion = function (location) {
    var html = '<h3>{0}</h3><div><p>{1}</p></div>';
    html = html.format(location.name, 'Content area');

    var div = $('#' + accordion);
    div.append(html);
  }

  var displayLocations = function () {
    $.each(locationPoints, function () {
      this.marker = plotLocation(this);
      //addToLocationsList(this);
      drawAccordion(this);
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

  var addDomListeners = function () {
    $.each(locationPoints, function () {
      var marker = this.marker;
      $('#location_' + this.sequence).click(function () {
        google.maps.event.trigger(marker, 'click');
        return false;
      });
    });
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
          addDomListeners();
        },
        error: function () {
          console.log('Error obtaining locations.');
        }
      });
    }
  }
}
