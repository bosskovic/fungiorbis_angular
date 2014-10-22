'use strict';

/**
 * @ngdoc overview
 * @name angularFungiorbisApp
 * @description
 * # angularFungiorbisApp
 *
 * Main module of the application.
 */
angular.module('angularFungiorbisApp', [
  'ngAnimate',
  'ui.router',
  'restangular',
  'dashboard'
])

  .constant('ICONS', {
    species: 'fa-book',
    specimens: 'fa-tags',
    dashboard: 'fa-dashboard',
    user: 'fa-user',
    users: 'fa-users',
    references: 'fa-university',
    activity: 'fa-dashboard',
    stats: 'fa-bar-chart-o'
  })

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home.tpl.html'
      });
  })

  .controller('NavigationController', function (ICONS) {
    this.isCollapsed = true;
    this.isLoggedIn = false;

    this.activeTab = 'home';

    this.toggleNavigation = function () {
      this.isCollapsed = !this.isCollapsed;
    };

    this.isActiveTab = function (tab) {
      return tab === this.activeTab;
    };

    this.setActiveTab = function (tab) {
      this.activeTab = tab;
    };

    this.items = [
      {name: 'dashboard', icon: ICONS.dashboard, text: 'Dashboard'},
      {name: 'species', icon: ICONS.species, text: 'Species'},
      {name: 'specimens', icon: ICONS.specimens, text: 'Specimens'}
    ];

//  $scope.$on('$routeChangeSuccess', function () {
//    $scope.isCollapsed = true;
//  });
  });