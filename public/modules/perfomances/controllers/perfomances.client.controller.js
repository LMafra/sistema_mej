'use strict';

// Perfomances controller
angular.module('perfomances').controller('PerfomancesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Perfomances',
	function($scope, $stateParams, $location, Authentication, Perfomances) {
		$scope.authentication = Authentication;

		// Create new Perfomance
		$scope.create = function() {
			// Create new Perfomance object
			var perfomance = new Perfomances ({
				name: this.name
			});

			// Redirect after save
			perfomance.$save(function(response) {
				$location.path('perfomances/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Perfomance
		$scope.remove = function(perfomance) {
			if ( perfomance ) { 
				perfomance.$remove();

				for (var i in $scope.perfomances) {
					if ($scope.perfomances [i] === perfomance) {
						$scope.perfomances.splice(i, 1);
					}
				}
			} else {
				$scope.perfomance.$remove(function() {
					$location.path('perfomances');
				});
			}
		};

		// Update existing Perfomance
		$scope.update = function() {
			var perfomance = $scope.perfomance;

			perfomance.$update(function() {
				$location.path('perfomances/' + perfomance._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Perfomances
		$scope.find = function() {
			$scope.perfomances = Perfomances.query();
		};

		// Find existing Perfomance
		$scope.findOne = function() {
			$scope.perfomance = Perfomances.get({ 
				perfomanceId: $stateParams.perfomanceId
			});
		};
	}
]);