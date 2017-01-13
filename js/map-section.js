/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var mapUrl = t.arg('map-url');

//var $mapFrame = $('#map-frame');
//$mapFrame.attr('id', mapUrl);

//var mapFrame = document.getElementById('map-frame');
//mapFrame.src = mapUrl;

t.render(function() {
  // make sure your rendering logic lives here, since we will
  // recall this method as the user adds and removes attachments
  // from your section
  t.card('attachments')
  .get('attachments')
  .filter(function(attachment) {
        return attachment.url.indexOf('https://www.maprosoft.com/app/map') == 0;
  })
  .then(function(attachments) {
        //var urls = attachments.map(function(a){
        //  return a.url;
        //});
        //document.getElementById('urls').textContent = urls.join(', ');

        var mapFrameElement = document.getElementById('map-frame');
        mapFrameElement.src = mapUrl;

        var mapFrameElement = document.getElementById('map-url-element');
        mapFrameElement.innerHTML = mapUrl;
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});
