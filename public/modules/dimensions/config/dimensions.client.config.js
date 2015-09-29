'use strict';

// Configuring the Articles module
angular.module('dimensions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dimensions', 'dimensions', 'dropdown', '/dimensions(/create)?');
		Menus.addSubMenuItem('topbar', 'dimensions', 'List Dimensions', 'dimensions');
		Menus.addSubMenuItem('topbar', 'dimensions', 'New Dimension', 'dimensions/create');
	}
]);