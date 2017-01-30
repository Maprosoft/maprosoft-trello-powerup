var defaultMapName = 'Default map';
var defaultFullMapName = 'Default Maprosoft map';

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
    $sharedMapSelectionButton.text(defaultMapName);
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
    if (buttonText && buttonText !== defaultMapName) {
        return buttonText;
    } else {
        return null;
    }
};

var setErrorMessage = function(errorMessage) {
    var $errorMessage = $('#error-message');
    if (errorMessage) {
        $errorMessage.html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + errorMessage);
    } else {
        $errorMessage.text('');
    }
};

var handleAddMapButtonClick = function(event) {
    setErrorMessage('');
    var selectedSharedMapName = getSelectedSharedMapName();
    var addressTextArea = document.getElementById('address');
    var address = addressTextArea.value;

    //if (address || selectedSharedMapName) {
        addMap(address, selectedSharedMapName);
    //} else {
    //    setErrorMessage('Select a shared map or enter an address.');
    //}
};

var addMap = function(address, sharedMapName) {
    t.get('board', 'shared', TEAM_NAME_KEY).then(function(teamNameOrKey) {
        if (teamNameOrKey) {
            addMapForTeam(teamNameOrKey, address, sharedMapName);
        } else {
            setErrorMessage('Your Maprosoft team name isn\'t set - try setting it again using the Power-Up seetings.');
        }
    }).catch(function() {
        setErrorMessage('It looks like there was a problem getting your team name - try setting it again using the Power-Up seetings.');
    });
};

var addMapForTeam = function(teamNameOrKey, address, sharedMapName) {
    if (sharedMapName) {
        var mapName = sharedMapName;
        var mapUrl = buildSharedMapUrl(teamNameOrKey, sharedMapName);
    } else {
        var mapName = defaultFullMapName;
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
                            var mapName = inputAddress;
                            return attachMapWithUrl(t, mapName, mapUrl);
                        });
                } else {

                    setErrorMessage('There was a problem working out the location of that address.');
                    //return t.closePopup();
                }
            }).then(function(sharedMapInfo) {
                var sharedMapInfoJson = JSON.stringify(sharedMapInfo);
                return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson);
            }).then(function() {
                return t.closePopup();
            }).catch(function() {
                setErrorMessage('There was a problem getting information from Maprosoft. Check your settings and internet connection.');
            });
    } else {
        return attachMapWithUrl(t, mapName, mapUrl);
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

