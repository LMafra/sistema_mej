'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dimension = mongoose.model('Dimension'),
	_ = require('lodash');

/**
 * Create a Dimension
 */
exports.create = function(req, res) {
	var dimension = new Dimension(req.body);
	dimension.user = req.user;

	dimension.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dimension);
		}
	});
};

/**
 * Show the current Dimension
 */
exports.read = function(req, res) {
	res.jsonp(req.dimension);
};

/**
 * Update a Dimension
 */
exports.update = function(req, res) {
	var dimension = req.dimension ;

	dimension = _.extend(dimension , req.body);

	dimension.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dimension);
		}
	});
};

/**
 * Delete an Dimension
 */
exports.delete = function(req, res) {
	var dimension = req.dimension ;

	dimension.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dimension);
		}
	});
};

/**
 * List of Dimensions
 */
exports.list = function(req, res) { 
	Dimension.find().sort('-created').populate('user', 'displayName').exec(function(err, dimensions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dimensions);
		}
	});
};

/**
 * Dimension middleware
 */
exports.dimensionByID = function(req, res, next, id) { 
	Dimension.findById(id).populate('user', 'displayName').exec(function(err, dimension) {
		if (err) return next(err);
		if (! dimension) return next(new Error('Failed to load Dimension ' + id));
		req.dimension = dimension ;
		next();
	});
};

/**
 * Dimension authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dimension.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
