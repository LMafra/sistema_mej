'use strict';

//Perfomances service used to communicate Perfomances REST endpoints
angular.module('perfomances').factory('Perfomances', ['$resource',
	function($resource) {
		return $resource('perfomances/:perfomanceId', { perfomanceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);