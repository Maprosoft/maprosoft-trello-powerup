var selectASharedMapChoiceText = 'Select a shared map';

$(document).ready(function() {
    initialiseAddMapPopup();
});

var initialiseAddMapPopup = function() {
    var $mapSelectionContainer = $('#map-selection-container');
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    $sharedMapSelectionButton.text(selectASharedMapChoiceText);
    $sharedMapSelectionButton.click(handleSharedMapSelectionButton);
    var $actionLink = $('#action-a');
    $actionLink.click(handleSharedMapSelectionLink);
    var $actionLinks = $('.shared-map-choice');
    $actionLinks.click(handleSharedMapSelectionLink);
    $mapSelectionContainer.removeClass('hidden');
};

var handleSharedMapSelectionLink = function(event) {
    event.preventDefault();
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    var sharedMapOption = event.target;
    var sharedMapName = sharedMapOption.innerText;
    $sharedMapSelectionButton.text(sharedMapName);

    getSharedMapPopupItemsUsingPromise().then(function() {

    });

    var teamKey = 'demo';
    getFreshMapInfo(teamKey)
        .then(function(retrievedSharedMapInfo) {
            var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
            if (sharedMapInfoJson) {
                var $sharedMapsDropdown = $('shared-maps-dropdown');
                for (var index = 0; index < sharedMapInfoJson.mapNames.length; index++) {
                    var mapName = sharedMapInfoJson.mapNames[index];
                    // <a id="action-x" class="dropdown-item shared-map-choice" href="#">None</a>
                    var $mapOption = $('a', {
                        id: "foo",
                        "class": "a",
                        text: mapName
                    });
                    $mapOption.appendTo($sharedMapsDropdown);

                }
            }
        });
};

var handleSharedMapSelectionButton = function(event) {

};
