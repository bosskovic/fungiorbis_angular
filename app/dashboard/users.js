'use strict';

angular.module('species', []).factory('Species', function (restmod) {
  return restmod.model('/species');
});

angular.module('dashboard.users', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard.users', {
        url: '^/dashboard/users',
        templateUrl: '/app/dashboard/users-index.tpl.html',
        controller: 'UsersController as usersCtrl',
        resolve: {
          users: function (Users) {
            return Users.$collection().$fetch().$asPromise().then(function (users) {
              return users;
            });
          }
        }
      });
  })

  .controller('UsersController', function ($scope, $state, users) {
    var that = this;

    this.tableParams = {
      prefix: 'users',
      data: users,
      columns: [
        { header: 'First Name', field: 'firstName' },
        { header: 'Last Name', field: 'lastName' },
        { header: 'Title', field: 'title' },
        { header: 'Email', field: 'email' },
        { header: 'Institution', field: 'institution' },
        { header: 'Phone', field: 'phone' },
        { header: 'Role', field: 'role' }
      ],
      meta: users.$metadata.users,
      sort: 'firstName',
      editUrl: $state.current.url,
      paginatorPages: 10,
      getData: function (attrs) {
        users.$refresh(attrs).$asPromise().then(function (sp) {
          that.tableParams.meta = sp.$metadata.users;
        });
      }
    };
  });