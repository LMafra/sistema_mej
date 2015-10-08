'use strict';

//Setting up route
angular.module('areas').config(['$stateProvider',
	function($stateProvider) {
		// Areas state routing
		$stateProvider.
		state('listAreas', {
			url: '/areas',
			templateUrl: 'modules/areas/views/list-areas.client.view.html'
		}).
		state('createArea', {
			url: '/areas/create',
			templateUrl: 'modules/areas/views/create-area.client.view.html'
		}).
		state('viewArea', {
			url: '/areas/:areaId',
			templateUrl: 'modules/areas/views/view-area.client.view.html'
		}).
		state('editArea', {
			url: '/areas/:areaId/edit',
			templateUrl: 'modules/areas/views/edit-area.client.view.html'
		});
	}
]);