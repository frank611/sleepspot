'use strict'

angular.module('sleepspotApp').controller 'LoginCtrl', ($scope, Auth, $location, $window) ->
  $scope.user = {}
  $scope.errors = {}

  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider