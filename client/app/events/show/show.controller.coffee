'use strict'

angular.module('sleepspotApp').controller 'ShowEventCtrl', ($scope, $routeParams, Event, Auth) ->

	$scope.event = Event.get
		fbId: $routeParams.fbId

	$scope.range = (n) ->
		new Array(n)

	$scope.reserveSpot = (index) ->
		Event.reserveSpot(
			fbId: $routeParams.fbId
		,
			spotId: index
		)