/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(function() {
  return Promise.all([
    t.get('board', 'shared', TEAM_NAME_KEY),
    t.get('board', 'shared', TEAM_TOKEN_KEY)
  ])
  .spread(function(teamName, token) {
    if (teamName) {
      var maprosoftTeamNameTextField = document.getElementById(TEAM_NAME_KEY);
      maprosoftTeamNameTextField.value = teamName;
    }
    if (token) {
      var maprosoftTokenTextField = document.getElementById(TEAM_TOKEN_KEY);
      maprosoftTokenTextField.value = token;
    }
  })
  .then(function(){
    t.sizeTo('#settings-content')
    .done();
  })
});

document.getElementById('save-settings').addEventListener('click', function() {
    var maprosoftTeamNameTextField = document.getElementById(TEAM_NAME_KEY);
    var maprosoftTokenTextField = document.getElementById(TEAM_TOKEN_KEY);
    var teamName = maprosoftTeamNameTextField.value;
    var token = maprosoftTokenTextField.value;
    var errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = '';

    if (!teamName) {
        errorMessageElement.innerHTML = 'Please enter the name of your Maprosoft team.';
        return;
    }
    if (!token) {
        errorMessageElement.innerHTML = 'Please enter the the token from Maprosoft team\'s Trello control panel.';
        return;
    }

    return t.set('board', 'shared', TEAM_NAME_KEY, teamName)
    .then(function() {
        return t.set('board', 'shared', TEAM_TOKEN_KEY, token);
    }).then(function() {
        return doGet(buildRetrieveSharedMapsUrl(teamName, token));
        //.reject(function() {
        //    var errorMessageElement = document.getElementById('error-message');
        //    errorMessageElement.innerHTML = 'There was a problem getting team information from Maprosoft. Check the team name and token you entered and your internet connection.';
        //});
    }).then(function(sharedMapInfo) {
      var sharedMapInfoJson = JSON.stringify(sharedMapInfo);
      return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfoJson);
    }).then(function() {
        return t.closePopup();
    }).catch(function() {
      errorMessageElement.innerHTML = 'There was a problem getting team information from Maprosoft. Check the team name and token you entered and your internet connection.';
    });
});

document.getElementById('clear-settings').addEventListener('click', function() {
  return t.set('board', 'shared', TEAM_NAME_KEY, '')
      .then(function() {
        return t.set('board', 'shared', TEAM_TOKEN_KEY, '');
      }).then(function() {
        return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, '{}');
      }).then(function() {
        return t.closePopup();
      });
});
