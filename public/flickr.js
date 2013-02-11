var rtwFlickr = new function () {
  var baseUrl = 'http://api.flickr.com/services/rest/';
  var apiKey = '9fc6793bf69c7609db1121c696495f7e';
  var authToken = '72157632740462201-6f6a20c9e1204d55';
  var size_thumb = 't';

  var getLatestThumbnails = function (data) {
    console.log(data);

    var thumbs = [];
    if (data.stat === "ok") {
       $.each(data.photoset.photo, function () {
         var url = getPhotoUrl(size_thumb, this.farm, this.server, this.id, this.secret);
         console.log(url);
         thumbs.push(url);
       });
    } else {
      console.log('Error retrieving data from Flickr. ' + data.stat);
    }
    
    return thumbs;
  }

  var callApi = function (method, params, callback) {
    var url = baseUrl + '?method=' + method + '&api_key=' + apiKey + '&format=json&nojsoncallback=1&auth_token=' + authToken + '&api_sig=7ee844fbcce23aa1876cf1ee28ce8b0f'
    $.each(params, function () {
      url += '&' + this.key + '=' + this.value;
    });

    $.getJSON(url, callback);
  }

  var getPhotoUrl = function (size, farm, server, id, secret) {
    return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg';
  }

  return {
    getThumbnails: function (photosetId, maxPhotos) {
      if (photosetId) {
        var params = [{ key: 'photoset_id', value: photosetId }];
        callApi('flickr.photosets.getPhotos', params, getLatestThumbnails);
      }
    },
    getPhotosetPhotos: function (photosetId) {
      console.log('getPhotosetPhotos');
    }
  };
}
