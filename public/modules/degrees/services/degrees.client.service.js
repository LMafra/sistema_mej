'use strict';

//Degrees service used to communicate Degrees REST endpoints
angular.module('degrees').factory('Degrees', ['$resource',
	function($resource) {
		return $resource('degrees/:degreeId', { degreeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);