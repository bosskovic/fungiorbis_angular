'use strict';

angular.module('dashboard.users', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.users', {
        url: '^/dashboard/users',
        templateUrl: '/app/dashboard/users-index.tpl.html',
        controller: 'UsersController as usersCtrl',
        resolve: {
          usersResponse: function (Users) {
            return Users.index({sort: 'role'});
          }
        }
      });
  })

  .controller('UsersController', function ($scope, $state, usersResponse, Users) {
    var that = this;
    var users = usersResponse.data.users;
    var meta = usersResponse.data.meta;

    this.tableParams = {
      prefix: 'users',
      data: users,
      columns: Users.fields(),
      meta: meta.users,
      sort: 'role',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        Users.index(attrs).success(function (data) {
          that.tableParams.meta = data.meta.users;
          that.tableParams.data = data.users;
        });
      }
    };
  });