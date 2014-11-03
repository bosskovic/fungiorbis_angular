'use strict';

angular.module('directives.descriptionEdit', [])

  .directive('foDescriptionEdit', function () {

    return {
      templateUrl: 'common/directives/characteristic/descriptionEdit.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=' },
      link: function (scope) {
        scope.locales = [
          { key: 'sr', title: 'srpski' },
          { key: 'en', title: 'English'}
        ];
        scope.sections = [
          { key: 'fruitingBody', title: 'Fruiting Body', locale: scope.locales[0] },
          { key: 'flesh', title: 'Flesh', locale: scope.locales[0] },
          { key: 'microscopy', title: 'Microscopy', locale: scope.locales[0] },
          { key: 'chemistry', title: 'Chemistry', locale: scope.locales[0] },
          { key: 'notes', title: 'Notes', locale: scope.locales[0] }
        ];

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