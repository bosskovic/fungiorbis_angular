'use strict';

angular.module('directives.habitatSpecies', [])

  .directive('foHabitatSpecies', function () {

    function recalculateAvailableSpecies(allSpecies, selectedSpecies){
      var availableSpecies = [];

      allSpecies.forEach(function(spHash){
        var found = false;

        if (angular.isArray(selectedSpecies)){
          selectedSpecies.forEach(function(sp){
            if (sp === spHash.key){
              found = true;
            }
          });
        }

        if (!found){
          availableSpecies.push(angular.copy(spHash));
        }
      });
      return availableSpecies;
    }

    return {
      templateUrl: 'common/directives/characteristic/habitatSpecies.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { habitat: '=', update: '=' },
      link: function (scope) {

        scope.species = function(){
          if (scope.habitat.species === undefined) {
            return [];
          }
          else {
            return scope.habitat.species;
          }
        };

        scope.speciesLabel = function(species) {
          var latinName = angular.copy(species.key);
          return latinName.charAt(0).toUpperCase() + latinName.slice(1) + ' (' + species.value + ')';
        };

        scope.$watch('newSpecies', function () {
          if (angular.isDefined(scope.newSpecies)) {
            if (!angular.isArray(scope.habitat.species)){
              scope.habitat.species = [];
            }
            scope.habitat.species.push(scope.newSpecies);

            scope.update(scope.habitat.i, scope.habitat.species);

            scope.addSpecies = false;
            scope.newSpecies = undefined;
          }

          scope.availableSpecies = recalculateAvailableSpecies(scope.habitat.availableSpecies, scope.habitat.species);
        });

        scope.deleteSpecies = function (index) {
          scope.habitat.species.splice(index, 1);
          if (scope.habitat.species.length === 0){
            scope.habitat.species = undefined;
          }
          scope.update(scope.habitat.i, scope.habitat.species);
          scope.availableSpecies = recalculateAvailableSpecies(scope.habitat.availableSpecies, scope.habitat.species);
        };
      }
    };
  });