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

    $scope.references = {};

    referencesResponse.data.references.forEach(function (reference) {
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


    $scope.translateUsability = Characteristics.translateUsability;

    $scope.$watch('result', function (newValue, oldValue) {
      if (angular.isDefined(newValue) && newValue.searchExecuted){
        $scope.selectedSpecies = undefined;
      }
    }, true);

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

      $scope.result = {};
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