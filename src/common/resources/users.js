'use strict';

angular.module('resources.users', [])

    .factory('Users', function ($http, $q, $cookieStore, SERVER_BASE_URL) {

    function baseUrl(){
      return SERVER_BASE_URL + '/users';
    }

    function index(params) {
      var url = baseUrl();

      return $http({
        url: url,
        method: 'GET',
        params: params
      });
    }


    function fields(){
      return [
        { header: 'Full Name', field: 'fullName' },
        { header: 'Title', field: 'title' },
        { header: 'Email', field: 'email' },
        { header: 'Institution', field: 'institution' },
        { header: 'Phone', field: 'phone' },
        { header: 'Role', field: 'role' }
      ];
    }

    return {
      index: index,
      fields: fields
    };
  });