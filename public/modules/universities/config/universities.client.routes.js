'use strict';

//Setting up route
angular.module('universities').config(['$stateProvider',
	function($stateProvider) {
		// Universities state routing
		$stateProvider.
		state('listUniversities', {
			url: '/universities',
			templateUrl: 'modules/universities/views/list-universities.client.view.html'
		}).
		state('createUniversity', {
			url: '/universities/create',
			templateUrl: 'modules/universities/views/create-university.client.view.html'
		}).
		state('viewUniversity', {
			url: '/universities/:universityId',
			templateUrl: 'modules/universities/views/view-university.client.view.html'
		}).
		state('editUniversity', {
			url: '/universities/:universityId/edit',
			templateUrl: 'modules/universities/views/edit-university.client.view.html'
		});
	}
]);