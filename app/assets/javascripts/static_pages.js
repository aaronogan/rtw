var rtwMap = new function () {
  var map = null;
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var locations = [{
    name: 'Chicago',
    lat: 41.9,
    lng: -87.65
  },
  {
    name: 'Reykjavik, Iceland',
    lat: 64.14,
    lng: -21.9
  }];

  var plotLocation = function (location) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: map,
      title: location.name
    });
  }

  return {
    init: function () {
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      $.each(locations, function () {
        console.log(this);
        plotLocation(this);
      });
    }
  }
}

$(document).ready(function() {
  rtwMap.init();
});
