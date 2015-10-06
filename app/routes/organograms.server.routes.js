'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var organograms = require('../../app/controllers/organograms.server.controller');

	// Organograms Routes
	app.route('/organograms')
		.get(organograms.list)
		.post(users.requiresLogin, organograms.create);

	app.route('/organograms/:organogramId')
		.get(organograms.read)
		.put(users.requiresLogin, organograms.hasAuthorization, organograms.update)
		.delete(users.requiresLogin, organograms.hasAuthorization, organograms.delete);

	// Finish by binding the Organogram middleware
	app.param('organogramId', organograms.organogramByID);
};
