'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var perfomances = require('../../app/controllers/perfomances.server.controller');

	// Perfomances Routes
	app.route('/perfomances')
		.get(perfomances.list)
		.post(users.requiresLogin, perfomances.create);

	app.route('/perfomances/:perfomanceId')
		.get(perfomances.read)
		.put(users.requiresLogin, perfomances.hasAuthorization, perfomances.update)
		.delete(users.requiresLogin, perfomances.hasAuthorization, perfomances.delete);

	// Finish by binding the Perfomance middleware
	app.param('perfomanceId', perfomances.perfomanceByID);
};
