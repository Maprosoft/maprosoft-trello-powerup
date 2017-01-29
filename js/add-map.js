
var addSharedMapCallbackA = function(t, options) {
    return t.popup({
        title: 'Select a Maprosoft map',
        items: getSharedMapPopupItemsUsingPromise,
        search: {
            count: 5,
            placeholder: 'Search shared maps',
            empty: 'No share map found'
        }
    });
};

var addSharedMapCallbackB = function(t, options) {
    return t.popup({
        title: 'Select a Maprosoft map',
        items: getSharedMapPopupItemsDirectly,
        search: {
            count: 5,
            placeholder: 'Search shared maps',
            empty: 'No share map found'
        }
    });
};

var addSharedMapCallbackC = function(t, options) {
    return t.popup({
        title: 'Select a Maprosoft map',
        items: getSharedMapPopupItemsDirectly(t, options),
        search: {
            count: 5,
            placeholder: 'Search shared maps',
            empty: 'No share map found'
        }
    });
};

var addLocationMapCallback = function(t) {
    return t.popup({
        title: 'Enter a location',
        url: './location-entry.html',
        height: 250
    });
};

var handleAddMapCallback = function(t) {
    return t.popup({
        title: 'Enter a location',
        url: './add-map-popup.html'
    });
};

var buildSharedMapPopupItem = function(t, teamName, sharedMapName) {
    var encodedSharedMapName = encodeURIComponent(sharedMapName);
    var encodedTeamName = encodeURIComponent(teamName);
    var sharedMapUrl = 'https://www.maprosoft.com/app/shared/' + encodedTeamName + '/' + encodedSharedMapName;
    return {
        text: sharedMapName,
        url: sharedMapUrl,
        callback: function (t) {
            return t.attach({
                url: sharedMapUrl,
                name: sharedMapName
            })
                .then(function () {
                    return t.closePopup();
                });
        }
    };
};

var buildSharedMapPopupItems = function(t, sharedMapInfo) {
    var teamName = sharedMapInfo.teamName;
    var popupItems = Object.keys(sharedMapInfo.mapNames).map(function (index) {
        var sharedMapName = sharedMapInfo.mapNames[index];
        return buildSharedMapPopupItem(t, teamName, sharedMapName);
    });
    return popupItems;
};

var getSharedMapPopupItemsXxxxxxxxxxxx = function(t, options) {
    var Promise = TrelloPowerUp.Promise;
    return Promise.all([
        t.get('board', 'shared', CACHED_SHARED_MAP_INFO_KEY),
        t.get('board', 'shared', TEAM_NAME_KEY),
        t.get('board', 'shared', TEAM_TOKEN_KEY)
    ])
        .spread(function(sharedMapInfoJson, teamName, token) {
            if (teamName && token && sharedMapInfoJson) {
                var sharedMapInfo = JSON.parse(sharedMapInfoJson);
            } else {
                var sharedMapInfo = null;
                return t.overlay({
                    url: './no-settings.html',
                    args: {}
                })
                    .then(function () {
                        return t.closePopup();
                    });
            }
            if (sharedMapInfo && sharedMapInfo.mapNames) {
                return buildSharedMapPopupItems(t, sharedMapInfo);
            } else {
                // If we don't have anything let's go fetch it
                if (teamName) {
                    var teamKey = teamName;
                } else {
                    var teamKey = 'demo';
                }
                return getFreshMapInfo(teamKey).then(function(retrievedSharedMapInfo) {
                    var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
                    t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson).then(function() {
                        // saved for next time
                    });
                    return buildSharedMapPopupItems(t, retrievedSharedMapInfo);
                });
            }
        });
};

var getSharedMapPopupItemsSSSSSSSSSSSS = function(t, options) {
    var Promise = TrelloPowerUp.Promise;
    return Promise.join(
        t.get('board', 'shared', CACHED_SHARED_MAP_INFO_KEY),
        t.get('board', 'shared', TEAM_NAME_KEY),
        t.get('board', 'shared', TEAM_TOKEN_KEY),
        function(sharedMapInfoJson, teamName, token) {
            if (teamName && token && sharedMapInfoJson) {
                //var sharedMapInfo = JSON.parse(sharedMapInfoJson);
                if (teamName) {
                    var teamKey = teamName;
                } else {
                    var teamKey = 'demo';
                }
                return getFreshMapInfo(teamKey).then(function(retrievedSharedMapInfo) {
                    var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
                    t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson).then(function() {
                        // saved for next time
                    });
                    return buildSharedMapPopupItems(t, retrievedSharedMapInfo);
                });
            } else {
                return t.overlay({
                    url: './no-settings.html',
                    args: {}
                })
                    .then(function () {
                        return t.closePopup();
                    });
            }
        }
    );
};

var getSharedMapPopupItemsUsingPromise = function(t, options) {
    var teamKey = 'demo';
    return getFreshMapInfo(teamKey)
        .then(function(retrievedSharedMapInfo) {
            var sharedMapInfoJson = JSON.stringify(retrievedSharedMapInfo);
            return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson).then(function() {
                // saved for next time
            }).then(function() {
                return buildSharedMapPopupItems(t, retrievedSharedMapInfo);
            });
        });
};

var getSharedMapPopupItemsDirectly = function(t, options) {
    var sharedMapInfo = {
        teamName: "mock",
        mapNames: ["aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg"]
    };
    return buildSharedMapPopupItems(t, sharedMapInfo);
};
