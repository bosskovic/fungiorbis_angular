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
      .state('dashboard.references/new', {
        url: '^/dashboard/references/new',
        templateUrl: '/app/dashboard/references-show.tpl.html',
        controller: 'NewReferenceController as referenceCtrl'
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

  .controller('NewReferenceController', function ($scope, $state, References, Util) {
    var referenceCtrl = this;
    var mandatoryFields = ['title'];
    var checked = {};

    referenceCtrl.context = 'create';

    referenceCtrl.pageTitle = 'Create new reference';

    referenceCtrl.createReference = function () {
      References.save({ data: $scope.reference }).success(function (data, status, headers) {
        var a = headers('Location').split('/');
        $state.go('dashboard.references/detail', {referenceId: a[a.length - 1]});
      });
    };

    $scope.reference = {};

    referenceCtrl.fields = References.fields();

    $scope.$watch('reference', function (reference) {
      Util.cleanParams(reference);
      if (Object.keys(reference).length === 0) {
        referenceCtrl.referenceIsEmpty = true;
        referenceCtrl.missingFields = mandatoryFields;
      }
      else {
        referenceCtrl.referenceIsEmpty = false;
        referenceCtrl.missingFields = Util.arrayDifference(mandatoryFields, Object.keys(reference));

        if (reference.url && checked.url !== reference.url) {
          References.index({ url: reference.url, fields: 'fullTitle,url' })
            .then(function (response) {
              var responseReferences = response.data.references;
              if (responseReferences.length === 1) {
                referenceCtrl.urlTaken = true;
                referenceCtrl.referenceFullTitle = responseReferences.fullTitle;
                referenceCtrl.matchingUrlId = responseReferences[0].id;
              }
              else {
                referenceCtrl.urlTaken = false;
              }
              checked.url = reference.url;
              referenceCtrl.readyToSave = !referenceCtrl.isbnTaken && !referenceCtrl.urlTaken && referenceCtrl.missingFields.length === 0;
            });
        }
        else {
          referenceCtrl.readyToSave = !referenceCtrl.isbnTaken && !referenceCtrl.urlTaken && referenceCtrl.missingFields.length === 0;
        }

        if (reference.url && checked.isbn !== reference.isbn) {
          References.index({ isbn: reference.isbn, fields: 'fullTitle,isbn' })
            .then(function (response) {
              var responseReferences = response.data.references;
              if (responseReferences.length === 1) {
                referenceCtrl.isbnTaken = true;
                referenceCtrl.referenceFullTitle = responseReferences.fullTitle;
                referenceCtrl.matchingIsbnId = responseReferences[0].id;
              }
              else {
                referenceCtrl.isbnTaken = false;
              }
              checked.isbn = reference.isbn;
              referenceCtrl.readyToSave = !referenceCtrl.isbnTaken && !referenceCtrl.urlTaken && referenceCtrl.missingFields.length === 0;
            });
        }
        else {
          referenceCtrl.readyToSave = !referenceCtrl.isbnTaken && !referenceCtrl.urlTaken && referenceCtrl.missingFields.length === 0;
        }
      }

    }, true);
  })

  .controller('ReferenceController', function ($scope, referenceResponse, Species, Characteristics, $modal, characteristicComponent, References, $timeout) {
    var referenceCtrl = this;
    var reference = referenceResponse.data.references;
    var initialCharacteristic = {
      referenceId: reference.id
    };

    referenceCtrl.context = 'edit';
    referenceCtrl.pageTitle = reference.authors ? reference.authors + ' - ' : '';
    referenceCtrl.pageTitle += reference.title;


    referenceCtrl.fields = References.fields();

    $scope.reference = reference;

    $scope.updateField = function (field, value) {
      var data = {
        id: reference.id
      };
      data[field] = value;
      return References.save({
        data: data,
        url: referenceResponse.data.links.references
      }).then(function () {
      }, function (response) {
        return response.data.errors.details[0];
      });
    };

    // show characteristic component as soon as a species is selected
    $scope.$watch('speciesId', function (speciesId) {
      if (angular.isDefined(speciesId)) {
        Characteristics
          .get({ speciesId: speciesId, referenceId: reference.id})
          .success(function (data, status, headers, config) {
            $scope.characteristic = angular.isDefined(data.characteristics[0]) ? data.characteristics[0]
              : angular.copy(initialCharacteristic);

            characteristicComponent.initialize($scope.characteristic.id, $scope.characteristic, config.url);
          });
      }
    });

    // hide characteristic component if species name is manually altered
    $scope.$watch('speciesFullName', function (newValue) {
      if ($scope.speciesId && (angular.isUndefined(newValue) || newValue.length === 0)) {
        referenceCtrl.reset(true);
      }
    });

    // track changes of characteristics (only for updating existing)
    $scope.$watch('characteristic', function (newValue, oldValue) {
      if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
        $scope.dirty = characteristicComponent.trackChanges(newValue);
      }
      $scope.emptyParams = characteristicComponent.emptyParams(newValue);
    }, true);


    referenceCtrl.saveCharacteristic = function () {
      characteristicComponent
        .saveCharacteristic($scope.characteristic)
        .then(function (characteristic) {
          if (angular.isDefined($scope.characteristic.id)){
            $scope.reference.characteristics[$scope.characteristicRow.currentIndex] = characteristic;
          }
          else {
            $scope.reference.characteristics.push(characteristic);
          }

          referenceCtrl.resetCharacteristic();
          $timeout(function () {
            $scope.characteristicRow.show();
          }, 1);
          $scope.resetDialog.hide();
        });
    };

    referenceCtrl.resetCharacteristic = function () {
      referenceCtrl.reset();
      $scope.characteristic = undefined;
    };

    referenceCtrl.reset = function (keepSpeciesName) {
      $scope.dirty = false;
      $scope.emptyParams = false;
      $scope.speciesId = undefined;
      if (angular.isUndefined(keepSpeciesName)) {
        $scope.speciesFullName = undefined;
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
        return $scope.reference.fullTitle;
      },
      subtitle: function () {
        if (angular.isDefined($scope.speciesFullName)) {
          return $scope.speciesFullName;
        }
        else if (angular.isDefined($scope.characteristic)) {
          return $scope.characteristic.species.fullName;
        }
      },
      hide: function () {
        this.modal.hide();
      },
      show: function () {
        this.modal.show();
      },
      save: function () {
        referenceCtrl.saveCharacteristic();
      },
      reset: function () {
        referenceCtrl.reset();
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
        return $scope.reference.fullTitle;
      },
      subtitle: function () {
        if (angular.isDefined($scope.characteristic) && angular.isDefined($scope.characteristic.species)) {
          return $scope.characteristic.species.fullName;
        }
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
            References.show($scope.reference.id).success(function (data) {
              deleteDialogContext.hide();
              referenceCtrl.reset();
              $scope.characteristic = undefined;
              $scope.reference.characteristics = data.references.characteristics;
            });
          });
      }
    };

    referenceCtrl.typeAheadProperties = {
      icon: 'species',
      key: 'fullName',
      placeholder: 'To add or edit characteristic type in the species name',
      getData: function (val) {
        return Species.index({ filterTarget: 'name,genus', fields: 'id,fullName', filterValue: val})
          .then(function (response) {
            return response.data.species;
          });
      }
    };
  });