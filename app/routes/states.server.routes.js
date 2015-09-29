'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var states = require('../../app/controllers/states.server.controller');

	// States Routes
	app.route('/states')
		.get(states.list)
		.post(users.requiresLogin, states.create);

	app.route('/states/:stateId')
		.get(states.read)
		.put(users.requiresLogin, states.hasAuthorization, states.update)
		.delete(users.requiresLogin, states.hasAuthorization, states.delete);

	// Finish by binding the State middleware
	app.param('stateId', states.stateByID);
};
