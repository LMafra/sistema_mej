'use strict';

//Universities service used to communicate Universities REST endpoints
angular.module('universities').factory('Universities', ['$resource',
	function($resource) {
		return $resource('universities/:universityId', { universityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);