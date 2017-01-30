var selectASharedMapChoiceText = 'Select a shared map';

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

//$(document).ready(function() {
//    initialiseAddMapPopup();
//});

t.render(function() {
    initialiseAddMapPopup();
});

var initialiseAddMapPopup = function() {
    var $addMapButton = $('#add-map-button');
    $addMapButton.click(handleAddMapButtonClick);
    var $mapSelectionContainer = $('#map-selection-container');
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    $sharedMapSelectionButton.text(selectASharedMapChoiceText);
    $sharedMapSelectionButton.click(handleSharedMapSelectionButton);
    var $actionLink = $('#action-a');
    $actionLink.click(handleSharedMapSelectionLink);
    var $actionLinks = $('.shared-map-choice');
    $actionLinks.click(handleSharedMapSelectionLink);
    $mapSelectionContainer.removeClass('hidden');

    var teamKey = 'demo';
    getFreshMapInfo(teamKey)
    .then(function(sharedMapInfo) {
        //var sharedMapInfoJson = JSON.stringify(sharedMapInfo);
        if (sharedMapInfo) {
            var $sharedMapsDropdown = $('#shared-maps-dropdown');
            $sharedMapsDropdown.empty();
            for (var index = 0; index < sharedMapInfo.mapNames.length; index++) {
                var mapName = sharedMapInfo.mapNames[index];
                // <a id="action-x" class="dropdown-item shared-map-choice" href="#">None</a>
                var $mapOption = $('<a>', {
                    //id: "foo",
                    "class": "dropdown-item shared-map-choice",
                    href: '#',
                    text: mapName
                });
                $sharedMapsDropdown.append($mapOption);
                $mapOption.click(handleSharedMapSelectionLink);

            }
            //$sharedMapSelectionButton.attr('aria-expanded', 'false');
            //$sharedMapsDropdown.dropdown();
        }
    });
};

var handleAddMapButtonClick = function(event) {

};

var handleSharedMapSelectionButton = function(event) {

};

var handleSharedMapSelectionLink = function(event) {
    event.preventDefault();
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    var sharedMapOption = event.target;
    var sharedMapName = sharedMapOption.innerText;
    $sharedMapSelectionButton.text(sharedMapName);

    getSharedMapPopupItemsUsingPromise().then(function() {

    });

};

