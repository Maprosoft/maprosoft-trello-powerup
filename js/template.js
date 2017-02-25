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
  return t.get('board', 'private', TEAM_NAME_KEY)
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

var buildMapSection = function(t, attachment) {
  // Capture the attachment variable in a closure so that it's attributes are safe to pass
  // into promises such as the signUrl function.
  var claimedAttachments = [attachment];
  var attachmentUrl = attachment.url;
  var signedUrl = t.signUrl('./map-section.html', {
    "map-url": attachmentUrl,
    settingsOk: true
  });
  if (attachment.name) {
    var attachmentTitle = attachment.name;
  } else {
    if (attachmentUrl.indexOf('dropPin') > 0) {
      var attachmentTitle = 'Maprosoft location map';
    } else {
      var attachmentTitle = extractSharedMapNameFromUrl(attachmentUrl);
    }
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
      text: 'Add map',
      callback: handleAddMapCallback
    //} , {
    //  icon: MAPROSOFT_ICON_GRAY,
    //  text: 'A: Map',
    //  callback: addSharedMapCallbackA
    //}, {
    //  icon: MAPROSOFT_ICON_GRAY,
    //  text: 'B: Map',
    //  callback: addSharedMapCallbackB
    //}, {
    //  icon: MAPROSOFT_ICON_GRAY,
    //  text: 'C: Map',
    //  callback: addSharedMapCallbackC
    //}, {
    //  icon: MAPROSOFT_ICON_GRAY,
    //  text: 'Location Map',
    //  callback: addLocationMapCallback
    }];
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
