var rtwFlickr = new function () {
  var baseUrl = 'http://api.flickr.com/services/rest/';
  var apiKey = '9fc6793bf69c7609db1121c696495f7e';
  var apiSig = '7ee844fbcce23aa1876cf1ee28ce8b0f';
  var authToken = '72157632740462201-6f6a20c9e1204d55';
  var size_thumb = 't'; // 150 on longest side
  var size_small_square = 's'; // 75x75
  var size_large_square = 'q'; // 150x150
  var size_medium = 'z'; // 640 on longest side
  var thumbnailsInPreview = 4;

  var getLatestThumbnails = function (data, callback) {
    var thumbs = [];
    if (data.stat === "ok") {
       $.each(data.photoset.photo, function () {
         var url = getPhotoUrl(size_thumb, this.farm, this.server, this.id, this.secret);
         thumbs.push(url);
       });
    } else {
      console.log('Error retrieving data from Flickr.');
      console.log(data);
    }

    callback({ thumbs: thumbs });
  }

  var getPhotoUrl = function (size, farm, server, id, secret) {
    return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg';
  }

  var callApi = function (method, params, callback) {
    var url = baseUrl + '?method=' + method + '&api_key=' + apiKey + '&format=json&nojsoncallback=1'; //&auth_token=' + authToken; // + '&api_sig=' + apiSig;
    $.each(params, function () {
      url += '&' + this.key + '=' + this.value;
    });

    //$.getJSON(url, callback);
    $.ajax({
      url: url,
      dataType: 'json',
      json: 'jsoncallback',
      success: function (data) {
        getLatestThumbnails(data, callback);
      }
    });
  }

  var getPhotoset = function (photosetId, callback) {
    var params = [{ key: 'photoset_id', value: photosetId }, { key: 'per_page', value: thumbnailsInPreview }, { key: 'page', value: 1 }];
    callApi('flickr.photosets.getPhotos', params, callback);
  }

  return {
    getPhotosetPreview: function (photosetId, callback) {
      if (photosetId) {
        getPhotoset(photosetId, callback);
      }
    },
    getPhotosetPhotos: function (photosetId) {
      console.log('getPhotosetPhotos');
    }
  };
}
