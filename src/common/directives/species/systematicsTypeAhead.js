'use strict';

angular.module('directives.systematicsTypeAhead', [])

  .directive('foSystematicsTypeAhead', function (Species) {

    return {
      templateUrl: 'common/directives/species/systematicsTypeAhead.tpl.html',
      restrict: 'E',
      replace: true,
      scope: { systematics: '=', systematicsCategory: '=' },
      link: function (scope) {
        scope.systematicsCategory = 'genus';

        scope.allSystematics = [
          { key: 'fullName', value: 'vrsta' },
          { key: 'genus', value: 'rod' },
          { key: 'familia', value: 'familija' },
          { key: 'ordo', value: 'red' },
          { key: 'subclassis', value: 'podklasa' },
          { key: 'classis', value: 'klasa' },
          { key: 'subphylum', value: 'podfilum' },
          { key: 'phylum', value: 'filum' }
        ];

        scope.$watch('systematicsCategory', function (systematicsCategory) {
          scope.allSystematics.forEach(function(s){
            if (s.key === systematicsCategory){
              scope.systematicsCategoryLabel =  s.value;
            }
          });
          scope.systematics = undefined;
        });

        scope.typeAheadProperties = {
          icon: 'species',
          key: 'value',
          placeholder: '',
          getData: function (val) {
            return Species.systematicsValues(scope.systematicsCategory, {value: val})
              .then(function (response) {
                return response.data.systematics;
              });
          }
        };
      }
    };
  });