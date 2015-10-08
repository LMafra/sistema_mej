'use strict';

// Configuring the Articles module
angular.module('areas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Areas', 'areas', 'dropdown', '/areas(/create)?');
		Menus.addSubMenuItem('topbar', 'areas', 'List Areas', 'areas');
		Menus.addSubMenuItem('topbar', 'areas', 'New Area', 'areas/create');
	}
]);