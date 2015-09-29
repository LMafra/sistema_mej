'use strict';

//States service used to communicate States REST endpoints
angular.module('states').factory('States', ['$resource',
	function($resource) {
		return $resource('states/:stateId', { stateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);