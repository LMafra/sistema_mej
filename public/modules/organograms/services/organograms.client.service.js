'use strict';

//Organograms service used to communicate Organograms REST endpoints
angular.module('organograms').factory('Organograms', ['$resource',
	function($resource) {
		return $resource('organograms/:organogramId', { organogramId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);