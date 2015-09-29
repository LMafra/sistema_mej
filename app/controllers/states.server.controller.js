'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	State = mongoose.model('State'),
	_ = require('lodash');

/**
 * Create a State
 */
exports.create = function(req, res) {
	var state = new State(req.body);
	state.user = req.user;

	state.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(state);
		}
	});
};

/**
 * Show the current State
 */
exports.read = function(req, res) {
	res.jsonp(req.state);
};

/**
 * Update a State
 */
exports.update = function(req, res) {
	var state = req.state ;

	state = _.extend(state , req.body);

	state.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(state);
		}
	});
};

/**
 * Delete an State
 */
exports.delete = function(req, res) {
	var state = req.state ;

	state.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(state);
		}
	});
};

/**
 * List of States
 */
exports.list = function(req, res) { 
	State.find().sort('-created').populate('user', 'displayName').exec(function(err, states) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(states);
		}
	});
};

/**
 * State middleware
 */
exports.stateByID = function(req, res, next, id) { 
	State.findById(id).populate('user', 'displayName').exec(function(err, state) {
		if (err) return next(err);
		if (! state) return next(new Error('Failed to load State ' + id));
		req.state = state ;
		next();
	});
};

/**
 * State authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.state.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
