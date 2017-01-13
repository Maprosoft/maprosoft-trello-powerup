/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var maprosoftTokenTextField = document.getElementById('maprosoft-token');
var vegetableSelector = document.getElementById('vegetable');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'maprosoft-token'),
    t.get('board', 'private', 'vegetable')
  ])
  .spread(function(maprosoftToken, savedVegetable) {
    if (maprosoftToken && /[0-9][a-z]+/.test(maprosoftToken)) {
      maprosoftTokenTextField.value = maprosoftToken;
    }
    if (savedVegetable && /[a-z]+/.test(savedVegetable)) {
      vegetableSelector.value = savedVegetable;
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
