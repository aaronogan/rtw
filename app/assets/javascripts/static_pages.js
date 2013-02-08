var rtwMap = new function () {
  var map = null;
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  return {
    init: function () {
     console.log('init');
      var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }
  }
}

$(document).ready(function() {
  rtwMap.init();
});
