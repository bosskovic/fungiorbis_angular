'use strict';

angular.module('dashboard.references', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.references', {
        url: '^/dashboard/references',
        templateUrl: '/app/dashboard/references-index.tpl.html',
        controller: 'ReferencesController as referencesCtrl',
        resolve: {
          referencesResponse: function (References) {
            return References.index();
          }
        }
      })
      .state('dashboard.references/detail', {
        url: '^/dashboard/references/:referenceId',
        templateUrl: '/app/dashboard/references-show.tpl.html',
        controller: 'ReferenceController as referenceCtrl',
        resolve: {
          referenceResponse: function (References, $stateParams) {
            return References.show($stateParams.referenceId);
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

  .controller('ReferencesController', function ($scope, $state, referencesResponse, References) {
    var that = this;
    var references = referencesResponse.data.references;
    var meta = referencesResponse.data.meta;

    this.tableParams = {
      prefix: 'references',
      data: references,
      columns: References.fields(),
      meta: meta.references,
      sort: 'authors',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        References.index(attrs).success(function (data) {
          that.tableParams.meta = data.meta.references;
          that.tableParams.data = data.references;
        });
      }
    };
  })

  .controller('ReferenceController', function ($scope, referenceResponse, Species, Characteristics, $modal, characteristicComponent, References) {
    var reference = referenceResponse.data.references;
    $scope.reference = reference;

    $scope.$watch('referenceDirty', function () {

    });

    this.fields = References.fields();

    var initialCharacteristic = {
      referenceId: reference.id
    };

    var that = this;

    // show characteristic component as soon as a species is selected
    $scope.$watch('speciesId', function (speciesId) {
      if (angular.isDefined(speciesId)) {
        Characteristics.get({ speciesId: speciesId, referenceId: reference.id}).success(function (data, status, headers, config) {
          $scope.characteristic = angular.isDefined(data.characteristics[0]) ? data.characteristics[0]
            : angular.copy(initialCharacteristic);

          characteristicComponent.initialize($scope.characteristic.id, $scope.characteristic, config.url);
        });
      }
    });


    // hide characteristic component if species name is manually altered
    $scope.$watch('speciesFullName', function (newValue) {
      if ($scope.speciesId && (angular.isUndefined(newValue) || newValue.length === 0)) {
        that.reset(true);
      }
    });

    // track changes of characteristics (only for updating existing)
    $scope.$watch('characteristic', function (newValue, oldValue) {
      if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
        $scope.dirty = characteristicComponent.trackChanges(newValue);
      }
      $scope.emptyParams = characteristicComponent.emptyParams(newValue);
    }, true);

    this.saveCharacteristic = function () {
      Characteristics.save(characteristicComponent.getAttrs($scope.characteristic))
        .success(function () {
          that.reset();
          References.show($scope.reference.id).success(function (data) {
            $scope.reference.characteristics = data.references.characteristics;
          });
        });
    };

    this.reset = function (keepSpeciesName) {
      $scope.dirty = false;
      $scope.emptyParams = false;
      $scope.speciesId = undefined;
      if (angular.isUndefined(keepSpeciesName)) {
        $scope.speciesFullName = undefined;
      }
      characteristicComponent.reset($scope.characteristic);
      $scope.characteristic = undefined;
    };

    var pendingIndex;

    this.showCharacteristicRow = function (index) {
      if (!characteristicComponent.emptyParams($scope.characteristic) && characteristicComponent.isDirty($scope.characteristic)) {
        pendingIndex = index;
        that.referencesModal.show();
      }
      else {
        pendingIndex = undefined;
        that.reset();
        $scope.characteristic = angular.copy($scope.reference.characteristics[index]);
        characteristicComponent.initialize($scope.characteristic.id, $scope.characteristic);
      }
    };

    this.hideCharacteristicRow = function (index) {
      if (!characteristicComponent.emptyParams($scope.characteristic) && characteristicComponent.isDirty($scope.characteristic)) {
        pendingIndex = index;
        that.referencesModal.show();
      }
      else {
        pendingIndex = undefined;
        that.reset();
      }
    };

    this.characteristicRowActive = function (id) {
      return $scope.speciesId === undefined && $scope.characteristic && $scope.characteristic.id === id;
    };

    this.referencesModalDelete = $modal({
      scope: $scope,
      template: 'app/dashboard/references-modal-delete.tpl.html',
      show: false
    });

    this.referencesModal = $modal({
      scope: $scope,
      template: 'app/dashboard/references-modal-save.tpl.html',
      show: false
    });

    $scope.modalSave = function () {
      that.saveCharacteristic();
      that.referencesModal.hide();
      if (angular.isDefined(pendingIndex)) {
        that.showCharacteristicRow(pendingIndex);
      }
    };

    $scope.modalReset = function () {
      that.reset();
      that.referencesModal.hide();
      if (angular.isDefined(pendingIndex)) {
        that.showCharacteristicRow(pendingIndex);
      }
    };

    $scope.modalClose = function () {
      that.referencesModal.hide();
      pendingIndex = undefined;
    };

    $scope.modalDelete = function () {
      Characteristics.httpDelete(characteristicComponent.getAttrs($scope.characteristic))
        .success(function () {
          that.reset();
          References.show($scope.reference.id).success(function (data) {
            $scope.reference.characteristics = data.references.characteristics;
            that.referencesModalDelete.hide();
          });
        });
    };
  });