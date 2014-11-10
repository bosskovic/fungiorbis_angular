'use strict';

angular.module('resources.characteristics', [])

  .factory('Characteristics', function ($http, $q, $cookieStore, SERVER_BASE_URL, authentication) {

    function headers() {
      var currentUser = authentication.currentUser;
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Email': currentUser.email,
        'X-User-Token': currentUser.authToken
      };
    }

    function baseUrl(speciesId) {
      return SERVER_BASE_URL + '/species/' + speciesId + '/characteristics';
    }

    function get(attrs) {
      var url = baseUrl(attrs.speciesId);

      if (angular.isDefined(attrs.id)) {
        url += '/' + attrs.id;
        delete attrs.id;
      }

      delete attrs.speciesId;

      return $http({
        url: url,
        method: 'GET',
        params: attrs
      });
    }

    /**
     * @param {object} attrs - keys: data, dirty, url, speciesId
     */
    function save(attrs) {
      var url = attrs.url ? attrs.url : baseUrl(attrs.speciesId);
      var method;
      var data = { characteristics: {} };

      if (angular.isDefined(attrs.params)) {
        Object.keys(attrs.params).forEach(function (key) {
          data[key] = attrs.params[key];
        });
      }

      if (angular.isDefined(attrs.data.id)) {
        url += '/' + attrs.data.id;

        angular.forEach(attrs.dirty, function (value) {
          data.characteristics[value] = attrs.data[value];
        });

        method = 'PATCH';
      }
      else {
        data.characteristics = attrs.data;
        method = 'POST';
      }

      return $http({
        url: url,
        method: method,
        headers: headers(),
        data: data
      });
    }


    function httpDelete(attrs) {
      var url = baseUrl(attrs.speciesId) + '/' + attrs.data.id;

      return $http({
        url: url,
        method: 'DELETE'
      });
    }

    function sectionsArray(locales) {
      return [
        { key: 'fruitingBody', title: 'Fruiting Body', locale: locales[0] },
        { key: 'microscopy', title: 'Microscopy', locale: locales[0] },
        { key: 'flesh', title: 'Flesh', locale: locales[0] },
        { key: 'chemistry', title: 'Chemistry', locale: locales[0] },
        { key: 'notes', title: 'Notes', locale: locales[0] }
      ];
    }

    function usabilitiesArray() {
      return [ 'edible', 'cultivated', 'medicinal', 'poisonous'];
    }

    return {
      get: get,
      save: save,
      httpDelete: httpDelete,
      sectionsArray: sectionsArray,
      usabilitiesArray: usabilitiesArray
    };
  });