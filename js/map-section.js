/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var settingsOk = t.arg('settingsOk');
var mapUrl = t.arg('map-url');
var inOverlayMode = t.arg('overlayMode');

var mapRenderCount = 0;

var resizeOverlayMap = function() {
    var mapFrameElement = document.getElementById('map-frame');
    var overlayContentElement = document.getElementById('map-overlay-content');
    var overlayContentHeight = overlayContentElement.offsetHeight;
    var mapOffsetTop = mapFrameElement.offsetTop;
    var mapHeight = overlayContentHeight - mapOffsetTop;
    mapFrameElement.height = mapHeight;
};

var handleWindowResize = function(event) {
    resizeOverlayMap();
};

t.render(function () {

    mapRenderCount++;
    //console.log('Rendering map instance ' + mapRenderCount + ' section for URL ' + mapUrl);

    // make sure your rendering logic lives here, since we will
    // recall this method as the user adds and removes attachments
    // from your section
    var mapFrameElement = document.getElementById('map-frame');
    var noSettingsSectionElement = document.getElementById('no-settings-section');
    if (settingsOk) {
        mapFrameElement.src = mapUrl;
        mapFrameElement.style.display='block';
        noSettingsSectionElement.style.display='none';
    } else {
        mapFrameElement.style.display='none';
        noSettingsSectionElement.style.display='block';
    }
    if (inOverlayMode) {
        resizeOverlayMap();

        optimizedResize.addWindowResizeListener(handleWindowResize);

        // close overlay if user clicks outside our content
        document.addEventListener('click', function(event) {
            var eventtarget = event.target;
            if (eventtarget.tagName == 'BODY' || eventtarget.id == 'close-map-overlay' || eventtarget.id == 'close-map-overlay-button') {
                t.closeOverlay().done();
            }
        });

        // close overlay if user presses escape key
        document.addEventListener('keyup', function(event) {
            if (event.keyCode == 27) {
                t.closeOverlay().done();
            }
        });
    } else {
        t.card('attachments')
        .get('attachments')
        .filter(function (attachment) {
            return attachment.url.indexOf('https://www.maprosoft.com/app/map') == 0;
        })
        .then(function (attachments) {
            mapUrl = appendAutoHideToolbarParameter(mapUrl);
            mapFrameElement.src = mapUrl;
        });
    }
});
