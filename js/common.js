/* global TrelloPowerUp */

var MAPROSOFT_ICON_WITH_TEXT_COLOR = './images/Maprosoft-logo-with-text-color.svg';
var MAPROSOFT_ICON_GRAY = './images/Maprosoft-logo-no-text-gray.svg';
var MAPROSOFT_ICON_COLOR = './images/Maprosoft-logo-no-text-color.svg';

var CACHED_SHARED_MAP_INFO_KEY = 'cached-shared-map-info';
var TEAM_NAME_KEY = 'maprosoft-team-name';
var TEAM_TOKEN_KEY = 'maprosoft-team-token';

var ORGANIZATION_SCOPE = 'organization';
var BOARD_SCOPE = 'board';
//var SETTINGS_SCOPE = 'organization';
var SETTINGS_VISIBILITY = 'shared';
var AUTO_HIDE_MAP_TOOLBAR = true;

var MAPROSOFT_WEBSITE_URL = 'https://www.maprosoft.com';
var MAPROSOFT_APP_URL = MAPROSOFT_WEBSITE_URL + '/app';
var MAPROSOFT_SHARED_MAP_URL_BASE = MAPROSOFT_APP_URL + '/shared';
var MAPROSOFT_SHARED_MAPS_PAGE_URL_BASE = MAPROSOFT_APP_URL + '/shared-maps.html';
var MAPROSOFT_MAP_URL_BASE = MAPROSOFT_APP_URL + '/map';

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
  var sharedMapUrl = MAPROSOFT_SHARED_MAP_URL_BASE + '/' + encodedTeamNameOrKey + '/' + encodedSharedMapName;
  return sharedMapUrl;
};

var buildGeneralMapUrl = function(teamNameOrKey) {
  var teamKey = teamNameToKey(teamNameOrKey);
  var mapUrl = MAPROSOFT_MAP_URL_BASE + '?team=' + teamKey + '&autoHideMapToolbar=yes';
  mapUrl = appendAutoHideToolbarParameter(mapUrl);
  return mapUrl;
};

var buildValidateTokenAndTeamUrl = function(token, team) {
  return MAPROSOFT_APP_URL + '/validate-token?team=' + team + '&token=' + token;
};

var buildGeocodeAddressUrl = function(token, address) {
  var encodedAddress = encodeURIComponent(address);
  return MAPROSOFT_APP_URL + '/geocode?token=' + token + '&address=' + encodedAddress;
};

var buildTeamSharedMapsUrl = function(teamNameOrKey) {
  var teamKey = teamNameToKey(teamNameOrKey);
  return MAPROSOFT_SHARED_MAPS_PAGE_URL_BASE + '?team=' + teamKey;
};

var buildRetrieveSharedMapsUrl = function(teamNameOrKey, token) {
  var teamKey = teamNameToKey(teamNameOrKey);
  return MAPROSOFT_SHARED_MAP_URL_BASE + '?team=' + teamKey + '&getSharedMapNames=yes';
};

var buildUrlWithDropPin = function(teamNameOrKey, address, latitude, longitude) {
  var teamKey = teamNameToKey(teamNameOrKey);
  var mapUrl = MAPROSOFT_MAP_URL_BASE + '?team=' + teamKey;
  mapUrl = appendAddressParameters(mapUrl, address, latitude, longitude);
  mapUrl = appendAutoHideToolbarParameter(mapUrl);
  return mapUrl;
};

var appendAddressParameters = function(mapUrl, address, latitude, longitude) {
  var nextSeparator = determineNextQuerySeparator(mapUrl);
  var encodedAddress = encodeURIComponent(address);
  return mapUrl + nextSeparator +
      'dropPinTitle=' + encodedAddress +
      '&dropPinLatitude=' + latitude +
      '&dropPinLongitude=' + longitude +
      '&customLatitude=' + latitude +
      '&customLongitude=' + longitude +
      '&customZoom=16';
};

var appendAutoHideToolbarParameter = function(mapUrl) {
  var extraParam = 'autoHideMapToolbar=yes';
  if (AUTO_HIDE_MAP_TOOLBAR && mapUrl.indexOf(extraParam) < 0) {
    var separator = determineNextQuerySeparator(mapUrl);
    return mapUrl + separator + extraParam;
  } else {
    return mapUrl;
  }
};

var determineNextQuerySeparator = function(url) {
  var questionIndex = url.indexOf('?');
  if (questionIndex < 0) {
    return '?';
  } else {
    return '&';
  }
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

var isMapLinkAttachment = function(attachment) {
  return attachment.url.indexOf(MAPROSOFT_MAP_URL_BASE) === 0 || attachment.url.indexOf(MAPROSOFT_SHARED_MAP_URL_BASE) === 0;
};

var showNoSettingsPopup = function(t) {
  return t.popup({
    title: 'No settings',
    url: './no-settings.html',
    height: 130
  });
};

var closeSettingsPopup = function(t) {
  //console.log('Closing settings...');
  return t.closePopup();
};

var openSettingsPopup = function(t) {
  //console.log('Opening settings...');
  return t.popup({
    title: 'Settings',
    url: './settings.html',
    height: 184
  });
};

var getData = function(t, key) {
  return t.set(ORGANIZATION_SCOPE, SETTINGS_VISIBILITY, 'dummy-key', 'dummy-data')
    .then(function(dummyData) {
        return t.get(ORGANIZATION_SCOPE, SETTINGS_VISIBILITY, key);
    })
    .catch(function() {
      return t.get(BOARD_SCOPE, SETTINGS_VISIBILITY, key)
    });
};

var setData = function(t, key, data) {
  return t.set(ORGANIZATION_SCOPE, SETTINGS_VISIBILITY, key, data)
    .catch(function() {
      return t.set(BOARD_SCOPE, SETTINGS_VISIBILITY, key, data)
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

