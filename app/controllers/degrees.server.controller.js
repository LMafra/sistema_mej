'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Degree = mongoose.model('Degree'),
	_ = require('lodash');

/**
 * Create a Degree
 */
exports.create = function(req, res) {
	var degree = new Degree(req.body);
	degree.user = req.user;

	degree.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(degree);
		}
	});
};

/**
 * Show the current Degree
 */
exports.read = function(req, res) {
	res.jsonp(req.degree);
};

/**
 * Update a Degree
 */
exports.update = function(req, res) {
	var degree = req.degree ;

	degree = _.extend(degree , req.body);

	degree.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(degree);
		}
	});
};

/**
 * Delete an Degree
 */
exports.delete = function(req, res) {
	var degree = req.degree ;

	degree.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(degree);
		}
	});
};

/**
 * List of Degrees
 */
exports.list = function(req, res) { 
	Degree.find().sort('-created').populate('user', 'displayName').exec(function(err, degrees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(degrees);
		}
	});
};

/**
 * Degree middleware
 */
exports.degreeByID = function(req, res, next, id) { 
	Degree.findById(id).populate('user', 'displayName').exec(function(err, degree) {
		if (err) return next(err);
		if (! degree) return next(new Error('Failed to load Degree ' + id));
		req.degree = degree ;
		next();
	});
};

/**
 * Degree authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.degree.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
