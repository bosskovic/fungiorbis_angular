'use strict';

angular.module('directives.referenceMarker', [])

  .directive('foReferenceMarker', function (References) {
    return {
      templateUrl: 'common/directives/referenceMarker.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { reference: '=' },
      link: function (scope) {
        scope.index = scope.reference.index;
        scope.title = References.toString(scope.reference.value);

      }
    };
  });