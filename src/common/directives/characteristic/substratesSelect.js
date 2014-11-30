'use strict';

angular.module('directives.substratesSelect', [])

  .directive('foSubstratesSelect', function (Substrates) {

    return {
      templateUrl: 'common/directives/characteristic/substratesSelect.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { substrates: '=' },
      link: function (scope) {
        if (scope.substrates === undefined){
          scope.substrates = [];
        }

        scope.allSubstrates = Substrates.substrates();

        scope.availableSubstrates = function(){
          var allSubstratesCopy = angular.copy(scope.allSubstrates);
          if (angular.isArray(scope.substrates)){
            scope.substrates.forEach(function(item){
              delete allSubstratesCopy[item];
            });
          }
          return allSubstratesCopy;
        };

        scope.$watch('newSubstrate', function () {
          if (angular.isDefined(scope.newSubstrate)) {
            scope.substrates.push(scope.newSubstrate);
            scope.editSubstrate = false;
            scope.newSubstrate = undefined;
          }
        });

        scope.deleteSubstrate = function (index) {
          scope.substrates.splice(index, 1);
        };
      }
    };
  });