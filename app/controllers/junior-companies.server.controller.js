'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	JuniorCompany = mongoose.model('JuniorCompany'),
	_ = require('lodash');

/**
 * Create a Junior company
 */
exports.create = function(req, res) {
	var juniorCompany = new JuniorCompany(req.body);
	juniorCompany.user = req.user;

	juniorCompany.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(juniorCompany);
		}
	});
};

/**
 * Show the current Junior company
 */
exports.read = function(req, res) {
	res.jsonp(req.juniorCompany);
};

/**
 * Update a Junior company
 */
exports.update = function(req, res) {
	var juniorCompany = req.juniorCompany ;
	console.log(juniorCompany);

	juniorCompany = _.extend(juniorCompany , req.body);

	juniorCompany.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(juniorCompany);
		}
	});
};

/**
 * Delete an Junior company
 */
exports.delete = function(req, res) {
	var juniorCompany = req.juniorCompany ;

	juniorCompany.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(juniorCompany);
		}
	});
};

/**
 * List of Junior companies
 */
exports.list = function(req, res) { 
	JuniorCompany.find().sort('-created').populate('user', 'displayName').exec(function(err, juniorCompanies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(juniorCompanies);
		}
	});
};

/**
 * Junior company middleware
 */
exports.juniorCompanyByID = function(req, res, next, id) { 
	JuniorCompany.findById(id).populate('user', 'displayName').exec(function(err, juniorCompany) {
		if (err) return next(err);
		if (! juniorCompany) return next(new Error('Failed to load Junior company ' + id));
		req.juniorCompany = juniorCompany ;
		next();
	});
};

/**
 * Junior company authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.juniorCompany.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
