'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var juniorCompanies = require('../../app/controllers/junior-companies.server.controller');

	// Junior companies Routes
	app.route('/junior-companies')
		.get(juniorCompanies.list)
		.post(users.requiresLogin, juniorCompanies.create);

	app.route('/junior-companies/:juniorCompanyId')
		.get(juniorCompanies.read)
		.put(users.requiresLogin, juniorCompanies.hasAuthorization, juniorCompanies.update)
		.delete(users.requiresLogin, juniorCompanies.hasAuthorization, juniorCompanies.delete);

	// Finish by binding the Junior company middleware
	app.param('juniorCompanyId', juniorCompanies.juniorCompanyByID);
};
