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
  'restmod',
  'ui.bootstrap',
  'xeditable',
  'dashboard',
  'navigation.userToolbar',
  'services.authentication',
  'services.icons',
  'resources.users',
  'resources.species',
  'resources.references',
  'directives.tableWithPagination'
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

  .config(function (restmodProvider, SERVER_BASE_URL) {
    restmodProvider.rebase('AMSApi');
    restmodProvider.rebase('DefaultPacker');
    restmodProvider.rebase({
      $config: {
        urlPrefix: SERVER_BASE_URL
      }
    }, 'setHeaders');
  })

  .run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })

  .factory('setHeaders', function (restmod, authentication) {
    var headers;
    if (authentication.isAuthenticated()) {
      var currentUser = authentication.currentUser();
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Email': currentUser.email,
        'X-User-Token': currentUser.authToken
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }

    return restmod.mixin({
      $hooks: {
        'before-request': function (_req) {
          _req.headers = headers;
        }
      }
    });
  })


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