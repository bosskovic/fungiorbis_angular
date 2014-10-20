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
  'ngRoute',
  'restangular'
]);

angular.module('angularFungiorbisApp').controller('ApplicationController', function () {
  this.adminSidebar = true;
});

angular.module('angularFungiorbisApp').controller('NavigationController', function () {
  this.isCollapsed = true;
//  $scope.$on('$routeChangeSuccess', function () {
//    $scope.isCollapsed = true;
//  });
});