'use strict';

angular.module('dashboard', ['dashboard.activity', 'dashboard.stats'])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/dashboard', '/dashboard/activity');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/app/dashboard/dashboard.tpl.html',
        controller: 'DashboardController as dashboardNav'
//      controller:'DashboardCtrl',
//      resolve:{
//        projects:['Projects', function (Projects) {
//          //TODO: need to know the current user here
//          return Projects.all();
//        }],
//        tasks:['Tasks', function (Tasks) {
//          //TODO: need to know the current user here
//          return Tasks.all();
//        }]
//      }
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