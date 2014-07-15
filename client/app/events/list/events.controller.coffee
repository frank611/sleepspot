'use strict'

angular.module('sleepspotApp').controller 'EventsCtrl', ($scope, Auth, $location, Event) ->

	$scope.events = Event.list();
	$scope.hostedEvents = Event.hosted();