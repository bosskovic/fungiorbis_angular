'use strict';

angular.module('services.icons', [])

  .constant('ICONS', {
    undefined: 'fa-question',


    species: 'fa-book',
    systematics: 'fa-sitemap',
    incontestableCharacteristics: 'fa-bars',
    missingCharacteristics: 'fa-exclamation',

    usability: 'fa-money',
    edible: 'fa-cutlery',
    cultivated: 'fa-thumbs-o-up',
//    poisonous: 'fa-frown-o',
    poisonous: 'fa-warning',
//    medicinal: 'fa-plus-square',
    medicinal: 'fa-heart-o',

    habitat: 'fa-tree',
    substrate: 'fa-leaf',
    description: 'fa-list-alt',

    fruitingBody: 'fa-lemon-o',
    chemistry: 'fa-flask',
    microscopy: 'fa-search',
    flesh: 'fa-asterisk',
    notes: 'fa-pencil-square-o',


    specimens: 'fa-tags',

//    references: 'fa-university',
    references: 'fa-quote-left',

    dashboard: 'fa-dashboard',
    activity: 'fa-dashboard',
    stats: 'fa-bar-chart-o',

    add: 'fa-plus',
    close: 'fa-close',
    remove: 'fa-close',
    delete: 'fa-trash-o',
    cancel: 'fa-close',
    save: 'fa-save',
    confirm: 'fa-check',
    edit: 'fa-edit',
    refresh: 'fa-refresh',
    spinner: 'fa-spinner fa-spin',
//    helpText: 'fa-question-circle',
//    helpText: 'fa-question',
    helpText: 'fa-info-circle',
//    sortDown: 'fa-sort-down',
    sortDown: 'fa-chevron-down',
//    sortUp: 'fa-sort-up',
    sortUp: 'fa-chevron-up',

//    backHistory: 'fa-arrow-circle-o-left',
    backHistory: 'fa-reply',

    successAlert: 'fa-check',
    dangerAlert: 'fa-flash',
    infoAlert: 'fa-info-circle',
    warningAlert: 'fa-exclamation-triangle',

    user: 'fa-user',
    users: 'fa-users',
    register: 'fa-pencil-square-o',
    support: 'fa-envelope',
    signIn: 'fa-sign-in',
    signOut: 'fa-power-off'
  })

  .factory('icons', ['ICONS', function (iconsObject) {
    return {
      get: function (iconName) {
        if (iconsObject[iconName] === undefined) {
          iconName = 'undefined';
        }
        return iconsObject[iconName];
      }
    };
  }]);