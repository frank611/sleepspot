'use strict';

var express = require('express');
var controller = require('./event.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/hosted', auth.isAuthenticated(), controller.hosted);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/:fbId', auth.isAuthenticated(), controller.create);
router.post('/:fbId/addSpot', auth.isAuthenticated(), controller.addSpot);
router.post('/:fbId/reserveSpot', auth.isAuthenticated(), controller.reserveSpot);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;