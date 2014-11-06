'use strict';

angular.module('directives.descriptionEdit', [])

  .directive('foDescriptionEdit', function (Characteristics, FoI18n) {

    return {
      templateUrl: 'common/directives/characteristic/descriptionEdit.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=' },
      link: function (scope) {
        scope.locales = FoI18n.localesArray();
        scope.sections = Characteristics.sectionsArray(scope.locales);

        var activeDescTab = scope.sections[0];

        scope.active = function (tabName) {
          return tabName === activeDescTab;
        };

        scope.activate = function (tabName) {
          activeDescTab = tabName;
        };

      }
    };
  });