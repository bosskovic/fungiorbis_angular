'use strict';

angular.module('dashboard.references', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.references', {
        url: '^/dashboard/references',
        templateUrl: '/app/dashboard/references-index.tpl.html',
        controller: 'ReferencesController as referencesCtrl',
        resolve: {
          references: function (References) {
            return References.$collection().$fetch().$asPromise().then(function (references) {
              return references;
            });
          }
        }
      })
      .state('dashboard.references/detail', {
        url: '^/dashboard/references/:referenceId',
        templateUrl: '/app/dashboard/references-show.tpl.html',
        controller: 'ReferenceController as referenceCtrl',
        resolve: {
          species: function (References, $stateParams) {
            return References.$find($stateParams.referenceId).$asPromise().then(function (reference) {
              return reference;
            });
          }
        }
      });
  })

  .controller('ReferencesController', function ($scope, $state, ICONS, references) {
    $scope.icon = ICONS;
    var that = this;

    this.tableParams = {
      prefix: 'references',
      data: references,
      columns: [
        { header: 'Authors', field: 'authors' },
        { header: 'Title', field: 'title' },
        { header: 'ISBN', field: 'isbn' },
        { header: 'URL', field: 'url' }
      ],
      meta: references.$metadata.references,
      sort: 'authors',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        references.$refresh(attrs).$asPromise().then(function (sp) {
          that.tableParams.meta = sp.$metadata.references;
        });
      }
    };
  })

  .controller('ReferenceController', function ($scope, ICONS, reference, $filter) {
    $scope.icon = ICONS;
//    $scope.species = species;
//
//    $scope.systematics = [
//      { label: 'Name', field: 'name' },
//      { label: 'Genus', field: 'genus' },
//      { label: 'Familia', field: 'familia' },
//      { label: 'Ordo', field: 'ordo' },
//      { label: 'Subclassis', field: 'subclassis' },
//      { label: 'Classis', field: 'classis' },
//      { label: 'Subphylum', field: 'subphylum' },
//      { label: 'Phylum', field: 'phylum' }
//    ];
//
//    $scope.growthTypes = [
//      { value: 'single', text: 'Single' },
//      { value: 'group', text: 'Group' }
//    ];
//
//    $scope.showGrowthType = function() {
//      var selected = $filter('filter')($scope.growthTypes, {value: $scope.species.growthType});
//      return ($scope.species.growthType && selected.length) ? selected[0].text : 'Not set';
//    };
//
//    $scope.nutritiveGroups = [
//      { value: 'parasitic', text: 'Parasitic' },
//      { value: 'mycorrhizal', text: 'Mycorrhizal' },
//      { value: 'saprotrophic', text: 'Saprotrophic' },
//      { value: 'parasitic-saprotrophic', text: 'Parasitic-saprotrophic' },
//      { value: 'saprotrophic-parasitic', text: 'Saprotrophic-parasitic' }
//    ];
//
//    $scope.showNutritiveGroup = function() {
//      var selected = $filter('filter')($scope.nutritiveGroups, {value: $scope.species.nutritiveGroup});
//      return ($scope.species.nutritiveGroup && selected.length) ? selected[0].text : 'Not set';
//    };
  });