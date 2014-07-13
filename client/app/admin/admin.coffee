'use strict'

angular.module('sleepspotApp')
  .config ($routeProvider) ->
    $routeProvider
    .when('/admin',
      templateUrl: 'app/admin/admin.html'
      controller: 'AdminCtrl'
    )