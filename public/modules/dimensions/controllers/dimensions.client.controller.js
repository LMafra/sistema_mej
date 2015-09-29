'use strict';

// Dimensions controller
angular.module('dimensions').controller('DimensionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dimensions', 'Perfomances',
	function($scope, $stateParams, $location, Authentication, Dimensions, Perfomances) {
		$scope.authentication = Authentication;

		//Perfomance has dimensions
		$scope.selectPerfomance = Perfomances.query();

		// Create new Dimension
		$scope.create = function() {
			// Create new Dimension object
			var dimension = new Dimensions ({
				name: this.name
			});

			// Redirect after save
			dimension.$save(function(response) {
				$location.path('dimensions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dimension
		$scope.remove = function(dimension) {
			if ( dimension ) { 
				dimension.$remove();

				for (var i in $scope.dimensions) {
					if ($scope.dimensions [i] === dimension) {
						$scope.dimensions.splice(i, 1);
					}
				}
			} else {
				$scope.dimension.$remove(function() {
					$location.path('dimensions');
				});
			}
		};

		// Update existing Dimension
		$scope.update = function() {
			var dimension = $scope.dimension;

			dimension.$update(function() {
				$location.path('dimensions/' + dimension._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dimensions
		$scope.find = function() {
			$scope.dimensions = Dimensions.query();
		};

		// Find existing Dimension
		$scope.findOne = function() {
			$scope.dimension = Dimensions.get({ 
				dimensionId: $stateParams.dimensionId
			});
		};
	}
]);