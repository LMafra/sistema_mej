'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Federation = mongoose.model('Federation'),
	_ = require('lodash');

/**
 * Create a Federation
 */
exports.create = function(req, res) {
	var federation = new Federation(req.body);
	federation.user = req.user;

	federation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(federation);
		}
	});
};

/**
 * Show the current Federation
 */
exports.read = function(req, res) {
	res.jsonp(req.federation);
};

/**
 * Update a Federation
 */
exports.update = function(req, res) {
	var federation = req.federation ;

	federation = _.extend(federation , req.body);

	federation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(federation);
		}
	});
};

/**
 * Delete an Federation
 */
exports.delete = function(req, res) {
	var federation = req.federation ;

	federation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(federation);
		}
	});
};

/**
 * List of Federations
 */
exports.list = function(req, res) { 
	Federation.find().sort('-created').populate('user', 'displayName').exec(function(err, federations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(federations);
		}
	});
};

/**
 * Federation middleware
 */
exports.federationByID = function(req, res, next, id) { 
	Federation.findById(id).populate('user', 'displayName').exec(function(err, federation) {
		if (err) return next(err);
		if (! federation) return next(new Error('Failed to load Federation ' + id));
		req.federation = federation ;
		next();
	});
};

/**
 * Federation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.federation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
