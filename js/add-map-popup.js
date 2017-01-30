$(document).ready(function() {
    initialiseAddMapPopup();
});

var initialiseAddMapPopup = function() {
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    $sharedMapSelectionButton.click(handleSharedMapSelectionButton);
    var $actionLink = $('#action-a');
    $actionLink.click(handleSharedMapSelectionLink);
    var $actionLinks = $('.shared-map-choice');
    $actionLinks.click(handleSharedMapSelectionLink);
};

var handleSharedMapSelectionLink = function(event) {
    event.preventDefault();
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    $sharedMapSelectionButton.text('hhhhhhhhhhhhhh');
};

var handleSharedMapSelectionButton = function(event) {

};
