'use strict';

//Federations service used to communicate Federations REST endpoints
angular.module('federations').factory('Federations', ['$resource',
	function($resource) {
		return $resource('federations/:federationId', { federationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);