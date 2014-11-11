'use strict';

angular.module('directives.icon', [])

  .directive('foIcon', function (icons) {

    return {
      templateUrl: 'common/directives/icon.tpl.html',
      restrict: 'E',
      replace: true,
      scope: { icon: '@', klass: '@' },
      link: function (scope) {
        scope.iconClass = scope.klass ? scope.klass : 'fa fw';
        scope.iconClass += ' ' + icons.get(scope.icon);
      }
    };
  });