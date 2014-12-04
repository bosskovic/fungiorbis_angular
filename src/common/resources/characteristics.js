'use strict';

angular.module('resources.characteristics', [])

  .factory('Characteristics', function ($http, $q, $cookieStore, SERVER_BASE_URL, authentication, Habitats, Substrates) {

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

//    TODO sort this out
    function sectionsArray2() {
      return [
        { key: 'fruitingBody', title: 'Plodno telo' },
        { key: 'microscopy', title: 'Mikroskopske karakteristike' },
        { key: 'flesh', title: 'Meso' },
        { key: 'chemistry', title: 'Hemijska reakcija' },
        { key: 'notes', title: 'Napomena' }
      ];
    }

    function usabilitiesArray() {
      return [ 'edible', 'cultivated', 'medicinal', 'poisonous'];
    }

    function translateUsability(u, locale) {
      if (angular.isUndefined(locale)) {
        locale = 'sr';
      }

      return {
        edible: { sr: 'jestiva', en: 'Edible'},
        cultivated: { sr: 'uzgajana', en: 'Cultivated'},
        medicinal: { sr: 'lekovita', en: 'Medicinal'},
        poisonous: { sr: 'otrovna', en: 'Poisonous'}
      }[u][locale];
    }

    function translateSection(u, locale) {
      if (angular.isUndefined(locale)) {
        locale = 'sr';
      }

      return {
        fruitingBody: { sr: 'plodno telo', en: 'Fruiting Body'},
        microscopy: { sr: 'mikroskopske karakteristike', en: 'Microscopy'},
        flesh: { sr: 'meso', en: 'Flesh'},
        chemistry: { sr: 'hemijska reakcija', en: 'Chemistry'},
        notes: { sr: 'napomena', en: 'Notes'}
      }[u][locale];
    }

    function speciesSections(species){
      var result = {
        sections: sectionsArray2()
      };
      sectionsArray2().forEach(function(section){
        if (angular.isUndefined(result[section.key])){
          result[section.key] = [];
        }

        species.characteristics.forEach(function(c){
          if (c[section.key] && c[section.key].sr.length > 0) {
            result[section.key].push(
              { content: c[section.key].sr, referenceId: c.links.reference }
            );
          }
        });
      });
      return result;
    }

    function speciesHabitats(species){
      var result = [];
      species.characteristics.forEach(function(c){

        var habitats = [];
        if (angular.isArray(c.habitats) && c.habitats.length > 0) {
          c.habitats.forEach(function (h) {
            var key = Object.keys(h)[0];
            var title, hSpecies;
            if (angular.isDefined(h[key].subhabitat)) {
              title = Habitats.translateSubhabitat(key, h[key].subhabitat);
            }
            else {
              title = Habitats.translateHabitat(key);
            }
            if (angular.isArray(h[key].species)) {
              hSpecies = h[key].species.join(', ');
            }
            habitats.push({ key: key, title: title, species: hSpecies});
          });
        }
        result.push({
          content: habitats, referenceId: c.links.reference
        });
      });

      return result;
    }


    function speciesSubstrates(species){
      var result = [];
      species.characteristics.forEach(function(c){

        var substrates = [];
        if (angular.isArray(c.substrates) && c.substrates.length > 0) {
          c.substrates.forEach(function (key) {
            substrates.push(Substrates.translateSubstrate(key));
          });
        }
        result.push({
          content: substrates.join(', '), referenceId: c.links.reference
        });
      });

      return result;
    }

    return {
      get: get,
      save: save,
      httpDelete: httpDelete,
      sectionsArray: sectionsArray,
      sectionsArray2: sectionsArray2,
      usabilitiesArray: usabilitiesArray,
      translateSection: translateSection,
      translateUsability: translateUsability,
      speciesSections: speciesSections,
      speciesHabitats: speciesHabitats,
      speciesSubstrates: speciesSubstrates
    };
  });