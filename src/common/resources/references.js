'use strict';

angular.module('resources.references', [])

  .factory('References', function (restmod) {
    return restmod.model('/references');
  });