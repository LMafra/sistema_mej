'use strict';

// Configuring the Articles module
angular.module('states').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'States', 'states', 'dropdown', '/states(/create)?');
		Menus.addSubMenuItem('topbar', 'states', 'List States', 'states');
		Menus.addSubMenuItem('topbar', 'states', 'New State', 'states/create');
	}
]);