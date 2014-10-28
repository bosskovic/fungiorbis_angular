'use strict';

angular.module('resources.users', [])

  .factory('Users', function (restmod) {
    return restmod.model('/users');
  });