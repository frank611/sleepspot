'use strict'

angular.module('sleepspotApp').controller 'HostedEventCtrl', ($scope, $routeParams, Event) ->

	$scope.event = Event.get
		fbId: $routeParams.fbId

	$scope.activateSleepSpot = ->
		$scope.event = Event.create
			fbId: $routeParams.fbId
		return

	$scope.addSpot = ->
		Event.addSpot
			fbId: $routeParams.fbId
		,
			name: $scope.newSpotName
			places: $scope.newSpotPlaces
		return

	$scope.addSpotPlace = (index) ->
		$scope.event.spots[index].places++

	$scope.removeSpotPlace = (index) ->
		$scope.event.spots[index].places--

	return