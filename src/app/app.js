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
  'ngCookies',
  'restangular',
  'dashboard',
  'navigation.userToolbar',
  'services.authentication',
  'services.icons'
])

  .constant('SERVER_BASE_URL', 'http://0.0.0.0:3000')

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home.tpl.html'
      });
  })

  .config(function (RestangularProvider, SERVER_BASE_URL) {
    RestangularProvider.setBaseUrl(SERVER_BASE_URL);
  })


//  .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
//    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//        if (!Auth.authorize(toState.data.access)) {
//          $rootScope.error = "Access denied";
//          event.preventDefault();
//
//          if(fromState.url === '^') {
//            if(Auth.isLoggedIn())
//              $state.go('user.home');
//            else {
//              $rootScope.error = null;
//              $state.go('anon.login');
//            }
//          }
//        }
//      });
//  }])

  .controller('NavigationController', function (icons, authentication) {
    this.activeTab = 'home';
    this.icon = icons.get;
    this.hasAccess = authentication.hasAccess;

    this.publicItems = [
      {name: 'species', text: 'Species'},
      {name: 'specimens', text: 'Specimens'}
    ];

    this.isActiveTab = function (tab) {
      return tab === this.activeTab;
    };

    this.setActiveTab = function (tab) {
      this.activeTab = tab;
    };
  });