'use strict';

//Setting up route
angular.module('degrees').config(['$stateProvider',
	function($stateProvider) {
		// Degrees state routing
		$stateProvider.
		state('listDegrees', {
			url: '/degrees',
			templateUrl: 'modules/degrees/views/list-degrees.client.view.html'
		}).
		state('createDegree', {
			url: '/degrees/create',
			templateUrl: 'modules/degrees/views/create-degree.client.view.html'
		}).
		state('viewDegree', {
			url: '/degrees/:degreeId',
			templateUrl: 'modules/degrees/views/view-degree.client.view.html'
		}).
		state('editDegree', {
			url: '/degrees/:degreeId/edit',
			templateUrl: 'modules/degrees/views/edit-degree.client.view.html'
		});
	}
]);