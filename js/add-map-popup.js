var selectASharedMapChoiceText = 'Select a shared map';

$(document).ready(function() {
    initialiseAddMapPopup();
});

var initialiseAddMapPopup = function() {
    var $mapSelectionContainer = $('#map-selection-container');
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    $sharedMapSelectionButton.innerText = selectASharedMapChoiceText;
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
    //$sharedMapSelectionButton.text('hhhhhhhhhhhhhh');
    var sharedMapOption = event.target;
    var sharedMapName = sharedMapOption.innerText;
    $sharedMapSelectionButton.text('hhhhhhhhhhhhhh');
};

var handleSharedMapSelectionButton = function(event) {

};
