'use strict'

angular.module('sleepspotApp')
  .config ($routeProvider) ->
    $routeProvider
    .when('/',
      templateUrl: 'app/main/main.html'
      controller: 'MainCtrl'
    )