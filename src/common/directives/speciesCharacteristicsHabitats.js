'use strict';

angular.module('directives.speciesCharacteristicsHabitats', [])

  .directive('foSpeciesCharacteristicsHabitats', function () {
    return {
      templateUrl: 'common/directives/speciesCharacteristicsHabitats.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { habitats: '=' },
      link: function () {
      }
    };
  });