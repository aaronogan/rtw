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

  var currentInfoWindow = null;

  var getMarkerImgPath = function (sequence) {
    return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + sequence + '%7C' + markerColor + '%7C000000';
  }

  var createLocationArray = function (locations) {
    console.log(locations);
    $.each(locations, function () {
      var latLng = new google.maps.LatLng(this.lat, this.lon);
      locationPoints.push({ id: this.id,  name: this.name, point: latLng, sequence: this.sequence, photoset: this.photoset, comments: this.comments });
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
    var content = '<h4>{0}</h4>{1}';
    var photos = '';

    if (location.photoset) {
      rtwFlickr.getPhotosetPreview(location.photoset, function (data) {
        photos += '<table><tr>';
        photos += '<td><img src="{0}"></td>'.format(data.thumbs[0]);
        photos += '<td><img src="{0}"></td></tr>'.format(data.thumbs[1]);
        photos += '<tr><td><img src="{0}"></td>'.format(data.thumbs[2]);
        photos += '<td><img src="{0}"></td>'.format(data.thumbs[3]);
        photos += '</tr></table>';
        photos += '<a href="{0}" target="_blank">See Photos</a>'.format(rtwFlickr.getPhotosetUrl(location.photoset));
        content = content.format(location.name, photos);
        setInfoWindowListener(location.point, marker, content);
      });
    } else {
      content = content.format(location.name, photos);
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

  var getCommentHtml = function(comment) {
    var link = '<a href="{0}" target="_blank">{1}</a>'.format(comment.url, comment.name);
    var html = '<span class="comment"><b>{0} said</b>: <i>{1}</i></span><br />';

    if (comment.url) {
      return html.format(link, comment.content);
    } else {
      return html.format(comment.name, comment.content);
    }
  }

  var drawAccordionElement = function (index, location) {
    var html = '<h3>{0}. {1}</h3><div>{2}{3}{4}</div>';
    var content = '<div id="location-links-{0}"><a href="#" class="location" id="location_{1}">See on Map</a></div>'.format(location.sequence, location.sequence);
    var comments = '<div id="location-comments-{0}">{1}</div>';
    var pastComments = '';
    $.each(location.comments, function () {
      pastComments += getCommentHtml(this);
    });

    comments = comments.format(location.sequence, pastComments);

    var commentForm = $('div.hidden form');
    commentForm.find('input[name="location_id"]').remove();
    commentForm.append($('<input>', { 'name': 'location_id', 'value': location.id, 'type': 'hidden' }));

    console.log(commentForm[0].outerHTML);

    var commentFormContainer = '<div>Leave a comment<br />{0}'.format(commentForm[0].outerHTML);
    html = html.format((index + 1), location.name, content, comments, commentFormContainer);
    
    var div = $('#' + accordion);
    div.append(html);
  }

  var submitComment = function (form) {
    var formData = { 'location_id': form.location_id.value, 'comment': {
      'name': form.name.value,
      'url': form.url.value,
      'content': form.content.value
    } };

    $.ajax({
      url: form.action,
      type: form.method,
      dataType: 'json',
      data: formData,
      success: function (data) {
        var html = getCommentHtml(formData.comment);
        $('#location-comments-' + form.location_id.value).append(html);
        
        form.reset();
      },
      error: function (x, s, e) {
        console.log('Error submitting comment.');
        console.log(formData);
      }
    });
    return false;
  }

  var displayLocations = function () {
    $.each(locationPoints, function (index, value) {
      drawAccordionElement(index, this);
      this.marker = plotLocation(this);
    });
    $('#' + accordion).accordion({
      heightStyle: 'content'
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
          $('form').submit(function () {
            submitComment(this);
            return false;
          });
        },
        error: function () {
          console.log('Error obtaining locations.');
        }
      });
    }
  }
}
