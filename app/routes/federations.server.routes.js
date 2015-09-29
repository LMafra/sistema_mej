'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var federations = require('../../app/controllers/federations.server.controller');

	// Federations Routes
	app.route('/federations')
		.get(federations.list)
		.post(users.requiresLogin, federations.create);

	app.route('/federations/:federationId')
		.get(federations.read)
		.put(users.requiresLogin, federations.hasAuthorization, federations.update)
		.delete(users.requiresLogin, federations.hasAuthorization, federations.delete);

	// Finish by binding the Federation middleware
	app.param('federationId', federations.federationByID);
};
