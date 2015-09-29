'use strict';

//Junior companies service used to communicate Junior companies REST endpoints
angular.module('junior-companies').factory('JuniorCompanies', ['$resource',
	function($resource) {
		return $resource('junior-companies/:juniorCompanyId', { juniorCompanyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);