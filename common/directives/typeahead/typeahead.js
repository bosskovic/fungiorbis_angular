'use strict';

angular.module('directives.typeahead', [])

  .directive('foTypeahead', function () {
    return {
      templateUrl: 'common/directives/typeahead/typeahead.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { id: '=', value: '=', properties: '='  },
      link: function (scope) {
        scope.select = function (item) {
          scope.id = item.id;
        };
      }
    };
  });