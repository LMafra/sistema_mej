'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organogram = mongoose.model('Organogram'),
	_ = require('lodash');

/**
 * Create a Organogram
 */
exports.create = function(req, res) {
	var organogram = new Organogram(req.body);
	organogram.user = req.user;

	organogram.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organogram);
		}
	});
};

/**
 * Show the current Organogram
 */
exports.read = function(req, res) {
	res.jsonp(req.organogram);
};

/**
 * Update a Organogram
 */
exports.update = function(req, res) {
	var organogram = req.organogram ;

	organogram = _.extend(organogram , req.body);

	organogram.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organogram);
		}
	});
};

/**
 * Delete an Organogram
 */
exports.delete = function(req, res) {
	var organogram = req.organogram ;

	organogram.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organogram);
		}
	});
};

/**
 * List of Organograms
 */
exports.list = function(req, res) { 
	Organogram.find().sort('-created').populate('user', 'displayName').exec(function(err, organograms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organograms);
		}
	});
};

/**
 * Organogram middleware
 */
exports.organogramByID = function(req, res, next, id) { 
	Organogram.findById(id).populate('user', 'displayName').exec(function(err, organogram) {
		if (err) return next(err);
		if (! organogram) return next(new Error('Failed to load Organogram ' + id));
		req.organogram = organogram ;
		next();
	});
};

/**
 * Organogram authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organogram.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
