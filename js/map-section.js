/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var mapUrl = t.arg('map-url');
var inOverlayMode = t.arg('overlayMode');

//var $mapFrame = $('#map-frame');
//$mapFrame.attr('id', mapUrl);

//var mapFrame = document.getElementById('map-frame');
//mapFrame.src = mapUrl;

t.render(function () {
    // make sure your rendering logic lives here, since we will
    // recall this method as the user adds and removes attachments
    // from your section
    var mapFrameElement = document.getElementById('map-frame');
    if (inOverlayMode) {
        mapFrameElement.src = mapUrl;

        // close overlay if user clicks outside our content
        document.addEventListener('click', function(e) {
            if(e.target.tagName == 'BODY') {
                t.closeOverlay().done();
            }
        });

        // close overlay if user presses escape key
        document.addEventListener('keyup', function(e) {
            if(e.keyCode == 27) {
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
            //var urls = attachments.map(function(a){
            //  return a.url;
            //});
            //document.getElementById('urls').textContent = urls.join(', ');

            mapFrameElement.src = mapUrl;

            //var mapUrlDebugElement = document.getElementById('map-url-debug');
            //if (mapUrlDebugElement) {
            //    mapUrlDebugElement.innerHTML = mapUrl;
            //}
        });
    }
});
