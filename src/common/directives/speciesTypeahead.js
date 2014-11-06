'use strict';

angular.module('directives.speciesTypeahead', [])

  .directive('foSpeciesTypeahead', function (Species) {

    return {
      templateUrl: 'common/directives/speciesTypeahead.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { id: '=', fullName: '=', placeholder: '@' },
      link: function (scope) {
        scope.getSpecies = function (val) {
          return Species.$collection().$fetch({ filterTarget: 'name,genus', fields: 'id,fullName', filterValue: val}).$asPromise().then(function (response) {
            return response;
          });
        };
        scope.select = function(item){
          scope.id = item.id;
        };

        if (angular.isUndefined(scope.placeholder)){
          scope.placeholder = 'Type in the species name';
        }
      }
    };
  });