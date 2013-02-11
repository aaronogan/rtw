var rtwFlickr = new function () {
  var apiKey = '9fc6793bf69c7609db1121c696495f7e';
  var authToken = '72157632740462201-6f6a20c9e1204d55';

  return {
    getThumbnails: function (photosetId, maxPhotos, callback) {
      if (photosetId) {
        $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + apiKey + '&photoset_id=' + photosetId + '&format=json&nojsoncallback=1&auth_token=' + authToken + '&api_sig=7ee844fbcce23aa1876cf1ee28ce8b0f', callback);
      } else {
        callback();
      }
    },
    getPhotosetPhotos: function (photosetId) {
      console.log('getPhotosetPhotos');
    }
  };
}
