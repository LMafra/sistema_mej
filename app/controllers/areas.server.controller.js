'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Area = mongoose.model('Area'),
	_ = require('lodash');

/**
 * Create a Area
 */
exports.create = function(req, res) {
	var area = new Area(req.body);
	area.user = req.user;

	area.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(area);
		}
	});
};

/**
 * Show the current Area
 */
exports.read = function(req, res) {
	res.jsonp(req.area);
};

/**
 * Update a Area
 */
exports.update = function(req, res) {
	var area = req.area ;

	area = _.extend(area , req.body);

	area.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(area);
		}
	});
};

/**
 * Delete an Area
 */
exports.delete = function(req, res) {
	var area = req.area ;

	area.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(area);
		}
	});
};

/**
 * List of Areas
 */
exports.list = function(req, res) { 
	Area.find().sort('-created').populate('user', 'displayName').exec(function(err, areas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(areas);
		}
	});
};

/**
 * Area middleware
 */
exports.areaByID = function(req, res, next, id) { 
	Area.findById(id).populate('user', 'displayName').exec(function(err, area) {
		if (err) return next(err);
		if (! area) return next(new Error('Failed to load Area ' + id));
		req.area = area ;
		next();
	});
};

/**
 * Area authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.area.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
