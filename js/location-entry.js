/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(function() {
  //return Promise.all([
  //  t.get('board', 'shared', TEAM_NAME_KEY),
  //  t.get('board', 'shared', TEAM_TOKEN_KEY)
  //])
  //.spread(function(teamName, token) {
  //  if (teamName) {
  //    var addressTextArea = document.getElementById('address');
  //    maprosoftTeamNameTextField.value = teamName;
  //  }
  //  if (token) {
  //    var maprosoftTokenTextField = document.getElementById(TEAM_TOKEN_KEY);
  //    maprosoftTokenTextField.value = token;
  //  }
  //})
  //.then(function(){
  //  t.sizeTo('#settings-content')
  //  .done();
  //})
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
            return t.get('board', 'shared', TEAM_NAME_KEY)
            .then(function(teamName) {
                  var url = buildUrlWithDropPin(teamName, data.inputAddress, geocodedLocation.latitude, geocodedLocation.longitude);
                  return t.attach({
                    url: url,
                    name: data.inputAddress
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
