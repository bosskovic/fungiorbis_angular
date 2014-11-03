'use strict';

angular.module('directives.characteristicEdit', [])

  .directive('foCharacteristicEdit', function () {

    return {
      templateUrl: 'common/directives/characteristicEdit.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=' },
      link: function (scope) {

        scope.appendHabitats = function(habitats){
          scope.characteristic.habitats = habitats;
        };

        scope.section = {
          usability: {
            title: 'Usability',
            helpText: 'Select one or more values. Optional.'
          },
          habitats: {
            title: 'Habitats',
            helpText: null
          },
          substrates: {
            title: 'Substrates',
            helpText: 'Press and hold CTRL to select multiple.'
          },
          description: {
            title: 'Description',
            helpText: null
          }
        };
      }
    };
  });