/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var retrieveSharedMapsUrl = 'https://www.maprosoft.com/app/shared?team=demo&getSharedMapNames=yes';
//var cachedSharedMapNames = [];

var doGet = function(url) {
  var getPromise = new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      try {
        if (request.status === 200) {
          var responseJson = JSON.parse(request.responseText);
          return resolve(responseJson);
        } else if (request.status === 404) {
          return reject(new i18nError.LocaleNotFound(targetLocale + " not found."));
        } else {
          return reject(new i18nError.Unknown("Unable to load locale, status: " + request.status));
        }
      } catch(ex) {
        return reject(new i18nError.Unknown(ex.message));
      }
    };
    request.send();
  });
  return getPromise;
};

var formatNPSUrl = function(t, url){
  if(!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)){
    return null;
  }
  var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
  if (parkShort && parkMap[parkShort]){
    return parkMap[parkShort];
  } else{
    return null;
  }
};

doGet(retrieveSharedMapsUrl).then(function(data) {
  cachedSharedMapNames = data.mapNames;
});

