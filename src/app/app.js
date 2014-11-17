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
  'ui.bootstrap',
  'ngCookies',
  'restmod',
  'ngResource',
  'xeditable',
  'mgcrea.ngStrap',
  'dashboard',
  'navigation.userToolbar',
  'services.authentication',
  'services.icons',
  'services.habitats',
  'services.substrates',
  'services.i18n',
  'services.util',
  'resources.users',
  'resources.species',
  'resources.references',
  'resources.characteristics',
  'directives.alert',
  'directives.icon',
  'directives.tableWithPagination',
  'directives.newHabitat',
  'directives.descriptionEdit',
  'directives.usability',
  'directives.typeahead',
  'directives.substratesSelect',
  'directives.helpText',
  'directives.characteristicEdit',
  'directives.characteristicPreview',
  'directives.characteristicsTable'
])

  .constant('SERVER_BASE_URL', 'http://0.0.0.0:3000')
//  .constant('SERVER_BASE_URL', 'http://fungiorbis.herokuapp.com')

  .config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common.Accept = 'application/json';

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
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

  .run(function ($http, authentication) {
    var currentUser = authentication.currentUser;
    if (currentUser) {
      $http.defaults.headers.common['X-User-Email'] = currentUser.email;
      $http.defaults.headers.common['X-User-Token'] = currentUser.authToken;
    }
  })

  .run(function ($rootScope, $state, authentication) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (angular.isDefined(toState.data) && toState.data.authenticate && !authentication.isSupervisor()) {
        $state.go('home');
        event.preventDefault();
      }
    });
  })

  .config(function (restmodProvider, SERVER_BASE_URL) {
    restmodProvider.rebase({
      $config: {
        urlPrefix: SERVER_BASE_URL
      }
    }, 'setHeaders', 'DefaultPacker', 'AMSApi', 'DirtyModel');
  })

  .run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })

  .factory('setHeaders', function (restmod, authentication) {
    var headers;
    if (authentication.isAuthenticated()) {
      var currentUser = authentication.currentUser;
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


  .controller('NavigationController', function (authentication) {
    this.activeTab = 'home';
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