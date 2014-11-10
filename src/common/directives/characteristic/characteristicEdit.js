'use strict';

angular.module('directives.characteristicEdit', [])

  .directive('foCharacteristicEdit', function (characteristicComponent) {

    return {
      templateUrl: 'common/directives/characteristic/characteristicEdit.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { characteristic: '=' },
      link: function (scope) {
        scope.$watch('characteristic', function () {
          scope.firstActive = true;
          scope.translationMissing = characteristicComponent.translationMissing(scope.characteristic);
        }, true);

        scope.appendHabitats = function (habitats) {
          scope.characteristic.habitats = habitats;
        };

        scope.section = {
          usability: {
            title: 'Usability',
            helpText: 'Select one or more values. Optional.'
          },
          habitats: {
            title: 'Habitats',
            helpText: null
          },
          substrates: {
            title: 'Substrates',
            helpText: 'Press and hold CTRL to select multiple.'
          },
          description: {
            title: 'Description',
            helpText: null
          }
        };
      }
    };
  })

  .factory('characteristicComponent', function (Characteristics, FoI18n, Util) {

    var dirty = {},
      original = {},
      url = {},
      speciesId = {};

    var undefinedOrNull = Util.undefinedOrNull;

    function initialize(characteristicId, characteristic, _url) {
      if (angular.isUndefined(characteristicId)) {
        characteristicId = 'new';
      }
      dirty[characteristicId] = [];
      if (angular.isDefined(characteristic)) {
        original[characteristicId] = angular.copy(characteristic);
        if (angular.isDefined(characteristic.species)) {
          // reference.characteristics.species
          speciesId[characteristicId] = characteristic.species.id;
        }
        else if (angular.isDefined(characteristic.links) && angular.isDefined(characteristic.links.species)) {
          // species.characteristics.links.species
          speciesId[characteristicId] = characteristic.links.species;
        }
        else {
          speciesId[characteristicId] = characteristic.speciesId;
          delete characteristic.speciesId;
        }
      }
      else {
        original[characteristicId] = undefined;
      }
      if (angular.isDefined(_url)) {
        url[characteristicId] = _url;
      }
    }

    function reset(characteristic) {
      if (characteristic) {
        initialize(id(characteristic));
      }
    }

    function trackChanges(characteristic) {
      if (characteristic && characteristic.id) {
        dirty[characteristic.id] = [];
        angular.forEach(original[characteristic.id], function (value, key) {
          if (angular.isUndefined(original[characteristic.id][key])) {
            // change of value from undefined to null is not treated as a change
            if (characteristic[key] !== null) {
              dirty[characteristic.id].push(key);
            }
          }
          else {
            if (!angular.equals(original[characteristic.id][key], characteristic[key])) {
              dirty[characteristic.id].push(key);
            }
          }

        });
      }
      return isDirty(characteristic);
    }

    function getAttrs(characteristic) {
      var characteristicId = id(characteristic);
      return {
        url: url[characteristicId],
        data: characteristic,
        dirty: dirty[characteristicId],
        speciesId: speciesId[characteristicId]
      };
    }

    function id(characteristic) {
      return angular.isDefined(characteristic.id) ? characteristic.id : 'new';
    }

    function isDirty(characteristic) {
      return !emptyParams(characteristic) &&
        angular.isDefined(characteristic) &&
        (angular.isUndefined(characteristic.id) || dirty[characteristic.id].length > 0);
    }

    function clean(characteristic) {
      var nullValue;
      if (angular.isUndefined(characteristic.id)) {
        nullValue = undefined;
        ['edible', 'cultivated', 'poisonous', 'medicinal'].forEach(function (usability) {
          if (characteristic[usability] === false) {
            characteristic[usability] = undefined;
          }
        });
        ['habitats', 'substrates'].forEach(function (array) {
          if (angular.isDefined(characteristic[array]) && characteristic[array].length === 0) {
            characteristic[array] = undefined;
          }
        });
      }
      else {
        nullValue = null;
      }
      var allEmpty;
      ['fruitingBody', 'flesh', 'microscopy', 'chemistry', 'notes'].forEach(function (section) {
        if (!undefinedOrNull(characteristic[section])) {
          allEmpty = true;
          ['sr', 'en'].forEach(function (locale) {

            if (blankString(characteristic[section][locale])) {
              characteristic[section][locale] = existingDescription(characteristic, section, locale) ? null : undefined;
            }

            allEmpty = allEmpty && angular.isUndefined(characteristic[section][locale]);
          });

          if (allEmpty === true) {
            characteristic[section] = nullValue;
          }
        }
      });
    }

    function emptyParams(characteristic) {
      if (angular.isDefined(characteristic)) {
        clean(characteristic);
        if (angular.isUndefined(characteristic.id)) {
          var result = true;
          angular.forEach(characteristic, function (value, key) {
            if (key !== 'referenceId' && angular.isDefined(value)) {
              result = false;
            }
          });
          return result;
        }
      }
      return false;
    }


    function existing(characteristic) {
      return angular.isDefined(characteristic) && angular.isDefined(characteristic.id);
    }

    function existingDescription(characteristic, section, locale) {
      return existing(characteristic) &&
        original[characteristic.id][section] !== null &&
        angular.isDefined(original[characteristic.id][section][locale]);
    }

    function blankString(value) {
      return angular.isUndefined(value) || value === null || value.length === 0;
    }

    function translationMissing(characteristic) {
      var localesMissing = [];
      if (angular.isDefined(characteristic)) {
        var locales = FoI18n.localesArray();
        var sectionLocales;

        Characteristics.sectionsArray(locales).forEach(function (section) {
          if (characteristic[section.key]) {
            sectionLocales = {};
            sectionLocales[section.key] = [];
            locales.forEach(function (locale) {
              if (angular.isUndefined(characteristic[section.key][locale.key])) {
                sectionLocales[section.key].push(locale.title);
              }
            });
            if (sectionLocales[section.key].length > 0) {
              localesMissing.push(sectionLocales);
            }
          }
        });
      }
      return localesMissing;
    }

    function missingCharacteristics(characteristics) {
      var allCharacteristics = ['habitats', 'substrates', 'flesh', 'microscopy', 'chemistry', 'fruitingBody'];
//      var missing = [];
//      var found;
//      allCharacteristics.forEach(function(characteristic){
//        found = false;
//        characteristics.forEach(function(c){
//          Object.keys(c).forEach(function (cKey){
//            if (!found && cKey === characteristic){
//console.log(c);
//              found = true;
//            }
//          });
//        });
//
//        if (!found){
//          missing.push(characteristic);
//        }
//      });
//      return missing;
      return allCharacteristics;
    }

    function saveCharacteristic(characteristic) {
      var attrs = getAttrs(characteristic);
      attrs.params = {respondWithBody: true};
      return Characteristics.save(attrs).then(function (response) {
        return response.data.characteristics;
      });
    }


    return {
      initialize: initialize,
      reset: reset,
      trackChanges: trackChanges,
      getAttrs: getAttrs,
      isDirty: isDirty,
      emptyParams: emptyParams,
      clean: clean,
      translationMissing: translationMissing,
      missingCharacteristics: missingCharacteristics,
      saveCharacteristic: saveCharacteristic
    };
  });