'use strict';

//Setting up route
angular.module('federations').config(['$stateProvider',
	function($stateProvider) {
		// Federations state routing
		$stateProvider.
		state('listFederations', {
			url: '/federations',
			templateUrl: 'modules/federations/views/list-federations.client.view.html'
		}).
		state('createFederation', {
			url: '/federations/create',
			templateUrl: 'modules/federations/views/create-federation.client.view.html'
		}).
		state('viewFederation', {
			url: '/federations/:federationId',
			templateUrl: 'modules/federations/views/view-federation.client.view.html'
		}).
		state('editFederation', {
			url: '/federations/:federationId/edit',
			templateUrl: 'modules/federations/views/edit-federation.client.view.html'
		});
	}
]);