'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var areas = require('../../app/controllers/areas.server.controller');

	// Areas Routes
	app.route('/areas')
		.get(areas.list)
		.post(users.requiresLogin, areas.create);

	app.route('/areas/:areaId')
		.get(areas.read)
		.put(users.requiresLogin, areas.hasAuthorization, areas.update)
		.delete(users.requiresLogin, areas.hasAuthorization, areas.delete);

	// Finish by binding the Area middleware
	app.param('areaId', areas.areaByID);
};
