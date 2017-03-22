/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so

var resizeOverlayMap = function() {
    //var mapFrameElement = document.getElementById('map-frame');
    //var overlayContentElement = document.getElementById('no-settings-content');
    //var overlayContentHeight = overlayContentElement.offsetHeight;
    //var mapOffsetTop = mapFrameElement.offsetTop;
    //var mapHeight = overlayContentHeight - mapOffsetTop;
    //mapFrameElement.height = mapHeight;
};

var handleWindowResize = function(event) {
    resizeOverlayMap();
};

t.render(function () {
    // make sure your rendering logic lives here, since we will
    // recall this method as the user adds and removes attachments
    // from your section
    var noSettingsSectionElement = document.getElementById('no-settings-section');
    noSettingsSectionElement.style.display='block';
    resizeOverlayMap();

    optimizedResize.addWindowResizeListener(handleWindowResize);

    // close overlay if user clicks outside our content
    document.addEventListener('click', function(event) {
        var eventtarget = event.target;
        if (eventtarget.tagName == 'BODY' || eventtarget.id == 'close-no-settings' || eventtarget.id == 'close-no-settings-button') {
            t.closeOverlay().done();
        }
    });

    // close overlay if user presses escape key
    document.addEventListener('keyup', function(event) {
        if (event.keyCode == 27) {
            t.closeOverlay().done();
        }
    });
});

document.getElementById('update-settings').addEventListener('click', function() {
    return
    closeSettingsPopup(t)
    .then(function() {
        openSettingsPopup(t);
    });
});


