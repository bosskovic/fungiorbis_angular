'use strict';

angular.module('directives.speciesCharacteristics', [])

  .directive('foSpeciesCharacteristics', function (Characteristics) {
    return {
      templateUrl: 'common/directives/speciesCharacteristics.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { species: '=' },
      link: function (scope) {
        scope.habitats = Characteristics.speciesHabitats(scope.species);

        scope.substrates = Characteristics.speciesSubstrates(scope.species);


        scope.reference = function(referenceId){
          return scope.species.references[referenceId];
        };
      }
    };
  });