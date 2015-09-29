'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var degrees = require('../../app/controllers/degrees.server.controller');

	// Degrees Routes
	app.route('/degrees')
		.get(degrees.list)
		.post(users.requiresLogin, degrees.create);

	app.route('/degrees/:degreeId')
		.get(degrees.read)
		.put(users.requiresLogin, degrees.hasAuthorization, degrees.update)
		.delete(users.requiresLogin, degrees.hasAuthorization, degrees.delete);

	// Finish by binding the Degree middleware
	app.param('degreeId', degrees.degreeByID);
};
