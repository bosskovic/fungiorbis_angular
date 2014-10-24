'use strict';

angular.module('services.authentication', [])

  .factory('authentication', ['$http', '$q', '$cookieStore', 'SERVER_BASE_URL', function ($http, $q, $cookieStore, SERVER_BASE_URL) {
    var currentUser;

    function signIn(email, password) {
      var deferred = $q.defer();

      email = 'ela@fungiorbis.edu';
      password = 'Ela12345!';

      $http({
        url: SERVER_BASE_URL + '/users/sign_in',
        method: 'POST',
        data: JSON.stringify({ user: { email: email, password: password } }),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
      })
        .then(function (result) {
          currentUser = result.data.users;
          $cookieStore.put('currentUser', currentUser);
          deferred.resolve(currentUser);
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function signOut() {
      var deferred = $q.defer();

      $http({
        url: SERVER_BASE_URL + '/users/sign_out',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-User-Email': currentUser.email,
          'X-User-Token': currentUser.authToken
        }
      }).then(function (result) {
        currentUser = {};
        $cookieStore.remove('currentUser');
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getCurrentUser() {
      return currentUser;
    }

    function hasAccess(requiredRole) {
      if (requiredRole === undefined || requiredRole === '' || requiredRole === 'visitor') {
        return true;
      } else if (getCurrentUser() === null){
        return false;
      } else {
        switch(getCurrentUser().role){
          case undefined:
            return false;
          case 'user':
            return requiredRole === 'user';
          case 'contributor':
            return requiredRole === 'user' || requiredRole === 'contributor';
          case 'supervisor':
            return true;
        }
      }
    }

    function init() {
      currentUser = $cookieStore.get('currentUser') || null;
    }

    init();

    // The public API of the service
    var service = {
      signIn: signIn,
      signOut: signOut,
      currentUser: getCurrentUser,
      hasAccess: hasAccess,

      isAuthenticated: function () {
        return getCurrentUser() !== null;
      },

      isSupervisor: function () {
        return !!(service.currentUser && service.currentUser.role === 'supervisor');
      },

      isContributor: function () {
        return !!(service.currentUser && service.currentUser.role === 'contributor');
      }
    };

    return service;
  }]);