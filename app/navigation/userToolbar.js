'use strict';

angular.module('navigation.userToolbar', [])

  .directive('foUserToolbar', function (authentication, $state) {
    return {
      templateUrl: 'app/navigation/userToolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function ($scope) {
        $scope.isAuthenticated = authentication.isAuthenticated();

        $scope.showSignIn = false;

        $scope.$watch(function () {
          return authentication.currentUser;
        }, function (currentUser) {
          $scope.currentUser = currentUser;
          if (authentication.isAuthenticated()) {
            $scope.currentUser.displayName = currentUser.firstName + ' ' + currentUser.lastName;
          }
        });

        $scope.signIn = function () {
          authentication.signIn(this.email, this.password)
            .then(function () {
              $scope.showSignIn = false;
              $scope.isAuthenticated = true;
            }, function () {
              $scope.showSignIn = true;
              $scope.isAuthenticated = false;
              // TODO error handler
//              console.log(error);
//              console.log(error.data.errors.details[0]);
            }).finally(function(){
              $scope.email = null;
              $scope.password = null;
            });
        };

        $scope.signOut = function () {
          authentication.signOut()
            .then(function () {
              $scope.isAuthenticated = false;
              $state.go('home');
            }, function () {
              // TODO error handler
//              console.log(error);
            });
        };

        $scope.cancel = function () {
          $scope.email = '';
          $scope.password = '';
        };
      }
    };
  });