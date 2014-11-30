'use strict';

angular.module('directives.usabilityPublic', [])

  .directive('foUsabilityPublic', function () {

    return {
      templateUrl: 'common/directives/characteristic/usabilityPublic.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { usabilities: '=' },
      link: function (scope) {
        if (scope.usabilities === undefined){
          scope.usabilities = [];
        }

        scope.allUsabilities = [
          { key: 'edible', title: 'Jestiva', selected: false },
          { key: 'cultivated', title: 'Uzgajana', selected: false },
          { key: 'poisonous', title: 'Otrovna', selected: false },
          { key: 'medicinal', title: 'Lekovita', selected: false }
        ];

        scope.toggleUsability = function (usability) {
          var index = scope.usabilities.indexOf(usability);
          if (index > -1) {
            scope.usabilities.splice(index, 1);
          }
          else {
            scope.usabilities.push(usability);
          }

          scope.allUsabilities.forEach(function (u) {
            if (u.key === usability) {
              u.selected = index === -1;
            }
          });
        };
      }
    };
  });