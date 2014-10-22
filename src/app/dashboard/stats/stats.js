'use strict';

angular.module('dashboard.stats', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.stats', {
        url: '/stats',
        templateUrl: '/app/dashboard/stats/stats.tpl.html'
      });
  });