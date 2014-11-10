'use strict';

angular.module('resources.species', [])

  .factory('Species', function ($http, $q, $cookieStore, SERVER_BASE_URL, authentication) {

    function headers() {
      var currentUser = authentication.currentUser;
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Email': currentUser.email,
        'X-User-Token': currentUser.authToken
      };
    }

    function baseUrl() {
      return SERVER_BASE_URL + '/species';
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

        if (angular.isDefined(attrs.dirty)) {
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
          species: data
        }
      });
    }

    function httpDelete(attrs) {
      var url = attrs.url + '/' + attrs.data.id;

      return $http({
        url: url,
        method: 'DELETE'
      });
    }

    function systematics(){
      return [
        { label: 'Name', field: 'name' },
        { label: 'Genus', field: 'genus' },
        { label: 'Familia', field: 'familia' },
        { label: 'Ordo', field: 'ordo' },
        { label: 'Subclassis', field: 'subclassis' },
        { label: 'Classis', field: 'classis' },
        { label: 'Subphylum', field: 'subphylum' },
        { label: 'Phylum', field: 'phylum' }
      ];
    }

    function growthTypes(){
      return [
        { value: 'single', text: 'Single' },
        { value: 'group', text: 'Group' }
      ];
    }

    function nutritiveGroups(){
      return [
        { value: 'parasitic', text: 'Parasitic' },
        { value: 'mycorrhizal', text: 'Mycorrhizal' },
        { value: 'saprotrophic', text: 'Saprotrophic' },
        { value: 'parasitic-saprotrophic', text: 'Parasitic-saprotrophic' },
        { value: 'saprotrophic-parasitic', text: 'Saprotrophic-parasitic' }
      ];
    }

    function fields(){
      return [
        { header: 'Species name', field: 'fullName' },
        { header: 'Family', field: 'familia' },
        { header: 'Order', field: 'ordo' },
        { header: 'Phylum', field: 'phylum' }
      ];
    }

    return {
      index: index,
      show: show,
      save: save,
      delete: httpDelete,
      systematics: systematics,
      growthTypes: growthTypes,
      nutritiveGroups: nutritiveGroups,
      fields: fields
    };
  });