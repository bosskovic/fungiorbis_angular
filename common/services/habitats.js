'use strict';

angular.module('services.habitats', [])

  .factory('Habitats', function ($http, $q, SERVER_BASE_URL) {

    var rawData;

    function load() {
      if (rawData === undefined) {
        var deferred = $q.defer();
        $http({
          url: SERVER_BASE_URL + '/habitats',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(function (result) {
          rawData = result.data;
          deferred.resolve(rawData);
        }, function (error) {
          // TODO: error handler
          deferred.reject(error);
        });
      }
      return rawData;
    }

    function hashToArray(data) {
      var result = [];
      var h;
      angular.forEach(data, function (value, key) {
        h = value || {};
        h.key = key;
        this.push(h);
      }, result);
      return result;
    }

    function habitats(){
      return hashToArray(rawData.en.habitats);
    }

    function subhabitats(h){
      return h === undefined ? [] : hashToArray(rawData.en.habitats[h].subhabitat);
    }

    function speciesHashToArray(data) {
      var result = [];
      angular.forEach(data, function (value, key) {
        this.push({
          key: key,
          value: value
        });
      }, result);
      return result;
    }

    function species(habitat, subhabitat) {
      var allowedGroups;
      var result = [];
      if (habitat === undefined && subhabitat === undefined) {
        return [];
      }
      else if (subhabitat === undefined) {
        allowedGroups = rawData.en.habitats[habitat].allowed_species_groups;
      }
      else {
        allowedGroups = rawData.en.habitats[habitat] === undefined || rawData.en.habitats[habitat].subhabitat === undefined || rawData.en.habitats[habitat].subhabitat[subhabitat] === undefined ? [] :
          rawData.en.habitats[habitat].subhabitat[subhabitat].allowed_species_groups;
      }

      if (allowedGroups) {
        for (var i = 0; i < allowedGroups.length; i++) {
          result = result.concat(speciesHashToArray(rawData.en.species[allowedGroups[i]]));
        }
      }

      return result;
    }

    function toString(habitat) {
      var key = Object.keys(habitat)[0];
      var result = key;
      if (habitat[key].subhabitat) {
        result += ' - ' + habitat[key].subhabitat;
      }
      if (habitat[key].species) {
        result += ': ' + habitat[key].species.join(', ');
      }
      return result;
    }


    return {
      load: load,
      habitats: habitats,
      subhabitats: subhabitats,
      species: species,
      toString: toString
    };

  });