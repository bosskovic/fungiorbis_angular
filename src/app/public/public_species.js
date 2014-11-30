'use strict';

angular.module('public.species', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('species', {
        url: '^/species',
        templateUrl: '/app/public/species-index.tpl.html',
        controller: 'PublicSpeciesController as speciesCtrl',
        resolve: {
          statsResponse: function (Species) {
            return Species.stats('species');
          },
          preloadHabitats: function (Habitats) {
            return Habitats.load();
          },
          preloadSubstrates: function (Substrates) {
            return Substrates.load();
          }
        }
      })
      .state('species/detail', {
        url: '^/species/:speciesId',
        templateUrl: '/app/public/species-show.tpl.html',
        controller: 'ASpeciesController as speciesCtrl',
        resolve: {
//          speciesResponse: function (Species, $stateParams) {
//            return Species.show($stateParams.speciesId);
//          },
//          preloadHabitats: function (Habitats) {
//            return Habitats.load();
//          },
//          preloadSubstrates: function (Substrates) {
//            return Substrates.load();
//          }
        }
      });
  })

  .controller('PublicSpeciesController', function ($scope, $state, Species, Characteristics, Habitats, Substrates, statsResponse) {
    var that = this;

    $scope.searchParams = {};

    $scope.appendHabitats = function (habitats) {
      $scope.searchParams.habitats = habitats;
    };

    $scope.stats = statsResponse.data.stats;

    $scope.$watch('searchParams', function (newValue, oldValue) {
      if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
        var params;
        $scope.displayParams = [];

        if (angular.isDefined(newValue.systematics)) {
          params = params || {};
          params[newValue.systematicsCategory] = newValue.systematics;
          $scope.displayParams.push(newValue.systematics);
        }

        if (params) {
          params.include = 'characteristics';
          Species.index(params)
            .then(function (response) {
console.log(response.data.species);
              $scope.species = response.data.species;
              $scope.characteristics = {};
              $scope.species.forEach(function (sp) {
                $scope.characteristics[sp.id] = $scope.displayCharacteristics(sp);
              });

            });
        }

        $scope.displayParams = $scope.displayParams.join('; ');
      }
    }, true);

    $scope.displayCharacteristics = function (species) {
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

    $scope.nutritiveGroups = Species.nutritiveGroupsHash();

    $scope.reset = function () {
      $scope.species = undefined;
      $scope.searchParams = {
        systematicsCategory: 'genus',
        habitats: [],
        substrates: []
      };
      $scope.resetUsabilities();
    };

    $scope.translateUsability = Characteristics.translateUsability;
  })

  .controller('ASpeciesController', function ($scope, $timeout, $state, $modal, $filter, speciesResponse, characteristicComponent, Characteristics, Species, References) {

  })
;