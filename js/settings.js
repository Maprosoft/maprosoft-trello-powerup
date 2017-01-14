/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var maprosoftTeamNameTextField = document.getElementById('maprosoft-team-name');
var maprosoftTokenTextField = document.getElementById('maprosoft-token');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'maprosoft-team-name'),
    t.get('board', 'shared', 'maprosoft-token'),
    t.get('board', 'private', 'vegetable')
  ])
  .spread(function(teamMaprosoftName, savedMaprosoftToken, savedVegetable) {
        if (teamMaprosoftName) {
          maprosoftTeamNameTextField.value = teamMaprosoftName;
        }
    if (savedMaprosoftToken) {
      maprosoftTokenTextField.value = savedMaprosoftToken;
    }
  })
  .then(function(){
    t.sizeTo('#settings-content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function() {
  return t.set('board', 'private', 'vegetable', 'Broccoli')
  .then(function() {
    return t.set('board', 'shared', 'maprosoft-token', maprosoftTokenTextField.value);
  })
  .then(function() {
    return t.set('board', 'shared', 'maprosoft-team-name', maprosoftTeamNameTextField.value);
  })
  .then(function() {
    t.closePopup();
  });
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
