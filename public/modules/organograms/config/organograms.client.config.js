'use strict';

// Configuring the Articles module
angular.module('organograms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Organograms', 'organograms', 'dropdown', '/organograms(/create)?');
		Menus.addSubMenuItem('topbar', 'organograms', 'List Organograms', 'organograms');
		Menus.addSubMenuItem('topbar', 'organograms', 'New Organogram', 'organograms/create');
	}
]);