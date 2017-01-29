/* global TrelloPowerUp */

var cachedCardInfo = {};

var getBadges = function(t) {
  return t.card('name')
  .get('name')
  .then(function(cardName){
    var badgeColor;
    var icon = MAPROSOFT_ICON_GRAY;
    var lowercaseName = cardName.toLowerCase();
    if (lowercaseName.indexOf('green') > -1){
      badgeColor = 'green';
      icon = MAPROSOFT_ICON_COLOR;
    } else if(lowercaseName.indexOf('yellow') > -1){
      badgeColor = 'yellow';
      icon = MAPROSOFT_ICON_COLOR;
    } else if(lowercaseName.indexOf('red') > -1){
      badgeColor = 'red';
      icon = MAPROSOFT_ICON_COLOR;
    }

    if (lowercaseName.indexOf('dynamic') > -1){
      // dynamic badges can have their function rerun after a set number
      // of seconds defined by refresh. Minimum of 10 seconds.
      return [{
        dynamic: function(){
          return {
            title: 'Detail Badge', // for detail badges only
            text: 'Dynamic ' + (Math.random() * 100).toFixed(0).toString(),
            icon: icon, // for card front badges only
            color: badgeColor,
            refresh: 10
          }
        }
      }]
    }

    if(lowercaseName.indexOf('static') > -1){
      // return an array of badge objects
      return [{
        title: 'Detail Badge', // for detail badges only
        text: 'Static',
        icon: icon, // for card front badges only
        color: badgeColor
      }];
    } else {
      return [];
    }
  })
};

var boardButtonCallback = function(t) {
  return t.get('board', 'shared', TEAM_NAME_KEY)
      .then(function(teamName) {
        if (teamName) {
          var generalMapUrl = buildGeneralMapUrl(teamName);
          var settingsOk = teamName && teamName.length;
          return t.overlay({
            url: './map-overlay.html',
            args: {
              settingsOk: settingsOk,
              'map-url': generalMapUrl,
              overlayMode: true
            }
          })
          .then(function(){
            return t.closePopup();
          });
        } else {
          return t.overlay({
            url: './no-settings.html',
            args: {}
          })
          .then(function () {
            return t.closePopup();
          });
        }
      });
};


//var parkMap = {
//  acad: 'Acadia National Park',
//  arch: 'Arches National Park',
//  badl: 'Badlands National Park',
//  brca: 'Bryce Canyon National Park',
//  crla: 'Crater Lake National Park',
//  dena: 'Denali National Park',
//  glac: 'Glacier National Park',
//  grca: 'Grand Canyon National Park',
//  grte: 'Grand Teton National Park',
//  olym: 'Olympic National Park',
//  yell: 'Yellowstone National Park',
//  yose: 'Yosemite National Park',
//  zion: 'Zion National Park'
//};


var buildSharedMapPopupItemXXXX = function(t, teamName, sharedMapName) {
  var encodedSharedMapName = encodeURIComponent(sharedMapName);
  var encodedTeamName = encodeURIComponent(teamName);
  var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + encodedTeamName + '/' + encodedSharedMapName;
  return {
    text: sharedMapName,
    url: sharedMapUrl,
    callback: function (t) {
      return t.attach({
        url: sharedMapUrl,
        name: sharedMapName
      })
      .then(function () {
        return t.closePopup();
      });
    }
  };
};

var addSharedMapCallbackAAAAAAAAA = function(t){
  var items = Object.keys(parkMap).map(function(parkCode){
    var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
    return {
      text: parkMap[parkCode],
      url: urlForCode,
      callback: function(t){
        return t.attach({ url: urlForCode, name: parkMap[parkCode] })
            .then(function(){
              return t.closePopup();
            })
      }
    };
  });

  return t.popup({
    title: 'Popup Search Example',
    items: items,
    search: {
      count: 5,
      placeholder: 'Search National Parks',
      empty: 'No parks found'
    }
  });
};

var buildSharedMapPopupItem = function(t, teamName, sharedMapName) {
  var encodedSharedMapName = encodeURIComponent(sharedMapName);
  var encodedTeamName = encodeURIComponent(teamName);
  var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + encodedTeamName + '/' + encodedSharedMapName;
  return {
    text: sharedMapName,
    url: sharedMapUrl,
    callback: function (t) {
      return t.attach({
        url: sharedMapUrl,
        name: sharedMapName
      })
      .then(function () {
        return t.closePopup();
      });
    }
  };
};

var buildSharedMapPopupItems = function(t, sharedMapInfo) {
  var teamName = sharedMapInfo.teamName;
  var popupItems = Object.keys(sharedMapInfo.mapNames).map(function (index) {
    var sharedMapName = sharedMapInfo.mapNames[index];
    return buildSharedMapPopupItem(t, teamName, sharedMapName);
  });
  return popupItems;
};

var getSharedMapPopupItemsXxx = function(t, options) {
  var Promise = TrelloPowerUp.Promise;
  return Promise.all([
    t.get('board', 'shared', CACHED_SHARED_MAP_INFO_KEY),
    t.get('board', 'shared', TEAM_NAME_KEY),
    t.get('board', 'shared', TEAM_TOKEN_KEY)
  ])
  .spread(function(sharedMapInfoJson, teamName, token) {
    if (teamName && token && sharedMapInfoJson) {
      var sharedMapInfo = JSON.parse(sharedMapInfoJson);
    } else {
      var sharedMapInfo = null;
      return t.overlay({
        url: './no-settings.html',
        args: {}
      })
      .then(function () {
        return t.closePopup();
      });
    }
    if (sharedMapInfo && sharedMapInfo.mapNames) {
      return buildSharedMapPopupItems(t, sharedMapInfo);
    } else {
      // If we don't have anything let's go fetch it
      if (teamName) {
        var teamKey = teamName;
      } else {
        var teamKey = 'demo';
      }
      return getFreshMapInfo(teamKey).then(function(retrievedSharedMapInfo) {
        var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
        t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson).then(function() {
          // saved for next time
        });
        return buildSharedMapPopupItems(t, retrievedSharedMapInfo);
      });
    }
  });
};

var delay = function(ms) {
  var deferred = Promise.defer(); // warning, defer is deprecated, use the promise constructor
  setTimeout(function(){
    deferred.fulfill();
  }, ms);
  return deferred.promise;
};

var getSharedMapPopupItems = function(t, options) {
  return getSharedMapPopupItemsSynchronously(t, options)
      .then(function() {
        return document.sharedMapPopupItems;
      });
};

var getSharedMapPopupItemsSynchronously = function(t, options) {
  document.sharedMapPopupItems = ['aaaa', 'bbbbbb'];
  var Promise = TrelloPowerUp.Promise;
  var deferred = Promise.defer();
  var itemsPromise = Promise.all([
    t.get('board', 'shared', CACHED_SHARED_MAP_INFO_KEY),
    t.get('board', 'shared', TEAM_NAME_KEY),
    t.get('board', 'shared', TEAM_TOKEN_KEY)
  ])
  .spread(function(sharedMapInfoJson, teamName, token) {
    if (teamName && token && sharedMapInfoJson) {
      var sharedMapInfo = JSON.parse(sharedMapInfoJson);
    } else {
      var sharedMapInfo = null;
      return t.overlay({
        url: './no-settings.html',
        args: {}
      })
      .then(function () {
        return t.closePopup();
      });
    }
    if (sharedMapInfo && sharedMapInfo.mapNames) {
      document.sharedMapPopupItems = buildSharedMapPopupItems(t, sharedMapInfo);
      deferred.fulfill();
    } else {
      // If we don't have anything let's go fetch it
      if (teamName) {
        var teamKey = teamName;
      } else {
        var teamKey = 'demo';
      }
      return getFreshMapInfo(teamKey).then(function(retrievedSharedMapInfo) {
        var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
        t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson).then(function() {
          // saved for next time
        });
        document.sharedMapPopupItems = buildSharedMapPopupItems(t, retrievedSharedMapInfo);
        deferred.fulfill();
      });
    }
  });
  //return itemsPromise;
  return deferred.promise;
};

var addSharedMapCallbackA = function(t, options) {
  var items = getSharedMapPopupItems(t, options);
  return t.popup({
    title: 'Select a Maprosoft map',
    items: items,
    search: {
      count: 5,
      placeholder: 'Search shared maps',
      empty: 'No share map found'
    }
  });
};

var addSharedMapCallbackB = function(t, options) {
  var items = getSharedMapPopupItems;
  return t.popup({
    title: 'Select a Maprosoft map',
    items: items,
    search: {
      count: 5,
      placeholder: 'Search shared maps',
      empty: 'No share map found'
    }
  });
};

//var getSharedMapPopupItems = function(t, options) {
//  var retrievedSharedMapInfo = {
//    "teamName":"foo",
//    "mapNames":["Apple", "Orange", "Banana"]};
//  return buildSharedMapPopupItems(t, retrievedSharedMapInfo);
//
//  //return cardButtonCallback(t);
//};

var addLocationMapCallback = function(t) {
  return t.popup({
    title: 'Enter a location',
    url: './location-entry.html',
    height: 250
  });
};

var buildMapSection = function(t, attachment) {
  // Capture the attachment variable in a closure so that it's attributes are safe to pass
  // into promises such as the signUrl function.
  var claimedAttachments = [attachment];
  var attachmentUrl = attachment.url;
  var signedUrl = t.signUrl('./map-section.html', {
    "map-url": attachmentUrl,
    settingsOk: true
  });
  if (attachmentUrl.indexOf('dropPin') > 0) {
    var attachmentTitle = 'Maprosoft location map';
  } else {
    //var attachmentTitle = 'Maprosoft shared map';
    var attachmentTitle = extractSharedMapNameFromUrl(attachmentUrl);
  }
  //console.log('Signed URL for attachment ' + attachmentUrl + " => " + signedUrl);
  var mapSection = {
    //id: 'maprosoft-map', // optional if you aren't using a function for the title
    claimed: claimedAttachments,
    icon: MAPROSOFT_ICON_GRAY,
    title: attachmentTitle,
    content: {
      type: 'iframe',
      url: signedUrl,
      height: 400
    }
  };
  //console.log('Built map section: ' + attachmentUrl);
  return mapSection;
};

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment) {
      var claim = isMapLinkAttachment(attachment);
      //console.log('Returning ' + claim + ' for attachment ' + attachment.url);
      return claim;
    });

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    if (claimed && claimed.length > 0) {
      // if the title for your section requires a network call or other
      // potentially length operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      var sections = [];
      for (var claimIndex = 0; claimIndex < claimed.length; claimIndex++) {
        var attachment = claimed[claimIndex];
        var mapSection = buildMapSection(t, attachment);
        sections.push(mapSection);
      }
      return sections;
    } else {
      return [];
    }
  },
  /*'attachment-thumbnail': function(t, options){
    var parkName = formatNPSUrl(t, options.url);
    if (parkName) {
      // return an object with some or all of these properties:
      // url, title, image, openText, modified (Date), created (Date), createdBy, modifiedBy
      return {
        url: options.url,
        title: parkName,
        image: {
          url: './images/nps.svg',
          logo: true // false if you are using a thumbnail of the content
        },
        openText: 'Open in NPS'
      };
    } else {
      throw t.NotHandled();
    }
  },*/
  /*'board-buttons': function(t, options){
    return [{
      icon: MAPROSOFT_ICON_COLOR,
      text: 'Maprosoft Map',
      callback: boardButtonCallback
    }];
  },*/
  'card-badges': function(t, options){
    return getBadges(t);
  },
  'card-buttons': function(t, options) {
    return [{
      icon: MAPROSOFT_ICON_GRAY,
      text: 'A: Shared Map',
      callback: addSharedMapCallbackA
    }, {
      icon: MAPROSOFT_ICON_GRAY,
      text: 'B: Shared Map',
      callback: addSharedMapCallbackB
    }/*, {
      icon: MAPROSOFT_ICON_GRAY,
      text: 'Location Map',
      callback: addLocationMapCallback
    }*/];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  /*'card-from-url': function(t, options) {
    var parkName = formatNPSUrl(t, options.url);
    if(parkName){
      return {
        name: parkName,
        desc: 'An awesome park: ' + options.url
      };
    } else {
      throw t.NotHandled();
    }
  },
  'format-url': function(t, options) {
    var parkName = formatNPSUrl(t, options.url);
    if(parkName){
      return {
        icon: MAPROSOFT_ICON_GRAY,
        text: parkName
      };
    } else {
      throw t.NotHandled();
    }
  },*/
  'show-settings': function(t, options){
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
