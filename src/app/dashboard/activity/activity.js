'use strict';

angular.module('dashboard.activity', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.activity', {
        url: '/activity',
        templateUrl: '/app/dashboard/activity/activity.tpl.html'
      })
      .state('dashboard.users', {
        url: '^/dashboard/users',
        templateUrl: '/app/dashboard/activity/activity_users.tpl.html'
      })
      .state('dashboard.species', {
        url: '/species',
        templateUrl: '/app/dashboard/activity/activity_species.tpl.html'
      })
      .state('dashboard.specimens', {
        url: '/specimens',
        templateUrl: '/app/dashboard/activity/activity_specimens.tpl.html'
      })
      .state('dashboard.references', {
        url: '/references',
        templateUrl: '/app/dashboard/activity/references.tpl.html'
      });
  });