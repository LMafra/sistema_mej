'use strict';

//Dimensions service used to communicate Dimensions REST endpoints
angular.module('dimensions').factory('Dimensions', ['$resource',
	function($resource) {
		return $resource('dimensions/:dimensionId', { dimensionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);