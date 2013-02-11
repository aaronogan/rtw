var rtwFlickr = function () {
  var apiKey = '9fc6793bf69c7609db1121c696495f7e';

  var displayImages = function (data) {
    console.log(data);
  }

  return {
    getPhotoset: function(id) {
      $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + apiKey + '&photoset_id=' + id + '&format=json&nojsoncallback=1&auth_token=72157632740462201-6f6a20c9e1204d55&api_sig=7ee844fbcce23aa1876cf1ee28ce8b0f', displayImages);
    },
    getThumbnails: function (maxPhotos) {
      
    }
  };
}
