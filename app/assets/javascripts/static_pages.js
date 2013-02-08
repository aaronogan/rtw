var rtwMap = new function () {
  var map = null;
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  return {
    init: function () {
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }
  }
}

$(document).ready(function() {
  rtwMap.init();
});
