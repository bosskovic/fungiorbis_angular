'use strict';

angular.module('services.util', [])

  .factory('Util', function () {

    var isArray = angular.isArray;
    var isString = angular.isString;
    var isDefined = angular.isDefined;
    var isUndefined = angular.isUndefined;

    function undefinedOrNull(value) {
      return isUndefined(value) || value === null;
    }

    function undefinedOrFalse(value) {
      return isUndefined(value) || isBoolean(value) && value === false;
    }

    function isEmptyArray(obj) {
      return isArray(obj) && obj.length === 0;
    }

    function isEmptyString(obj) {
      return isString(obj) && obj.length === 0;
    }

    function isBoolean(obj) {
      return obj === true || obj === false;
    }

    function cleanParams(newObject, oldObject) {
      Object.keys(newObject).forEach(function (key) {
        if (isEmptyArray(newObject[key]) || isEmptyString(newObject[key])) {
          newObject[key] = null;
        }

        if (isDefined(oldObject) && oldObject[key] === newObject[key] ||
          (undefinedOrNull(newObject[key]) && (undefinedOrNull(oldObject) || undefinedOrNull(oldObject[key]))) ||
          (newObject[key] === false && undefinedOrFalse(oldObject[key]))) {
          delete newObject[key];
        }
      });
    }

    function arrayDifference(a1, a2){
      if (isUndefined(a2) || !isArray(a2)){
        return a1;
      }
      var found;
      var result = [];
      var a2copy = angular.copy(a2);
      a1.forEach(function (e1){
        found = false;
        a2copy.forEach(function (e2, key){
          if (e1 === e2){
            delete a2copy[key];
            found = true;
          }
        });
        if (!found){
          result.push(e1);
        }
      });
      return result;
    }

    return {
      undefinedOrNull: undefinedOrNull,
      isEmptyArray: isEmptyArray,
      isEmptyString: isEmptyString,
      cleanParams: cleanParams,
      arrayDifference: arrayDifference
    };
  });