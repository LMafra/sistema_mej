'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Perfomance = mongoose.model('Perfomance'),
	_ = require('lodash');

/**
 * Create a Perfomance
 */
exports.create = function(req, res) {
	var perfomance = new Perfomance(req.body);
	perfomance.user = req.user;

	perfomance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(perfomance);
		}
	});
};

/**
 * Show the current Perfomance
 */
exports.read = function(req, res) {
	res.jsonp(req.perfomance);
};

/**
 * Update a Perfomance
 */
exports.update = function(req, res) {
	var perfomance = req.perfomance ;

	perfomance = _.extend(perfomance , req.body);

	perfomance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(perfomance);
		}
	});
};

/**
 * Delete an Perfomance
 */
exports.delete = function(req, res) {
	var perfomance = req.perfomance ;

	perfomance.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(perfomance);
		}
	});
};

/**
 * List of Perfomances
 */
exports.list = function(req, res) { 
	Perfomance.find().sort('-created').populate('user', 'displayName').exec(function(err, perfomances) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(perfomances);
		}
	});
};

/**
 * Perfomance middleware
 */
exports.perfomanceByID = function(req, res, next, id) { 
	Perfomance.findById(id).populate('user', 'displayName').exec(function(err, perfomance) {
		if (err) return next(err);
		if (! perfomance) return next(new Error('Failed to load Perfomance ' + id));
		req.perfomance = perfomance ;
		next();
	});
};

/**
 * Perfomance authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.perfomance.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
