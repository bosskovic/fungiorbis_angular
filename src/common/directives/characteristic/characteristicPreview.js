'use strict';

angular.module('directives.characteristicPreview', [])

  .directive('foCharacteristicPreview', function (FoI18n, Characteristics) {

    return {
      templateUrl: 'common/directives/characteristic/characteristicPreview.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=' },
      link: function (scope) {
        scope.showUsability = scope.characteristic.edible || scope.characteristic.cultivated || scope.characteristic.poisonous || scope.characteristic.medicinal;

        scope.usabilities = Characteristics.usabilitiesArray();

        scope.descriptions = [];
        scope.locales = FoI18n.localesArray();
        scope.sections = Characteristics.sectionsArray(scope.locales);


        scope.descriptions = [];
        var localesMissing;
        scope.sections.forEach(function (section) {
          if (scope.characteristic[section.key]) {
            localesMissing = [];
            scope.locales.forEach(function (locale){
              if (angular.isUndefined(scope.characteristic[section.key][locale.key])) {
                localesMissing.push(locale.title);
              }
            });
            scope.descriptions.push({
              section: section,
              localesMissing: localesMissing
            });
          }
        });
      }
    };
  });