'use strict';

//Setting up route
angular.module('dimensions').config(['$stateProvider',
	function($stateProvider) {
		// Dimensions state routing
		$stateProvider.
		state('listDimensions', {
			url: '/dimensions',
			templateUrl: 'modules/dimensions/views/list-dimensions.client.view.html'
		}).
		state('createDimension', {
			url: '/dimensions/create',
			templateUrl: 'modules/dimensions/views/create-dimension.client.view.html'
		}).
		state('viewDimension', {
			url: '/dimensions/:dimensionId',
			templateUrl: 'modules/dimensions/views/view-dimension.client.view.html'
		}).
		state('editDimension', {
			url: '/dimensions/:dimensionId/edit',
			templateUrl: 'modules/dimensions/views/edit-dimension.client.view.html'
		});
	}
]);