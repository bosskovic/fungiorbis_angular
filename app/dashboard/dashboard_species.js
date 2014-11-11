'use strict';

angular.module('dashboard.species', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.species', {
        url: '^/dashboard/species',
        templateUrl: '/app/dashboard/species-index.tpl.html',
        controller: 'SpeciesController as speciesCtrl',
        resolve: {
          speciesResponse: function (Species) {
            return Species.index();
          }
        }
      })
      .state('dashboard.species/new', {
        url: '^/dashboard/species/new',
        templateUrl: '/app/dashboard/species-show.tpl.html',
        controller: 'NewSpeciesController as speciesCtrl'
      })
      .state('dashboard.species/detail', {
        url: '^/dashboard/species/:speciesId',
        templateUrl: '/app/dashboard/species-show.tpl.html',
        controller: 'ASpeciesController as speciesCtrl',
        resolve: {
          speciesResponse: function (Species, $stateParams) {
            return Species.show($stateParams.speciesId);
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

  .controller('SpeciesController', function ($scope, $state, speciesResponse, Species) {
    var that = this;
    var species = speciesResponse.data.species;
    var meta = speciesResponse.data.meta;

    this.tableParams = {
      prefix: 'species',
      data: species,
      columns: Species.fields(),
      meta: meta.species,
      sort: 'fullName',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        Species.index(attrs).success(function (data) {
          that.tableParams.meta = data.meta.species;
          that.tableParams.data = data.species;
        });
      }
    };
  })

  .controller('NewSpeciesController', function ($scope, $filter, Species, Util, $state) {
    var speciesCtrl = this;
    var mandatoryFields = [];
    var checked = {};

    speciesCtrl.context = 'create';

    speciesCtrl.pageTitle = 'Create new species';

    speciesCtrl.createSpecies = function () {
      Species.save({ data: $scope.species }).success(function (data, status, headers) {
        var a = headers('Location').split('/');
        $state.go('dashboard.species/detail', {speciesId: a[a.length - 1]});
      });
    };

    $scope.species = {};
    $scope.systematics = Species.systematics();
    $scope.growthTypes = Species.growthTypes();
    $scope.nutritiveGroups = Species.nutritiveGroups();

    $scope.showGrowthType = function () {
      var selected = $filter('filter')($scope.growthTypes, {value: $scope.species.growthType});
      return ($scope.species.growthType && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showNutritiveGroup = function () {
      var selected = $filter('filter')($scope.nutritiveGroups, {value: $scope.species.nutritiveGroup});
      return ($scope.species.nutritiveGroup && selected.length) ? selected[0].text : 'Not set';
    };

    angular.forEach($scope.systematics, function (field) {
      mandatoryFields.push(field.field);
    });
    $scope.$watch('species', function (species) {
      Util.cleanParams(species);
      if (Object.keys(species).length === 0) {
        speciesCtrl.speciesIsEmpty = true;
        speciesCtrl.missingFields = mandatoryFields;
      }
      else {
        speciesCtrl.speciesIsEmpty = false;
        speciesCtrl.missingFields = Util.arrayDifference(mandatoryFields, Object.keys(species));
        if (species.name && species.genus && (checked.name !== species.name || checked.genus !== species.genus)) {
          Species.index({ name: species.name, genus: species.genus, fields: 'name,genus' })
            .then(function (response) {
              var responseSpecies = response.data.species;
              if (responseSpecies.length === 1) {
                speciesCtrl.nameGenusTaken = true;
                speciesCtrl.speciesFullName = species.genus + ' ' + species.name;
                speciesCtrl.matchingSpeciesId = responseSpecies[0].id;
              }
              else {
                speciesCtrl.nameGenusTaken = false;
              }
              checked.name = species.name;
              checked.genus = species.genus;
              speciesCtrl.readyToSave = !speciesCtrl.nameGenusTaken && speciesCtrl.missingFields.length === 0;
            });
        }
        else {
          speciesCtrl.readyToSave = !speciesCtrl.nameGenusTaken && speciesCtrl.missingFields.length === 0;
        }
      }
    }, true);
  })

  .controller('ASpeciesController', function ($scope, speciesResponse, $filter, Characteristics, characteristicComponent, $modal, Species, References, $timeout) {
    var speciesCtrl = this;
    var species = speciesResponse.data.species;

    speciesCtrl.context = 'edit';

    speciesCtrl.pageTitle = species.genus + ' ' + species.name;

    $scope.species = species;
    $scope.systematics = Species.systematics();
    $scope.growthTypes = Species.growthTypes();
    $scope.nutritiveGroups = Species.nutritiveGroups();

    $scope.showGrowthType = function () {
      var selected = $filter('filter')($scope.growthTypes, {value: $scope.species.growthType});
      return ($scope.species.growthType && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showNutritiveGroup = function () {
      var selected = $filter('filter')($scope.nutritiveGroups, {value: $scope.species.nutritiveGroup});
      return ($scope.species.nutritiveGroup && selected.length) ? selected[0].text : 'Not set';
    };

    speciesCtrl.updateField = function (field, value) {
      var data = {
        id: species.id
      };
      data[field] = value;
      return Species.save({
        data: data,
        url: speciesResponse.data.links.species
      }).then(function () {
      }, function (response) {
        return response.data.errors.details[0];
      });
    };

    // show characteristic component as soon as a reference is selected
    $scope.$watch('referenceId', function (referenceId) {
      if (angular.isDefined(referenceId)) {
        Characteristics
          .get({ speciesId: species.id, referenceId: referenceId})
          .success(function (data, status, headers, config) {
            $scope.characteristic = angular.isDefined(data.characteristics[0]) ? data.characteristics[0]
              : { referenceId: referenceId, speciesId: species.id};

            characteristicComponent.initialize($scope.characteristic.id, $scope.characteristic, config.url);
          });
      }
    });

    // hide characteristic component if reference name is manually altered
    $scope.$watch('referenceFullTitle', function (newValue) {
      if ($scope.referenceId && (angular.isUndefined(newValue) || newValue.length === 0)) {
        speciesCtrl.reset(true);
      }
    });

    // track changes of characteristics (only for updating existing)
    $scope.$watch('characteristic', function (newValue, oldValue) {
      if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
        $scope.dirty = characteristicComponent.trackChanges(newValue);
      }
      $scope.emptyParams = characteristicComponent.emptyParams(newValue);
    }, true);


    $scope.missingCharacteristics = characteristicComponent.missingCharacteristics(species.characteristics);


    speciesCtrl.saveCharacteristic = function () {
      characteristicComponent
        .saveCharacteristic($scope.characteristic)
        .then(function (characteristic) {
          if (angular.isDefined($scope.characteristic.id)){
            $scope.species.characteristics[$scope.characteristicRow.currentIndex] = characteristic;
          }
          else {
            $scope.species.characteristics.push(characteristic);
          }

          $scope.missingCharacteristics = characteristicComponent.missingCharacteristics($scope.species.characteristics);
          speciesCtrl.resetCharacteristic();
          $timeout(function () {
            $scope.characteristicRow.show();
          }, 1);
          $scope.resetDialog.hide();
        });
    };

    speciesCtrl.resetCharacteristic = function () {
      speciesCtrl.reset();
      $scope.characteristic = undefined;
    };

    speciesCtrl.reset = function (keepSpeciesName) {
      $scope.dirty = false;
      $scope.emptyParams = false;
      $scope.referenceId = undefined;
      if (angular.isUndefined(keepSpeciesName)) {
        $scope.referenceFullTitle = undefined;
      }
      characteristicComponent.reset($scope.characteristic);
    };

    $scope.resetDialog = {
      modal: $modal({
        scope: $scope,
        template: 'common/templates/modal-reset.tpl.html',
        show: false
      }),
      title: function () {
        if (angular.isDefined($scope.referenceFullTitle)) {
          return $scope.referenceFullTitle;
        }
        else if (angular.isDefined($scope.characteristic) && angular.isDefined($scope.characteristic.reference)) {
          return $scope.characteristic.reference.fullTitle;
        }
      },
      subtitle: function () {
        return $scope.species.fullName;
      },
      hide: function () {
        this.modal.hide();
      },
      show: function () {
        this.modal.show();
      },
      save: function () {
        speciesCtrl.saveCharacteristic();
        this.modal.hide();
      },
      reset: function () {
        speciesCtrl.reset();
        $scope.characteristic = undefined;
        this.modal.hide();
        $timeout(function () {
          $scope.characteristicRow.show();
        }, 1);
      },
      close: function () {
        this.hide();
      }
    };

    $scope.deleteDialog = {
      modal: $modal({
        scope: $scope,
        template: 'common/templates/modal-delete.tpl.html',
        show: false
      }),
      title: function () {
        if (angular.isDefined($scope.characteristic) && angular.isDefined($scope.characteristic.reference)) {
          return $scope.characteristic.reference.fullTitle;
        }
      },
      subtitle: function () {
        return $scope.species.fullName;
      },
      hide: function () {
        this.modal.hide();
      },
      show: function () {
        this.modal.show();
      },
      destroy: function () {
        var deleteDialogContext = this;
        Characteristics
          .httpDelete(characteristicComponent.getAttrs($scope.characteristic))
          .success(function () {
            Species.show($scope.species.id).success(function (data) {
              deleteDialogContext.hide();
              speciesCtrl.reset();
              $scope.characteristic = undefined;
              $scope.missingCharacteristics = characteristicComponent.missingCharacteristics(species.characteristics);
              $scope.species.characteristics = data.species.characteristics;
            });
          });
      }
    };

    $scope.deleteSpeciesDialog = $modal({
      scope: $scope,
      template: 'common/templates/modal-delete-species.tpl.html',
      show: false,
//      controllerAs: 'ctrl',
      controller: function () {
        console.log(this);
//        this.species = 1;
        this.destroy = function () {
          console.log('!');
          console.log($scope.speciesId);
//          Species.delete({ url: speciesResponse.data.links.species, data: {id: species.id }});
        };
      }
    });


    speciesCtrl.typeAheadProperties = {
      icon: 'references',
      key: 'fullTitle',
      placeholder: 'To add or edit characteristic type in the reference title or author name',
      getData: function (val) {
        return References.index({ filterTarget: 'authors,title', fields: 'id,fullTitle', filterValue: val})
          .then(function (response) {
            return response.data.references;
          });
      }
    };
  });