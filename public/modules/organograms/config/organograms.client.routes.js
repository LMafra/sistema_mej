'use strict';

//Setting up route
angular.module('organograms').config(['$stateProvider',
	function($stateProvider) {
		// Organograms state routing
		$stateProvider.
		state('listOrganograms', {
			url: '/organograms',
			templateUrl: 'modules/organograms/views/list-organograms.client.view.html'
		}).
		state('createOrganogram', {
			url: '/organograms/create',
			templateUrl: 'modules/organograms/views/create-organogram.client.view.html'
		}).
		state('viewOrganogram', {
			url: '/organograms/:organogramId',
			templateUrl: 'modules/organograms/views/view-organogram.client.view.html'
		}).
		state('editOrganogram', {
			url: '/organograms/:organogramId/edit',
			templateUrl: 'modules/organograms/views/edit-organogram.client.view.html'
		});
	}
]);