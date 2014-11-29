'use strict';

angular.module('public.species', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('species', {
        url: '^/species',
        templateUrl: '/app/public/species-index.tpl.html',
        controller: 'PublicSpeciesController as speciesCtrl'
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

  .controller('PublicSpeciesController', function ($scope, $state, Species) {
    var that = this;

  })

  .controller('ASpeciesController', function ($scope, $timeout, $state, $modal, $filter, speciesResponse, characteristicComponent, Characteristics, Species, References) {

  })
;