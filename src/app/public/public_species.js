'use strict';

angular.module('public.species', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('species', {
        url: '^/species',
        templateUrl: '/app/public/public_species.tpl.html',
        controller: 'PublicSpeciesController as speciesCtrl',
        resolve: {
          referencesResponse: function (References) {
            return References.index();
          },
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
      });
  })


  .controller('PublicSpeciesController', function ($scope, $state, Species, Characteristics, Habitats, Substrates, statsResponse, referencesResponse, SERVER_BASE_URL) {
    var that = this;

    $scope.searchParams = {};

    $scope.appendHabitats = function (habitats) {
      $scope.searchParams.habitats = habitats;
    };

    $scope.references = {};
    referencesResponse.data.references.forEach(function (reference, index) {
      $scope.references[reference.id] = reference;
      $scope.references[reference.id].display = '';
      if ($scope.references[reference.id].isbn) {
        if ($scope.references[reference.id].authors) {
          $scope.references[reference.id].display += $scope.references[reference.id].authors + ', ';
        }
        $scope.references[reference.id].display += $scope.references[reference.id].title;
      }
      else {
        $scope.references[reference.id].display += $scope.references[reference.id].url;
      }
    });

    $scope.stats = statsResponse.data.stats;

    $scope.$watch('searchParams', function (newValue, oldValue) {
      if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
        var params;
        $scope.displayParams = [];
        $scope.selectedSpecies = undefined;

        if (angular.isDefined(newValue.systematics) && newValue.systematics.length > 0) {
          params = params || {};
          params[newValue.systematicsCategory] = newValue.systematics;
          $scope.displayParams.push(newValue.systematics);
        }

        if (angular.isDefined(newValue.habitats) && newValue.habitats.length > 0) {
          params = params || {};
          params.habitats = '';
          newValue.habitats.forEach(function (habitat) {
            $scope.displayParams.push(Habitats.toString(habitat, 'localized'));
            params.habitats += Habitats.toString(habitat) + ',';
          });
        }

        if (angular.isDefined(newValue.substrates) && newValue.substrates.length > 0) {
          params = params || {};
          params.substrates = newValue.substrates.join(',');
          $scope.displayParams.push(newValue.substrates.join(', '));
        }

        if (angular.isDefined(newValue.nutritiveGroup) && newValue.nutritiveGroup.length > 0) {
          params = params || {};
          params.nutritiveGroup = newValue.nutritiveGroup;
          $scope.displayParams.push(newValue.nutritiveGroup);
        }

        if (angular.isArray(newValue.usabilities) && newValue.usabilities.length > 0) {
          params = params || {};
          newValue.usabilities.forEach(function (u) {
            params['characteristics.' + u] = true;
            $scope.displayParams.push(Characteristics.translateUsability(u));
          });
        }

        if (params) {
          params.include = 'characteristics';
          Species.index(params)
            .then(function (response) {
              $scope.species = response.data.species;
              $scope.characteristics = {};
              $scope.species.forEach(function (sp) {
                $scope.characteristics[sp.id] = $scope.displayCharacteristics(sp);
              });

              $scope.totalHits = response.data.meta.species.count + ' pogodaka';
            });
        }
        else {
          $scope.species = undefined;
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
        substrates: [],
        usabilities: []
      };
      $scope.resetUsabilities();
    };

    $scope.translateUsability = Characteristics.translateUsability;

    $scope.selectSpecies = function (sp) {
      $scope.selectedSpecies = sp;
      if (angular.isDefined(sp.image)) {
        $scope.selectedSpecies.imageUrl = SERVER_BASE_URL + sp.image;
      }
      $scope.selectedSpecies.references = {};
      $scope.selectedSpecies.characteristics.forEach(function (c, index) {
        $scope.selectedSpecies.references[c.links.reference] = {
          index: index+1,
          value: $scope.references[c.links.reference]
        };
      });
    };

    $scope.systematics = function (sp) {
      return [sp.familia, sp.ordo , sp.subclassis , sp.classis , sp.subphylum , sp.phylum].join(', ');
    };

    $scope.localizedHabitat = function (habitat) {
      return Habitats.toString(habitat, 'localized');
    };

    $scope.localizedSubstrate = function (substrate) {
      return Substrates.translateSubstrate(substrate);
    };
  });