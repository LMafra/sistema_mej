'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var universities = require('../../app/controllers/universities.server.controller');

	// Universities Routes
	app.route('/universities')
		.get(universities.list)
		.post(users.requiresLogin, universities.create);

	app.route('/universities/:universityId')
		.get(universities.read)
		.put(users.requiresLogin, universities.hasAuthorization, universities.update)
		.delete(users.requiresLogin, universities.hasAuthorization, universities.delete);

	// Finish by binding the University middleware
	app.param('universityId', universities.universityByID);
};
