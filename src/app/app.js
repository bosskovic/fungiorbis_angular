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
  'ngResource',
  'xeditable',
  'mgcrea.ngStrap',
  'public',
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
  'directives.usabilityPublic',
  'directives.typeahead',
  'directives.substratesSelect',
  'directives.helpText',
  'directives.characteristicEdit',
  'directives.characteristicPreview',
  'directives.characteristicsTable',
  'directives.systematicsTypeAhead'
])

  .constant('SERVER_BASE_URL', 'http://0.0.0.0:3000')
//  .constant('SERVER_BASE_URL', 'https://178.79.152.32/api')

  .config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common.Accept = 'application/json';

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .run(function ($http, authentication) {
    var currentUser = authentication.currentUser;
    if (currentUser) {
      $http.defaults.headers.common['X-User-Email'] = currentUser.email;
      $http.defaults.headers.common['X-User-Token'] = currentUser.authToken;
    }
  })

  .run(function ($rootScope, $state, authentication) {
//    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (angular.isDefined(toState.data) && toState.data.authenticate && !authentication.isSupervisor()) {
        $state.go('home');
        event.preventDefault();
      }
    });
  })

  .run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  });