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

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Maprosoft board actions',
    items: [
      {
        text: 'Map Overlay',
        callback: function(t){
          return t.overlay({
            url: './map-operlay.html',
            args: {
              overlayMode: true
            }
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }, {
        text: 'Open Board Bar',
        callback: function(t){
          return t.boardBar({
            url: './board-bar.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

var getSharedMapPopupItems = function(t, options) {
  var Promise = TrelloPowerUp.Promise;
  return Promise.all([
    t.get('board', 'shared', CACHED_SHARED_MAP_INFO_KEY),
    t.get('board', 'shared', TEAM_NAME_KEY),
    t.get('board', 'shared', TEAM_TOKEN_KEY)
  ])
  //.spread(function(sharedMapInfo, teamName, token) {
  //  if (sharedMapInfo && sharedMapInfo.mapNames) {
  //    retrievedSharedMapInfo = sharedMapInfo;
  //  } else {
  //    // If we don't have anything let's go fetch it
  //    if (teamName) {
  //      retrievedSharedMapInfo = getFreshMapInfo(teamName); // Should return a Promise
  //    } else {
  //      retrievedSharedMapInfo = getFreshMapInfo('demo'); // Should return a Promise
  //    }
  //  }
  //})
  .spread(function(sharedMapInfoJson, teamName, token) {
      if (sharedMapInfoJson) {
        var sharedMapInfo = JSON.parse(sharedMapInfoJson);
      } else {
        var sharedMapInfo = null;
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

var buildSharedMapPopupItems = function(t, sharedMapInfo) {
  var teamName = sharedMapInfo.teamName;
  var popupItems = Object.keys(sharedMapInfo.mapNames).map(function (index) {
    var sharedMapName = sharedMapInfo.mapNames[index];
    return buildSharedMapPopupItem(t, teamName, sharedMapName);
  });
  return popupItems;
};

var buildSharedMapPopupItem = function(t, teamName, sharedMapName) {
  var encodedSharedMapName = encodeURIComponent(sharedMapName);
  var encodeTeamName = encodeURIComponent(teamName);
  var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + encodeTeamName + '/' + encodedSharedMapName;
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

var addSharedMapCallback = function(t) {
  return t.popup({
    title: 'Select a Maprosoft map',
    items: getSharedMapPopupItems,
    search: {
      count: 5,
      placeholder: 'Search shared maps',
      empty: 'No share map found'
    }
  });
};

var addLocationMapCallback = function(t) {
  return t.popup({
    title: 'Enter a location',
    url: './location-entry.html',
    height: 250
  });
};

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment) {
      return isMapLinkAttachment(attachment);
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
        // Capture the attachment variable in a closure so that it's attributes are safe to pass
        // into promises such as the signUrl function.
        (function(attachment) {
          var claimedAttachments = [];
          claimedAttachments.push(attachment);
          var mapSection = {
            id: 'maprosoft-map', // optional if you aren't using a function for the title
            claimed: claimedAttachments,
            icon: MAPROSOFT_ICON_GRAY,
            title: 'Maprosoft Map',
            content: {
              type: 'iframe',
              url: t.signUrl('./map-section.html', { "map-url": attachment.url }),
              height: 400
            }
          };
          sections.push(mapSection);
        })(attachment);
      }
      return sections;
    } else {
      return [];
    }
  },
  'attachment-thumbnail': function(t, options){
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
  },
  'board-buttons': function(t, options){
    return [{
      icon: MAPROSOFT_ICON_COLOR,
      text: 'Maprosoft',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t);
  },
  'card-buttons': function(t, options) {
    return [{
      icon: MAPROSOFT_ICON_GRAY,
      text: 'Shared Map',
      callback: addSharedMapCallback
    }, {
      icon: MAPROSOFT_ICON_GRAY,
      text: 'Location Map',
      callback: addLocationMapCallback
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  'card-from-url': function(t, options) {
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
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
