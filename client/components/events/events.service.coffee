'use strict'

angular.module('sleepspotApp').factory 'Event', ($resource) ->
  $resource '/api/events/:fbId/:controller',
    fbId: '@fbId'
  ,
    update:
      method: 'PUT'
    list:
      method: 'GET'
      params:
        fbId: ''
      isArray: true
    hosted:
      method: 'GET'
      params:
        fbId: 'hosted'
      isArray: true
    get:
      method: 'GET'
    create:
      method: 'POST'
    addSpot:
      method: 'POST'
      params:
        controller: 'addSpot'
    reserveSpot:
      method: 'POST'
      params:
        controller: 'reserveSpot'