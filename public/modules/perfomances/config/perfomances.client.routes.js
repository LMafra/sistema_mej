'use strict';

//Setting up route
angular.module('perfomances').config(['$stateProvider',
	function($stateProvider) {
		// Perfomances state routing
		$stateProvider.
		state('listPerfomances', {
			url: '/perfomances',
			templateUrl: 'modules/perfomances/views/list-perfomances.client.view.html'
		}).
		state('createPerfomance', {
			url: '/perfomances/create',
			templateUrl: 'modules/perfomances/views/create-perfomance.client.view.html'
		}).
		state('viewPerfomance', {
			url: '/perfomances/:perfomanceId',
			templateUrl: 'modules/perfomances/views/view-perfomance.client.view.html'
		}).
		state('editPerfomance', {
			url: '/perfomances/:perfomanceId/edit',
			templateUrl: 'modules/perfomances/views/edit-perfomance.client.view.html'
		});
	}
]);