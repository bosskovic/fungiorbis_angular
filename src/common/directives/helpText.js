'use strict';

angular.module('directives.helpText', [])

  .directive('foHelpText', function () {

    return {
      templateUrl: 'common/directives/helpText.tpl.html',
      restrict: 'E',
      replace: true,
      scope: { text: '@' },
      link: function (scope) {
        scope.expand = false;
      }
    };
  });