'use strict';

var Event = require('./event.model');
var passport = require('passport');
var config = require('../../config/environment');
var moment = require('moment');
var _ = require('lodash');
var FB = require('fb');
var async = require('async');

/**
 * Get list of events the user hosts or is attending that are activated on SleepSpot
 */
exports.index = function(req, res) {
  req.user.getFbEvents(function(fbEvents) {
    // Filter out past events
    var futureFbEvents = _.filter(fbEvents, function(fbEvent) {
      return moment(fbEvent.start_time).isAfter(moment());
    });

    // Combine existing sleepspot events to their facebook event
    async.map(futureFbEvents, function(fbEvent, callback) {
      Event.findOne({fbId: fbEvent.id}).populate('spots.occupants.person').exec(function(err, dbEvent) {
        if (err) return callback(err);
        if (!dbEvent) return callback(null, null);
        callback(null, _.merge(dbEvent.toObject(), fbEvent));
      });
    }, function(err, results) {
      results = results.filter(function(n){ return n != undefined });
      res.json(results);
    });
  });
};

/**
 * Get list of fb events the user hosts
 */

exports.hosted = function(req, res) {
  req.user.getHostedFbEvents(function(fbEvents) {
    var futureHostedFbEvents = _.filter(fbEvents, function(fbEvent) {
      return moment(fbEvent.start_time).isAfter(moment());
    });

    _.each(futureHostedFbEvents, function(fbEvent) {
      _.extend(fbEvent, { relativeDate: moment(fbEvent.start_time).fromNow() })
    });

    res.json(futureHostedFbEvents);
  });
};

/**
 * Get the fb event or the full sleepspot event if it has been activated
 */
exports.show = function (req, res, next) {
  var eventFbId = req.params.id;

  FB.setAccessToken(req.user.facebook.accessToken);
  FB.api('/' + eventFbId, function(fbResponse) {
    if (fbResponse.error) return res.send(404);

    Event.findOne({fbId: eventFbId}).populate('spots.occupants.person').exec(function(err, event) {
      if (err) return res.send(500);
      if (!event) return res.json(fbResponse);
      res.json(_.merge(event.toObject(), fbResponse));
    });
  });
};

/**
 * Creates a new sleepspot event
 */
exports.create = function(req, res, next) {
  var newEvent = new Event({
    fbId: req.body.fbId,
    host: req.user.id
  });

  newEvent.save(function(err, event) {
    res.send(204);
  });
};

/**
 * Add a spot to an event
 * restricion: host
 */
exports.addSpot = function(req, res) {
  Event.findOne({fbId: req.params.fbId}, function(err, event) {
    if(err) return res.send(500, err);
    if (!event.host.equals(req.user.id)) return res.send(403);

    event.spots.push(req.body);

    event.save(function(err) {
      if(err) return res.send(500, err);
      return res.send(204);
    });
  });
};

/**
 * Update an event
 * restricion: host
 */
exports.update = function(req, res) {
  Event.findById(req.params.id, function(err, event) {
    if(err) return res.send(500, err);
    if (!event.host.equals(req.user.id)) return res.send(403);

    event.remove(function() {
      return res.send(204);
    });
  });
};

/**
 * Reserve a place on a spot
 */
exports.reserveSpot = function(req, res, next) {
  Event.findOne({fbId: req.params.fbId}, function(err, event) {
    if(err) return res.send(500, err);

    // Check if user already has a place on the required spot
    var alreadyReserved = false;
    event.spots[req.body.spotId].occupants.forEach(function(occupant) {
      if (occupant.person.equals(req.user.id)) {
        alreadyReserved = true;
      }
    });
    if (alreadyReserved) return res.send(204);

    // Check if there are places left at the required spot
    if (event.spots[req.body.spotId].occupants.length === event.spots[req.body.spotId].places) return res.send(403);

    async.series([
      // Remove reservations for other spots the user might already have
      function(cb) {
        var reservedOtherSpot = false;
        var otherSpot = 0;

        event.spots.forEach(function(spot, spotIndex) {
          spot.occupants.forEach(function(occupant) {
            if (occupant.person.equals(req.user.id)) {
              reservedOtherSpot = true;
              otherSpot = spotIndex;
            }
          });
        });

        if (reservedOtherSpot) {
          var pullObject = {};
          pullObject['spots.' + otherSpot + '.occupants'] = { person: req.user.id };

          event.update({ $pull: pullObject }, function(err, nbaffected) {
            if(err) return res.send(500, err);
            cb();
          });
        }
        else {
          cb();
        }
      },
      // Reserve a place at the new spot
      function(cb) {
        event.spots[req.body.spotId].occupants.push({
          person: req.user.id
        });

        event.save(function(err) {
          if(err) return res.send(500, err);
          return res.send(204);
        });
      }
    ]);
  });
};

/**
 * Deletes an event
 * restricion: host
 */
exports.destroy = function(req, res) {
  Event.findById(req.params.id, function(err, event) {
    if(err) return res.send(500, err);
    if (!event.host.equals(req.user.id)) return res.send(403);

    event.remove(function() {
      return res.send(204);
    });
  });
};
