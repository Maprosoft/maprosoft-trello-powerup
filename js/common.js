/* global TrelloPowerUp */

var MAPROSOFT_ICON_WITH_TEXT_COLOR = './images/Maprosoft-logo-with-text-color.svg';
var MAPROSOFT_ICON_GRAY = './images/Maprosoft-logo-no-text-gray.svg';
var MAPROSOFT_ICON_COLOR = './images/Maprosoft-logo-no-text-color.svg';
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var CACHED_SHARED_MAP_INFO_KEY = 'cached-shared-map-info';
var TEAM_NAME_KEY = 'maprosoft-team-name';
var TEAM_TOKEN_KEY = 'maprosoft-team-token';

var SETTINGS_SCOPE = 'organization';
var SETTINGS_VISIBILITY = 'shared';

//var Promise = TrelloPowerUp.Promise;
//var t = TrelloPowerUp.iframe();

//var retrieveSharedMapsUrl = 'https://www.maprosoft.com/app/shared?team=demo&getSharedMapNames=yes';
//var cachedMapInfo = {};

var teamNameToKey = function(teamNameOrKey) {
  var key = teamNameOrKey;
  key = key.toLowerCase();
  key = key.replace(' ', '-');
  key = key.replace('\'', '');
  key = key.replace('"', '');
  key = key.replace('~', '');
  key = key.replace('`', '');
  key = key.replace('!', '');
  key = key.replace('@', '');
  key = key.replace('#', '');
  key = key.replace('$', '');
  key = key.replace('%', '');
  key = key.replace('^', '');
  key = key.replace('&', '');
  key = key.replace('*', '');
  key = key.replace('(', '');
  key = key.replace(')', '');
  key = key.replace('{', '');
  key = key.replace('}', '');
  key = key.replace('[', '');
  key = key.replace(']', '');
  key = key.replace(':', '');
  key = key.replace(';', '');
  key = key.replace('.', '');
  key = key.replace('<', '');
  key = key.replace('>', '');
  key = key.replace('?', '');
  key = key.replace('/', '');
  key = key.replace('\\', '');
  key = key.replace('|', '');
  key = key.replace('+', '');
  key = key.replace('=', '');
  key = key.replace('_', '');
  return key;
};

var extractSharedMapNameFromUrl = function(url) {
  var sharedMapName = 'Maprosoft shared map';
  if (url) {
    var decodedUrl = decodeURI(url);
    var urlParts = decodedUrl.split('/');
    if (urlParts && urlParts.length) {
      sharedMapName = urlParts[urlParts.length - 1];
    }
  }
  return sharedMapName;
};

var buildSharedMapUrl = function(teamNameOrKey, sharedMapName) {
  var encodedSharedMapName = encodeURIComponent(sharedMapName);
  var encodedTeamNameOrKey = encodeURIComponent(teamNameOrKey);
  var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + encodedTeamNameOrKey + '/' + encodedSharedMapName;
  return sharedMapUrl;
};

var buildGeneralMapUrl = function(teamNameOrKey) {
  var teamKey = teamNameToKey(teamNameOrKey);
  return 'https://www.maprosoft.com/app/map?team=' + teamKey;
};

var buildGeocodeAddressUrl = function(token, address) {
  var encodedAddress = encodeURIComponent(address);
  return 'https://www.maprosoft.com/app/geocode?token=' + token + '&address=' + encodedAddress;
};

var buildTeamSharedMapsUrl = function(teamNameOrKey) {
  var teamKey = teamNameToKey(teamNameOrKey);
  return 'https://www.maprosoft.com/shared-maps.html?team=' + teamKey;
};

var buildRetrieveSharedMapsUrl = function(teamNameOrKey, token) {
  var teamKey = teamNameToKey(teamNameOrKey);
  return 'https://www.maprosoft.com/app/shared?team=' + teamKey + '&getSharedMapNames=yes';
};

var buildUrlWithDropPin = function(teamNameOrKey, address, latitude, longitude) {
  var teamKey = teamNameToKey(teamNameOrKey);
  var mapUrl = 'https://www.maprosoft.com/app/map?team=' + teamKey;
  var nextSeparator = '&';
  mapUrl = appendAddressParameters(mapUrl, nextSeparator, address, latitude, longitude);
  return mapUrl;
};

var appendAddressParameters = function(mapUrl, nextSeparator, address, latitude, longitude) {
  var encodedAddress = encodeURIComponent(address);
  return mapUrl + nextSeparator +
      'dropPinTitle=' + encodedAddress +
      '&dropPinLatitude=' + latitude +
      '&dropPinLongitude=' + longitude +
      '&customLatitude=' + latitude +
      '&customLongitude=' + longitude +
      '&customZoom=16';
};

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
          return reject(new Error("resource not found."));
        } else {
          return reject(new Error("Unable to load locale, status: " + request.status));
        }
      } catch(ex) {
        return reject(new Error(ex.message));
      }
    };
    request.send();
  });
  return getPromise;
};

var geocodeAddress = function(token, address) {
  var retrieveSharedMapsUrl = buildGeocodeAddressUrl(token, address);
  return doGet(retrieveSharedMapsUrl);
};

var getFreshMapInfo = function(teamName) {
  var token = null;
  var retrieveSharedMapsUrl = buildRetrieveSharedMapsUrl(teamName, token);
  return doGet(retrieveSharedMapsUrl);
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

//var getSharedMapInfo = function(t) {
//  return t.get(SETTINGS_SCOPE, SETTINGS_VISIBILITY, CACHED_SHARED_MAP_INFO_KEY, null);
//};

var isMapLinkAttachment = function(attachment) {
  return attachment.url.indexOf('https://www.maprosoft.com/app/map') === 0 || attachment.url.indexOf('https://www.maprosoft.com/app/shared') === 0;
};

var showNoSettingsPopup = function(t) {
  //return t.overlay({
  //  url: './no-settings.html',
  //  args: {}
  //})
  //.then(function () {
  //  return t.closePopup();
  //});

  return t.popup({
    title: 'Settings',
    url: './no-settings.html',
    height: 184
  //})
  //.then(function () {
  //  return t.closePopup();
  });
};

var closeSettingsPopup = function(t) {
  console.log('Closing settings...');
  return t.closePopup();
};

var openSettingsPopup = function(t) {
  console.log('Opening settings...');
  return t.popup({
    title: 'Settings',
    url: './settings.html',
    height: 184
  });
};

// This example is from https://developer.mozilla.org/en-US/docs/Web/Events/resize:
var optimizedResize = (function() {

  var callbacks = [],
      running = false;

  // fired on resize event
  function resize() {

    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }

  }

  // run the actual callbacks
  function runCallbacks() {

    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {

    if (callback) {
      callbacks.push(callback);
    }

  }

  return {
    // public method to add additional callback
    addWindowResizeListener: function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    }
  }
}());

