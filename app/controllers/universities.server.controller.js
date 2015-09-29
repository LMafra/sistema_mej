'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	University = mongoose.model('University'),
	_ = require('lodash');

/**
 * Create a University
 */
exports.create = function(req, res) {
	var university = new University(req.body);
	university.user = req.user;

	university.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(university);
		}
	});
};

/**
 * Show the current University
 */
exports.read = function(req, res) {
	res.jsonp(req.university);
};

/**
 * Update a University
 */
exports.update = function(req, res) {
	var university = req.university ;

	university = _.extend(university , req.body);

	university.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(university);
		}
	});
};

/**
 * Delete an University
 */
exports.delete = function(req, res) {
	var university = req.university ;

	university.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(university);
		}
	});
};

/**
 * List of Universities
 */
exports.list = function(req, res) { 
	University.find().sort('-created').populate('user', 'displayName').exec(function(err, universities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(universities);
		}
	});
};

/**
 * University middleware
 */
exports.universityByID = function(req, res, next, id) { 
	University.findById(id).populate('user', 'displayName').exec(function(err, university) {
		if (err) return next(err);
		if (! university) return next(new Error('Failed to load University ' + id));
		req.university = university ;
		next();
	});
};

/**
 * University authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.university.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
