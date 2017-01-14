/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

//var Promise = TrelloPowerUp.Promise;
//var t = TrelloPowerUp.iframe();

var retrieveSharedMapsUrl = 'https://www.maprosoft.com/app/shared?team=demo&getSharedMapNames=yes';
//var cachedMapInfo = {};

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

var formatNPSUrl = function(t, url) {
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

var getSharedMapInfo = function(t) {
  return t.get('board', 'shared', 'cached-shared-map-info', null);
};

//var updateSharedMapInfoCache = function(t) {
//  return t.get('board', 'shared', 'cached-shared-map-info', null).then(function(data) {
//    cachedMapInfo = data;
//  });
//};

//doGet(retrieveSharedMapsUrl).then(function(data) {
//  cachedSharedMapNames = data.mapNames;
//});

//doGet(retrieveSharedMapsUrl).then(function(data) {
//  cachedMapInfo = data;
//});

//var cachedSharedMapNames = t.get('board', 'shared', 'cached-shared-map-info', null).then(function(data) {
//  console.log('xxxxxxxxxxx');
//  cachedMapInfo = data;
//});

