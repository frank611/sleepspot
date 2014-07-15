'use strict'

angular.module('sleepspotApp')
  .config ($routeProvider) ->
    $routeProvider
    .when('/login',
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginCtrl'
    )
    .when('/settings',
      templateUrl: 'app/account/settings/settings.html'
      controller: 'SettingsCtrl'
    )