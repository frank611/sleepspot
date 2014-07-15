'use strict'

angular.module('sleepspotApp')
  .config ($routeProvider) ->
    $routeProvider
    .when('/events',
      templateUrl: 'app/events/list/events.html'
      controller: 'EventsCtrl'
    )
    .when('/events/mine/:fbId',
      templateUrl: 'app/events/hosted/hosted.html'
      controller: 'HostedEventCtrl'
    )
    .when('/events/:fbId',
      templateUrl: 'app/events/show/show.html'
      controller: 'ShowEventCtrl'
    )