/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var maprosoftTeamNameTextField = document.getElementById('maprosoft-team-name');
var maprosoftTokenTextField = document.getElementById('maprosoft-token');

t.render(function() {
  return Promise.all([
    t.get('board', 'shared', 'maprosoft-team-name'),
    t.get('board', 'shared', 'maprosoft-token')
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
//    return t.set('board', 'shared', 'maprosoft-token', maprosoftTokenTextField.value);
//  })
//  .then(function() {
//    return t.set('board', 'shared', 'maprosoft-team-name', maprosoftTeamNameTextField.value);
//  })
//  .then(function() {
//    //updateSharedMapInfoCache(t);
//
//    return doGet(retrieveSharedMapsUrl).then(function(sharedMapInfo) {
//      //var sharedMapInfo = '{"teamName":"demo","mapNames":["General","Stack Panel","Libraries","Parks","Park Highlights","First Fleet Park","Commuting","Driving Directions","Map Rulers"]}';
//      return t.set('board', 'shared', 'cached-shared-map-info', sharedMapInfo);
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
    t.set('board', 'shared', 'maprosoft-team-name', teamName),
    t.set('board', 'shared', 'maprosoft-token', token),
    //t.set('board', 'shared', 'cached-shared-map-info', sharedMapInfo);
    doGet(buildRetrieveSharedMapsUrl(teamName, token)).then(function(sharedMapInfo) {
      return t.set('board', 'shared', 'cached-shared-map-info', sharedMapInfo);
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
