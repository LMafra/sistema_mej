'use strict';

// Configuring the Articles module
angular.module('junior-companies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Junior companies', 'junior-companies', 'dropdown', '/junior-companies(/create)?');
		Menus.addSubMenuItem('topbar', 'junior-companies', 'List Junior companies', 'junior-companies');
		Menus.addSubMenuItem('topbar', 'junior-companies', 'New Junior company', 'junior-companies/create');
	}
]);