'use strict';

//Areas service used to communicate Areas REST endpoints
angular.module('areas').factory('Areas', ['$resource',
	function($resource) {
		return $resource('areas/:areaId', { areaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);