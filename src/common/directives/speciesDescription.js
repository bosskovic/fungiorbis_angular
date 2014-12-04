'use strict';

angular.module('directives.speciesDescription', [])

  .directive('foSpeciesDescription', function (Characteristics) {
    return {
      templateUrl: 'common/directives/speciesDescription.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { species: '=' },
      link: function (scope) {
        scope.characteristics = Characteristics.speciesSections(scope.species);

        scope.reference = function(referenceId){
          return scope.species.references[referenceId];
        };
      }
    };
  });