'use strict';

// Configuring the Articles module
angular.module('federations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Federations', 'federations', 'dropdown', '/federations(/create)?');
		Menus.addSubMenuItem('topbar', 'federations', 'List Federations', 'federations');
		Menus.addSubMenuItem('topbar', 'federations', 'New Federation', 'federations/create');
	}
]);