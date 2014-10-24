'use strict';

angular.module('services.icons', [])

  .constant('ICONS', {
    undefined: 'fa-question',

    species: 'fa-book',
    specimens: 'fa-tags',
    references: 'fa-university',

    dashboard: 'fa-dashboard',
    activity: 'fa-dashboard',
    stats: 'fa-bar-chart-o',

    close: 'fa-close',
    cancel: 'fa-close',

    user: 'fa-user',
    users: 'fa-users',
    register: 'fa-pencil-square-o',
    support: 'fa-envelope',
    signIn: 'fa-sign-in',
    signOut: 'fa-power-off'
  })

  .factory('icons', ['ICONS', function (iconsObject) {
    return {
      get: function (iconName) {
        if (iconsObject[iconName] === undefined) {
          iconName = 'undefined';
        }
        return iconsObject[iconName];
      }
    };
  }]);