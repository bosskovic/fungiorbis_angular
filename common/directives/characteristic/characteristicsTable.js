'use strict';

angular.module('directives.characteristicsTable', [])

  .directive('foCharacteristicsTable', function (characteristicComponent) {

    return {
      templateUrl: 'common/directives/characteristic/characteristicsTable.tpl.html',
      restrict: 'E',
      replace: true,
      scope: { parent: '@', characteristic: '=', characteristics: '=', characteristicRow: '=', deleteDialog: '=', resetDialog: '=', saveCharacteristic: '=', reset: '=', parentId: '='},
      link: function (scope) {
        scope.isDirty = function () {
          return characteristicComponent.isDirty(scope.characteristic);
        };

        if (scope.parent === 'species') {
          scope.parentColumnTitle = 'Species';
          scope.parentValue = function (hash) {
            return hash.species.fullName;
          };
        }
        else if (scope.parent === 'references') {
          scope.parentColumnTitle = 'References';
          scope.parentValue = function (hash) {
            return hash.reference.fullTitle;
          };
        }

        scope.resetCharacteristic = function(){
          scope.reset();
          scope.characteristic = undefined;
        };

        scope.characteristicRow = {
          show: function (index) {
            index = angular.isDefined(index) ? index : this.pendingIndex;
            this.currentIndex = index;
            if (angular.isDefined(index)) {
              if (scope.isDirty()) {
                this.pendingIndex = index;
                scope.resetDialog.show();
              }
              else {
                scope.reset();
                scope.characteristic = angular.copy(scope.characteristics[index]);
                characteristicComponent.initialize(scope.characteristic.id, scope.characteristic);
                this.pendingIndex = undefined;
              }
            }
          },
          hide: function (index) {
            if (scope.isDirty()) {
              scope.resetDialog.show(index);
            }
            else {
              this.pendingIndex = undefined;
              scope.reset();
              scope.characteristic = undefined;
            }
          },
          isActive: function (id) {
            return scope.parentId === undefined && scope.characteristic && scope.characteristic.id === id;
          },
          pendingIndex: undefined,
          currentIndex: undefined
        };
      }
    };
  });