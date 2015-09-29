'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dimensions = require('../../app/controllers/dimensions.server.controller');

	// Dimensions Routes
	app.route('/dimensions')
		.get(dimensions.list)
		.post(users.requiresLogin, dimensions.create);

	app.route('/dimensions/:dimensionId')
		.get(dimensions.read)
		.put(users.requiresLogin, dimensions.hasAuthorization, dimensions.update)
		.delete(users.requiresLogin, dimensions.hasAuthorization, dimensions.delete);

	// Finish by binding the Dimension middleware
	app.param('dimensionId', dimensions.dimensionByID);
};
