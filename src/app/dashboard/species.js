'use strict';

angular.module('dashboard.species', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.species', {
        url: '^/dashboard/species',
        templateUrl: '/app/dashboard/species-index.tpl.html',
        controller: 'SpeciesController as speciesCtrl',
        resolve: {
          species: function (Species) {
            return Species.$collection().$fetch().$asPromise().then(function (species) {
              return species;
            });
          }
        }
      })
      .state('dashboard.species/detail', {
        url: '^/dashboard/species/:speciesId',
        templateUrl: '/app/dashboard/species-show.tpl.html',
        controller: 'ASpeciesController as speciesCtrl',
        resolve: {
          species: function (Species, $stateParams) {
            return Species.$find($stateParams.speciesId).$asPromise().then(function (species) {
              return species;
            });
          }
        }
      });
  })

  .controller('SpeciesController', function ($scope, $state, species) {
    var that = this;

    this.tableParams = {
      prefix: 'species',
      data: species,
      columns: [
        { header: 'Species name', field: 'fullName' },
        { header: 'Family', field: 'familia' },
        { header: 'Order', field: 'ordo' },
        { header: 'Phylum', field: 'phylum' }
      ],
      meta: species.$metadata.species,
      sort: 'fullName',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        species.$refresh(attrs).$asPromise().then(function (sp) {
          that.tableParams.meta = sp.$metadata.species;
        });
      }
    };
  })

  .controller('ASpeciesController', function ($scope, species, $filter) {
    $scope.species = species;

    $scope.systematics = [
      { label: 'Name', field: 'name' },
      { label: 'Genus', field: 'genus' },
      { label: 'Familia', field: 'familia' },
      { label: 'Ordo', field: 'ordo' },
      { label: 'Subclassis', field: 'subclassis' },
      { label: 'Classis', field: 'classis' },
      { label: 'Subphylum', field: 'subphylum' },
      { label: 'Phylum', field: 'phylum' }
    ];

    $scope.growthTypes = [
      { value: 'single', text: 'Single' },
      { value: 'group', text: 'Group' }
    ];

    $scope.showGrowthType = function() {
      var selected = $filter('filter')($scope.growthTypes, {value: $scope.species.growthType});
      return ($scope.species.growthType && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.nutritiveGroups = [
      { value: 'parasitic', text: 'Parasitic' },
      { value: 'mycorrhizal', text: 'Mycorrhizal' },
      { value: 'saprotrophic', text: 'Saprotrophic' },
      { value: 'parasitic-saprotrophic', text: 'Parasitic-saprotrophic' },
      { value: 'saprotrophic-parasitic', text: 'Saprotrophic-parasitic' }
    ];

    $scope.showNutritiveGroup = function() {
      var selected = $filter('filter')($scope.nutritiveGroups, {value: $scope.species.nutritiveGroup});
      return ($scope.species.nutritiveGroup && selected.length) ? selected[0].text : 'Not set';
    };
  });