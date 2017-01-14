/* global TrelloPowerUp */

//var WHITE_ICON = './images/icon-white.svg';
//var GRAY_ICON = './images/icon-gray.svg';
//
//var retrieveSharedMapsUrl = 'https://www.maprosoft.com/app/shared?team=demo&getSharedMapNames=yes';
//var cachedSharedMapNames = [];

var getBadges = function(t) {
  return t.card('name')
  .get('name')
  .then(function(cardName){
    var badgeColor;
    var icon = GRAY_ICON;
    var lowercaseName = cardName.toLowerCase();
    if(lowercaseName.indexOf('green') > -1){
      badgeColor = 'green';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('yellow') > -1){
      badgeColor = 'yellow';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('red') > -1){
      badgeColor = 'red';
      icon = WHITE_ICON;
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

//var doGet = function(url) {
//  var getPromise = new Promise(function(resolve, reject) {
//    var request = new XMLHttpRequest();
//    request.open('GET', url, true);
//    request.onload = function() {
//      try {
//        if (request.status === 200) {
//          var responseJson = JSON.parse(request.responseText);
//          return resolve(responseJson);
//        } else if (request.status === 404) {
//          return reject(new i18nError.LocaleNotFound(targetLocale + " not found."));
//        } else {
//          return reject(new i18nError.Unknown("Unable to load locale, status: " + request.status));
//        }
//      } catch(ex) {
//        return reject(new i18nError.Unknown(ex.message));
//      }
//    };
//    request.send();
//  });
//  return getPromise;
//};
//
//var formatNPSUrl = function(t, url){
//  if(!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)){
//    return null;
//  }
//  var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
//  if (parkShort && parkMap[parkShort]){
//    return parkMap[parkShort];
//  } else{
//    return null;
//  }
//};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Overlay',
        callback: function(t){
          return t.overlay({
            url: './overlay.html',
            args: { rand: (Math.random() * 100).toFixed(0) }
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
      {
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

var cardButtonCallback = function(t) {
  var popupItems = [];
  t.get('board', 'shared', 'cached-shared-map-info', null).then(function(data) {
    if (data) {
      var sharedMapInfo = data;
      if (sharedMapInfo && sharedMapInfo.mapNames) {
        popupItems = Object.keys(sharedMapInfo.mapNames).map(function(index) {
          var sharedMapName = sharedMapInfo.mapNames[index];
          var teamKey = 'demo';
          var encodedSharedMapName = encodeURIComponent(sharedMapName);
          var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + teamKey + '/' + encodedSharedMapName;
          return {
            text: sharedMapName,
            url: sharedMapUrl,
            callback: function(t) {
              return t.attach({
                url: sharedMapUrl,
                name: sharedMapName
              })
                  .then(function(){
                    return t.closePopup();
                  });
            }
          };
        });
      } else {
        popupItems = [];
      }
    } else {
      // ???
    }
  });
  return t.popup({
    title: 'Select a Maprosoft map',
    items: popupItems,
    search: {
      count: 5,
      placeholder: 'Search shared maps',
      empty: 'No share map found'
    }
  });
};

var cardButtonCallbackOLD = function(t) {
  //var cachedSharedMapNames = t.get('board', 'shared', 'cached-shared-map-info', null);
  if (cachedMapInfo && cachedMapInfo.mapNames) {
    var popupItems = Object.keys(cachedMapInfo.mapNames).map(function(index) {
      var sharedMapName = cachedMapInfo.mapNames[index];
      var teamKey = 'demo';
      var encodedSharedMapName = encodeURIComponent(sharedMapName);
      var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + teamKey + '/' + encodedSharedMapName;
      return {
        text: sharedMapName,
        url: sharedMapUrl,
        callback: function(t) {
          return t.attach({
            url: sharedMapUrl,
            name: sharedMapName
          })
          .then(function(){
            return t.closePopup();
          });
        }
      };
    });
  } else {
    var popupItems = [];
  }
  return t.popup({
    title: 'Select a Maprosoft map',
    items: popupItems,
    search: {
      count: 5,
      placeholder: 'Search shared maps',
      empty: 'No share map found'
    }
  });
};

//doGet(retrieveSharedMapsUrl).then(function(data) {
//  cachedSharedMapNames = data.mapNames;
//});

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment) {
      return attachment.url.indexOf('https://www.maprosoft.com/app/map') === 0 || attachment.url.indexOf('https://www.maprosoft.com/app/shared') === 0;
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
      if (claimed && claimed.length > 0) {
        for (var claimIndex = 0; claimIndex < claimed.length; claimIndex++) {
          var attachment = claimed[claimIndex];
          var claimedAttachments = [];
          claimedAttachments.push(attachment);
          var mapSection = {
            id: 'maprosoft-map', // optional if you aren't using a function for the title
            claimed: claimedAttachments,
            icon: GRAY_ICON,
            title: 'Maprosoft Map v13 [' + claimIndex + ']',
            content: {
              type: 'iframe',
              url: t.signUrl('./map-section.html',
                  { "map-url": attachment.url }),
              height: 400
            }
          };
          sections.push(mapSection);
        }
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
      icon: WHITE_ICON,
      text: 'Template',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t);
  },
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Maprosoft map',
      callback: cardButtonCallback
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
        icon: GRAY_ICON,
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
