'use strict';

angular.module('services.i18n', [])

  .factory('FoI18n', function () {

    function localesArray() {
      return [
        { key: 'sr', title: 'srpski' },
        { key: 'en', title: 'English'}
      ];
    }

    return {
      localesArray: localesArray
    };
  });