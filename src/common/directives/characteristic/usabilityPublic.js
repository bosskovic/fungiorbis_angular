'use strict';

angular.module('directives.usabilityPublic', [])

  .directive('foUsabilityPublic', function (Characteristics) {

    return {
      templateUrl: 'common/directives/characteristic/usabilityPublic.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { usabilities: '=', reset: '=' },
      link: function (scope) {
        if (scope.usabilities === undefined) {
          scope.usabilities = [];
        }

        scope.reset = function(){
          Characteristics.usabilitiesArray().forEach(function(u){
            scope.allUsabilities[u].selected = false;
          });
        };

        scope.allUsabilities = {
          edible: { title: 'Jestiva', selected: false },
          cultivated: { title: 'Uzgajana', selected: false },
          poisonous: { title: 'Otrovna', selected: false },
          medicinal: { title: 'Lekovita', selected: false }
        };

        scope.toggleUsability = function (usability) {
          var index = scope.usabilities.indexOf(usability);
          if (index > -1) {
            scope.usabilities.splice(index, 1);
          }
          else {
            scope.usabilities.push(usability);
          }

          scope.allUsabilities[usability].selected = !scope.allUsabilities[usability].selected;
        };
      }
    };
  });