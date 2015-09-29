'use strict';

//Setting up route
angular.module('states').config(['$stateProvider',
	function($stateProvider) {
		// States state routing
		$stateProvider.
		state('listStates', {
			url: '/states',
			templateUrl: 'modules/states/views/list-states.client.view.html'
		}).
		state('createState', {
			url: '/states/create',
			templateUrl: 'modules/states/views/create-state.client.view.html'
		}).
		state('viewState', {
			url: '/states/:stateId',
			templateUrl: 'modules/states/views/view-state.client.view.html'
		}).
		state('editState', {
			url: '/states/:stateId/edit',
			templateUrl: 'modules/states/views/edit-state.client.view.html'
		});
	}
]);