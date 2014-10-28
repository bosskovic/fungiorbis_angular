'use strict';

angular.module('dashboard', [
  'dashboard.stats',
  'dashboard.users',
  'dashboard.species',
  'dashboard.references'])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/dashboard', '/dashboard/activity');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/app/dashboard/dashboard.tpl.html',
        controller: 'DashboardController as dashboardNav'
      })
      .state('dashboard.activity', {
        url: '/activity',
        templateUrl: '/app/dashboard/activity.tpl.html'
      });
  })

  .controller('DashboardController', function (ICONS, $scope) {
    $scope.icons = ICONS;

    this.activityCollapsed = false;
    this.activeTab = 'activity';
    this.toggleActivity = function () {
      if (this.activeTab === 'activity'){
        this.activityCollapsed = !this.activityCollapsed;
      }
      else{
        this.activeTab = 'activity';
      }
    };

    this.isActiveTab = function (tab) {
      return this.activeTab === tab;
    };
    this.setActiveTab = function (tab) {
      this.activeTab = tab;
    };

    this.activityItems = [
      { name: 'users', icon: ICONS.users, text: 'Users'},
      { name: 'species', icon: ICONS.species, text: 'Species'},
      { name: 'specimens', icon: ICONS.specimens, text: 'Specimens'},
      { name: 'references', icon: ICONS.references, text: 'References'}
    ];
  });