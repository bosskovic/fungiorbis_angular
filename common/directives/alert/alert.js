'use strict';

angular.module('directives.alert', [])

  .directive('foAlert', function () {

    return {
      templateUrl: 'common/directives/alert/alert.tpl.html',
      restrict: 'E',
      replace: false,
      transclude: true,
      scope: { type: '@', title: '@', notDismissable: '='  },
      link: function (scope) {
        if (scope.danger){
          scope.type = 'danger';
          scope.title = scope.title || 'Danger';
        }
        else if (scope.warning){
          scope.type = 'warning';
          scope.title = scope.title || 'Warning';
        }
        else if (scope.info){
          scope.type = 'info';
          scope.title = scope.title || 'Info';
        }
        else if (scope.success){
          scope.type = 'success';
          scope.title = scope.title || 'Success';
        }
      }
    };
  });