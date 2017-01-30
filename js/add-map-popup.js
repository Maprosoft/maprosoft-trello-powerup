var selectASharedMapChoiceText = 'Select a shared map';

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

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
                var $mapOption = $('<a>', {
                    //id: "foo",
                    "class": "dropdown-item shared-map-choice",
                    href: '#',
                    text: mapName
                });
                $sharedMapsDropdown.append($mapOption);
                $mapOption.click(handleSharedMapSelectionLink);
            }
        }
    });
};

var getSelectedSharedMapName = function() {
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    var buttonText = $sharedMapSelectionButton.text();
    if (buttonText && buttonText !== selectASharedMapChoiceText) {
        return buttonText;
    } else {
        return null;
    }
};

var handleAddMapButtonClick = function(event) {
    var errorMessage = '';

    var errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = '';
    var selectedSharedMapName = getSelectedSharedMapName();
    var addressTextArea = document.getElementById('address');
    var address = addressTextArea.value;

    if (address || selectedSharedMapName) {
        addMap(errorMessageElement, address, selectedSharedMapName);
    } else {
        errorMessageElement.innerHTML = errorMessage;
    }
};

var addMap = function(errorMessageElement, address, selectedSharedMapName) {


    var teamNameOrKey = 'demo';

    if (selectedSharedMapName) {
        var mapUrl = buildSharedMapUrl(teamNameOrKey, sharedMapName);
    } else {
        var mapUrl = buildGeneralMapUrl(teamNameOrKey);
    }


    //var promise = t.get('board', 'shared', TEAM_TOKEN_KEY);
    //if (address) {
    //    promise = promise.then(function(token) {
    //        return geocodeAddress(token, address);
    //    });
    //}

    if (address) {
        var promise = t.get('board', 'shared', TEAM_TOKEN_KEY)
            .then(function(token) {
                return geocodeAddress(token, address);
            }).then(function(geocodeResult) {
                /*
                 Example result:
                 {"success":true,
                 "data":{
                 "inputAddress":"341 George St,Sydney",
                 "geocodedLocation":{
                 "latitude":-33.8672664,"longitude":151.2066123
                 },
                 "zeroResults":false,
                 "errorOccurred":false
                 }
                 }
                 */
                if (geocodeResult && geocodeResult.success && geocodeResult.data && geocodeResult.data.geocodedLocation) {
                    var geocodedLocation = geocodeResult.data.geocodedLocation;
                    var inputAddress = geocodeResult.data.inputAddress;
                    return t.get('board', 'shared', TEAM_NAME_KEY)
                        .then(function(teamName) {
                            //var url = buildUrlWithDropPin(teamName, inputAddress, geocodedLocation.latitude, geocodedLocation.longitude);
                            var nextSeparator = '?';
                            mapUrl = appendAddressParameters(mapUrl, nextSeparator, inputAddress, geocodedLocation.latitude, geocodedLocation.longitude);
                            return attachMapWithUrl(t, inputAddress, mapUrl);
                        });
                } else {
                    errorMessageElement.innerHTML = 'There was a problem working out the location of that address.';
                    //return t.closePopup();
                }
            }).then(function(sharedMapInfo) {
                var sharedMapInfoJson = JSON.stringify(sharedMapInfo);
                return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson);
            }).then(function() {
                return t.closePopup();
            }).catch(function() {
                errorMessageElement.innerHTML = 'There was a problem getting information from Maprosoft. Check your settings and internet connection.';
            });
    } else {
        return attachMapWithUrl(t, inputAddress, mapUrl);
    }
};

var attachMapWithUrl = function(t, name, url) {
    return t.attach({
        url: url,
        name: name
    })
    .then(function(){
        return t.closePopup();
    });
};

var handleSharedMapSelectionButton = function(event) {

};

var handleSharedMapSelectionLink = function(event) {
    event.preventDefault();
    var $sharedMapSelectionButton = $('#sharedMapSelectionButton');
    var sharedMapOption = event.target;
    var sharedMapName = sharedMapOption.innerText;
    $sharedMapSelectionButton.text(sharedMapName);

    //getSharedMapPopupItemsUsingPromise().then(function() {
    //
    //});

};

