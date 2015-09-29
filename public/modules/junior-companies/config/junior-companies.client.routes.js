'use strict';

//Setting up route
angular.module('junior-companies').config(['$stateProvider',
	function($stateProvider) {
		// Junior companies state routing
		$stateProvider.
		state('listJuniorCompanies', {
			url: '/junior-companies',
			templateUrl: 'modules/junior-companies/views/list-junior-companies.client.view.html'
		}).
		state('createJuniorCompany', {
			url: '/junior-companies/create',
			templateUrl: 'modules/junior-companies/views/create-junior-company.client.view.html'
		}).
		state('viewJuniorCompany', {
			url: '/junior-companies/:juniorCompanyId',
			templateUrl: 'modules/junior-companies/views/view-junior-company.client.view.html'
		}).
		state('editJuniorCompany', {
			url: '/junior-companies/:juniorCompanyId/edit',
			templateUrl: 'modules/junior-companies/views/edit-junior-company.client.view.html'
		});
	}
]);