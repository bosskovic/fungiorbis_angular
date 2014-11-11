'use strict';

angular.module('directives.substratesSelect', [])

  .directive('foSubstratesSelect', function (Substrates) {

    return {
      templateUrl: 'common/directives/characteristic/substratesSelect.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { substrates: '=' },
      link: function (scope) {
        scope.allSubstrates = Substrates.substrates();
        scope.selectSize = Object.keys(scope.allSubstrates).length;
      }
    };
  });