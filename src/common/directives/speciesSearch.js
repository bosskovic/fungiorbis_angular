'use strict';

angular.module('directives.speciesSearch', [])

  .directive('foSpeciesSearch', function (Habitats, Substrates, Characteristics, Species) {
    return {
      templateUrl: 'common/directives/speciesSearch.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { result: '=', reset: '=' },
      link: function (scope) {
        scope.result = {};
        scope.searchParams = {};

        scope.appendHabitats = function (habitats) {
          scope.searchParams.habitats = habitats;
        };

        scope.$watch('searchParams', function (newValue, oldValue) {
          if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
            var params;
            var displayParams = [];
            scope.result.searchExecuted = true;

            if (angular.isDefined(newValue.systematics) && newValue.systematics.length > 0) {
              params = params || {};
              params[newValue.systematicsCategory] = newValue.systematics;
              displayParams.push(newValue.systematics);
            }

            if (angular.isDefined(newValue.habitats) && newValue.habitats.length > 0) {
              params = params || {};
              params.habitats = '';
              newValue.habitats.forEach(function (habitat) {
                displayParams.push(Habitats.toString(habitat, 'localized'));
                params.habitats += Habitats.toString(habitat) + ',';
              });
            }

            if (angular.isDefined(newValue.substrates) && newValue.substrates.length > 0) {
              params = params || {};
              params.substrates = newValue.substrates.join(',');

              var ss = [];
              newValue.substrates.forEach(function(s){
                ss.push(Substrates.translateSubstrate(s));
              });
              displayParams.push(ss.join(', '));
            }

            if (angular.isDefined(newValue.nutritiveGroup) && newValue.nutritiveGroup.length > 0) {
              params = params || {};
              params.nutritiveGroup = newValue.nutritiveGroup;
              displayParams.push(newValue.nutritiveGroup);
            }

            if (angular.isArray(newValue.usabilities) && newValue.usabilities.length > 0) {
              params = params || {};
              newValue.usabilities.forEach(function (u) {
                params['characteristics.' + u] = true;
                displayParams.push(Characteristics.translateUsability(u));
              });
            }

            if (params) {
              params.include = 'characteristics';

              Species.index(params)
                .then(function (response) {
                  scope.result.species = response.data.species;
                  scope.result.characteristics = {};
                  scope.result.species.forEach(function (sp) {
                    scope.result.characteristics[sp.id] = scope.displayCharacteristics(sp);
                  });

                  scope.result.totalHits = response.data.meta.species.count + ' pogodaka';
                });
            }
            else {
              scope.result.species = undefined;
            }

            scope.result.displayParams = displayParams.join('; ');
          }
        }, true);

        scope.displayCharacteristics = function (species) {
          var result = {
            usabilities: [],
            habitats: [],
            substrates: [],
            nutritiveGroup: 'nutritivna grupa: ' + species.nutritiveGroup,
            growthType: species.growthType === null ? undefined : 'način rasta: ' + species.growthType,
            sections: {}
          };

          if (angular.isDefined(species)) {
            species.characteristics.forEach(function (c) {
              Characteristics.usabilitiesArray().forEach(function (usability) {
                if (c[usability]) {
                  result.usabilities.push(usability);
                }
              });

              if (angular.isArray(c.habitats) && c.habitats.length > 0) {
                c.habitats.forEach(function (h) {
                  var key = Object.keys(h)[0];
                  var title, hSpecies;
                  if (angular.isDefined(h[key].subhabitat)) {
                    title = Habitats.translateSubhabitat(key, h[key].subhabitat);
                  }
                  else {
                    title = Habitats.translateHabitat(key);
                  }
                  if (angular.isArray(h[key].species)) {
                    hSpecies = h[key].species.join(', ');
                  }
                  result.habitats.push({ key: key, title: title, species: hSpecies});
                });
              }

              if (angular.isArray(c.substrates) && c.substrates.length > 0) {
                c.substrates.forEach(function (s) {
                  result.substrates.push({ key: s, title: Substrates.translateSubstrate(s)});
                });
              }

              ['fruitingBody', 'microscopy', 'flesh', 'chemistry', 'notes'].forEach(function (section) {
                if (c[section] && c[section].sr.length > 0) {
                  result.sections[section] = {
                    key: section,
                    title: Characteristics.translateSection(section),
                    content: c[section].sr
                  };
                }
              });

            });
          }

          return result;
        };

        scope.nutritiveGroups = Species.nutritiveGroupsHash();


        scope.reset = function () {
          scope.result.species = undefined;
          scope.searchParams = {
            systematicsCategory: 'genus',
            habitats: [],
            substrates: [],
            usabilities: []
          };
          scope.resetUsabilities();
        };

      }
    };
  });