'use strict';

angular.module('services.habitats', [])

  .factory('Habitats', function ($http, $q, SERVER_BASE_URL) {

    var rawData;

    function load() {
      if (rawData === undefined) {
        var deferred = $q.defer();
        return $http({
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
      else {
        return rawData;
      }
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
      return hashToArray(rawData.sr.habitats);
    }

    function subhabitats(h){
      return h === undefined ? [] : hashToArray(rawData.sr.habitats[h].subhabitat);
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
        allowedGroups = rawData.sr.habitats[habitat].allowed_species_groups;
      }
      else {
        allowedGroups = rawData.sr.habitats[habitat] === undefined || rawData.sr.habitats[habitat].subhabitat === undefined || rawData.sr.habitats[habitat].subhabitat[subhabitat] === undefined ? [] :
          rawData.sr.habitats[habitat].subhabitat[subhabitat].allowed_species_groups;
      }

      if (allowedGroups) {
        for (var i = 0; i < allowedGroups.length; i++) {
          result = result.concat(speciesHashToArray(rawData.sr.species[allowedGroups[i]]));
        }
      }

      return result;
    }

    function toString(habitat, localized) {
      var key = Object.keys(habitat)[0];
      var result;
      if (angular.isDefined(localized)){
        result = translateHabitat(key);
        if (habitat[key].subhabitat) {
          result += ' - ' + habitat[key].subhabitat.title;
        }
        if (habitat[key].species) {
          var localizedSpecies = [];
          habitat[key].species.forEach(function(sp){
            localizedSpecies.push(sp);
          });
          result += ': '+localizedSpecies.join(', ');
        }
      }
      else{
        result = key;
        if (habitat[key].subhabitat) {
          result += '-' + habitat[key].subhabitat;
        }
        if (habitat[key].species) {
          result += ':' + habitat[key].species.sort().join(',');
        }
      }

      return result;
    }

    function translateHabitat(habitatKey){
      return rawData.sr.habitats[habitatKey].title;
    }

    function translateSubhabitat(habitatKey, subhabitatKey){
      if (angular.isDefined(rawData.sr.habitats[habitatKey].subhabitat) &&
        angular.isDefined(rawData.sr.habitats[habitatKey].subhabitat[subhabitatKey])){
        return rawData.sr.habitats[habitatKey].subhabitat[subhabitatKey].title;
      }
    }

    return {
      load: load,
      habitats: habitats,
      translateHabitat: translateHabitat,
      subhabitats: subhabitats,
      translateSubhabitat: translateSubhabitat,
      species: species,
      toString: toString
    };

  });