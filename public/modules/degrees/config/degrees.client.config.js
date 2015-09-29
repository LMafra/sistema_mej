'use strict';

// Configuring the Articles module
angular.module('degrees').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Degrees', 'degrees', 'dropdown', '/degrees(/create)?');
		Menus.addSubMenuItem('topbar', 'degrees', 'List Degrees', 'degrees');
		Menus.addSubMenuItem('topbar', 'degrees', 'New Degree', 'degrees/create');
	}
]);