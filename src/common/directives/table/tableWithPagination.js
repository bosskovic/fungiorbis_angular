'use strict';

angular.module('directives.tableWithPagination', [])

  .directive('foTable', function () {

    var pageLinks = function (params) {
      var meta = params.meta;
      var totalPages = meta.pageCount;
      var page = meta.page;

      var pageLinks;
      var i, j;

      var paginatorPages = params.paginatorPages || 10;

      var perPage = meta.perPage || 10;

      if (totalPages <= paginatorPages) {
        pageLinks = new Array(totalPages);
        i = 0;
      }
      else if (page >= totalPages - perPage / 2) {
        pageLinks = new Array(paginatorPages);
        i = totalPages - perPage;
      }
      else {
        pageLinks = new Array(paginatorPages);
        i = (page - perPage / 2 <= 1) ? 0 : (page - (perPage / 2) - 1 );
      }
      for (j = 0; j < pageLinks.length; j++) {
        pageLinks[j] = j + i + 1;
      }

      return pageLinks;
    };

    var metaParams = function (params, changed) {
      changed = changed === undefined ? {} : changed;
      var meta = params.meta;
      var result = {};

      var page = changed.page === undefined ? meta.page : changed.page;
      var perPage = changed.perPage === undefined ? meta.perPage : changed.perPage;
      var sort = changed.sort === undefined ? params.sort : changed.sort;
      var order = params.order === undefined ? '' : params.order;

      if (page > 1) {
        result.page = page;
      }
      if (perPage !== 10) {
        result.perPage = perPage;
      }
      result.sort = order + sort;

      return result;
    };

    return {
      templateUrl: 'common/directives/table/table.tpl.html',
      restrict: 'E',
      replace: false,
      scope: { params: '=' },
      link: function (scope) {
        scope.$watch('params', function () {
          scope.pageLinks = pageLinks(scope.params);
        }, true);

        scope.previous = function () {
          if (scope.params.meta.page > 1) {
            scope.params.getData(metaParams(scope.params, {page: scope.params.meta.page - 1}));
          }
        };

        scope.next = function () {
          if (scope.params.meta.page < scope.params.meta.pageCount) {
            scope.params.getData(metaParams(scope.params, {page: scope.params.meta.page + 1}));
          }
        };

        scope.getPage = function (page) {
          scope.params.getData(metaParams(scope.params, {page: page}));
        };

        scope.changeOrder = function () {
          if (scope.params.order === '-') {
            scope.params.order = '';
          }
          else {
            scope.params.order = '-';
          }
        };

        scope.removeRow = function(row) {
          scope.params.removeRow(row.id);
        };

        scope.params.columns.forEach(function(column){
          if(angular.isDefined(scope.columns)){
            scope.columns.push(column);
          }
          else{
            // excludes first element this way
            scope.columns = [];
          }
        });

        scope.pageSizeChoices = scope.params.pageSizeChoices === undefined ?
          [10, 25, 50, 100] : scope.params.pageSizeChoices;

        scope.editUrl =  scope.params.editUrl[0] === '^' ? scope.params.editUrl.substring(1) : scope.params.editUrl;

        scope.changeOrder = function(order){
          scope.params.order = order;
          scope.getPage(1);
        };
      }
    };
  });