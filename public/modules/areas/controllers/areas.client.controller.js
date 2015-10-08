'use strict';

// Areas controller
angular.module('areas').controller('AreasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Areas', 'Organograms',
	function($scope, $stateParams, $location, Authentication, Areas, Organograms) {
		$scope.authentication = Authentication;

		//select the Organogram
		$scope.selectOrganogram = Organograms.query();

		// Create new Area
		$scope.create = function() {
			// Create new Area object
			var area = new Areas ({
				name: this.name
			});

			// Redirect after save
			area.$save(function(response) {
				$location.path('areas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Area
		$scope.remove = function(area) {
			if ( area ) { 
				area.$remove();

				for (var i in $scope.areas) {
					if ($scope.areas [i] === area) {
						$scope.areas.splice(i, 1);
					}
				}
			} else {
				$scope.area.$remove(function() {
					$location.path('areas');
				});
			}
		};

		// Update existing Area
		$scope.update = function() {
			var area = $scope.area;

			area.$update(function() {
				$location.path('areas/' + area._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Areas
		$scope.find = function() {
			$scope.areas = Areas.query();
		};

		// Find existing Area
		$scope.findOne = function() {
			$scope.area = Areas.get({ 
				areaId: $stateParams.areaId
			});
		};
	}
]);