'use strict';

angular.module('resources.species', [])

  .factory('Species', function (restmod) {
    return restmod.model('/species');
//      .mix({
//        characteristics: { hasMany: 'Characteristics'}
//      });
  });