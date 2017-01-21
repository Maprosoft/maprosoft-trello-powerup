/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(function() {
});

document.getElementById('save-location').addEventListener('click', function() {
  var addressTextArea = document.getElementById('address');
  var address = addressTextArea.value;
  if (address) {
    return t.get('board', 'shared', TEAM_TOKEN_KEY)
        .then(function(token) {
          return geocodeAddress(token, address);
        }).then(function(geocodeResult) {
          /*
          Example result:
           {"success":true,
           "data":{
              "inputAddress":"341 George St,Sydney",
              "geocodedLocation":{
                "latitude":-33.8672664,"longitude":151.2066123
              },
              "zeroResults":false,
              "errorOccurred":false
            }
          }
           */
          if (geocodeResult && geocodeResult.success && geocodeResult.data && geocodeResult.data.geocodedLocation) {
            var geocodedLocation = geocodeResult.data.geocodedLocation;
            var inputAddress = geocodeResult.data.inputAddress;
            return t.get('board', 'shared', TEAM_NAME_KEY)
            .then(function(teamName) {
                  var url = buildUrlWithDropPin(teamName, inputAddress, geocodedLocation.latitude, geocodedLocation.longitude);
                  return t.attach({
                    url: url,
                    name: inputAddress
                  })
                  .then(function(){
                    return t.closePopup();
                  });
            });
          } else {
            return t.closePopup();
          }
        }).then(function(sharedMapInfo) {
          var sharedMapInfoJson = JSON.stringify(sharedMapInfo);
          return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson);
        }).then(function() {
          return t.closePopup();
        });
  } else {
    return t.closePopup();
  }
});
