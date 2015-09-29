'use strict';

// Configuring the Articles module
angular.module('universities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Universities', 'universities', 'dropdown', '/universities(/create)?');
		Menus.addSubMenuItem('topbar', 'universities', 'List Universities', 'universities');
		Menus.addSubMenuItem('topbar', 'universities', 'New University', 'universities/create');
	}
]);