'use strict';

// Configuring the Articles module
angular.module('perfomances').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Perfomances', 'perfomances', 'dropdown', '/perfomances(/create)?');
		Menus.addSubMenuItem('topbar', 'perfomances', 'List Perfomances', 'perfomances');
		Menus.addSubMenuItem('topbar', 'perfomances', 'New Perfomance', 'perfomances/create');
	}
]);