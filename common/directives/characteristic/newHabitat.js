'use strict';

angular.module('directives.newHabitat', [])

  .directive('foNewHabitat', function (Habitats) {

    function loadExternalHabitats(habitats) {
      if (angular.isDefined(habitats) && angular.isArray(habitats) && habitats.length > 0) {
        var a = [];
        var h;
        var key;
        var id = 0;
        angular.forEach(habitats, function(hash){
          key = Object.keys(hash)[0];
          h = {
            habitat: key,
            id: 0
          };
          if (hash[key].subhabitat) {
            h.subhabitat = hash[key].subhabitat;
          }
          if (hash[key].species) {
            h.species = hash[key].species;
          }
          h.availableSpecies = Habitats.species(h.habitat, h.subhabitat);
          a.push(h);
          id++;

        }, a);
        return a;
      }
      else {
        return [];
      }
    }

    function convertHabitats(habitatsInternal) {
      var habitatsExternal = [];
      angular.forEach(habitatsInternal, function (hash) {
        var h = {};
        h[hash.habitat] = {};
        if (hash.subhabitat) {
          h[hash.habitat].subhabitat = hash.subhabitat;
        }
        if (hash.species) {
          h[hash.habitat].species = hash.species;
        }
        habitatsExternal.push(h);
      }, habitatsExternal);
      return habitatsExternal;
    }

    return {
      templateUrl: 'common/directives/characteristic/newHabitat.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { storeValue: '=', habitats: '=' },
      link: function (scope) {
        scope.habitatsInternal = loadExternalHabitats(scope.habitats);

        scope.$watch('newHabitat', function () {
          if (angular.isDefined(scope.newHabitat)) {
            var habitatInternal = {
              habitat: scope.newHabitat,
              id: scope.habitatsInternal.length,
              availableSpecies: Habitats.species(scope.newHabitat)
            };
            scope.habitatsInternal.push(habitatInternal);
            scope.habitatsExternal = convertHabitats(scope.habitatsInternal);

            scope.storeValue(scope.habitatsExternal);
            scope.editHabitat = false;
            scope.newHabitat = undefined;
          }
        });

        scope.availableHabitats = Habitats.habitats();


        scope.updateHabitat = function (id, newHabitat) {
          angular.forEach(scope.habitatsInternal, function (hash) {
            if (hash.id === id) {
              hash.habitat = newHabitat;
              hash.availableSpecies = Habitats.species(hash.habitat, hash.subhabitat);
            }
          }, scope.habitatsInternal);
          scope.habitatsExternal = convertHabitats(scope.habitatsInternal);
          scope.storeValue(scope.habitatsExternal);
        };

        scope.updateSubhabitat = function (id, newSubhabitat) {
          angular.forEach(scope.habitatsInternal, function (hash) {
            if (hash.id === id) {
              hash.subhabitat = newSubhabitat;
              hash.species = undefined;
              hash.availableSpecies = Habitats.species(hash.habitat, hash.subhabitat);
            }
          }, scope.habitatsInternal);
          scope.habitatsExternal = convertHabitats(scope.habitatsInternal);
          scope.storeValue(scope.habitatsExternal);
        };

        scope.updateSpecies = function (id, newSpecies) {
          angular.forEach(scope.habitatsInternal, function (hash) {
            if (hash.id === id) {
              hash.species = newSpecies;
            }
          }, scope.habitatsInternal);
          scope.habitatsExternal = convertHabitats(scope.habitatsInternal);
          scope.storeValue(scope.habitatsExternal);
        };

        scope.deleteHabitat = function (index) {
          scope.habitatsInternal.splice(index, 1);
          scope.habitatsExternal = convertHabitats(scope.habitatsInternal);
          scope.storeValue(scope.habitatsExternal);
        };

        scope.displaySpecies = function (species) {
          return angular.isDefined(species) ? species.join(', ') : 'select species';
        };

        scope.subhabitatsFor = function (habitat) {
          return Habitats.subhabitats(habitat);
        };
      }
    };
  });