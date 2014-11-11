'use strict';

angular.module('resources.references', [])

  .factory('References', function ($http, $q, $cookieStore, SERVER_BASE_URL, authentication) {

    function headers() {
      var currentUser = authentication.currentUser;
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Email': currentUser.email,
        'X-User-Token': currentUser.authToken
      };
    }

    function baseUrl(){
      return SERVER_BASE_URL + '/references';
    }

    function index(params) {
      var url = baseUrl();

      return $http({
        url: url,
        method: 'GET',
        params: params
      });
    }

    function show(id, params) {
      var url = baseUrl() + '/' + id;

      return $http({
        url: url,
        method: 'GET',
        params: params
      });
    }

    /**
     * @param {object} attrs - keys: data, dirty, url, speciesId
     */
    function save(attrs) {
      var url = attrs.url ? attrs.url : baseUrl();
      var method;
      var data = {};

      if (angular.isDefined(attrs.data.id)) {
        url += '/' + attrs.data.id;

        if (angular.isDefined(attrs.dirty)){
          angular.forEach(attrs.dirty, function (value) {
            data[value] = attrs.data[value];
          });
        }
        else {
          data = attrs.data;
        }

        method = 'PATCH';
      }
      else {
        data = attrs.data;
        method = 'POST';
      }

      return $http({
        url: url,
        method: method,
        headers: headers(),
        data: {
          references: data
        }
      });
    }

    function fields(){
      return [
        { header: 'Title', field: 'title', placeholder: 'Type in title' },
        { header: 'Authors', field: 'authors', placeholder: 'Type in authors' },
        { header: 'ISBN', field: 'isbn', placeholder: 'Type in ISBN (optional)' },
        { header: 'URL', field: 'url', placeholder: 'Type in URL (optional)' }
      ];
    }

    return {
      index: index,
      show: show,
      save: save,
      fields: fields
    };
  });