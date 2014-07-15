'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  fbId: { type: Number, unique: true },
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  spots: [{
    name: String,
    places: { type: Number, min: 1, default: 1 },
    occupants: [{
      person: { type: Schema.Types.ObjectId, ref: 'User' },
      dateOccupied: { type: Date, default: Date.now }
    }]
  }]
});

module.exports = mongoose.model('Event', EventSchema);
