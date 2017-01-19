/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var maprosoftTeamNameTextField = document.getElementById(TEAM_NAME_KEY);
var maprosoftTokenTextField = document.getElementById(TEAM_TOKEN_KEY);

t.render(function() {
  return Promise.all([
    t.get('board', 'shared', TEAM_NAME_KEY),
    t.get('board', 'shared', TEAM_TOKEN_KEY)
  ])
  .spread(function(teamName, token) {
    if (teamName) {
      maprosoftTeamNameTextField.value = teamName;
    }
    if (token) {
      maprosoftTokenTextField.value = token;
    }
  })
  .then(function(){
    t.sizeTo('#settings-content')
    .done();
  })
});

//document.getElementById('save').addEventListener('click', function() {
//  return t.set('board', 'private', 'vegetable', 'Broccoli')
//  .then(function() {
//    return t.set('board', 'shared', TEAM_TOKEN_KEY, maprosoftTokenTextField.value);
//  })
//  .then(function() {
//    return t.set('board', 'shared', TEAM_NAME_KEY, maprosoftTeamNameTextField.value);
//  })
//  .then(function() {
//    //updateSharedMapInfoCache(t);
//
//    return doGet(retrieveSharedMapsUrl).then(function(sharedMapInfo) {
//      //var sharedMapInfo = '{"teamName":"demo","mapNames":["General","Stack Panel","Libraries","Parks","Park Highlights","First Fleet Park","Commuting","Driving Directions","Map Rulers"]}';
//      return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfo);
//    });
//  })
//  .then(function() {
//    t.closePopup();
//  });
//});

var buildRetrieveSharedMapsUrl = function(teamName, token) {
  return 'https://www.maprosoft.com/app/shared?team=' + teamName + '&getSharedMapNames=yes';
};

document.getElementById('save').addEventListener('click', function() {
  var teamName = maprosoftTeamNameTextField.value;
  var token = maprosoftTokenTextField.value;
  return Promise.all([
    t.set('board', 'shared', TEAM_NAME_KEY, teamName),
    t.set('board', 'shared', TEAM_TOKEN_KEY, token),
    //t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfo);
    doGet(buildRetrieveSharedMapsUrl(teamName, token)).then(function(sharedMapInfo) {
      return t.set('board', 'shared', CACHED_SHARED_MAP_INFO_KEY, sharedMapInfo);
    })
  ])
  //.spread(function(token, teamName, sharedMapInfo) {
  //  if (teamMaprosoftName) {
  //    maprosoftTeamNameTextField.value = teamMaprosoftName;
  //  }
  //  if (savedMaprosoftToken) {
  //    maprosoftTokenTextField.value = savedMaprosoftToken;
  //  }
  //})
  .then(function() {
    t.closePopup();
  })
});


//t.render(function(){
//  return Promise.all([
//    t.get('board', 'shared', 'fruit'),
//    t.get('board', 'private', 'vegetable')
//  ])
//      .spread(function(savedFruit, savedVegetable) {
//        if (savedFruit && /[a-z]+/.test(savedFruit)) {
//          fruitSelector.value = savedFruit;
//        }
//        if (savedVegetable && /[a-z]+/.test(savedVegetable)) {
//          vegetableSelector.value = savedVegetable;
//        }
//      })
//      .then(function(){
//        t.sizeTo('#settings-content')
//            .done();
//      })
//});
//
//document.getElementById('save').addEventListener('click', function() {
//  return t.set('board', 'private', 'vegetable', 'Broccoli')
//      .then(function() {
//        return t.set('board', 'shared', 'fruit', fruitSelector.value);
//      })
//      .then(function() {
//        t.closePopup();
//      });
//});
