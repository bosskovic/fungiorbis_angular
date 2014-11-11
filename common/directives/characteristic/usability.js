'use strict';

angular.module('directives.usability', [])

  .directive('foUsability', function () {

    return {
      templateUrl: 'common/directives/characteristic/usability.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=', edit: '@', showLabels: '@' },
      link: function (scope) {
        scope.sections = [
          { key: 'edible', title: 'Edible' },
          { key: 'cultivated', title: 'Cultivated' },
          { key: 'poisonous', title: 'Poisonous' },
          { key: 'medicinal', title: 'Medicinal' }
        ];
      }
    };
  });